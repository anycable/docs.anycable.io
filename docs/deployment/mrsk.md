# MRSK Deployment

You can deploy AnyCable using the provided mrsk deploy scenario. Here is example of `config/deploy.yml` for AnyCable deployment

```yml
servers:
  # ...
  anycable_rpc:
    traefik: true
    hosts:
      - <%= ENV['MAIN_HOST'] %>
    cmd: bundle exec anycable
    env:
      clear:
        ANYCABLE_RPC_HOST: 0.0.0.0:50051
    labels:
      traefik.tcp.routers.anycable_rpc.rule: 'HostSNI(`*`)'
      traefik.tcp.routers.anycable_rpc.entrypoints: anycable_rpc
      traefik.tcp.services.anycable_rpc.loadbalancer.server.port: 50051

traefik:
  options:
    publish:
      - 50051:50051
  args:
    # In case you create another traefik endpoint, don't forget to this line for the main endpoint of the application
    entrypoints.web.address: ":80"
    entrypoints.anycable_rpc.address: ":50051"

env:
  clear:
    ANYCABLE_REDIS_URL: <%= ENV['REDIS_URL'] %>
    CABLE_URL: "ws://<%= ENV['ANYCABLE_GO_HOST'] %>/cable"

accessories:
  # ...
  ws:
    image: anycable/anycable-go:1.3
    host: <%= ENV['ANYCABLE_GO_HOST'] %>
    port: "80:8080"
    env:
      clear:
        ANYCABLE_HOST: "0.0.0.0"
        ANYCABLE_PORT: 8080
        ANYCABLE_REDIS_URL: <%= ENV['ANYCABLE_REDIS_URL'] %>
        ANYCABLE_RPC_HOST: "<%= ENV['MAIN_HOST'] %>:50051"
```
