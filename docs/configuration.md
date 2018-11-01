# Configuration

AnyCable uses [`anyway_config`](https://github.com/palkan/anyway_config) gem for configuration, thus it is possible to set configuration parameters through environment vars, `config/anycable.yml` file or `secrets.yml` when using Rails.

You can also pass configuration variables to CLI as options, e.g.:

```sh
$ bundle exec anycable --rpc-host 0.0.0.0:50120 \ 
                       --redis-channel my_redis_channel \
                       --log-level debug
```

**NOTE:** CLI options take precedence over parameters from other sources (files, env).

## Parameters Explained

Here is the list of the most commonly used configuration parameters and the way you can provide them:
- in Ruby code using parameter name (e.g. `AnyCable.config.rpc_host = "127.0.0.0:42421"`)
- in `config/anycable.yml` or `secrets.yml` using parameter name
- through environment variable
- through CLI option.

**rpc_host** (`ANYCABLE_RPC_HOST`, `--rpc-host`)

Local address to run gRPC server on (default: `"[::]:50051"`).

**redis_url** (`REDIS_URL`, `ANYCABLE_REDIS_URL`, `--redis-url`)

Redis URL for pub/sub (default: `"redis://localhost:6379/5"`).
