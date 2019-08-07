# Configuration

AnyCable uses [`anyway_config`](https://github.com/palkan/anyway_config) gem for configuration; thus it is possible to set configuration parameters through environment vars, `config/anycable.yml` file or `secrets.yml` when using Rails.

You can also pass configuration variables to CLI as options, e.g.:

```sh
$ bundle exec anycable --rpc-host 0.0.0.0:50120 \
                       --redis-channel my_redis_channel \
                       --log-level debug
```

**NOTE:** CLI options take precedence over parameters from other sources (files, env).

## Parameters

Here is the list of the most commonly used configuration parameters and the way you can provide them:

- in Ruby code using parameter name (e.g. `AnyCable.config.rpc_host = "127.0.0.0:42421"`)
- in `config/anycable.yml` or `secrets.yml` using the parameter name
- through environment variable
- through CLI option.

**rpc_host** (`ANYCABLE_RPC_HOST`, `--rpc-host`)

Local address to run gRPC server on (default: `"[::]:50051"`, deprecated, will be changed to `"127.0.0.1:50051"` in future versions).

**redis_url** (`REDIS_URL`, `ANYCABLE_REDIS_URL`, `--redis-url`)

Redis URL for pub/sub (default: `"redis://localhost:6379/5"`).

**redis_channel** (`ANYCABLE_REDIS_CHANNEL`, `--redis-channel`)

Redis channel for broadcasting (default: `"__anycable__"`).

**log_level** (`ANYCABLE_LOG_LEVEL`, `--log-level`)

Logging level (default: `"info"`).

**log_file** (`ANYCABLE_LOG_FILE`, `--log-file`)

Path to log file. By default AnyCable logs to STDOUT.

**debug** (`ANYCABLE_DEBUG`, `--debug`)

Shortcut to turn on verbose logging ("debug" log level and gRPC logging on).

For the complete list of configuration parameters see [`config.rb`](https://github.com/anycable/anycable/blob/master/lib/anycable/config.rb) file.
