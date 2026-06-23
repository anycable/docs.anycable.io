# Server options reference (anycable-go)

Every command-line option and environment variable for the `anycable-go` server, grouped by area. Generated from `anycable-go --help` (OSS v1.6.14), with Pro-only options listed separately.

For prose explanations of the most common options, see [Configuration](./configuration.md). This page is the complete, flat list, handy as a lookup and for agents.

> Every option can be set three ways: a command-line flag (`--port 8080`), an environment variable (the **Env** column, e.g. `ANYCABLE_PORT=8080`), or a key in a TOML config file (`--config-path`). Options marked **Value** take an argument. Run `anycable-go --help` for the list matching your installed version.

## Global

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--config-path` | yes | — | — | Path to the TOML configuration file |
| `--help, -h` | — | — | — | show help |
| `--ignore-config-path` | — | — | `false` | Ignore configuration files |
| `--print-config` | — | — | `false` | Print configuration and exit |
| `--version, -v` | — | — | — | print the version |
| `--ws_max_pending_size` | yes | — | `1048576` | Maximum size (in bytes) of the write queue for a session before it's considered slow and disconnected (0 = unlimited) |

## AnyCable-Go Server

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--allowed_origins` | yes | `ANYCABLE_ALLOWED_ORIGINS` | — | Accept requests only from specified origins, e.g., "www.example.com,*example.io". No check is performed if empty |
| `--broadcast_key` | yes | `ANYCABLE_BROADCAST_KEY` | — | An authentication key for broadcast requests |
| `--health-path` | yes | `ANYCABLE_HEALTH_PATH` | `"/health"` | HTTP health endpoint path |
| `--host` | yes | `ANYCABLE_HOST` | `"localhost"` | Server host |
| `--max-conn` | yes | `ANYCABLE_MAX_CONN` | `0` | Limit simultaneous server connections (0 – without limit) |
| `--noauth` | — | `ANYCABLE_NOAUTH` | `false` | [DANGER ZONE] Disable client authentication over RPC |
| `--path` | yes | `ANYCABLE_PATH` | `"/cable"` | WebSocket endpoint path (you can specify multiple paths using comma as separator) |
| `--port` | yes | `ANYCABLE_PORT, $PORT` | `8080` | Server port |
| `--public` | — | `ANYCABLE_PUBLIC` | `false` | [DANGER ZONE] Run server in the public mode allowing all connections and stream subscriptions |
| `--secret` | yes | `ANYCABLE_SECRET` | — | A common secret key used by all features by default |
| `--shutdown_delay` | yes | `ANYCABLE_SHUTDOWN_DELAY` | `0` | Sleep time before shutting down (in seconds) |
| `--shutdown_timeout` | yes | `ANYCABLE_SHUTDOWN_TIMEOUT` | `30` | Graceful shutdown timeout (in seconds) |

## API

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--api_path` | yes | `ANYCABLE_API_PATH` | `"/api"` | API endpoint base path |
| `--api_port` | yes | `ANYCABLE_API_PORT` | `0` | API server port (0 = use main server port) |
| `--api_secret` | yes | `ANYCABLE_API_SECRET` | — | Secret token to authenticate API requests |

## Broadcasting

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--broadcast_adapter` | yes | `ANYCABLE_BROADCAST_ADAPTER` | — | Broadcasting adapter to use (http, redisx, redis or nats). You can specify multiple at once via a comma-separated list |
| `--broker` | yes | `ANYCABLE_BROKER` | — | Broker engine to use (memory) |
| `--nats_channel` | yes | `ANYCABLE_NATS_CHANNEL` | `"__anycable__"` | NATS channel for broadcasts |
| `--pubsub` | yes | `ANYCABLE_PUBSUB` | — | Pub/Sub adapter to use (redis or nats) |
| `--redis_channel` | yes | `ANYCABLE_REDIS_CHANNEL` | `"__anycable__"` | Redis channel for broadcasts |

## Broker

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--history_limit` | yes | `ANYCABLE_HISTORY_LIMIT` | `100` | Max number of messages to keep in the stream's history |
| `--history_ttl` | yes | `ANYCABLE_HISTORY_TTL` | `300` | TTL for messages in streams history (seconds) |
| `--presence_ttl` | yes | `ANYCABLE_PRESENCE_TTL` | `15` | TTL for presence information (seconds) |
| `--sessions_ttl` | yes | `ANYCABLE_SESSIONS_TTL` | `300` | TTL for expired/disconnected sessions (seconds) |

## Disconnector

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--disconnect_mode` | yes | `ANYCABLE_DISCONNECT_MODE` | `"auto"` | Define when to call Disconnect callback (always, never, auto) |

## Durable Streams

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--ds` | — | `ANYCABLE_DS` | `false` | Enable Durable Streams endpoint |
| `--ds_path` | yes | `ANYCABLE_DS_PATH` | `"/ds"` | Durable Streams endpoint path |
| `--ds_poll_interval` | yes | `ANYCABLE_DS_POLL_INTERVAL` | `10` | Durable Streams long polling interval (seconds) |
| `--ds_skip_auth` | — | `ANYCABLE_DS_SKIP_AUTH` | `false` | Disable client authentication for Durable Streams (only authorize stream access) |
| `--ds_sse_ttl` | yes | `ANYCABLE_DS_SSE_TTL` | `60` | Durable Streams SSE connections time-to-live (seconds) |

## Embedded NATS

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--embed_nats` | — | `ANYCABLE_EMBED_NATS` | `false` | Enable embedded NATS server and use it for pub/sub |
| `--enats_cluster_name` | yes | `ANYCABLE_ENATS_CLUSTER_NAME` | `"anycable-cluster"` | NATS cluster name |
| `--enats_cluster_routes` | yes | `ANYCABLE_ENATS_CLUSTER_ROUTES` | — | Comma-separated list of known cluster addresses |
| `--enats_gateway_advertise` | yes | `ANYCABLE_ENATS_GATEWAY_ADVERTISE` | — | NATS gateway advertise address |
| `--enats_gateways` | yes | `ANYCABLE_ENATS_GATEWAYS` | — | Semicolon-separated list of known gateway configurations: name_a:gateway_1,gateway_2;name_b:gateway_4 |
| `--enats_max_payload` | yes | `ANYCABLE_ENATS_MAX_PAYLOAD` | `1048576 = 1MB) (default: 0` | Maximum message payload size in bytes |
| `--enats_server_name` | yes | `ANYCABLE_ENATS_SERVER_NAME` | — | Embedded NATS unique server name (required for JetStream), auto-generated by default |

## HTTP Broadcast

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--http_broadcast_path` | yes | `ANYCABLE_HTTP_BROADCAST_PATH` | `"/_broadcast"` | HTTP pub/sub endpoint path |
| `--http_broadcast_port` | yes | `ANYCABLE_HTTP_BROADCAST_PORT` | `0` | HTTP pub/sub server port |

## JWT

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--enforce_jwt` | — | `ANYCABLE_ENFORCE_JWT` | `false` | Whether to enforce token presence for all connections |
| `--jwt_param` | yes | `ANYCABLE_JWT_PARAM` | `"jid"` | The name of a query string param or an HTTP header carrying a token |
| `--jwt_secret` | yes | `ANYCABLE_JWT_SECRET` | — | The encryption key used to verify JWT tokens |

## Log

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--debug` | — | `ANYCABLE_DEBUG` | `false` | Enable debug mode (more verbose logging) |
| `--log_format` | yes | `ANYCABLE_LOG_FORMAT` | `"text"` | Set logging format (text/json) |
| `--log_level` | yes | `ANYCABLE_LOG_LEVEL` | `"info"` | Set logging level (debug/info/warn/error) |

## Metrics

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--metrics_host` | yes | `ANYCABLE_METRICS_HOST` | — | Server host for metrics endpoint |
| `--metrics_http` | yes | `ANYCABLE_METRICS_HTTP` | — | Enable HTTP metrics endpoint at the specified path |
| `--metrics_log` | — | `ANYCABLE_METRICS_LOG` | `false` | Enable metrics logging (with info level) |
| `--metrics_log_filter` | yes | `ANYCABLE_METRICS_LOG_FILTER` | — | Specify list of metrics to print to log (to reduce the output) |
| `--metrics_port` | yes | `ANYCABLE_METRICS_PORT` | `0` | Server port for metrics endpoint, the same as for main server by default |
| `--metrics_rotate_interval` | yes | `ANYCABLE_METRICS_ROTATE_INTERVAL` | `15` | Specify how often flush metrics to writers (logs, statsd) (in seconds) |
| `--metrics_tags` | yes | `ANYCABLE_METRICS_TAGS` | — | Comma-separated list of default (global) tags to add to every metric |
| `--stats_refresh_interval` | yes | `ANYCABLE_STATS_REFRESH_INTERVAL` | `5` | How often to refresh the server stats (in seconds) |

## Misc

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--presets` | yes | `ANYCABLE_PRESETS` | — | Configuration presets, comma-separated (none, fly, heroku, broker). Inferred automatically |

## NATS

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--nats_servers` | yes | `ANYCABLE_NATS_SERVERS` | `"nats://127.0.0.1:4222"` | Comma separated list of NATS cluster servers |

## Ping

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--enable_native_pings` | — | `ANYCABLE_ENABLE_NATIVE_PINGS` | `false` | Send native pings (e.g., WebSocket ping frames) along with application-level pings to keepalive clients using custom protocols |
| `--ping_interval` | yes | `ANYCABLE_PING_INTERVAL` | `3` | Action Cable ping interval (in seconds) |
| `--pong_timeout` | yes | `ANYCABLE_PONG_TIMEOUT` | `0` | How long to wait for a pong response before disconnecting the client (in seconds). Zero means no pongs required |

## Pusher

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--pusher_api_port` | yes | `ANYCABLE_PUSHER_API_PORT` | `0` | Port for Pusher HTTP API (0 = use the main server port) |
| `--pusher_app_id` | yes | `ANYCABLE_PUSHER_APP_ID` | — | Pusher application ID |
| `--pusher_app_key` | yes | `ANYCABLE_PUSHER_APP_KEY` | — | Pusher application key |
| `--pusher_secret` | yes | `ANYCABLE_PUSHER_SECRET` | — | Pusher secret |

## Redis X Broadcast

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--redisx_stream` | yes | `ANYCABLE_REDISX_STREAM` | `"__anycable__"` | Redis X broadcaster stream name |

## Redis

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--redis_sentinels` | yes | `ANYCABLE_REDIS_SENTINELS` | — | Comma separated list of sentinel hosts, format: 'hostname:port,..' |
| `--redis_tls_ca_cert_path` | yes | `ANYCABLE_REDIS_TLS_CA_CERT_PATH` | — | Path to the CA certificate file to verify the Redis server certificate |
| `--redis_tls_client_cert_path` | yes | `ANYCABLE_REDIS_TLS_CLIENT_CERT_PATH` | — | Path to the client TLS certificate file for mutual TLS with Redis |
| `--redis_tls_client_key_path` | yes | `ANYCABLE_REDIS_TLS_CLIENT_KEY_PATH` | — | Path to the client TLS private key file for mutual TLS with Redis |
| `--redis_url` | yes | `ANYCABLE_REDIS_URL, $REDIS_URL` | `"redis://localhost:6379"` | Redis url |

## RPC

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--headers` | yes | `ANYCABLE_HEADERS` | `"cookie"` | List of headers to proxy to RPC |
| `--http_rpc_secret` | yes | `ANYCABLE_HTTP_RPC_SECRET` | — | Authentication secret for RPC over HTTP |
| `--norpc` | — | `ANYCABLE_NORPC` | `false` | Disable RPC component and run server in the standalone mode |
| `--proxy-cookies` | yes | `ANYCABLE_PROXY_COOKIES` | — | Cookie keys to send to RPC, default is all |
| `--rpc_concurrency` | yes | `ANYCABLE_RPC_CONCURRENCY` | `28` | Max number of concurrent RPC request; should be slightly less than the RPC server concurrency |
| `--rpc_host` | yes | `ANYCABLE_RPC_HOST` | `"localhost:50051"` | RPC service address (full URL in case of HTTP RPC) |
| `--rpc_request_timeout` | yes | `ANYCABLE_RPC_REQUEST_TIMEOUT` | `0` | RPC requests timeout (in ms) |

## Server-Sent Events

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--sse` | — | `ANYCABLE_SSE` | `false` | Enable SSE endpoint |
| `--sse_path` | yes | `ANYCABLE_SSE_PATH` | `"/events"` | SSE endpoint path |

## Signed Streams

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--cable_ready` | — | `ANYCABLE_CABLE_READY` | `false` | Enable Cable Ready support |
| `--cable_ready_secret` | yes | `ANYCABLE_CABLE_READY_SECRET` | — | A custom secret to verify CableReady streams |
| `--public_streams` | — | `ANYCABLE_PUBLIC_STREAMS` | `false` | Enable public (unsigned) streams |
| `--streams_presence` | — | `ANYCABLE_STREAMS_PRESENCE` | `true` | Enable presence for signed pub/sub streams |
| `--streams_secret` | yes | `ANYCABLE_STREAMS_SECRET` | — | Secret you use to sign stream names |
| `--streams_whisper` | — | `ANYCABLE_STREAMS_WHISPER` | `false` | Enable whispering for signed pub/sub streams |
| `--turbo_streams` | — | `ANYCABLE_TURBO_STREAMS` | `false` | Enable Turbo Streams support |
| `--turbo_streams_secret` | yes | `ANYCABLE_TURBO_STREAMS_SECRET` | — | A custom secret to verify Turbo Streams |

## SSL

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--ssl_cert` | yes | `ANYCABLE_SSL_CERT` | — | SSL certificate path |
| `--ssl_key` | yes | `ANYCABLE_SSL_KEY` | — | SSL private key path |

## StatsD

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--statsd_host` | yes | `ANYCABLE_STATSD_HOST` | — | Server host for metrics sent to statsd server in the format &lt;host&gt;:&lt;port&gt; |
| `--statsd_prefix` | yes | `ANYCABLE_STATSD_PREFIX` | `"anycable_go."` | Statsd metrics prefix |
| `--statsd_tags_format` | yes | `ANYCABLE_STATSD_TAGS_FORMAT` | `"datadog"` | One of "datadog", "influxdb", or "graphite" |

## WebSockets

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--ws_write_timeout` | yes | `ANYCABLE_WS_WRITE_TIMEOUT` | `2` | Maximum time to wait for a write operation to complete |

## Pro-only options

These options are available in [AnyCable Pro](../pro.md) and AnyCable+, on top of everything above. Generated from a Pro build (`1.6.14-pro`).

| Option | Value | Env | Default | Description |
|---|---|---|---|---|
| `--admin` | — | `ANYCABLE_ADMIN` | `false` | Enable admin console |
| `--admin_path` | yes | `ANYCABLE_ADMIN_PATH` | `"/_high_voltage_"` | Admin console HTTP root |
| `--admin_port` | yes | `ANYCABLE_ADMIN_PORT` | `0` | Admin console server port (set to 0 to run on the same port as the main server) |
| `--admin_secret` | yes | `ANYCABLE_ADMIN_SECRET` | — | Authentication secret for admin actions |
| `--graphql_action` | yes | `ANYCABLE_GRAPHQL_ACTION` | `"execute"` | GraphQL Ruby channel action (method) name |
| `--graphql_channel` | yes | `ANYCABLE_GRAPHQL_CHANNEL` | `"GraphqlChannel"` | GraphQL Ruby channel class name |
| `--graphql_idle_timeout` | yes | `ANYCABLE_GRAPHQL_IDLE_TIMEOUT` | `2` | Defines for how long to wait for connection_init (in seconds) |
| `--graphql_path` | yes | `ANYCABLE_GRAPHQL_PATH` | — | Enable GraphQL proxy and mount at the specified path |
| `--poll` | — | `ANYCABLE_POLL` | `false` | Enable long polling support |
| `--poll_flush_interval` | yes | `ANYCABLE_POLL_FLUSH_INTERVAL` | `500` | Long polling flush interval (in milliseconds) |
| `--poll_interval` | yes | `ANYCABLE_POLL_INTERVAL` | `15` | Long polling interval (in seconds) |
| `--poll_keepalive_timeout` | yes | `ANYCABLE_POLL_KEEPALIVE_TIMEOUT` | `5` | Long polling keepalive timeout (in seconds) |
| `--poll_max_request_size` | yes | `ANYCABLE_POLL_MAX_REQUEST_SIZE` | `65536` | Long polling maximum request body size (in bytes) |
| `--poll_path` | yes | `ANYCABLE_POLL_PATH` | `"/lp"` | Long polling endpoint path |
| `--ocpp_channel` | yes | `ANYCABLE_OCPP_CHANNEL` | `"OCPPChannel"` | OCPP Action Cable channel class name |
| `--ocpp_granular_actions` | — | `ANYCABLE_OCPP_GRANULAR_ACTIONS` | `true` | Translate each OCPP command into its own action |
| `--ocpp_heartbeat_interval` | yes | `ANYCABLE_OCPP_HEARTBEAT_INTERVAL` | `30` | Default heartbeat interval in seconds |
| `--ocpp_path` | yes | `ANYCABLE_OCPP_PATH` | — | WebSocket endpoint path prefix to accept OCPP connections |
| `--rpc_concurrency_initial` | yes | `ANYCABLE_RPC_CONCURRENCY_INITIAL` | `25` | Initial concurrency (adaptive) |
| `--rpc_concurrency_max` | yes | `ANYCABLE_RPC_CONCURRENCY_MAX` | `100` | Max concurrency (adaptive) |
| `--rpc_concurrency_min` | yes | `ANYCABLE_RPC_CONCURRENCY_MIN` | `5` | Min concurrency (adaptive) |
| `--shutdown_slowdrain` | — | `ANYCABLE_SHUTDOWN_SLOWDRAIN` | `false` | Enable slow draining of connections during shutdown |
| `--netpoll_enabled` | — | `ANYCABLE_NETPOLL_ENABLED` | `true` | Whether to use net polling (epoll, kqueue) |
