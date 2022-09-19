struct ForgeAPIError <: GitForge.ForgeError
    message::String
end

struct ForgeAPINotImplemented <: GitForge.ForgeError
    func::Function
    args::Tuple
    noted::Bool
    api
end

Base.showerror(io::IO, e::ForgeAPINotImplemented) =
    print(io, typeof(e.api), " has not implemented the function $(e.func) for arguments $(typeof.((e.api, e.func, e.args...)))\n  use: @not_implemented(::$(typeof(e.api)), ::typeof($(e.func)), $(join(map(a-> "::$(typeof(a))", e.args), ", ")))")

not_implemented(api, func, args...; noted = true) = throw(ForgeAPINotImplemented(func, args, noted, api))

"""
A forge is an online platform for Git repositories.
The most common example is [GitHub](https://github.com).

`Forge` subtypes can access their respective web APIs.
"""
abstract type Forge end

abstract type ForgeType end

forgeof(::Type) = Nothing

struct ForgeContext{Forge, Type} end

StructTypes.StructType(::Type{<:ForgeType}) = DictType()

function construct(::Type{T}, dict::Dict; kw...) where {T <: ForgeType}
    ctx = ForgeContext{forgeof(T), T}()
    T(;
         (k=> try
              GitForge.constructfield(ctx, k, fieldtype(T, k), get(dict, k, nothing))
          catch
              throw(ForgeAPIError("Error constructing field $T.$k from $(get(dict, k, nothing))"))
          end
          for k in fieldnames(T) if haskey(dict, k))...,
      _extras = (; kw..., (k=> v for (k, v) in dict if !hasfield(T, k))...),
      )
end

showfield(type, name) = "$(parentmodule(type)).$(nameof(type)).$name"

# all fields should be assingable to nothing because of the @json macro
constructfield(::ForgeContext, field, ::Type, ::Nothing) = constructfrom(Nothing, nothing)

## handle Date strings properly and convert ordinary dicts to symbol dicts
constructfield(::ForgeContext{FORGE, OWNER}, field, FT::Type, val) where {FORGE, OWNER} = try
    constructfrom(FT, val)
catch err
    @error "Could not construct $(showfield(OWNER, field))::$FT from value $v" exception=(err,catch_backtrace())
    rethrow(err)
end
    
# convert Dict keys to Symbols where appropriate
constructfield(::ForgeContext, field, FT::Type, dict::Dict{Symbol}) = constructfrom(FT, dict)

# convert dicts that are not known to be keyed with symbols
constructfield(::ForgeContext, field, FT::Type, dict::Dict) =
    NamedTuple <: FT ?
    (; (Symbol(k) => v for (k,v) in dict)...) :
    constructfrom(FT, Dict(Symbol(k) => v for (k,v) in dict))

StructTypes.keyvaluepairs(obj::T) where {T <: ForgeType} = [
    [k=>getfield(obj, k) for k in fieldnames(T) if k != :_extras]...,
    pairs(obj._extras)...,
]

function StructTypes.keywordargs(::Type{T}) where T <: ForgeType
    M = parentmodule(T)
    return if isdefined(M, :DEFAULT_DATEFORMAT)
        (; dateformat=M.DEFAULT_DATEFORMAT)
    else
        NamedTuple()
    end
end

"""
    Endpoint(
        method::Symbol,
        url::$AStr;
        headers::Vector{<:Pair}=HTTP.Header[],
        query::Dict=Dict(),
        allow_404::Bool=false,
    ) -> Endpoint

Contains information on how to call an endpoint.

## Arguments
- `method::Symbol`: HTTP request method to use.
- `url::$AStr`: Endpoint URL, relative to the base URL.

## Keywords
- `headers::Vector{<:Pair}=HTTP.Header[]`: Request headers to add.
- `query::Dict=Dict()`: Query string parameters to add.
- `allow_404::Bool=false`: Sends responses  with 404 statuses to the postprocessor.
"""
struct Endpoint
    method::Symbol
    url::String
    headers::Vector{<:Pair}
    query::Dict
    allow_404::Bool

    function Endpoint(
        method::Symbol, url::AStr;
        headers::Vector{<:Pair}=HTTP.Header[],
        query::Dict=Dict(),
        allow_404::Bool=false,
    )
        return new(method, url, headers, query, allow_404)
    end
end

"""
    base_url(::Forge) -> String

Returns the base URL of all API endpoints.
"""
base_url(::Forge) = ""

"""
    request_headers(::Forge, ::Function) -> Vector{Pair}

Returns the headers that should be added to each request.
"""
request_headers(::Forge, ::Function) = HEADERS

"""
    request_query(::Forge, ::Function) -> Dict

Returns the query string parameters that should be added to each request.
"""
request_query(::Forge, ::Function) = Dict()

"""
    request_kwargs(::Forge, ::Function) -> Dict{Symbol}

Returns the extra keyword arguments that should be passed to `HTTP.request`.
"""
request_kwargs(::Forge, ::Function) = Dict()

"""
    postprocessor(::Forge, ::Function) -> PostProcessor

Returns the [`PostProcessor`](@ref) to be used.
"""
postprocessor(::Forge, ::Function) = DoNothing()

"""
    into(::Forge, ::Function) -> Type

Returns the type that the [`PostProcessor`](@ref) should create from the response.

"""
into(::Forge, ::Function) = Any

"""
    endpoint(::Forge, ::Function, args...) -> Endpoint

Returns an [`Endpoint`](@ref) for a given function.
Trailing arguments are usually important for routing.
For example, [`get_user`](@ref) can take some ID parameter which becomes part of the URL.
"""
endpoint(forge::T, func::Function, args...) where T <: Forge =
    throw(ForgeAPINotImplemented(func, args, false, forge))

macro not_implemented(api::Expr, func::Expr, rest...)
    api_name = length(api.args) == 2 ? api.args[1] : :api
    func_name = func.args[1].args[end]
    rest = [rest[n].head !== :(::) ? rest[n] : :($(Symbol("a$n"))::$(rest[n].args[end])) for n in 1:length(rest)]
    rest_names = map(a-> a.head !== :(::) ? a : a.args[1], rest)
    :(endpoint(api::$(esc((api.args[end]))), $(esc(func)), $(rest...)) = throw(ForgeAPINotImplemented($func_name, ($(rest_names...),), true, $api_name)))
end

"""
    has_rate_limits(::Forge, ::Function) -> Bool

Returns whether or not the forge server uses rate limiting.
"""
has_rate_limits(::Forge, ::Function) = false

"""
    rate_limit_check(::Forge, ::Function) -> Bool

Returns whether or not there is an active rate limit.
If one is found, [`on_rate_limit`](@ref) is called to determine how to react.
"""
rate_limit_check(::Forge, ::Function) = false

"""
    on_rate_limit(::Forge, ::Function) -> OnRateLimit

Returns an [`OnRateLimit`](@ref) that determines how to react to an exceeded rate limit.
"""
on_rate_limit(::Forge, ::Function) = ORL_THROW

"""
    rate_limit_wait(::Forge, ::Function)

Wait for a rate limit to expire.
"""
rate_limit_wait(::Forge, ::Function) = nothing

"""
    rate_limit_period(::Forge, ::Function) -> Period

Compute the amount of time until a rate limit expires.
"""
rate_limit_period(::Forge, ::Function) = nothing

"""
    rate_limit_update!(::Forge, ::Function, ::HTTP.Response)

Update the rate limiter with a new response.
"""
rate_limit_update!(::Forge, ::Function, ::HTTP.Response) = nothing
