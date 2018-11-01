[![GitPitch](https://gitpitch.com/assets/badge.svg)](https://gitpitch.com/anycable/anycable/master?grs=github) [![Gem Version](https://badge.fury.io/rb/anycable.svg)](https://rubygems.org/gems/anycable) [![Build Status](https://travis-ci.org/anycable/anycable.svg?branch=master)](https://travis-ci.org/anycable/anycable)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/anycable/Lobby)

# AnyCable

> Polyglot replacement for ActionCable-compatible servers

<img align="right" height="150" width="129"
     title="TestProf logo" class="home-logo" src="./assets/images/logo.svg">

AnyCable allows you to use any WebSocket server (written in any language) as a replacement for your Ruby server (such as Faye, ActionCable, etc).

AnyCable uses [Action Cable protocol](./action_cable_protocol.md), so you can use Action Cable [JavaScript client](https://www.npmjs.com/package/actioncable) without any monkey-patching.

<a href="https://evilmartians.com/">
<img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg" alt="Sponsored by Evil Martians" width="236" height="54"></a>

## How It Works?

![](./assets/images/scheme.png)

AnyCable **WebSocket server** (1) is responsible for handling clients, or sockets. That includes:
- low-level connections (sockets) management
- subscriptions management
- broadcasting messages to clients

WebSocket server should include gRPC client built from AnyCable [`rpc.proto`](https://github.com/anycable/anycable/blob/master/protos/rpc.proto).

**RPC server** (2) is a connector between Ruby application (e.g. Rails) and WebSocket server. It’s an instance of your application with a [gRPC](https://grpc.io) endpoint which implements `rpc.proto`.

This server is a part of the [`anycable` gem](./anycable_getting_started.md).

We use a **Pub/Sub service** (3) to send messages from the application to the WS server, which then broadcasts the messages to clients.

Currently, only Redis is supported as Pub/Sub service.

## Where to go from here?

- [Using AnyCable with Rails](./anycable_rails.md)

- [Using AnyCable with other Ruby frameworks](./anycable_no_rails.md)

## Resources

- [AnyCable: Action Cable on steroids!](https://evilmartians.com/chronicles/anycable-actioncable-on-steroids)

- [Connecting LiteCable to Hanami](http://gabrielmalakias.com.br/ruby/hanami/iot/2017/05/26/websockets-connecting-litecable-to-hanami.html) by [@GabrielMalakias](https://github.com/GabrielMalakias)

- [From Action to Any](https://medium.com/@leshchuk/from-action-to-any-1e8d863dd4cf) by [@alekseyl](https://github.com/alekseyl)

## Talks

- One cable to rule them all, RubyKaigi 2018, [slides](https://speakerdeck.com/palkan/rubykaigi-2018-anycable-one-cable-to-rule-them-all) and [video](https://www.youtube.com/watch?v=jXCPuNICT8s) (EN)

- Wroc_Love.rb 2018 [slides](https://speakerdeck.com/palkan/wroc-love-dot-rb-2018-cables-cables-cables) and [video](https://www.youtube.com/watch?v=AUxFFOehiy0) (EN)

- RubyConfMY 2017 [slides](https://speakerdeck.com/palkan/rubyconf-malaysia-2017-anycable) and [video](https://www.youtube.com/watch?v=j5oFx525zNw) (EN)

- RailsClub Moscow 2016 [slides](https://speakerdeck.com/palkan/railsclub-moscow-2016-anycable) and [video](https://www.youtube.com/watch?v=-k7GQKuBevY&list=PLiWUIs1hSNeOXZhotgDX7Y7qBsr24cu7o&index=4) (RU)

## License

 Gems and libraries are available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
