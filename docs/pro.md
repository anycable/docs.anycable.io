# AnyCable-Go

<p class="pro-badge-header"></p>

AnyCable-Go Pro aims to bring AnyCable to the next level of efficient resources usage and developer ~~experience~~ happiness.

> Read also <a rel="noopener" href="https://evilmartians.com/chronicles/anycable-goes-pro-fast-websockets-for-ruby-at-scale" target="_blank">AnyCable Goes Pro: Fast WebSockets for Ruby, at scale</a>.

## Memory usage

Pro version uses a different memory model under the hood, which gives you yet another **30-50% RAM usage reduction**.

Here is the results of running [websocket-bench][] `broadcast` and `connect` benchmarks and measuring RAM used:

version | broadcast 5k | connect 10k |  connect 15k
---|----|---|---
1.3.0-pro               |  142MB | 280MB | 351MB
1.3.0-pro (w/o poll)\*  |  207MB | 343MB | 480MB
1.3.0                   |  217MB | 430MB | 613MB

\* AnyCable-Go Pro uses epoll/kqueue to react on incoming messages by default.
In most cases, that should work the same way as with non-Pro version; however, if you have a really high rate of
incoming messages, you might want to fallback to the _actor-per-connection_ model (you can do this by specifying `--netpoll_enabled=false`).

**NOTE:** Currently, using net polling is not compatible with WebSocket per-message compression and the built-in TLS support.

## More features

- [Adaptive RPC concurrency](anycable-go/configuration.md#adaptive-concurrency)
- [Binary messaging formats](anycable-go/binary_formats.md)
- [Apollo GraphQL protocol support](anycable-go/apollo.md)
- [Long polling support](anycable-go/long_polling.md)

## Installation

Read our [installation guide](pro/install.md).

[websocket-bench]: https://github.com/anycable/websocket-bench
