# Reliable connections on the client

Configure the AnyCable JS SDK so a client survives disconnects: automatic
reconnection, session recovery, stream history catch-up, and faster detection
of broken connections. This page is the client half of AnyCable [reliable
streams](../anycable-go/reliable_streams.md); the server half is enabled with
`anycable-go --presets=broker`.

## Use the extended protocol

The default protocol is `actioncable-v1-json`, compatible with Action Cable.
To get delivery guarantees, opt in to the extended protocol (AnyCable server
v1.4+):

```js
// cable.js
import { createCable } from '@anycable/web'
// or for non-web projects
// import { createCable } from '@anycable/core'

export default createCable({ protocol: 'actioncable-v1-ext-json' })
```

That is the whole migration. The extended protocol adds two mechanisms, both
implemented by the protocol itself, with no changes to your channels code:

- **Session recovery**: after a reconnect, the server restores the previous
  session and its subscriptions, so the client skips re-subscribing.
- **Stream history**: every broadcast carries an incrementing `offset`; the
  client tracks the last offset it saw and, on reconnect, receives exactly the
  missed messages, in order, before the live stream resumes.

:::tip Server side
History and recovery require the broker: `anycable-go --presets=broker`. Tune
`--history_ttl` to the longest disconnect you want to survive (default 300s).
:::

## Reconnect automatically

Reconnection works out of the box. The component responsible for it is called
_Monitor_; `createCable` sets it up with exponential backoff and jitter, so
many clients reconnecting at once do not overload the server. To disable
automatic reconnection (for example, in tests), pass `monitor: false`:

```js
const cable = createCable({ monitor: false })
```

## Catch up on messages missed during page load

Broadcasts sent between the HTML response and the WebSocket connection are
easy to lose. With the extended protocol, the client can request history from
a point in time when it first subscribes. Provide the page render time via a
meta tag:

```html
<meta name="cable-history-timestamp" content="1614556800">
```

Or set it explicitly (a UTC timestamp in seconds):

```js
export default createCable({
  protocol: 'actioncable-v1-ext-json',
  protocolOptions: {
    historyTimestamp: 1614556800
  }
})
```

By default, the current time is used. For subscriptions made later in the
session, the value is adjusted automatically to the last received ping. Set
`historyTimestamp: false` to disable time-based catch-up.

## Handle history retrieval failures

History is finite (size limit and TTL), so a client that was offline too long
may fail to catch up. The server reports this via the protocol-level `info`
event; handle it by restoring the state from your backend:

```js
import { createCable, Channel } from '@anycable/web'

class ChatChannel extends Channel {
  static identifier = 'ChatChannel'

  constructor(params) {
    super(params)

    this.on('info', (evt) => {
      if (evt.type === 'history_not_found') {
        // Restore the state from your backend (or reload the page)
        this.perform('resetState')
      }

      if (evt.type === 'history_received') {
        // Catch-up completed successfully
      }
    })
  }
}
```

## Watch lifecycle events

Both cables and channels emit lifecycle events. Use them to drive connection
UI (an "offline" banner, disabled inputs).

Cable events:

```js
cable.on('connect', (ev) => {
  // ev.reconnect distinguishes a recovery from the initial connection
  console.log(ev.reconnect ? 'Welcome back!' : 'Welcome!')
})

cable.on('disconnect', (ev) => {
  // Connection lost; the monitor will try to reconnect
  console.log(`Disconnected: ${ev.reason ?? 'network failure'}`)
})

cable.on('close', (ev) => {
  // Terminal state: no automatic reconnection
  // (server sent reconnect: false, or you called cable.disconnect())
  console.log(ev ? 'Cable failed' : 'Disconnected by us')
})

cable.on('keepalive', () => {
  // Fired on every server ping
})
```

Channels emit `connect`, `disconnect`, and `close` too (`keepalive` is
cable-only), plus `message` for incoming data. One difference matters: when the
cable is closed, its channels stay `disconnected` rather than `closed`, so they
resubscribe automatically when the cable connects again. A channel becomes
`closed` only when you call `channel.disconnect()` or the subscription is
rejected.

:::warning Clean up your listeners
Event subscriptions are never removed automatically. `on(...)` returns an
unbind function; call it when the component goes away:

```js
useEffect(() => {
  const channel = cable.subscribeTo('ChatChannel', { id })
  const unbind = channel.on('message', handleMessage)
  return () => {
    unbind()
    channel.disconnect()
  }
}, [cable, id])
```

:::

## Detect broken connections faster

The extended protocol can send `pong` replies to server pings, letting the
server drop connections that stopped responding. Opt in on the client:

```js
export default createCable({
  protocol: 'actioncable-v1-ext-json',
  protocolOptions: {
    pongs: true
  }
})
```

## Fine-tune for high loads

Three settings matter when you have many subscriptions or many clients
reconnecting at once:

- **Ping interval.** The default is 3 seconds and is dictated by the server
  (`--ping_interval`, or per-connection via the `?pi=10` query param). If you
  raise it, mirror the value on the client so the monitor does not treat slower
  pings as a dead connection:

  ```js
  export default createCable({ pingInterval: 10000 })
  ```

- **Subscription confirmation timeout.** The client expects a confirmation
  within 5 seconds, retries once, then treats the subscription as rejected.
  When many clients reconnect at once, increase the timeout:

  ```js
  export default createCable({
    protocolOptions: { subscribeRetryInterval: 10000 }
  })
  ```

- **Linearized subscriptions.** By default, subscription requests are sent
  concurrently. With many subscriptions per page, send them one at a time to
  smooth the load:

  ```js
  export default createCable({ concurrentSubscribes: false })
  ```

## Read next

- [Reliable streams & recovery (server)](../anycable-go/reliable_streams.md)
- [Client authentication and tokens](./authentication.md)
- [Presence and whispering](./presence.md)
