# Getting Started with `anycable-go`

AnyCable-Go is a WebSocket server for AnyCable written in Golang.

## Installation

The easiest way to install AnyCable-Go is to [download](https://github.com/anycable/anycable-go/releases) a pre-compiled binary.

MacOS users could install it with [Homebrew](https://brew.sh/)

```sh
brew install anycable-go
```

Arch Linux users can install [anycable-go package from AUR](https://aur.archlinux.org/packages/anycable-go/).

Of course, you can install it from source too:

```sh
go get -u -f github.com/anycable/anycable-go/cmd/anycable-go
```

## Usage

Run server:

```sh
$ anycable-go --rpc_host=localhost:50051 --headers=cookie \
              --redis_url=redis://localhost:6379/5 --redis_channel=__anycable__ \
              --host=localhost --port=8080

=> INFO time context=main Starting AnyCable v1.0.0 (pid: 12902, open files limit: 524288)
```

You can also provide configuration parameters through the corresponding environment variables (i.e. `ANYCABLE_RPC_HOST`, `ANYCABLE_REDIS_URL`, etc.).

### Configuration parameters

Here is the list of the most commonly used configuration parameters and the way you can provide them:

- through environment variable
- through a CLI option.

**NOTE:** To see all available options run `anycable-go -h`.

---

**--host**, **--port** (`ANYCABLE_HOST`, `ANYCABLE_PORT` or `PORT`)

Server host and port (default: `"localhost:8080"`).

**--rpc_host** (`ANYCABLE_RPC_HOST`)

RPC service address (default: `"localhost:50051"`).

**--headers** (`ANYCABLE_HEADERS`)

Comma-separated list of headers to proxy to RPC (default: `"cookie"`).

**--broadcast_adapter** (`ANYCABLE_BROADCAST_ADAPTER`, default: `redis`)

[Broadcasting adapter](../ruby/broadcast_adapters.md) to use. Available options: `redis` (default), `http`.

When HTTP adapter is used, AnyCable-Go accepts broadcasting requests on `:8090/_broadcast`.

**--http_broadcast_port** (`ANYCABLE_HTTP_BROADCAST_PORT`, default: `8090`)

You can specify on which port to receive broadcasting requests (NOTE: it could be the same port as the main HTTP server listens to).

**--http_broadcast_secret** (`ANYCABLE_HTTP_BROADCAST_SECRET`)

Authorization secret to protect the broadcasting endpoint (see [Ruby docs](../ruby/broadcast_adapters.md#securing-http-endpoint)).

**--redis_url** (`ANYCABLE_REDIS_URL` or `REDIS_URL`)

Redis URL for pub/sub (default: `"redis://localhost:6379/5"`).

**--redis_channel** (`ANYCABLE_REDIS_CHANNEL`)

Redis channel for broadcasting (default: `"__anycable__"`).

**--log_level** (`ANYCABLE_LOG_LEVEL`)

Logging level (default: `"info"`).

**--debug** (`ANYCABLE_DEBUG`)

Enable debug mode (more verbose logging).

## TLS

To secure your `anycable-go` server provide the paths to SSL certificate and private key:

```sh
anycable-go --port=443 -ssl_cert=path/to/ssl.cert -ssl_key=path/to/ssl.key

=> INFO time context=http Starting HTTPS server at 0.0.0.0:443
```

## Concurrently settings

AnyCable-Go uses a single Go gRPC client to communicate with AnyCable RPC servers (see [the corresponding PR](https://github.com/anycable/anycable-go/pull/88)). We limit the number of concurrent RPC calls to avoid flooding servers (and getting `ResourceExhausted` exceptions in response).

By default, the concurrency limit is equal to **28**, which is intentionally less than the default RPC size (see [Ruby configuration](../ruby/configuration.md#concurrency-settings)): there is a tiny lag between the times when the response is received by the client and the corresponding worker is returned to the pool. Thus, whenever you update the concurrency settings, make sure that the AnyCable-Go value is _slightly less_ than the AnyCable-RPC one.

You can change this value via `--rcp_concurrency` (`ANYCABLE_RPC_CONCURRENCY`) parameter.
