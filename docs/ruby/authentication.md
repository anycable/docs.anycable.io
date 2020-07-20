# Authentication

## Devise/Warden

Devise relies on [`warden`](https://github.com/wardencommunity/warden) Rack middleware to authenticate users but unlike Action Cable,
Anycable does not have it in the environment ('cause it doesn't use Rails app Rack middleware at all).

Hopefully, you can reconstruct the necessary part of the Rack env from cookies:

```ruby
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user || reject_unauthorized_connection
    end

    protected

    def find_verified_user
      app_cookies_key = Rails.application.config.session_options[:key] ||
        raise("No session cookies key in config")

      env["rack.session"] = cookies.encrypted[app_cookies_key]
      Warden::SessionSerializer.new(env).fetch(:user)
    end
  end
end
```

If you're using some other other session store instead `cookie_store` (for example [`Redis`](https://github.com/anycable/anycable-rails/issues/95#issuecomment-502458973)) you need manually get key from users cookies and find payload in your session store. Take a look at this [issue](https://github.com/anycable/anycable-rails/issues/95#issuecomment-502458973) for example of Redis stored session.
