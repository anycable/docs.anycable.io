# GraphQL subscriptions with Apollo

<p class="pro-badge-header"></p>

Serve GraphQL subscriptions over AnyCable using standard Apollo tooling. With
[AnyCable Pro](../pro.md), the server speaks the [graphql-ws][] protocol
directly, so clients need no AnyCable-specific code: any Apollo-compatible
client (web, React Native, Apollo Studio) connects to a dedicated GraphQL
endpoint.

## Configure the client

Point Apollo's WebSocket link at the AnyCable GraphQL endpoint:

```js
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:8080/graphql'
}))
```

This is the official Apollo WebSocket link configuration; the legacy
[subscriptions-transport-ws][] protocol is supported, too.

## Authenticate

Pass credentials via connection params:

```js
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:8080/graphql',
  connectionParams: {
    token: 'some-token'
  }
}))
```

The server forwards them to your backend as a JSON-encoded
`x-apollo-connection` HTTP header; see [Apollo GraphQL
support](../anycable-go/apollo.md#authentication) for the backend example.

With [JWT identification](../anycable-go/jwt_identification.md), pass the
token as the `jid` connection param or as a query parameter
(`ws://localhost:8080/graphql?jid=<token>`).

## Server requirements

- [AnyCable Pro](../pro.md) with the GraphQL endpoint enabled:
  `anycable-go --graphql_path=/graphql`.
- A backend with [graphql-ruby][] and the [graphql-anycable][] plugin. Your
  GraphQL Ruby code stays unchanged.

See [Apollo GraphQL support](../anycable-go/apollo.md) for the full server
configuration and a [React Native demo](https://github.com/anycable/anycable_rails_demo/pull/18).

## Without Pro

With Rails and graphql-ruby, clients can also connect over the standard
Action Cable protocol using graphql-ruby's [ActionCableLink](https://graphql-ruby.org/javascript_client/apollo_subscriptions.html),
passing a consumer created by the [AnyCable JS SDK](../guides/client-side.md#migrate-from-railsactioncable).

## Read next

- [Apollo GraphQL support (server)](../anycable-go/apollo.md)
- [JWT authentication (server)](../anycable-go/jwt_identification.md)
- [AnyCable JS SDK overview](../guides/client-side.md)

[graphql-ws]: https://github.com/enisdenjo/graphql-ws
[subscriptions-transport-ws]: https://github.com/apollographql/subscriptions-transport-ws
[graphql-ruby]: https://graphql-ruby.org
[graphql-anycable]: https://github.com/anycable/graphql-anycable
