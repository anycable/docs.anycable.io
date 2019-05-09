# Heroku Deployment

# The Problem

Deploying applications using AnyCable on Heroku is a little bit tricky due to the following limitations:

- Missing HTTP/2 support.

AnyCable relies on HTTP/2 ('cause it uses [gRPC](https://grpc.io)).

- The only `web` service.

It is not possible to have two HTTP services within one application (only `web` service is open the world).

# The Workaround

The only way (for now) to run AnyCable applications on Heroku is to have two separate applications sharing some resources: the first one is a typical web application responsible for general HTTP and the second is a websocket server plus AnyCable RPC server.

We have to use the same `Procfile` for both applications ('cause we're using the same repo) but run different commands for the `web` service. That can be achieved through a custom script (from [this post](http://techtime.getharvest.com/blog/deploying-multiple-heroku-apps-from-a-single-repo)):

```sh
#!/bin/bash

if [ "$ANYCABLE_DEPLOYMENT" == "true" ]; then
  bundle exec anycable --server-command="anycable-go"
else
  bundle exec rails server -p $PORT -b 0.0.0.0  
fi
```

Put this script, for example, into `bin/heroku-web` (and don't forget to `chmod +x`). Then in your `Procfile`:

```yml
web: CABLE_URL='wss://anycable-demo-rpc.herokuapp.com/cable' bin/heroku-web
```

We need `CABLE_URL` variable to correctly configure AnyCable and Rails (i.e. `config.action_cable.url = ENV['CABLE_URL']`).

Steps to setup both applications (using [anycable_demo](https://github.com/anycable/anycable_demo) as an example):

```sh
# Create new heroku application
heroku create anycable-demo

# Add necessary add-ons
# NOTE: we need at least Redis
heroku addons:create heroku-postgresql 
heroku addons:create heroku-redis

# Deploy application
git push heroku master

# Run migrations or other postdeployment scripts
heroku run "rake db:migrate"

# Create WS+RPC application
heroku create anycable-demo-rpc --remote rpc

# Get the list of the first app add-ons
heroku addons -a anycable-demo

# Attach addons to the second app
heroku addons:attach postgresql-closed-12345 -a anycable-demo-rpc
heroku addons:attach redis-regular-12345 -a anycable-demo-rpc

# Add anycable-go buildpack
heroku buildpacks:add https://github.com/anycable/heroku-anycable-go -a anycable-demo-rpc

# Add ruby buildpack
heroku buildpacks:add heroku/ruby -a anycable-demo-rpc

# Set config var
heroku config:set ANYCABLE_DEPLOYMENT=true -a anycable-demo-rpc
# Don't forget to add RAILS_ENV if using Rails
heroku config:set RAILS_ENV=production -a anycable-demo-rpc 

# And don't forget to push code to the RPC app
git push rpc master

# NOTE: you should update both applications every time,
# i.e. run `git push heroku master && git push rpc master`
```

See complete example: [code](https://github.com/anycable/anycable_demo) and [deployed application](http://heroku-demo.anycable.io/).


## Using with Heroku Review apps

We recommend using _standard_ Action Cable in review apps with [enforced runtime compatibility checks](compatibility.md#runtime-checks).

In your `cable.yml` use the following code to conditionally load the adapter:

```yml
production:
  adapter: <%= ENV.fetch('CABLE_ADAPTER', 'any_cable') %>
```

And set `"CABLE_ADAPTER": "redis"` (or any other built-in adapter, e.g. `"CABLE_ADAPTER": "async"`) in your `app.json`.
