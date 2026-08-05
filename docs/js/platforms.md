# Node.js, React Native, and transport fallbacks

The SDK core is platform-agnostic: `@anycable/web` wraps it for browsers, and
`@anycable/core` runs anywhere else. This page covers non-browser usage,
long-polling fallback for locked-down networks, and binary encoders.

## Node.js

Use `@anycable/core` with a WebSocket implementation such as
[ws](https://github.com/websockets/ws):

```js
import WebSocket from 'ws'
import { createCable } from '@anycable/core'

// Passing the URL is required (there is no page to look it up from)
const cable = createCable('ws://localhost:8080/cable', {
  websocketImplementation: WebSocket
})

// Additional ws options (e.g., headers) go via websocketOptions
const cableWithHeader = createCable('ws://localhost:8080/cable', {
  websocketImplementation: WebSocket,
  websocketOptions: { headers: { 'x-token': 'secret' } }
})
```

The packages are ESM-only. If your tooling requires CommonJS, see the
[bundler notes](#bundler-notes) below.

## React Native

React Native ships a compatible WebSocket implementation, so `@anycable/core`
works without extra dependencies:

```js
import { createCable } from '@anycable/core'

const cable = createCable('wss://cable.example.com/cable', {
  websocketOptions: { headers: { 'x-token': 'secret' } }
})
```

Since headers are available here, consider the `header` [auth
strategy](./authentication.md#choose-how-the-token-travels) instead of query
parameters.

## Long polling fallback

WebSockets still get blocked by some corporate firewalls and proxies. The
`@anycable/long-polling` package adds an HTTP long-polling transport that
kicks in when the WebSocket connection fails:

```js
import { createCable } from '@anycable/web'
import { LongPollingTransport } from '@anycable/long-polling'

const lp = new LongPollingTransport('https://cable.example.com/lp')

export default createCable({ fallbacks: [lp] })
```

You can also make it the primary transport:

```js
export default createCable({ transport: lp })
```

Constructor options (defaults shown):

```js
new LongPollingTransport(url, {
  cooldownPeriod: 500, // ms to wait before the next poll request
  sendBuffer: 500, // ms to buffer outgoing commands before sending
  pingInterval: 30000, // ms between emulated pings (keeps the monitor calm)
  credentials: 'same-origin', // fetch credentials mode
  fetchImplementation: fetch // a fetch-compatible function
})
```

:::warning Server side is Pro
Long polling support on the server is an [AnyCable Pro](../pro.md) feature.
See [long polling](../anycable-go/long_polling.md) for server configuration.
:::

Cookie-based auth caveat: with the `headers` authentication method, requests
are sent with `credentials: "omit"`; cookies are only sent when using the
`cookies` method (`credentials: "include"`).

## Binary encoders (Pro)

[AnyCable Pro](../pro.md) supports [binary formats](../anycable-go/binary_formats.md),
which cut bandwidth and decode faster than JSON. Install the encoder package
and pass it along with the matching protocol:

```js
// Msgpack
import { createCable } from '@anycable/web'
import { MsgpackEncoder } from '@anycable/msgpack-encoder'

export default createCable({
  protocol: 'actioncable-v1-msgpack',
  encoder: new MsgpackEncoder()
})

// Protobuf
import { ProtobufEncoder } from '@anycable/protobuf-encoder'

export default createCable({
  protocol: 'actioncable-v1-protobuf',
  encoder: new ProtobufEncoder()
})
```

Both work with the extended protocol, too: use `actioncable-v1-ext-msgpack`
with `MsgpackEncoder`, or `actioncable-v1-ext-protobuf` with
`ProtobufEncoderV2`.

## Bundler notes

- The libraries target ES6+: either exclude them from ES5 transpilation
  (Browserslist query `["defaults", "not IE 11"]`) or add `@anycable/*` to your
  loader's processed files:

  ```js
  {
    include: [
      path.resolve('src'),
      path.resolve('node_modules/@anycable')
    ]
  }
  ```

- The packages are ESM-only, with no CommonJS builds planned; tools like
  [commonizer](https://github.com/wintercounter/commonizer) can bridge the gap.
- The long-polling package relies on `fetch` and `AbortController`; polyfill
  them for legacy browsers.

## Read next

- [Client authentication and tokens](./authentication.md)
- [Binary formats (server)](../anycable-go/binary_formats.md)
