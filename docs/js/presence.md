# Presence and whispering

Show who is online and share transient client-to-client events (typing
indicators, cursor positions) with the JS SDK. Presence state lives in the
AnyCable server, so there is no storage layer or heartbeat loop to write.

Server requirements: AnyCable v1.6+ with the broker enabled
(`anycable-go --presets=broker`). See the server-side
[presence documentation](../anycable-go/presence.md).

## Join the presence set

Joining is explicit: provide a unique user ID within the channel and arbitrary
presence info:

```js
import { createCable } from '@anycable/web'

const cable = createCable({ protocol: 'actioncable-v1-ext-json' })
const chatChannel = cable.streamFrom('room/42')

chatChannel.presence.join(user.id, { name: user.name })
```

Join once; the SDK re-joins automatically after every reconnection.

## React to joins and leaves

```js
chatChannel.on('presence', (ev) => {
  const { type, id, info } = ev

  if (type === 'join') {
    console.log('user joined', id, info)
  }

  if (type === 'leave') {
    // leave events carry only the id
    console.log('user left', id)
  }
})
```

The event `type` is one of `join`, `leave`, `info` (the full presence state),
or `error`.

## Read the current state

```js
const users = await chatChannel.presence.info()

users //=> { 'user-1': { name: 'Alice' }, 'user-2': { name: 'Bob' } }
```

The first `info()` call performs a server request; after that, the SDK keeps
the state up to date from `join` and `leave` events. Joining is optional for
reading: a viewer can observe the presence set without appearing in it.

## Leave

```js
chatChannel.presence.leave()
```

Users also leave automatically on unsubscribe or disconnect. A client that
disconnects without leaving stays in the presence set for the server's
`--presence_ttl` (15 seconds by default), so a brief network interruption does
not make the user appear offline.

## Whisper client-to-client

Whispers are broadcasts published by clients and delivered to everyone else on
the stream, bypassing your backend. They are transient: never stored, and
clients that are offline miss them. Use them for typing indicators and live
cursors; use regular broadcasts for anything that must be replayable.

```js
// Publish
chatChannel.whisper({ event: 'typing', name: user.name })

// Receive (whispers arrive as regular messages on other clients)
chatChannel.on('message', (msg) => {
  if (msg.event === 'typing') {
    showTypingIndicator(msg.name)
  }
})
```

The sender does not receive its own whispers.

:::warning Enable whispering on the server
Public streams allow whispering out of the box. For signed streams, start the
server with `--streams_whisper` (`ANYCABLE_STREAMS_WHISPER=true`). For
Rails channels, mark the stream as whisperable:
`stream_from "room/42", whisper: true`. See
[whispering docs](../anycable-go/signed_streams.md#whispering).
:::

## Read next

- [Presence (server)](../anycable-go/presence.md)
- [Signed streams & whispering (server)](../anycable-go/signed_streams.md)
- [Reliable connections on the client](./reliability.md)
