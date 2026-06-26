# Using AnyCable with Python (and any HTTP backend)

AnyCable is language-agnostic. Your Python application, on Django, FastAPI,
Flask, or anything else, does not need a special SDK or a persistent connection
to AnyCable. It authorizes clients by issuing tokens and signing stream names,
and publishes messages with plain HTTP POSTs. AnyCable owns the WebSocket
connections; your app stays the source of truth.

This is the same [standalone pub/sub](../quickstart.md#any-backend) model used by
any HTTP backend. The examples below are Python, but the three moving parts (a
JWT, a signed stream name, an HTTP broadcast) are identical in every language.

## 1. Run the server

```sh
export ANYCABLE_SECRET=$(openssl rand -hex 32)   # use a stable value in production
anycable-go \
  --jwt_secret=$ANYCABLE_SECRET \
  --streams_secret=$ANYCABLE_SECRET \
  --broadcast_adapter=http \
  --enforce_jwt
```

- `--jwt_secret` authenticates connections.
- `--streams_secret` authorizes stream subscriptions via signed names.
- `--enforce_jwt` rejects any connection without a valid token.

Use a secret of at least 32 bytes (HMAC-SHA256 warns on shorter keys).

## 2. Authenticate connections with JWT

Issue a token in your Python backend when a user loads the page. The payload
carries an `ext` claim with your connection identifiers (the equivalent of
Action Cable's `identified_by`):

```python
import json, jwt, time   # pip install pyjwt

def anycable_token(user_id, secret, ttl=300):
    payload = {"ext": json.dumps({"user_id": user_id}), "exp": int(time.time()) + ttl}
    return jwt.encode(payload, secret, algorithm="HS256")
```

Hand the token to the client, which passes it on connect:

```js
import { createCable } from '@anycable/web'
const cable = createCable(`ws://localhost:8080/cable?jid=${token}`)
```

A connection with no token (or a bad one) is rejected with
`disconnect: unauthorized`. A valid token is accepted with `welcome`, and the
identifiers from `ext` are available to AnyCable.

## 3. Authorize streams with signed names

So a client can only subscribe to streams you allow, sign the stream name in
Python and give the signed value to the client. The algorithm is HMAC-SHA256,
the same one used across Ruby, Node, and PHP:

```python
import base64, json, hmac, hashlib

def sign_stream(name, secret):
    encoded = base64.b64encode(json.dumps(name).encode()).decode()
    digest = hmac.new(secret.encode(), encoded.encode(), hashlib.sha256).hexdigest()
    return f"{encoded}--{digest}"
```

```js
const channel = cable.streamFromSigned(signedStreamName)
channel.on('message', (msg) => render(msg))
```

## 4. Broadcast from Python

Publishing is an HTTP POST. The `data` field is a string; clients receive it
parsed:

```python
import json, httpx   # or requests

BROADCAST_URL = "http://localhost:8090/_broadcast"

def broadcast(stream, payload):
    httpx.post(BROADCAST_URL, json={"stream": stream, "data": json.dumps(payload)})

broadcast("chat/1", {"text": "Hello from Python"})
```

> The broadcast endpoint runs on port `8090` by default. To serve it on the main
> port and require an auth key, see [securing the broadcast
> endpoint](../anycable-go/broadcasting.md#securing-http-endpoint).

That's it. Your Python backend now drives realtime through three HTTP-level
pieces: a token, a signed stream name, and a POST. No SDK, no persistent
connection to maintain.

## Framework notes

The integration is the same regardless of framework, because it is just token
issuing, stream signing, and HTTP POSTs:

- **Django**: issue tokens in a view or context processor; broadcast from views,
  signals, or Celery tasks.
- **FastAPI / Flask**: issue tokens in a route; broadcast from request handlers
  or background workers.
- **Any other backend**: replicate the three snippets above in your language.

## Related

- [Quick Start: any backend](../quickstart.md#any-backend)
- [JWT authentication](../anycable-go/jwt_identification.md)
- [Signed streams](../anycable-go/signed_streams.md)
- [Broadcasting](../anycable-go/broadcasting.md)
- [HTTP RPC](../ruby/http_rpc.md) for the RPC-style integration (delegating channel logic to your app)
