# Load balancing

## RPC load balancing

You can use load balancers to scale your application and/or perform zero-disconnect deployments (by doing a rolling update of RPC servers without restarting WebSocket servers).

### Using Envoy

[Envoy](https://envoyproxy.io) is a modern proxy server which supports HTTP2 and gRPC.

See [the example configuration](https://github.com/anycable/anycable-go/tree/master/etc/envoy) in the `anycable-go` repo.

### Using NGINX

You can use NGINX [gRPC module](http://nginx.org/en/docs/http/ngx_http_grpc_module.html) to distribute traffic across multiple RPC servers.

The minimalist configuration looks like this (credits goes to [avlazarov](https://gist.github.com/avlazarov/9503c23d81c75f760e14b30e38847356#file-grpc-confe)):

```conf
upstream grpcservers {
    server 0.0.0.0:50051;
    server 0.0.0.0:50052;
}

server {
    listen 50050 http2;
    server_name localhost;

    access_log /var/log/nginx/grpc_log.json;
    error_log /var/log/nginx/grpc_error_log.json debug;

    location / {
        grpc_pass grpc://grpcservers;
    }
}
```

## WebSocket load balancing

There is nothing specific in load balancing AnyCable WebSocket server comparing to other WebSocket applications. See, for example, [NGINX documentation](https://www.nginx.com/blog/websocket-nginx/).

**NOTE:** We recommend to use a _least connected_ strategy for WebSockets to have more uniform clients distribution (see, for example, [NGINX](http://nginx.org/en/docs/http/load_balancing.html#nginx_load_balancing_with_least_connected)).

<!-- TODO: add demos -->
