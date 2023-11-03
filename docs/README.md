# AnyCable

> Build lightning fast, reliable real-time applications with Ruby and Rails

<picture>
     <source srcset="/assets/images/logo_invert.svg" media="(prefers-color-scheme: dark)">
     <img class="home-logo" align="right" height="150" width="129" title="AnyCable logo" src="/assets/images/logo.svg">
</picture>

AnyCable helps you build reliable and fast real-time features—notifications, chats, Hotwire frontends, and more—natively on Ruby on Rails without using 3rd-party services. Stay productive by writing clean, maintainable code in Ruby with the assurance that your application scales efficiently.

Save up to 10x on infrastructure compared to built-in Action Cable without sacrificing Rails productivity by switching to third-party services: a fast Golang server handles the load, a gRPC-driven Rails application deals with business-logic. The [Pro version](./pro.md) offers even more benefits: an additional 40% reduced memory footprint, DX improvements, and priority support.

Besides from being Action Cable-compatible, AnyCable comes with an exclusive set of features, including [reliable streams](./anycable-go/reliable_streams.md), [JWT authentication](./anycable-go/jwt_identifications.md), etc.

<!-- markdownlint-disable no-trailing-punctuation -->
## Getting started

- [Using AnyCable with Rails](rails/getting_started.md)

- [Using AnyCable with Hotwire applications](guides/hotwire.md)

- [Using AnyCable with other Ruby frameworks](ruby/non_rails.md)

## Latest updates 🆕

- **2023-11-03**: [NATS JetStream broker](./anycable-go/reliable_streams.md#nats) support is added to AnyCable-Go v1.4.7+.

- **2023-10-13**: [Batch broadcasts](./ruby/broadcast_adapters.md#broadcast-options) and [broadcasting to others](./rails/getting_started.md#action-cable-extensions).

- **2023-09-07**: [Server-sent events](./anycable-go/sse.md) suppport is added to AnyCable-Go 1.4.4+.

- **2023-08-09**: `pong` command is added to the [extended Action Cable protocol](./misc/action_cable_protocol.md#action-cable-extended-protocol) and is supported by AnyCable-Go 1.4.3+.

- **2023-08-04**: [Slow drain mode for disconnecting clients on shutdown <img class='pro-badge' src='/assets/pro.svg' alt='pro' />](./anycable-go/configuration.md#slow-drain-mode)

- **2023-07-05**: [Reliable streams](./anycable-go/reliable_streams.md)

## Resources

- [Official Website](https://anycable.io)

- [AnyCable Blog](https://anycable.io/blog)

- 🎥 [AnyCasts screencasts](https://www.youtube.com/playlist?list=PLAgBW0XUpyOVFnpoS6FKDszd8WEvXzg-A)

### Talks

- [The pitfalls of realtime-ification](https://noti.st/palkan/MeBUVe/the-pitfalls-of-realtime-ification), RailsConf 2022

- [High-speed cables for Ruby](https://noti.st/palkan/Y1bPpn/high-speed-cables-for-ruby), RubyConf 2018

- [One cable to rule them all](https://noti.st/palkan/ALKDiC/anycable-one-cable-to-rule-them-all), RubyKaigi 2018

## Acknowledgements

<br/>

<div style="display:flex;flex-direction: row;gap:20px">
<a href="https://evilmartians.com/">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://evilmartians.com/badges/sponsored-by-evil-martians_v2.0_for-dark-bg.svg">
  <img alt="Evil Martians logo" src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg" width="236" height="54">
</picture>
</a>

<br/>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/assets/fly-sponsored-landscape-dark.svg">
  <img alt="Sponsored by Fly.io" src="/assets/fly-sponsored-landscape-light.svg" height="97" width="259">
</picture>
</div>
