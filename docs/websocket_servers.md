# AnyCable WebSocket Servers

Since AnyCable uses [gRPC](https://grpc.io) to "speak" with the Ruby application,
it could be used with any WebSocket server which implements AnyCable gRPC client.

You're likely don't need to build a server yourself but choose the existing one:

- [`anycable-go`](anycable-go/getting_started.md) (Golang) (_recommended_)
- [`erlycable`](https://github.com/anycable/erlycable) (Erlang).

We also have a server written in Ruby–[AnyCable Rack Server](https://github.com/anycable/anycable-rack-server)–which could be used in non-production environments to emulate the same architecture as with _real_ AnyCable server.

If you're not happy with the above implementations, you can build your own [AnyCable-compatible server](misc/how_to_anycable_server.md).
