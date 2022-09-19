"""
    Bitbucket

Implements read-only access
"""
module Bitbucket

import ..GitForge: endpoint, into, postprocessor, ForgeAPIError, constructfield, @forge, ForgeContext
import ..GitForge.GitHub: ismemberorcollaborator
import Base.@kwdef, Base.Meta.quot
import StructTypes: Struct, UnorderedStruct, construct, constructfrom, StructType

using ..GitForge
using ..GitForge:
    @json,
    AStr,
    DoSomething,
    Endpoint,
    Forge,
    JSON,
    JSON3,
    OnRateLimit,
    RateLimiter,
    HEADERS,
    ORL_THROW,
    @not_implemented
using ..GitForge.GitHub: NoToken, JWT, AbstractToken
using Dates, TimeZones, HTTP, UUIDs, StructTypes
using Dates: Date, DateTime

export BitbucketAPI, Token, JWT

# using a const here in order to export it
const Token = GitForge.GitHub.Token
const DEFAULT_URL = "https://api.bitbucket.org/2.0"

auth_headers(::NoToken) = []
auth_headers(t::Token) = ["Authorization" => "Basic $(t.token)"]
auth_headers(t::JWT) = ["Authorization" => "Bearer $(t.token)"]

"""
    BitbucketAPI(;
        token::AbstractToken=NoToken(),
        url::$AStr="$DEFAULT_URL",
        has_rate_limits::Bool=true,
        on_rate_limit::OnRateLimit=ORL_THROW,
    )

Create a Bitbucket API client.

## Keywords
- `token::AbstractToken=NoToken()`: Authorization token (or lack thereof).
- `url::$AStr="$DEFAULT_URL"`: Base URL of the target Bitbucket instance.
- `has_rate_limits::Bool=true`: Whether or not the Bitbucket server has rate limits.
- `on_rate_limit::OnRateLimit=ORL_THROW`: Behaviour on exceeded rate limits.
- `workspace::AbstractString=""`: slug for chosen workspace
"""
mutable struct BitbucketAPI <: Forge
    token::AbstractToken
    url::AbstractString
    hasrl::Bool
    orl::OnRateLimit
    rl_general::RateLimiter
    rl_search::RateLimiter
    workspace::AbstractString

    function BitbucketAPI(;
        token::AbstractToken=NoToken(),
        url::AStr=DEFAULT_URL,
        has_rate_limits::Bool=false,
        on_rate_limit::OnRateLimit=ORL_THROW,
        workspace::AbstractString="",
    )
        return new(token, url, has_rate_limits, on_rate_limit, RateLimiter(), RateLimiter(), workspace)
    end
end
@forge BitbucketAPI

GitForge.base_url(b::BitbucketAPI) = b.url
GitForge.request_headers(b::BitbucketAPI, ::Function) = [HEADERS; auth_headers(b.token)]
GitForge.postprocessor(::BitbucketAPI, ::Function) = JSON()
GitForge.has_rate_limits(b::BitbucketAPI, ::Function) = b.hasrl
GitForge.rate_limit_check(b::BitbucketAPI, ::Function) = GitForge.rate_limit_check(b.rl_general)
GitForge.on_rate_limit(b::BitbucketAPI, ::Function) = b.orl
GitForge.rate_limit_wait(b::BitbucketAPI, ::Function) = GitForge.rate_limit_wait(b.rl_general)
GitForge.rate_limit_period(b::BitbucketAPI, ::Function) = GitForge.rate_limit_period(b.rl_general)
GitForge.rate_limit_update!(b::BitbucketAPI, ::Function, r::HTTP.Response) =
    GitForge.rate_limit_update!(b.rl_general, r)

constructfield(::ForgeContext{BitbucketAPI}, f, ::Type{Union{UUID, Nothing}}, str::AbstractString) =
    UUID(str[2:end-1])

constructfield(::ForgeContext{BitbucketAPI}, f, ::Type{Union{Date, Nothing}}, v::AbstractString) =
    Date(ZonedDateTime(replace(v, r"(\.[0-9]{3})([0-9]*)\+" => s"\1+")))

constructfield(::ForgeContext{BitbucketAPI}, f, ::Type{Union{DateTime, Nothing}}, v::AbstractString) =
    DateTime(ZonedDateTime(replace(v, r"(\.[0-9]{3})([0-9]*)\+" => s"\1+")))

include("pagination.jl")
include("users.jl")
include("repositories.jl")
include("pull_requests.jl")
include("workspaces.jl")
include("commits.jl")
include("branches.jl")
include("tags.jl")

end
