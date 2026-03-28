# Railway Deployment

The recommended way to deploy AnyCable apps to [Railway][railway] is to have two services within the same project: one with a Rails app and another one with `anycable-go` (backed by the official Docker image). This approach uses Railway's [private networking][railway-private] for server-to-server communication (broadcasting) while exposing only the WebSocket endpoint publicly.

> You can also use the `rails g anycable:setup` generator to configure most of the Rails-side settings automatically. See [Getting started with Rails](../rails/getting_started.md).

## Prerequisites

You need two random secrets shared between the Rails app and the AnyCable-Go server. Generate them with:

```sh
bin/rails secret
bin/rails secret
```

Use the first as `ANYCABLE_SECRET` (JWT authentication) and the second as `ANYCABLE_HTTP_BROADCAST_SECRET` (broadcast verification). Keep both values handy—you'll set them on both services.

## Deploying AnyCable-Go

Create a new service in your Railway project using the official Docker image. Both services **must be in the same Railway project** for private networking to work.

### Via Railway dashboard

1. Click **New** → **Docker Image** and enter `anycable/anycable-go:1.6`.
2. Add the environment variables listed [below](#anycable-go-environment-variables).
3. In **Settings** → **Networking**, expose port `8080` and generate a public domain (e.g., `my-cable.up.railway.app`).

### Via Railway CLI

```sh
railway link
railway add --service anycable --image anycable/anycable-go:1.6
railway service link anycable

railway variable set \
  ANYCABLE_HOST=0.0.0.0 \
  ANYCABLE_PORT=8080 \
  ANYCABLE_SECRET=<secret> \
  ANYCABLE_HTTP_BROADCAST_SECRET=<broadcast-secret> \
  ANYCABLE_BROADCAST_ADAPTER=http \
  ANYCABLE_BROKER=memory \
  ANYCABLE_TURBO_STREAMS=true
```

### AnyCable-Go environment variables

```sh
ANYCABLE_HOST=0.0.0.0
ANYCABLE_PORT=8080

# Shared secrets (must match the Rails app)
ANYCABLE_SECRET=<secret>
ANYCABLE_HTTP_BROADCAST_SECRET=<broadcast-secret>

# HTTP broadcasting (no Redis required)
ANYCABLE_BROADCAST_ADAPTER=http

# Broker and Turbo Streams
ANYCABLE_BROKER=memory
ANYCABLE_TURBO_STREAMS=true
```

**IMPORTANT:** Do not use `anycable/anycable-go:latest`—it may point to an older version that lacks features like [presence](../anycable-go/presence.md) and [reliable streams](../anycable-go/reliable_streams.md) (added in v1.6). Always pin to a specific major.minor tag.

**NOTE:** For multi-instance deployments, use `ANYCABLE_BROKER=nats` with [embedded NATS](../anycable-go/embedded_nats.md) instead of `memory`.

If you plan to use [presence](../anycable-go/presence.md), also add:

```sh
ANYCABLE_PRESENCE_TTL=30
```

## Configuring the Rails app

### Gem

Add the `anycable-rails` gem and install it:

```ruby
# Gemfile
gem "anycable-rails", "~> 1.5"
```

```sh
bundle install
```

You can keep `solid_cable` in the Gemfile for development (see [Development mode](#development-mode)).

### Cable adapter

Switch the production adapter to `any_cable`:

```yml
# config/cable.yml
development:
  adapter: solid_cable
  # ...your existing config...

test:
  adapter: test

production:
  adapter: any_cable
```

### AnyCable configuration

```yml
# config/anycable.yml
default: &default
  broadcast_adapter: http
  http_broadcast_url: <%= ENV.fetch("ANYCABLE_HTTP_BROADCAST_URL", "http://localhost:8080/_broadcast") %>

development:
  <<: *default

production:
  <<: *default
```

### Initializer

Create a single initializer that handles both secrets and Turbo Streams integration:

```ruby
# config/initializers/anycable.rb

# 1. Load secrets from env vars or Rails credentials
AnyCable.configure do |config|
  secret = ENV["ANYCABLE_SECRET"] || Rails.application.credentials.dig(:anycable, :secret)
  broadcast_secret = ENV["ANYCABLE_HTTP_BROADCAST_SECRET"] || Rails.application.credentials.dig(:anycable, :http_broadcast_secret)

  config.secret = secret if secret
  config.http_broadcast_secret = broadcast_secret if broadcast_secret
end

# 2. Sync Turbo Streams signed stream verifier with AnyCable secret.
#    IMPORTANT: Must be inside after_initialize to ensure this runs after
#    all initializers (including turbo-rails) have loaded.
Rails.application.config.after_initialize do
  if AnyCable.config.secret.present?
    Rails.application.config.turbo.signed_stream_verifier_key = AnyCable.config.secret
  end
end
```

Instead of (or in addition to) env vars, you can store secrets in Rails encrypted credentials:

```yml
# bin/rails credentials:edit
anycable:
  secret: <secret>
  http_broadcast_secret: <broadcast-secret>
```

**NOTE:** The AnyCable-Go service always needs the secrets as env vars—it doesn't have access to Rails credentials. You can use Railway's [shared variables](https://docs.railway.com/guides/variables#shared-variables) to avoid duplicating secret values between services.

### Production environment

```ruby
# config/environments/production.rb
if ENV["ANYCABLE_URL"].present?
  config.action_cable.mount_path = nil
  config.action_cable.url = ENV["ANYCABLE_URL"]
end
```

Setting `mount_path = nil` tells Rails not to handle WebSocket connections—AnyCable-Go takes over. If `ANYCABLE_URL` is not set, Rails falls back to serving Action Cable in-process.

### Rails environment variables

Add the following to your **Rails** service on Railway.

Via the dashboard, add them in your service's **Variables** tab. Via CLI:

```sh
railway service link my-app

railway variable set \
  ANYCABLE_URL=wss://my-cable.up.railway.app/cable \
  ANYCABLE_SECRET=<secret> \
  ANYCABLE_HTTP_BROADCAST_SECRET=<broadcast-secret> \
  ANYCABLE_HTTP_BROADCAST_URL=http://my-cable.railway.internal:8080/_broadcast
```

**IMPORTANT:** These are two different URLs serving different purposes:

- `ANYCABLE_URL` is **public**—it goes into the HTML `<meta>` tag so the browser JS client knows where to open a WebSocket connection. Use your Railway public domain with `wss://`.
- `ANYCABLE_HTTP_BROADCAST_URL` is **private**—Rails uses it to push broadcast messages to AnyCable-Go over Railway's internal network. Use the `*.railway.internal` hostname with `http://`.

Replace `my-cable` with your actual AnyCable-Go service name in Railway.

## Authentication

Since the Rails app and AnyCable-Go run on separate Railway domains (e.g., `my-app.up.railway.app` and `my-cable.up.railway.app`), browsers won't share cookies between them. Use [JWT identification][jwt-id] instead.

The `anycable-rails` gem provides a helper that generates a signed JWT and embeds it in a `<meta>` tag:

```erb
<%# In your layout (replaces action_cable_meta_tag) %>
<%= action_cable_with_jwt_meta_tag(current_user: current_user.id) %>
```

The AnyCable JS client picks up the token from the meta tag automatically. AnyCable-Go verifies it using the shared `ANYCABLE_SECRET`.

> If you put both services behind the same custom domain (so cookies are shared), you can keep session-based authentication without JWT. Make sure to configure your session cookie with `domain: :all`. See also [Authentication](../rails/authentication.md).

Your existing `ApplicationCable::Connection` code (e.g., reading `request.session` or `cookies.signed`) runs via AnyCable's gRPC handler, which receives the original request headers including cookies. Session-based identification continues to work—no changes to `connection.rb` are needed. The JWT provides server-level authentication at the AnyCable-Go layer (before the request reaches Rails), while `connection.rb` handles user identification.

## Client-side JavaScript

Replace the default Action Cable JS client with the AnyCable client. Existing `turbo_stream_from` subscriptions and `broadcast_*` calls in your models and jobs require **no changes**—they work with AnyCable out of the box.

### With importmap-rails

The AnyCable packages are not available on jspm, so `bin/importmap pin` won't work. You need to vendor them manually.

Download the ESM builds and place them in `vendor/javascript/`:

```sh
curl -o vendor/javascript/@anycable--web.js "https://ga.jspm.io/npm:@anycable/web@1.0.0/index.js"
curl -o vendor/javascript/@anycable--core.js "https://ga.jspm.io/npm:@anycable/core@1.0.0/index.js"
curl -o vendor/javascript/@anycable--turbo-stream.js "https://ga.jspm.io/npm:@anycable/turbo-stream@0.8.0/index.js"
curl -o vendor/javascript/nanoevents.js "https://ga.jspm.io/npm:nanoevents@9.1.0/index.js"
```

Then pin them in your import map:

```ruby
# config/importmap.rb
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/turbo", to: "turbo.min.js" # Alias: @anycable/turbo-stream imports from @hotwired/turbo
pin "@hotwired/stimulus", to: "stimulus.min.js"
# ...

# AnyCable client (replaces @rails/actioncable)
pin "@anycable/web", to: "@anycable--web.js"
pin "@anycable/core", to: "@anycable--core.js"
pin "@anycable/turbo-stream", to: "@anycable--turbo-stream.js"
pin "nanoevents", to: "nanoevents.js"
```

**NOTE:** The `@hotwired/turbo` alias pin is required because `@anycable/turbo-stream` imports `connectStreamSource` from `@hotwired/turbo`. Both pins resolve to the same `turbo.min.js` file.

**IMPORTANT:** The vendored `@anycable--turbo-stream.js` uses named imports (`import { connectStreamSource } from "@hotwired/turbo"`), but `turbo.min.js` from `turbo-rails` exports these as properties of the `Turbo` namespace, not as standalone named exports. This causes a silent `SyntaxError` that kills all JavaScript on the page. You must patch the vendored file — replace:

```js
import { connectStreamSource, disconnectStreamSource } from "@hotwired/turbo";
```

with:

```js
import { Turbo } from "@hotwired/turbo";
var { connectStreamSource, disconnectStreamSource } = Turbo;
```

Apply this to **every** occurrence of this import in the file (there may be two — one for stream sources, one for presence).

You can safely remove the `@rails/actioncable` pin—AnyCable replaces it entirely.

### With jsbundling-rails (esbuild, webpack, rollup)

Install the packages directly via npm:

```sh
npm install @anycable/web @anycable/turbo-stream
```

No vendoring or alias pins needed—the bundler resolves imports automatically.

### JavaScript entrypoint

Regardless of your asset pipeline, update your JavaScript entrypoint:

```js
// app/javascript/application.js
import "@hotwired/turbo-rails"
import { createCable } from "@anycable/web"
import { start } from "@anycable/turbo-stream"

const cable = createCable({ protocol: "actioncable-v1-ext-json" })
start(cable, { requestSocketIDHeader: true })

// ...rest of your imports (Stimulus controllers, etc.)
```

Remove the `import "@rails/actioncable"` line if present.

See the [@anycable/turbo-stream documentation](https://github.com/anycable/anycable-client/tree/master/packages/turbo-stream) for more details.

**IMPORTANT:** After switching the JS client, run your **system tests** (`bin/rails test:system`), not just unit/integration tests. If any vendored package fails to resolve (missing pin, 404), the entire `application.js` module fails silently—Stimulus controllers and Turbo stop working. Check the browser DevTools Console for import errors.

## Content Security Policy

If your Rails app sets a Content Security Policy, add the AnyCable-Go WebSocket origin to the `connect-src` directive:

```ruby
# config/initializers/content_security_policy.rb
Rails.application.configure do
  config.content_security_policy do |policy|
    anycable_origin = if (url = ENV["ANYCABLE_URL"].presence)
      uri = URI.parse(url)
      "#{uri.scheme}://#{uri.host}#{":#{uri.port}" unless [80, 443].include?(uri.port)}"
    end

    policy.connect_src :self, *[anycable_origin].compact
  end
end
```

## Development mode

You don't need to run AnyCable-Go locally during development. Keep `solid_cable` (or `async`) as the development adapter in `config/cable.yml`:

```yml
# config/cable.yml
development:
  adapter: solid_cable
  connects_to:
    database:
      writing: cable
  polling_interval: 0.1.seconds
  message_retention: 1.day

production:
  adapter: any_cable
```

All your broadcasting code (`turbo_stream_from`, `broadcast_refresh_later_to`, `broadcast_append_to`, etc.) works identically in both modes—only the delivery mechanism changes.

**NOTE:** [Presence](../anycable-go/presence.md) requires the AnyCable extended protocol and does not work with Solid Cable. In development, presence elements will render but the counter stays at 0.

## Presence

AnyCable presence + Hotwire lets you show who's viewing a page with zero custom JavaScript. Enable presence in your JS entrypoint:

```js
const cable = createCable({ protocol: "actioncable-v1-ext-json" })
start(cable, { requestSocketIDHeader: true, presence: true })
```

Make sure `ANYCABLE_PRESENCE_TTL=30` is set on the AnyCable-Go service, then drop this into any template (or your layout for site-wide presence):

```erb
<turbo-cable-presence-source
  signed-stream-name="<%= Turbo::StreamsChannel.signed_stream_name(["presence", request.path]) %>"
  presence-id="<%= dom_id(current_user, :presence) %>">
  <div style="display: flex; align-items: center; gap: 4px;">
    <div style="display: flex; flex-direction: row-reverse;" id="presence-avatars"></div>
    <span data-presence-counter>0</span> online
  </div>
  <template>
    <%= turbo_stream.append "presence-avatars" do %>
      <div id="<%= dom_id(current_user, :presence) %>">
        <%= current_user.name %>
      </div>
    <% end %>
  </template>
</turbo-cable-presence-source>
```

When users open the page, their name appears; when they leave, it disappears. The `data-presence-counter` attribute updates automatically. Use `["presence", request.path]` as the stream name for per-page presence, or a fixed string like `"global_presence"` for site-wide.

See the [presence documentation](../anycable-go/presence.md) for more details.

## Scaling

Railway assigns a private DNS name to each service (`<service-name>.railway.internal`). This is used for HTTP broadcasting from Rails to AnyCable-Go.

To scale WebSocket capacity, increase the number of AnyCable-Go instances in Railway. For multi-instance deployments, switch from `memory` to `nats` broker to ensure messages reach all instances:

```sh
ANYCABLE_BROKER=nats
```

See [embedded NATS](../anycable-go/embedded_nats.md) for details on running NATS within AnyCable-Go without a separate NATS server.

## Verifying the deployment

After deploying both services, open your Rails app and check the browser DevTools:

- **Network tab:** Filter by "WS". You should see a connection to `wss://my-cable.up.railway.app/cable` with status 101. Click it to inspect frames—the first message should be `{"type":"welcome"}`.
- **Console tab:** A healthy connection shows `[AnyCable] Connected to wss://...`. Errors to look for:
  - `WebSocket connection failed` — AnyCable-Go is not reachable or the domain is wrong.
  - `Refused to connect... Content Security Policy` — CSP needs the AnyCable-Go origin (see [CSP](#content-security-policy)).
  - `{"type":"disconnect","reason":"unauthorized"}` — `ANYCABLE_SECRET` doesn't match between services.

Test a broadcast from the Rails console:

```ruby
Turbo::StreamsChannel.broadcast_refresh_to("test")
```

Check AnyCable-Go logs via CLI (`railway service link anycable && railway logs`) or in the Railway dashboard.

If broadcasts aren't delivered, check these in order:

1. Both services have the **same** `ANYCABLE_SECRET` and `ANYCABLE_HTTP_BROADCAST_SECRET` values.
2. `ANYCABLE_HTTP_BROADCAST_URL` uses the `*.railway.internal` hostname (private network), not the public domain.
3. The `signed_stream_verifier_key` is set inside `after_initialize` in the initializer (see [Initializer](#initializer)).
4. The broadcast URL port is `8080`. When `ANYCABLE_SECRET` is configured, AnyCable-Go serves both WebSocket and HTTP broadcast on the same port.

[railway]: https://railway.app
[railway-private]: https://docs.railway.com/reference/private-networking
[jwt-id]: /anycable-go/jwt_identification
