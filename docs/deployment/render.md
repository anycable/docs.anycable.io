# Render Deployment

The easiest way to deploy AnyCable + Rails apps to Render.com is by having three services:
* **Rails app** -- Web Service (public) -- Ruby environment
* **Same rails app running gRPC** - Private Service -- Ruby environment
* **AnyCable-Go server** -- Web Service (public) -- Docker environment

It's likely doable to combine the two Rails app instances (public and grpc) into a single server, but I'll leave that exercise to the reader.

### Assumptions

* You've followed the standard Rails setup and run the excellent installer script (https://docs.anycable.io/rails/getting_started)
* You are using a custom domain and have DNS control, so you can create a subdomain.
* You are using Devise/Warden for authentication in your Rails app (if you're using something else, I'll leave it to you to figure out what is needed to make AnyCable work with your auth scheme.)
* You are using `redis_session_store` for sessions

## Rails Web Service

We're going to call our Rails app **"xylophone"** for the remainder of this guide. 

Provision the normal public Rails app web service as you usually would on Render. I'm also assuming you've provisioned a Redis server; remember the `REDIS_URL` because we'll need it later.

We're going to asssume you set up your custom domain under *Settings* (e.g. `xylophone.com`)

## gRPC Private Service

The gRPC app is just going to be your same Rails app again, but this time running on a _private_ service, communicating internally with your AnyCable service.

We're going to provision it with the name `xylophone-grpc`

Under **Environment**, you will likely want to set the following:
- `RAILS_MASTER_KEY` (same as on your public app service)
- `REDIS_URL` (same as on your public app service)

Under **Settings**, set the following:
- Build Command: `bundle install`
- Start Command: `bundle exec anycable --rpc-host 0.0.0.0:50051`

Once your grpc app service is provisioned, it should provide an _internal_ service name like `xylophone-grpc:50051` ... remember this because you'll need it later.

## AnyCable-Go Web Service

AnyCable is going to be deployed as a simple Docker application on Render. The easiest way to do this is create a `anycable-go` directory on your local machine that literally _only_ has a `Dockerfile` in it. 

### `Dockerfile`

```
FROM anycable/anycable-go:latest
```
(seriously, that's it)

Now push that directory to a git repo so Render will be able to connect to it.

Back to Render dashboard, click New+ and create a `Web Service` (it's going to be publicly available because this is the server that your clients' browser will hit up with websocket requests.) Make sure to connect to your new anycable-go repo with the Dockerfile. Render should auto-detect that it's a Docker app and build it for you. You'll need some settings though...

### Render Settings

Under **Environment**:
* set `ANYCABLE_HOST` to `0.0.0.0`
* set `ANYCABLE_RPC_HOST` to `xylophone-grpc:50051` (the internal service name from before)
* set `REDIS_URL` to the same redis url for your other services (e.g. `redis://red-abc123abc123abc123:6379`)

Under **Settings**:

You shouldn't really need to change much here. Just make sure you've set up your custom domain with a reasonable subdomain, e.g. `ws.xylophone.com`

## Wiring some things together

Now that you've got all three services running, you need to go back to the public Rails web service and tell it what ActionCable URL to give to clients.

This assumes that your `production.rb` has something like this:
```ruby
  config.after_initialize do
    config.action_cable.url = ENV.fetch("CABLE_URL", "/cable") if AnyCable::Rails.enabled?
  end
```
If so, all you need to do on Render is change the Rails app **Environment** variables again:
* Set `CABLE_URL` to your new anycable service (e.g. `wss://ws.xylophone.com/cable`)

(_Don't forget the **/cable** at the end!_)

With that, your services should now all be able to talk to each other. However, you may run into some issues:

## cable.yml

If you haven't already, make sure you've setup `cable.yml` properly for production:

```
production:
  adapter: any_cable
```

## redis_session_store config

If, like me, you're using the `redis_session_store` gem for session handling, you may need to tweak the config some...

```ruby
Rails.application.config.session_store :redis_session_store,
  key: "_session_#{Rails.env}",
  serializer: :json,
  domain: :all, # <-- THIS IS IMPORTANT
  redis: {
    expire_after: 1.year,
    ttl: 1.year,
    key_prefix: "xylophone:session:",
    url: ENV['REDIS_URL']
  }
```
⚠️ Note the change to `domain: :all`. This ensures that your clients' session cookie key can be shared between your primary domain (`xylophone.com`) and your websocket subdomain (`ws.xylophone.com`)

## Devise/Warden authentication issues

You may need to create an initializer like `config/initializers/anycable.rb` with the following:

```ruby
AnyCable::Rails::Rack.middleware.use Warden::Manager do |config|
  Devise.warden_config = config
end
```

In my app, I had to change `app/channels/application_cable/connection.rb` because the internal service doesn't have any Warden context; you have to fetch the current sessioned user manually using the cookie from the client browser:

```ruby
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    protected

    def find_verified_user
      redis = Redis.new(url: ENV['REDIS_URL'])
      
      # this key should have the same `key_prefix` as setup in redis_session_store config (see above)
      rkey = "xylophone:session:#{cookies[app_cookies_key]}"
      
      session_data = redis.get(rkey)

      if session_data.present?
        env["rack.session"] = JSON.parse(session_data, quirks_mode: true)
        Warden::SessionSerializer.new(env).fetch(:user)
      else
        reject_unauthorized_connection
      end
    end

    def app_cookies_key
      Rails.application.config.session_options[:key] ||
        raise("No session cookies key in config")
    end   
  end
end 
```