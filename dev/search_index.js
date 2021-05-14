var documenterSearchIndex = {"docs":
[{"location":"","page":"Home","title":"Home","text":"CurrentModule = GitForge","category":"page"},{"location":"#GitForge","page":"Home","title":"GitForge","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"(Image: Build Status)","category":"page"},{"location":"","page":"Home","title":"Home","text":"GitForge.jl is a unified interface for interacting with Git \"forges\".","category":"page"},{"location":"","page":"Home","title":"Home","text":"Forge","category":"page"},{"location":"#GitForge.Forge","page":"Home","title":"GitForge.Forge","text":"A forge is an online platform for Git repositories. The most common example is GitHub.\n\nForge subtypes can access their respective web APIs.\n\n\n\n\n\n","category":"type"},{"location":"#Supported-Forges","page":"Home","title":"Supported Forges","text":"","category":"section"},{"location":"#GitHub","page":"Home","title":"GitHub","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"GitHub.GitHubAPI\nGitHub.NoToken\nGitHub.Token\nGitHub.JWT","category":"page"},{"location":"#GitForge.GitHub.GitHubAPI","page":"Home","title":"GitForge.GitHub.GitHubAPI","text":"GitHubAPI(;\n    token::AbstractToken=NoToken(),\n    url::AbstractString=\"https://api.github.com\",\n    has_rate_limits::Bool=true,\n    on_rate_limit::OnRateLimit=ORL_THROW,\n)\n\nCreate a GitHub API client.\n\nKeywords\n\ntoken::AbstractToken=NoToken(): Authorization token (or lack thereof).\nurl::AbstractString=\"https://api.github.com\": Base URL of the target GitHub instance.\nhas_rate_limits::Bool=true: Whether or not the GitHub server has rate limits.\non_rate_limit::OnRateLimit=ORL_THROW: Behaviour on exceeded rate limits.\n\n\n\n\n\n","category":"type"},{"location":"#GitForge.GitHub.NoToken","page":"Home","title":"GitForge.GitHub.NoToken","text":"NoToken()\n\nRepresents no authentication. Only public data will be available.\n\n\n\n\n\n","category":"type"},{"location":"#GitForge.GitHub.Token","page":"Home","title":"GitForge.GitHub.Token","text":"Token(token::AbstractString)\n\nAn OAuth2 token, or a personal access token.\n\n\n\n\n\n","category":"type"},{"location":"#GitForge.GitHub.JWT","page":"Home","title":"GitForge.GitHub.JWT","text":"JWT(token::AbstractString)\n\nA JWT signed by a private key for GitHub Apps.\n\n\n\n\n\n","category":"type"},{"location":"#GitLab","page":"Home","title":"GitLab","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"GitLab.GitLabAPI\nGitLab.NoToken\nGitLab.OAuth2Token\nGitLab.PersonalAccessToken","category":"page"},{"location":"#GitForge.GitLab.GitLabAPI","page":"Home","title":"GitForge.GitLab.GitLabAPI","text":"GitLabAPI(;\n    token::AbstractToken=NoToken(),\n    url::AbstractString=\"https://gitlab.com/api/v4\",\n    has_rate_limits::Bool=true,\n    on_rate_limit::OnRateLimit=ORL_THROW,\n)\n\nCreate a GitLab API client.\n\nKeywords\n\ntoken::AbstractToken=NoToken(): Authorization token (or lack thereof).\nurl::AbstractString\"https://gitlab.com/api/v4\": Base URL of the target GitLab instance.\nhas_rate_limits::Bool=true: Whether or not the GitLab server has rate limits.\non_rate_limit::OnRateLimit=ORL_THROW: Behaviour on exceeded rate limits.\n\n\n\n\n\n","category":"type"},{"location":"#GitForge.GitLab.NoToken","page":"Home","title":"GitForge.GitLab.NoToken","text":"NoToken()\n\nRepresents no authentication. Only public data will be available.\n\n\n\n\n\n","category":"type"},{"location":"#GitForge.GitLab.OAuth2Token","page":"Home","title":"GitForge.GitLab.OAuth2Token","text":"OAuth2Token(token::AbstractString)\n\nAn OAuth2 bearer token.\n\n\n\n\n\n","category":"type"},{"location":"#GitForge.GitLab.PersonalAccessToken","page":"Home","title":"GitForge.GitLab.PersonalAccessToken","text":"PersonalAccessToken(token::AbstractString)\n\nA private access token.\n\n\n\n\n\n","category":"type"},{"location":"#API","page":"Home","title":"API","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Each API function (get_user, get_repo, etc.) returns a Tuple{T, HTTP.Response}. The value of T depends on what function you've called. For example, get_user will generally return some User type for your forge.","category":"page"},{"location":"","page":"Home","title":"Home","text":"When things go wrong, exceptions are thrown. They will always be one of the following types:","category":"page"},{"location":"","page":"Home","title":"Home","text":"ForgeError\nHTTPError\nPostProcessorError\nRateLimitedError","category":"page"},{"location":"#GitForge.ForgeError","page":"Home","title":"GitForge.ForgeError","text":"The supertype of all other exceptions raised by API functions.\n\n\n\n\n\n","category":"type"},{"location":"#GitForge.HTTPError","page":"Home","title":"GitForge.HTTPError","text":"An error encountered during the HTTP request.\n\nFields\n\nresponse::Union{HTTP.Response, Nothing}: Set for status exceptions.\nexception::Exception\nstacktrace::StackTrace\n\n\n\n\n\n","category":"type"},{"location":"#GitForge.PostProcessorError","page":"Home","title":"GitForge.PostProcessorError","text":"An error encountered during response postprocessing.\n\nFields\n\nresponse::HTTP.Response\nexception::Exception\nstacktrace::StackTrace\n\n\n\n\n\n","category":"type"},{"location":"#GitForge.RateLimitedError","page":"Home","title":"GitForge.RateLimitedError","text":"A signal that a rate limit has been exceeded.\n\nFields\n\nperiod::Union{Period, Nothing} Amount of time until rate limit expiry, if known.\n\n\n\n\n\n","category":"type"},{"location":"#Pagination","page":"Home","title":"Pagination","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"@paginate","category":"page"},{"location":"#GitForge.@paginate","page":"Home","title":"GitForge.@paginate","text":"@paginate fun(args...; kwargs...) page=1 per_page=100 -> Paginator\n\nCreate an iterator that paginates the results of repeatedly calling fun(args...; kwargs...). The first argument of fun must be a Forge and it must return a Tuple{Vector{T}, HTTP.Response}.\n\nKeywords\n\npage::Int=1: Starting page.\nper_page::Int=100: Number of entries per page.\n\n\n\n\n\n","category":"macro"},{"location":"#Endpoints","page":"Home","title":"Endpoints","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"These functions all allow any number of trailing keywords. For more information on these keywords, see request.","category":"page"},{"location":"","page":"Home","title":"Home","text":"get_user\nget_users\nupdate_user\ncreate_user\ndelete_user\nget_user_repos\nget_repo\nget_branch\nget_file_contents\nget_pull_request\nget_pull_requests\ncreate_pull_request\nupdate_pull_request\nget_commit\nget_tags\nis_collaborator\nis_member","category":"page"},{"location":"#GitForge.get_user","page":"Home","title":"GitForge.get_user","text":"get_user(::Forge[, name_or_id::Union{AbstractString, Integer}])\n\nGet the currently authenticated user, or a user by name or ID.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.get_users","page":"Home","title":"GitForge.get_users","text":"get_users(::Forge)\n\nGet all users.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.update_user","page":"Home","title":"GitForge.update_user","text":"update_user(::Forge[, id::Integer]; kwargs...)\n\nUpdate the currently authenticated user, or a user by ID.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.create_user","page":"Home","title":"GitForge.create_user","text":"create_user(::Forge; kwargs...)\n\nCreate a new user.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.delete_user","page":"Home","title":"GitForge.delete_user","text":"delete_user(::Forge, id::Integer)\n\nDelete a user by ID.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.get_user_repos","page":"Home","title":"GitForge.get_user_repos","text":"get_user_repos(::Forge[, name_or_id::Union{AbstractString, Integer}])\n\nGet the currently authenticated user's repositories, or those of a user by name or ID.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.get_repo","page":"Home","title":"GitForge.get_repo","text":"get_repo(::Forge, owner::AbstractString, repo::AbstractString)\nget_repo(::Forge, id::Integer)\nget_repo(::Forge, owner::AbstractString, subgroup::AbstractString, repo::AbstractString)\n\nGet a repository by owner and name or ID.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.get_branch","page":"Home","title":"GitForge.get_branch","text":"get_branch(::Forge, owner::AbstractString, repo::AbstractString, branch::AbstractString)\n\nGet a branch from a repository.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.get_file_contents","page":"Home","title":"GitForge.get_file_contents","text":"get_file_contents(\n    ::Forge,\n    owner::AbstractString,\n    repo::AbstractString,\n    path::AbstractString,\n)\nget_file_contents(f::Forge, id::Integer, path::AbstractString)\n\nGet a file from a repository.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.get_pull_request","page":"Home","title":"GitForge.get_pull_request","text":"get_pull_request(::Forge, owner::AbstractString, repo::AbstractString, number::Integer)\nget_pull_request(::Forge, project::Integer, number::Integer)\n\nGet a specific pull request.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.get_pull_requests","page":"Home","title":"GitForge.get_pull_requests","text":"get_pull_requests(::Forge, owner::AbstractString, repo::AbstractString)\nget_pull_requests(::Forge, project::Integer)\n\nList a repository's pull requests.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.create_pull_request","page":"Home","title":"GitForge.create_pull_request","text":"create_pull_requests(::Forge, owner::AbstractString, repo::AbstractString; kwargs...)\ncreate_pull_requests(::Forge, project::Integer; kwargs...)\n\nCreate a pull request.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.update_pull_request","page":"Home","title":"GitForge.update_pull_request","text":"update_pull_request(::Forge, owner::AbstractString, repo::AbstractString, number::Integer; kwargs...)\nupdate_pull_request(::Forge, project::Integer, number::Integer; kwargs...)\n\nUpdate a pull request.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.get_commit","page":"Home","title":"GitForge.get_commit","text":"get_commit(::Forge, owner::AbstractString, repo::AbstractString, ref::AbstractString)\nget_commit(::Forge, project::Integer, ref::AbstractString)\n\nGet a commit from a repository.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.get_tags","page":"Home","title":"GitForge.get_tags","text":"get_tags(::Forge, owner::AbstractString, repo::AbstractString)\nget_tags(::Forge, project::Integer)\n\nGet a list of tags from a repository.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.is_collaborator","page":"Home","title":"GitForge.is_collaborator","text":"is_collaborator(\n    ::Forge,\n    owner::AbstractString,\n    repo::AbstractString,\n    name_or_id::Union{AbstractString, Integer},\n)\n\nCheck whether or not a user is a collaborator on a repository.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.is_member","page":"Home","title":"GitForge.is_member","text":"is_member(::Forge, org::AbstractString, name_or_id::Union{AbstractString, Integer})\n\nCheck whether or not a user is a member of an organization.\n\n\n\n\n\n","category":"function"},{"location":"#Internals","page":"Home","title":"Internals","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The following resources are useful for implementing new forges, or customizing behaviour.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Many functions take a Function argument, which can be used to limit the affected API functions. To make a method specific to a single function, use ::typeof(fun).","category":"page"},{"location":"#URLs","page":"Home","title":"URLs","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"These functions set request URLs. To determine the full URL for a given request, they are concatenated together.","category":"page"},{"location":"","page":"Home","title":"Home","text":"base_url\nendpoint\nEndpoint","category":"page"},{"location":"#GitForge.base_url","page":"Home","title":"GitForge.base_url","text":"base_url(::Forge) -> String\n\nReturns the base URL of all API endpoints.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.endpoint","page":"Home","title":"GitForge.endpoint","text":"endpoint(::Forge, ::Function, args...) -> Endpoint\n\nReturns an Endpoint for a given function. Trailing arguments are usually important for routing. For example, get_user can take some ID parameter which becomes part of the URL.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.Endpoint","page":"Home","title":"GitForge.Endpoint","text":"Endpoint(\n    method::Symbol,\n    url::AbstractString;\n    headers::Vector{<:Pair}=HTTP.Header[],\n    query::Dict=Dict(),\n    allow_404::Bool=false,\n) -> Endpoint\n\nContains information on how to call an endpoint.\n\nArguments\n\nmethod::Symbol: HTTP request method to use.\nurl::AbstractString: Endpoint URL, relative to the base URL.\n\nKeywords\n\nheaders::Vector{<:Pair}=HTTP.Header[]: Request headers to add.\nquery::Dict=Dict(): Query string parameters to add.\nallow_404::Bool=false: Sends responses  with 404 statuses to the postprocessor.\n\n\n\n\n\n","category":"type"},{"location":"#Request-Options","page":"Home","title":"Request Options","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"These functions set parts of HTTP requests.","category":"page"},{"location":"","page":"Home","title":"Home","text":"request_headers\nrequest_query\nrequest_kwargs","category":"page"},{"location":"#GitForge.request_headers","page":"Home","title":"GitForge.request_headers","text":"request_headers(::Forge, ::Function) -> Vector{Pair}\n\nReturns the headers that should be added to each request.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.request_query","page":"Home","title":"GitForge.request_query","text":"request_query(::Forge, ::Function) -> Dict\n\nReturns the query string parameters that should be added to each request.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.request_kwargs","page":"Home","title":"GitForge.request_kwargs","text":"request_kwargs(::Forge, ::Function) -> Dict{Symbol}\n\nReturns the extra keyword arguments that should be passed to HTTP.request.\n\n\n\n\n\n","category":"function"},{"location":"#Requests","page":"Home","title":"Requests","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"This function makes the actual HTTP requests.","category":"page"},{"location":"","page":"Home","title":"Home","text":"request","category":"page"},{"location":"#GitForge.request","page":"Home","title":"GitForge.request","text":"request(\n    f::Forge, fun::Function, ep::Endpoint;\n    headers::Vector{<:Pair}=HTTP.Header[],\n    query::AbstractDict=Dict(),\n    request_opts=Dict(),\n    kwargs...,\n) -> T, HTTP.Response\n\nMake an HTTP request and return T and the response, where T is determined by into.\n\nArguments\n\nf::Forge A Forge subtype.\nfun::Function: The API function being called.\nep::Endpoint: The endpoint information.\n\nKeywords\n\nquery::AbstractDict=Dict(): Query string parameters to add to the request.\nheaders::Vector{<:Pair}=HTTP.Header[]: Headers to add to the request.\nrequest_opts=Dict(): Keywords passed into HTTP.request.\n\nTrailing keywords are sent as a JSON body for PATCH, POST, and PUT requests. For other request types, the keywords are sent as query string parameters.\n\nnote: Note\nEvery API function passes its keyword arguments into this function. Therefore, to customize behaviour for a single request, pass the above keywords to the API function.\n\n\n\n\n\n","category":"function"},{"location":"#Rate-Limiting","page":"Home","title":"Rate Limiting","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"These functions and types handle certain generic rate limiters.","category":"page"},{"location":"","page":"Home","title":"Home","text":"RateLimiter\nOnRateLimit\nhas_rate_limits\nrate_limit_check\non_rate_limit\nrate_limit_wait\nrate_limit_period\nrate_limit_update!","category":"page"},{"location":"#GitForge.RateLimiter","page":"Home","title":"GitForge.RateLimiter","text":"A generic rate limiter using the [X-]RateLimit-Remaining and [X-]RateLimit-Reset response headers. The reset header is assumed to be a Unix timestamp in seconds.\n\n\n\n\n\n","category":"type"},{"location":"#GitForge.OnRateLimit","page":"Home","title":"GitForge.OnRateLimit","text":"Determines how to react to an exceeded rate limit.\n\nORL_THROW: Throw a RateLimitedError.\nORL_WAIT: Block and wait for the rate limit to expire.\n\n\n\n\n\n","category":"type"},{"location":"#GitForge.has_rate_limits","page":"Home","title":"GitForge.has_rate_limits","text":"has_rate_limits(::Forge, ::Function) -> Bool\n\nReturns whether or not the forge server uses rate limiting.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.rate_limit_check","page":"Home","title":"GitForge.rate_limit_check","text":"rate_limit_check(::Forge, ::Function) -> Bool\n\nReturns whether or not there is an active rate limit. If one is found, on_rate_limit is called to determine how to react.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.on_rate_limit","page":"Home","title":"GitForge.on_rate_limit","text":"on_rate_limit(::Forge, ::Function) -> OnRateLimit\n\nReturns an OnRateLimit that determines how to react to an exceeded rate limit.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.rate_limit_wait","page":"Home","title":"GitForge.rate_limit_wait","text":"rate_limit_wait(::Forge, ::Function)\n\nWait for a rate limit to expire.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.rate_limit_period","page":"Home","title":"GitForge.rate_limit_period","text":"rate_limit_period(::Forge, ::Function) -> Period\n\nCompute the amount of time until a rate limit expires.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.rate_limit_update!","page":"Home","title":"GitForge.rate_limit_update!","text":"rate_limit_update!(::Forge, ::Function, ::HTTP.Response)\n\nUpdate the rate limiter with a new response.\n\n\n\n\n\n","category":"function"},{"location":"#Post-Processing","page":"Home","title":"Post Processing","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"These functions and types process HTTP responses.","category":"page"},{"location":"","page":"Home","title":"Home","text":"postprocessor\ninto\nPostProcessor\npostprocess\nDoNothing\nDoSomething\nJSON\n@json","category":"page"},{"location":"#GitForge.postprocessor","page":"Home","title":"GitForge.postprocessor","text":"postprocessor(::Forge, ::Function) -> PostProcessor\n\nReturns the PostProcessor to be used.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.into","page":"Home","title":"GitForge.into","text":"into(::Forge, ::Function) -> Type\n\nReturns the type that the PostProcessor should create from the response.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.PostProcessor","page":"Home","title":"GitForge.PostProcessor","text":"Determines the behaviour of postprocess.\n\n\n\n\n\n","category":"type"},{"location":"#GitForge.postprocess","page":"Home","title":"GitForge.postprocess","text":"postprocess(::PostProcessor, ::HTTP.Response, ::Type{T})\n\nComputes a value to be returned from an HTTP response.\n\n\n\n\n\n","category":"function"},{"location":"#GitForge.DoNothing","page":"Home","title":"GitForge.DoNothing","text":"Does nothing and always returns nothing.\n\n\n\n\n\n","category":"type"},{"location":"#GitForge.DoSomething","page":"Home","title":"GitForge.DoSomething","text":"DoSomething(::Function) -> DoSomething\n\nRuns a user-defined postprocessor.\n\n\n\n\n\n","category":"type"},{"location":"#GitForge.JSON","page":"Home","title":"GitForge.JSON","text":"JSON(f::Function=identity) -> JSON\n\nParses a JSON response into a given type and runs f on that object.\n\n\n\n\n\n","category":"type"},{"location":"#GitForge.@json","page":"Home","title":"GitForge.@json","text":"@json struct T ... end\n\nCreate a type that can be parsed from JSON.\n\n\n\n\n\n","category":"macro"}]
}
