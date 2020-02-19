# AnyCable WebSocket Servers

Since AnyCable uses [gRPC](https://grpc.io) to "speak" with the Ruby application,
it could be used with any WebSocket server which implements AnyCable gRPC client.

Since v1.0 the only officially supported (i.e., recommended for production usage) server is [`anycable-go`](anycable-go/getting_started.md) (written in Golang).

For older versions you can still use [`erlycable`](https://github.com/anycable/erlycable) (Erlang).

We also have a server written in Ruby–[AnyCable Rack Server](https://github.com/anycable/anycable-rack-server)–which could be used for local experiments to emulate the same architecture as with _real_ AnyCable server.

If you're not happy with the above implementations, you can build your own [AnyCable-compatible server](misc/how_to_anycable_server.md).
