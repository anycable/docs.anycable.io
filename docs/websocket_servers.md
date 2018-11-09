# AnyCable WebSocket Servers

Since AnyCable uses [gRPC](https://grpc.io) to "speak" with the Ruby application,
it could be used with any WebSocket server which implements AnyCable gRPC client.

You're likely don't need to build a server yourself but choose the existing one:
- [`anycable-go`](anycable_go.md) (Golang) (_recommended_)
- [`erlycable`](https://github.com/anycable/erlycable) (Erlang).

If you're not happy with the above implementations, you can build your own [AnyCable-compatible server](how_to_anycable_server.md).
