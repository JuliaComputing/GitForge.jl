module GitForge

using Base.Iterators: Pairs
using Base.StackTraces: StackTrace

using Dates
using Dates: Period, UTC, now
using HTTP: HTTP
using UUIDs: UUID
using JSON3: JSON3, @writechar, @check
using StructTypes: StructTypes, UnorderedStruct, StructType, DictType, StringType
import StructTypes: construct, constructfrom

const AStr = AbstractString
const HEADERS = ["Content-Type" => "application/json"]

diag = false

function set_diag(value::Bool)
    global diag = value

    @info "GitForge: set diag to $diag"
end

let
    proj = read(joinpath(dirname(@__DIR__), "Project.toml"), String)
    pkgver = match(r"version = \"(.+)\"", proj)[1]
    push!(HEADERS, "User-Agent" => "Julia v$VERSION (GitForge v$pkgver)")
end

"""
The supertype of all other exceptions raised by API functions.
"""
abstract type ForgeError <: Exception end

Base.include_dependency("../Project.toml")
include("forge.jl")
include("ratelimits.jl")
include("request.jl")
include("pagination.jl")
include("helpers.jl")
include("api.jl")
include(joinpath("forges", "GitHub", "GitHub.jl"))
include(joinpath("forges", "GitLab", "GitLab.jl"))
include(joinpath("forges", "Bitbucket", "Bitbucket.jl"))

end
