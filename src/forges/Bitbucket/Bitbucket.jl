"""
    Bitbucket

Implements read-only access
"""
module Bitbucket

import ..GitForge: endpoint, into, postprocessor, ForgeAPIError
import ..GitForge.GitHub: ismemberorcollaborator
import Base.@kwdef, Base.Meta.quot
import StructTypes: Struct, UnorderedStruct, constructfrom, StructType, construct

using ..GitForge
using ..GitForge:
    @json,
    AStr,
    DoSomething,
    Endpoint,
    Forge,
    JSON,
    OnRateLimit,
    RateLimiter,
    HEADERS,
    ORL_THROW,
    @not_implemented
using ..GitForge.GitHub: NoToken, JWT, AbstractToken
using Dates, TimeZones, HTTP, JSON2, UUIDs, StructTypes
using Dates: Date, DateTime

export BitbucketAPI, Token, JWT

# using a const here in order to export it
const Token = GitForge.GitHub.Token
const DEFAULT_URL = "https://api.bitbucket.org/2.0"

auth_headers(::NoToken) = []
auth_headers(t::Token) = ["Authorization" => "Basic $(t.token)"]
auth_headers(t::JWT) = ["Authorization" => "Bearer $(t.token)"]

function JSON2.read(io::IO, ::Type{UUID}; kwargs...)
    str = JSON2.read(io, String)
    UUID(str[2:end-1])
end
JSON2.write(io::IO, uuid::UUID; kwargs...) = JSON2.write(io, "{$uuid}"; kwargs...)

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
struct BitbucketAPI <: Forge
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

GitForge.base_url(b::BitbucketAPI) = b.url
GitForge.request_headers(b::BitbucketAPI, ::Function) = [HEADERS; auth_headers(b.token)]
GitForge.postprocessor(::BitbucketAPI, ::Function) = JSON_Struct()
GitForge.has_rate_limits(b::BitbucketAPI, ::Function) = b.hasrl
GitForge.rate_limit_check(b::BitbucketAPI, ::Function) = GitForge.rate_limit_check(b.rl_general)
GitForge.on_rate_limit(b::BitbucketAPI, ::Function) = b.orl
GitForge.rate_limit_wait(b::BitbucketAPI, ::Function) = GitForge.rate_limit_wait(b.rl_general)
GitForge.rate_limit_period(b::BitbucketAPI, ::Function) = GitForge.rate_limit_period(b.rl_general)
GitForge.rate_limit_update!(b::BitbucketAPI, ::Function, r::HTTP.Response) =
    GitForge.rate_limit_update!(b.rl_general, r)

cvt_date(str::AbstractString) =
    ZonedDateTime(replace(str, r"(\.[0-9]{3})([0-9]*)\+" => s"\1+")).utc_datetime

function zdate(kw::NamedTuple, prop::Symbol)
    !haskey(kw, prop) && return (;)
    (; prop =>
        ZonedDateTime(replace(kw[prop], r"(\.[0-9]{3})([0-9]*)\+" => s"\1+")).utc_datetime)
end

struct BBStructClosure{T}
    obj::T
end

constructfield(::Type{FT}, v) where {FT} = constructfrom(FT, v)

# capture type Nothing fields here so the methods below won't apply to them
constructfield(::Type{Nothing}, v) = constructfrom(Nothing, v)

constructfield(::Type{FT}, str::AbstractString) where {FT <: Union{UUID, Nothing}} = UUID(str[2:end-1])

constructfield(::Type{FT}, v::AbstractString) where {FT <: Union{Date, Nothing}} =
    Date(ZonedDateTime(replace(v, r"(\.[0-9]{3})([0-9]*)\+" => s"\1+")))

constructfield(::Type{FT}, v::AbstractString) where {FT <: Union{DateTime, Nothing}} =
    DateTime(ZonedDateTime(replace(v, r"(\.[0-9]{3})([0-9]*)\+" => s"\1+")))

@inline function (f::BBStructClosure{T})(_i, nm, ::Type{FT}) where {T, FT}
    hasfield(T, nm) ? constructfield(FT, getfield(f.obj, nm)) : nothing
end

StructTypes.constructfrom(::Struct, ::Type{ST}, ::Struct, obj::OT) where {ST <: NamedTuple, OT <: ST} =
    obj

StructTypes.constructfrom(::UnorderedStruct, ::Type{ST}, ::UnorderedStruct, obj::OT) where {ST <: NamedTuple, OT <: ST} =
    obj

function collect_extras(type::Type, kw::NamedTuple)
    names = fieldnames(type)
    main = []
    extras = []
    for k in keys(kw)
        push!(k in names ? main : extras, k => kw[k])
    end
    (; main..., _extras = (; extras...))
end

sortkw(kw)=(;sort([pairs(kw)...], by=p->p[1])...)

struct JSON_Struct <: GitForge.PostProcessor
    f::Function
end
JSON_Struct() = JSON_Struct(identity)

function GitForge.postprocess(p::JSON_Struct, r::HTTP.Response, ::Type{T}) where T
    data = JSON2.read(IOBuffer(r.body))
    p.f(constructfrom(T, JSON2.read(IOBuffer(r.body))))
end

macro json_struct(type)
    quote
        StructTypes.StructType(::Type{$type}) = UnorderedStruct()

        StructTypes.constructfrom(::Struct, ::Type{$type}, ::Union{StructTypes.Mutable, StructTypes.Struct}, obj) =
            StructTypes.construct(BBStructClosure(obj), $type)

        function StructTypes.constructfrom(t::Struct, ::Type{$type}, kw::NamedTuple)
            kw = collect_extras($type, kw)
            constructfrom(UnorderedStruct(), $type, StructType(NamedTuple), kw)
        end
    end
end

include("pagination.jl")
include("users.jl")
include("repositories.jl")
include("pull_requests.jl")
include("workspaces.jl")
include("commits.jl")
include("branches.jl")
include("tags.jl")
#include("comments.jl")

end
