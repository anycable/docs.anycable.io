# Pro version overview <img class='pro-badge' src='https://docs.anycable.io/assets/pro.svg' alt='pro' />

> Our early access program is open! <a rel="noopener" href="https://anycable.io/#pro" target="_blank">Go Pro today!</a>

AnyCable-Go Pro aims to bring AnyCable to the next level of efficient resources usage and developer ~~experience~~ happiness.

Read also <a rel="noopener" href="https://evilmartians.com/chronicles/anycable-goes-pro-fast-websockets-for-ruby-at-scale" target="_blank">AnyCable Goes Pro: Fast WebSockets for Ruby, at scale</a>.

## Features

### Memory usage

Pro version uses a different memory model under the hood, which gives you yet another **30-50% RAM usage reduction**.

Here is the results of running [websocket-bench][] `broadcast` and `connect` benchmarks and measuring RAM used:

version | broadcast 5k | connect 10k |  connect 15k
---|----|---|---
1.1.0-pro               |  142MB | 280MB | 351MB
1.1.0-pro (w/o poll)\*  |  207MB | 343MB | 480MB
1.1.0                   |  217MB | 430MB | 613MB

\* AnyCable-Go Pro uses epoll/kqueue to react on incoming messages by default.
In most cases, that should work the same way as with non-Pro version; however, if you have a really high rate of
incoming messages, you might want to fallback to the _actor-per-connection_ model (you can do this by specifying `--netpoll_enabled=false`).

**NOTE:** Currently, using net polling is not compatible with WebSocket per-message compression and the built-in TLS support.

### More features

- [Binary messaging formats](anycable-go/binary_formats.md)
- [Apollo GraphQL protocol support](anycable-go/apollo.md)
- [StatsD instrumentation](anycable-go/instrumentation.md#statsd)
- [JWT identification](anycable-go/jwt_identification.md)
- [Signed streams (Hotwire, CableReady)](anycable-go/signed_streams.md)

## Installation

AnyCable Pro is distributed in two forms: a Docker image and pre-built binaries.

**NOTE:** All distribution methods, currently, relies on GitHub **personal access tokens**. We can either grant an access to the packages/projects to your users or generate a token for you. You MUST enable the following permissions: `read:packages` to download Docker images and/or `repo` (full access) to download binary releases.

### Docker

We use [GitHub Container Registry][ghcr] to host images.

See the [official documentation][ghcr-auth] on how to authenticate Docker to pull images from GHCR.

Once authenticated, you can pull images using the following identifier: `ghcr.io/anycable/anycable-go-pro`. For example:

```yml
# docker-compose.yml
services:
  ws:
    image: ghcr.io/anycable/anycable-go-pro:1.1
    ports:
      - '8080:8080'
    environment:
      ANYCABLE_HOST: "0.0.0.0"
```

### Pre-built binaries

We use a dedicated GitHub repo to host pre-built binaries via GitHub Releases: [github.com/anycable/anycable-go-pro-releases][releases-repo].

We recommend using [`fetch`][fetch] to download releases via command line:

```sh
fetch --repo=https://github.com/anycable/anycable-go-pro-releases --tag="v1.1.0" --release-asset="anycable-go-linux-amd64" --github-oauth-token="<access-token>" /tmp
```

### Heroku

Our [heroku buildpack][buildpack] supports downloading binaries from the private GitHub releases repo.
You need to provide the following configuration parameters:

- `HEROKU_ANYCABLE_GO_REPO=https://github.com/anycable/anycable-go-pro-releases`
- `HEROKU_ANYCABLE_GO_GITHUB_TOKEN=<access-token>`

Currently, you also need to specify the version as well: `HEROKU_ANYCABLE_GO_VERSION=1.1.0`.

Make sure you're not using cached `anycable-go` binary by purging the Heroku cache: `heroku builds:cache:purge -a <your-app-name>`.

[websocket-bench]: https://github.com/anycable/websocket-bench
[ghcr]: https://ghcr.io
[ghcr-auth]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry
[releases-repo]: https://github.com/anycable/anycable-go-pro-releases/
[fetch]: https://github.com/gruntwork-io/fetch
[buildpack]: https://github.com/anycable/heroku-anycable-go
