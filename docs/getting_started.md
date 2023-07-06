<!-- markdownlint-disable no-inline-html -->
# Getting Started

AnyCable acts like a bridge between _logic-less_ WebSocket server and _Action Cable-like_ Ruby framework (i.e. framework which support [Action Cable protocol](misc/action_cable_protocol.md)).

<div class="chart-container">
  <img class="is-light" src="/assets/images/anycable.svg" alt="AnyCable diagram" width="40%">
  <img class="is-dark" src="/assets/images/anycable_dark.svg" alt="AnyCable diagram" width="40%">
</div>

The primary goal of AnyCable is to make it possible to write a high-performant real-time application using Ruby as a language for implementing a business-logic.

This goal is achieved by _moving_ low-level responsibility (handling sockets, parsing frames, broadcasting data) to WebSocket servers written in other languages (such as Golang or Erlang).

AnyCable could be used with the existing Action Cable clients (such as [Rails JavaScript client](https://www.npmjs.com/package/actioncable) or [Action Cable CLI](https://github.com/palkan/acli)) without any change. However, for web development we recommend using [AnyCable JS/TS client](https://github.com/anycable/anycable-client), which provides better compatibility with AnyCable-specific features.

You can use AnyCable with:

- Action Cable (Rails) applications (see [Using with Rails](rails/getting_started.md))
- Hotwire applications (see [Using with Hotwire](guides/hotwire.md))
- [Lite Cable](https://github.com/palkan/litecable) for  _plain_ Ruby projects (see [Using with Ruby](ruby/non_rails.md))
- your own [AnyCable-compatible framework](ruby/non_rails.md).

See the list of available WebSocket servers [here](websocket_servers.md).
