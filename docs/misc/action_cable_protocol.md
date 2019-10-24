# Action Cable Protocol

[Action Cable](https://guides.rubyonrails.org/action_cable_overview.html) is a framework that allows you to integrate WebSockets with the rest of your Rails application easily.

It uses a simple JSON-based protocol for client-server communication.

## Messages

Communication is based on messages. Every message is an object.

Protocol-related messages from server to client MUST have `type` field (string).

Possible types:

* [`welcome`]
* [`disconnect`]
* [`ping`]
* [`confirm_subscription`]
* [`reject_subscription`]

There are also _data_ messages–broadcasts and transmissions–they MUST have `message` field.

Protocol-related messages from client to server MUST have `command` field (string).

Possible commands:

* [`subscribe`]
* [`unsubscribe`]
* [`message`]

## Handshake

When client connects to server one of the following two could happen:

* server accepts the connection and responds with `welcome` message (`{"type":"welcome"}`)
* server rejects the connection and responds with a `disconnect` message, which may include fields `reason` and `reconnect` (`{"type":"disconnect", "reason":"unauthorized", "reconnect":false}`)\*

Server MUST respond with either a `welcome` message or a `disconnect` message.

\* `disconnect` message only exists in Rails 6.0 and later. Prior to 6.0, server would drop the connection without sending anything.

## Subscriptions & identifiers

Data messages, client-to-server messages and some server-to-client messages (`confirm_subscription`, `reject_subscription`) MUST contain `identifier` field (string) which is used to route data to the specified _channel_.

It's up to server and client how to generate and resolve identifiers.

Rails identifiers schema is the following: `{ channel: "MyChannelClass", **params }.to_json`.

For example, to subscribe to `ChatChannel` with `id: 42` client should send the following message:

```json
{
  "identifier": "{\"channel\":\"ChatChannel\",\"id\":42}",
  "command": "subscribe"
}
```

The response from server MUST contain the same identifier, e.g.:

```json
{
  "identifier": "{\"channel\":\"ChatChannel\",\"id\":42}",
  "type": "confirm_subscription"
}
```

To unsubscribe from the channel client should send the following message:

```json
{
  "identifier": "{\"channel\":\"ChatChannel\",\"id\":42}",
  "command": "unsubscribe"
}
```

There is no _unsubscription_ confirmation sent (see [PR#24900](https://github.com/rails/rails/pull/24900)).

## Receive messages

Data message from server to client MUST contain `identifier` field and `message` field with the data itself.

## Perform actions

_Action_ message from client to server MUST contain `command` ("message"), `identifier` fields, and `data` field containing a JSON-encoded value.

The `data` field MAY contain `action` field.

For example, in Rails to invoke a method on a channel class, you should send:

```json
{
  "identifier": "{\"channel\":\"ChatChannel\",\"id\":42}",
  "command": "message",
  "data": "{\"action\":\"speak\",\"text\":\"hello!\"}"
}
```

## Ping

Although [WebSocket protocol](https://tools.ietf.org/html/rfc6455#section-5.5.2) describes low-level `ping`/`pong` frames to detect dropped connections, some implementation (e.g. browsers) don't provide an API for using them.

That's why Action Cable protocol has its own, protocol-level pings support.

Server sends `ping` messages (`{ "type": "ping", "message": <Time.now.to_i>}`) every X seconds (3 seconds in Rails).

Client MAY track this messages and decide to re-connect if no `ping` messages have been observed in the last Y seconds.

For example, default Action Cable client reconnects if no `ping` messages have been received in 6 seconds.
