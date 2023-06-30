# AnyCable

> Build lightning fast, reliable real-time applications with Ruby and Rails

<img class="is-light" align="right" height="150" width="129"
     title="AnyCable logo" class="home-logo" src="/assets/images/logo.svg">
<img class="is-dark" align="right" height="150" width="129"
     title="AnyCable logo" class="home-logo" src="/assets/images/logo_invert.svg">

AnyCable allows you to use any WebSocket server (written in any language) as a replacement for your Ruby server (such as Faye, ActionCable, etc.).

AnyCable uses [Action Cable protocol](misc/action_cable_protocol.md), so you can use Action Cable [JavaScript client](https://www.npmjs.com/package/actioncable) without any monkey-patching.

<br/>
<a href="https://evilmartians.com/">
<img class="is-light" src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg" alt="Sponsored by Evil Martians" width="236" height="54">
<img class="is-dark" src="https://evilmartians.com/badges/sponsored-by-evil-martians_v2.0_for-dark-bg.svg" alt="Sponsored by Evil Martians" width="236" height="54">
</a>

<!-- markdownlint-disable no-trailing-punctuation -->
## Where to go from here?

- [How it works?](architecture.md)

- [Using AnyCable with Rails](rails/getting_started.md)

- [Using AnyCable with other Ruby frameworks](ruby/non_rails.md)

- [🔥 Troubleshooting](troubleshooting.md)

- [🆘 Commercial support](https://anycable.io/#custom-solutions)

## Latest updates 🆕

- **2023-06-30**: [RPC over HTTP](./ruby/http_rpc.md)

- **2023-06-28**: [Long polling support](./anycable-go/long-polling.md)

- **2023-06-09**: [Using AnyCable with Hotwire applications (incl. non-Ruby apps)](./guides/hotwire.md)

- **2023-04-18**: [Streams history](./anycable-go/broker.md)

- **2023-02-28**: [Adaptive concurrency support](./anycable-go/configuration.md#adaptive-concurrency)

- **2023-02-28**: [Embedded NATS](./anycable-go/embedded_nats.md)

## Resources

- [Official Website](https://anycable.io)

- [AnyCable Blog](https://anycable.io/blog)

- 🎥 [AnyCasts screencasts](https://www.youtube.com/playlist?list=PLAgBW0XUpyOVFnpoS6FKDszd8WEvXzg-A)

### Blog Posts

- [AnyCable off Rails: connecting Twilio streams with Hanami](https://evilmartians.com/chronicles/anycable-goes-off-rails-connecting-twilio-streams-with-hanami)

- [Scaling Rails web sockets in Kubernetes with AnyCable](https://vitobotta.com/2022/06/18/scaling-rails-web-sockets-in-kubernetes-with-anycable/)

- [AnyCable Goes Pro: Fast WebSockets for Ruby, at scale](https://evilmartians.com/chronicles/anycable-goes-pro-fast-websockets-for-ruby-at-scale)

- [AnyCable 1.0: Four years of real-time web with Ruby and Go](https://evilmartians.com/chronicles/anycable-1-0-four-years-of-real-time-web-with-ruby-and-go)

- [AnyCable: Action Cable on steroids!](https://evilmartians.com/chronicles/anycable-actioncable-on-steroids)

- [Connecting LiteCable to Hanami](http://gabrielmalakias.com.br/ruby/hanami/iot/2017/05/26/websockets-connecting-litecable-to-hanami.html) by [@GabrielMalakias](https://github.com/GabrielMalakias)

### Talks

- [The pitfalls of realtime-ification](https://noti.st/palkan/MeBUVe/the-pitfalls-of-realtime-ification), RailsConf 2022

- [High-speed cables for Ruby](https://noti.st/palkan/Y1bPpn/high-speed-cables-for-ruby), RubyConf 2018

- [One cable to rule them all](https://noti.st/palkan/ALKDiC/anycable-one-cable-to-rule-them-all), RubyKaigi 2018

## License

Gems and libraries are available as open source under the terms of the MIT License.
