# Client authentication and tokens

Pass an authentication token from the client, refresh it when it expires, and
choose how it is sent with the WebSocket connection. The server counterpart is
[JWT authentication](../anycable-go/jwt_identification.md); the SDK works the
same way with custom token schemes.

## Provide the initial token

The simplest way is to include the token in the connection URL:

```js
import { createCable } from '@anycable/web'

export default createCable(`ws://localhost:8080/cable?jid=${token}`)
```

Or pass it via the `auth` option:

```js
export default createCable({
  auth: { token: 'secret-value' }
})
```

By default, the token is added as the `jid` query parameter, matching AnyCable
JWT authentication. Use `param` to change the name:

```js
export default createCable({
  auth: { token: 'secret-value', param: 'token' }
})
```

With `@anycable/web`, you can also inject the token into the page instead of
into JS:

```html
<meta name="cable-token" content="secret-token">
<!-- optionally, a custom param name -->
<meta name="cable-token-param" content="token">
```

## Fetch the token before connecting

When the token can only be obtained via a request, you can still create the
cable instance at application start and configure the transport lazily with
`transportConfigurator`. It runs right before the connection is established:

```js
import { createCable } from '@anycable/web'

export default createCable({
  transportConfigurator: async (transport, { initial }) => {
    // Only fetch on the first connection attempt
    if (!initial) return

    const response = await fetch('/token.json')
    const data = await response.json()

    transport.setToken(data.token, 'token')
  }
})
```

The configurator does not handle expiration; combine it with `tokenRefresher`
below for long-lived clients.

## Refresh expired tokens

The server checks the token only when a connection is established. The typical
failure: a client reconnects after a network interruption, and its token has
expired in the meantime. The server rejects it with the reason `token_expired`,
and the SDK can then fetch a fresh token and reconnect on its own. Provide a
`tokenRefresher` function:

```js
// cable.js
import { createCable } from '@anycable/web'

export default createCable({
  tokenRefresher: async (transport) => {
    const response = await fetch('/token.json')
    const data = await response.json()

    // Update the whole URL...
    transport.setURL(`ws://example.com/cable?jid=${data.token}`)
    // ...or only the token
    transport.setToken(data.token)
  }
})
```

The refresher activates only on a `token_expired` disconnect
(`{"type":"disconnect","reason":"token_expired","reconnect":false}`); network
failures go through the regular [reconnection flow](./reliability.md).

For browser apps that embed the connection URL in HTML meta tags, there is a
built-in refresher that reloads the current page in the background and reads
the fresh URL and token from it:

```js
import { createCable, fetchTokenFromHTML } from '@anycable/web'

export default createCable({ tokenRefresher: fetchTokenFromHTML() })

// or fetch a dedicated lightweight page
export default createCable({
  tokenRefresher: fetchTokenFromHTML({ url: '/custom-token-refresh-endpoint' })
})
```

:::tip Keep the refresh response small
`fetchTokenFromHTML` sends the `X-ANYCABLE-OPERATION: token-refresh` header
with its request. Detect it on the backend and render only the meta tags
instead of the full page.
:::

## Choose how the token is sent

Browsers cannot set custom headers on WebSocket connections, so query
parameters are the default. In other environments you have more options,
controlled by `websocketAuthStrategy`:

```js
import WebSocket from 'ws'
import { createCable } from '@anycable/core'

const cable = createCable(url, {
  websocketImplementation: WebSocket,
  websocketAuthStrategy: 'header',
  auth: { token: 'secret-token' }
})
```

- `'header'` (Node.js, React Native): adds an `x-<param>: <token>` header to
  the connection request (`x-jid` with the default param name).
- `'sub-protocol'`: appends an `anycable-token.<token>` entry to the WebSocket
  sub-protocols (the `sec-websocket-protocol` header). This works in browsers
  too and is supported by AnyCable server since v1.6.
- Query parameter: the default, works everywhere.

## Read next

- [JWT authentication (server)](../anycable-go/jwt_identification.md)
- [Reliable connections on the client](./reliability.md)
