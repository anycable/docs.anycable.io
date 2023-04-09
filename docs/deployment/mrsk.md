# MRSK Deployment

You can deploy AnyCable using the provided mrsk deploy scenario.

*config/deploy.yml*

```yaml
env:
  clear:
    ANYCABLE_REDIS_URL: redis://localhost:6379/0
    ANYCABLE_RPC_HOST: localhost:50051
    CABLE_URL: ws://anycable.your.domain:8080/cable
    # ...
  secret:
    # ...

accessories:
  redis:
    image: redis:latest
    roles:
      - web
    port: "6379:6379"
    volumes:
      - /var/lib/redis:/data

  ws:
    image: anycable/anycable-go:1.2
    host: anycable.your.domain
    port: "8080:8080"
    env:
      clear:
        ANYCABLE_HOST: "0.0.0.0"
        ANYCABLE_PORT: 8080
        ANYCABLE_REDIS_URL: redis://your.domain:6379/0
        ANYCABLE_RPC_HOST: your.domain:50051
```

Also, you should add to your *docker-entrypoint* file this line to start AnyCable RPC server

```shell
bundle exec anycable &
```
