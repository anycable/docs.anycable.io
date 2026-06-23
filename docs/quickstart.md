# Quick Start

Get an AnyCable server running and a client receiving messages in a few minutes.
Pick your stack:

- [Any backend (standalone pub/sub)](#any-backend) — Node.js, Python, Go, PHP, or any HTTP server
- [Rails](#rails) — drop-in Action Cable replacement
- [Laravel](#laravel) — drop-in Reverb / Pusher replacement
- [Node.js](#nodejs) — with the serverless SDK

If you do not want to run a server at all, start with the managed
[AnyCable+](https://plus.anycable.io) (free tier) and skip installation.

## Install AnyCable {#install}

The server is a single Go binary.

```sh
# macOS (Homebrew)
brew install anycable-go

# Any platform: download a release binary
# https://github.com/anycable/anycable/releases

# JavaScript projects (installs the matching binary on first run)
npm install --save-dev @anycable/anycable-go
npx anycable-go
```

Check it runs:

```sh
anycable-go --version
# AnyCable 1.6.7 ...
```

## Any backend (standalone pub/sub) {#any-backend}

In standalone mode AnyCable handles connections and message delivery on its own.
Your backend, in any language, publishes messages over plain HTTP. This is the
fastest way to add realtime to a Node.js, Python, Go, or PHP application.

> **Try it without writing code:** the [browser
> playground](https://github.com/anycable/anycable-browser-playground) lets you
> connect and publish to a live AnyCable server from the browser. For a minimal
> code example, see [anycable-pubsub-nextjs](https://github.com/anycable/anycable-pubsub-nextjs).

### 1. Run the server (development)

```sh
anycable-go --public --broadcast_adapter=http
```

`--public` disables authentication and allows any stream name, which is handy
for local development. The HTTP broadcast endpoint starts on port `8090` (it
moves off the main port when no authorization is configured). You will see:

```
INF Starting AnyCable 1.6.7 ...
WRN Server is running in the public mode
INF Accept broadcast requests at http://localhost:8090/_broadcast (no authorization)
INF Handle WebSocket connections at http://localhost:8080/cable
```

> **Do not run `--public` in production.** See [Secure it](#secure-it) below.

### 2. Connect a client

Subscribe to a stream named `chat/1` using the
[AnyCable client SDK](https://github.com/anycable/anycable-client):

```js
import { createCable } from '@anycable/web'

const cable = createCable('ws://localhost:8080/cable')

const channel = cable.streamFrom('chat/1')
channel.on('message', (msg) => {
  console.log('received', msg)
})
```

Any Action Cable-compatible client works too. The raw subscribe command is:

```json
{"command":"subscribe","identifier":"{\"channel\":\"$pubsub\",\"stream_name\":\"chat/1\"}"}
```

### 3. Broadcast a message

From your backend (or just `curl`), POST to the broadcast endpoint. The `data`
field is a string; clients receive it parsed:

```sh
curl -X POST http://localhost:8090/_broadcast \
  -H "Content-Type: application/json" \
  -d '{"stream":"chat/1","data":"{\"text\":\"Hello, world!\"}"}'
# 201 Created
```

The connected client logs `received { text: 'Hello, world!' }`. That is a
complete realtime round trip with no application-server connection involved.

### 4. Secure it {#secure-it}

For production, replace `--public` with real authorization. Two pieces:

**Authorize streams with signed names.** Set a secret and sign stream names in
your backend so clients cannot subscribe to arbitrary streams:

```sh
anycable-go --streams_secret=$ANYCABLE_SECRET --broadcast_adapter=http
```

Generate a signed name in your backend and hand it to the client. The algorithm
is HMAC-SHA256, identical across languages. Node.js:

```js
import { createHmac } from 'crypto'

const encoded = Buffer.from(JSON.stringify('chat/1')).toString('base64')
const digest = createHmac('sha256', process.env.ANYCABLE_SECRET).update(encoded).digest('hex')
const signedStreamName = `${encoded}--${digest}`
```

Python:

```python
import base64, json, hmac, hashlib

encoded = base64.b64encode(json.dumps("chat/1").encode()).decode()
digest = hmac.new(secret.encode(), encoded.encode(), hashlib.sha256).hexdigest()
signed_stream_name = f"{encoded}--{digest}"
```

The client subscribes with the signed name:

```js
const channel = cable.streamFromSigned(signedStreamName)
```

**Authenticate connections with JWT.** Issue a token in your backend and have
clients present it on connect. See [JWT
authentication](./anycable-go/jwt_identification.md).

Full reference: [Signed streams](./anycable-go/signed_streams.md) and
[Broadcasting](./anycable-go/broadcasting.md) (including securing the broadcast
endpoint with a key).

## Rails {#rails}

For Rails, AnyCable is a drop-in replacement for Action Cable. It runs your
existing channels over [RPC](./anycable-go/rpc.md), so your `app/channels` code
stays the same.

```sh
bundle add anycable-rails
```

Follow the [Rails getting started guide](./rails/getting_started.md) for the
full setup, then run the server alongside your app:

```sh
anycable-go
```

You can also use Rails in [standalone mode](./anycable-go/signed_streams.md)
(no RPC) for Hotwire and Turbo Streams.

## Laravel {#laravel}

AnyCable is a drop-in replacement for Laravel Reverb or Pusher. The quickest
path is [Pusher mode](./anycable-go/pusher.md):

```sh
ANYCABLE_PUSHER_APP_ID=app-id \
ANYCABLE_PUSHER_APP_KEY=app-key \
ANYCABLE_SECRET=app-secret \
anycable-go
```

AnyCable listens on port `8080` and recognizes your existing Reverb environment
variables. See the [Laravel guide](./guides/laravel.md) for native mode with
reliable streams and presence.

## Node.js {#nodejs}

Beyond the [standalone path](#any-backend) above, the
[AnyCable Serverless SDK](https://github.com/anycable/anycable-serverless-js)
lets your Node.js backend handle channels, authentication, and broadcasting with
familiar abstractions. See [Using AnyCable with serverless
JavaScript](./guides/serverless.md).

## Next steps

- [Capabilities](./capabilities.md): delivery guarantees, presence, deploy resilience.
- [Deployment](./deployment/heroku.md): ship the server to production.
- [Configuration](./anycable-go/configuration.md): every server option.
