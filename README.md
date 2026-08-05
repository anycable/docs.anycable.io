# AnyCable documentation

[AnyCable](https://github.com/anycable/anycable) is a realtime server with
delivery guarantees for Rails, Laravel, Node.js, Python, and any backend. It
handles WebSocket (and SSE) connections, authenticates them with JWT, and
delivers every broadcast, including to clients that dropped and reconnected.

This repository is the source of [docs.anycable.io](https://docs.anycable.io).
The documentation itself is the Markdown in [`docs/`](./docs); read it here on
GitHub or on the site.

## Start here

- [What is AnyCable](./docs/overview.md)
- [Quick start](./docs/quickstart.md)
- [Capabilities](./docs/capabilities.md): delivery guarantees, presence, whispering, zero-downtime deploys

By backend: [Rails](./docs/rails/getting_started.md) ·
[Laravel](./docs/guides/laravel.md) ·
[Node.js serverless](./docs/guides/serverless.md) ·
[Python and any HTTP backend](./docs/guides/python.md) ·
[Hotwire](./docs/guides/hotwire.md)

On the client: [JS SDK overview](./docs/guides/client-side.md) ·
[reliable connections](./docs/js/reliability.md) ·
[authentication](./docs/js/authentication.md) ·
[presence and whispering](./docs/js/presence.md)

Server reference: [configuration](./docs/anycable-go/configuration.md) ·
[all options](./docs/anycable-go/options.md) ·
[broadcasting](./docs/anycable-go/broadcasting.md) ·
[signed streams](./docs/anycable-go/signed_streams.md) ·
[JWT authentication](./docs/anycable-go/jwt_identification.md)

## The one-minute version

Run the server (development mode):

```sh
anycable-go --public --broadcast_adapter=http
```

Subscribe from a browser:

```js
import { createCable } from '@anycable/web'

const cable = createCable('ws://localhost:8080/cable')

const channel = cable.streamFrom('chat/1')
channel.on('message', (msg) => {
  console.log('received', msg)
})
```

Broadcast from any backend (or curl):

```sh
curl -X POST http://localhost:8090/_broadcast \
  -H "Content-Type: application/json" \
  -d '{"stream":"chat/1","data":"{\"text\":\"Hello, world!\"}"}'
# 201 Created
```

That is a complete realtime round trip. `--public` is for local development
only; see the [quick start](./docs/quickstart.md#secure-it) for securing the
server with JWT and signed streams.

## For AI agents

The documentation is available in agent-friendly forms:

- [llms.txt](https://docs.anycable.io/llms.txt) (index) and
  [llms-full.txt](https://docs.anycable.io/llms-full.txt) (full corpus).
- Every page has a Markdown mirror at the same path with `.md` appended
  (for example, `https://docs.anycable.io/js/reliability.md`).
- Requests with an `Accept: text/markdown` header receive Markdown at the
  canonical page URLs.

## Working on the docs

The site is built with [VitePress](https://vitepress.dev). You need
[Node.js](https://nodejs.org) installed. Then, from the `docs/` directory:

```sh
cd docs

# Install dependencies
npm install

# Start the dev server with hot reload
npm run dev
```

Other available scripts:

- `npm run build`—build the static site into `docs/.vitepress/dist`.
- `npm run preview`—preview the production build locally.

## Contributing

The quickest way to fix a typo or propose a small change is to use the GitHub web interface (open a file, click on "Edit", create a PR).

If you want to propose a bigger change, you might want to use a common flow:

1. Fork it.
1. Create a new branch (`git checkout -b feat/my-proposal`).
1. Commit and push changes.
1. Open new Pull Request.

### Linters

We keep the documentation both correct and _stylish_ using the following tools:

- [mdl](https://github.com/markdownlint/markdownlint)—Markdown linter, Ruby edition.
- [lychee](https://github.com/lycheeverse/lychee)—links checker.
- [forspell](https://github.com/kkuprikov/forspell)—spelling checker.

These run automatically in CI for every pull request (see [`.github/workflows/docs-lint.yml`](./.github/workflows/docs-lint.yml)), so you can rely on CI to do the checks for you.
