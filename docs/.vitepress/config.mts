import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'
import { availableSinceMarkdownPlugin } from './availableSinceMarkdownPlugin'

export default defineConfig({
  title: "AnyCable",
  description: "A real-time server for Rails, Laravel, Node.js, and Hotwire applications",

  cleanUrls: true,
  ignoreDeadLinks: true,

  vite: {
    plugins: [
      llmstxt(),
    ],
  },

  markdown: {
    config(md) {
      md.use(availableSinceMarkdownPlugin)
    },
  },

  head: [
    ['link', { rel: 'icon', href: '/assets/images/favicon-32x32.png', type: 'image/png', sizes: '32x32' }],
    ['link', { rel: 'icon', href: '/assets/images/favicon-16x16.png', type: 'image/png', sizes: '16x16' }],
    ['link', { rel: 'apple-touch-icon', href: '/assets/images/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#ff5e5e' }],
    ['meta', { property: 'og:title', content: 'AnyCable Documentation' }],
    ['meta', { property: 'og:description', content: 'A real-time server for Rails, Laravel, Node.js, and Hotwire applications' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@any_cable' }],
    ['meta', { name: 'keywords', content: 'ruby, rails, websockets, real-time, action-cable, anycable, hotwire, laravel' }],
  ],

  themeConfig: {
    logo: {
      light: '/assets/images/logo.svg',
      dark: '/assets/images/logo_invert.svg',
    },

    nav: [
      { text: 'Guide', link: '/getting_started', activeMatch: '/' },
      { text: 'anycable.io', link: 'https://anycable.io' },
      { text: 'LLMs', link: '/llms-full.txt' },
    ],

    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Getting Started', link: '/getting_started' },
          { text: 'Architecture', link: '/architecture' },
          { text: 'Benchmarks', link: '/benchmarks' },
          { text: 'Troubleshooting', link: '/troubleshooting' },
          { text: 'Release Notes', link: '/release_notes' },
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Using with Rails', link: '/rails/getting_started' },
          { text: 'Client-side usage', link: '/guides/client-side' },
          { text: 'Using with JavaScript (serverless)', link: '/guides/serverless' },
          { text: 'Using with Hotwire', link: '/guides/hotwire' },
          { text: 'Using with Laravel', link: '/guides/laravel' },
          { text: 'Broadcasting', link: '/anycable-go/broadcasting' },
          { text: 'Signed streams', link: '/anycable-go/signed_streams' },
          { text: 'Reliable streams', link: '/anycable-go/reliable_streams' },
          { text: 'Presence', link: '/anycable-go/presence' },
          { text: 'REST API', link: '/anycable-go/api' },
          { text: 'JWT authentication', link: '/anycable-go/jwt_identification' },
        ]
      },
      {
        text: 'AnyCable PRO',
        items: [
          { text: 'Going PRO', link: '/pro' },
          { text: 'Install PRO', link: '/pro/install' },
          { text: 'AnyCable RPC', link: '/anycable-go/rpc' },
          { text: 'Apollo GraphQL', link: '/anycable-go/apollo' },
          { text: 'Binary formats', link: '/anycable-go/binary_formats' },
          { text: 'Long polling', link: '/anycable-go/long_polling' },
          { text: 'OCPP support', link: '/anycable-go/ocpp' },
        ]
      },
      {
        text: 'Protocols',
        items: [
          { text: 'Server-sent events', link: '/anycable-go/sse' },
          { text: 'Pusher', link: '/anycable-go/pusher' },
          { text: 'Durable Streams', link: '/anycable-go/durable_streams' },
          { text: 'Long polling', link: '/anycable-go/long_polling' },
          { text: 'OCPP support', link: '/anycable-go/ocpp' },
        ]
      },
      {
        text: 'Deployment',
        items: [
          { text: 'Heroku', link: '/deployment/heroku' },
          { text: 'Fly.io', link: '/deployment/fly' },
          { text: 'Kamal', link: '/deployment/kamal' },
          { text: 'Thruster', link: 'https://github.com/anycable/thruster' },
          { text: 'Render', link: '/deployment/render' },
          { text: 'Hatchbox', link: 'https://hatchbox.relationkit.io/articles/12-does-hatchbox-support-anycable' },
          { text: 'Docker', link: '/deployment/docker' },
          { text: 'Kubernetes', link: '/deployment/kubernetes' },
          { text: 'Capistrano', link: '/deployment/capistrano' },
          { text: 'Systemd', link: '/deployment/systemd' },
          { text: 'AWS Beanstalk', link: 'https://jetrockets.com/blog/scaling-rails-docker-aws-beanstalk' },
          { text: 'AWS ECS', link: 'https://medium.com/expsoftwareengineering/deploying-ruby-on-rails-with-anycable-using-docker-ecs-80f0da2051ba' },
          { text: 'Load Balancing', link: '/deployment/load_balancing' },
          { text: 'Load Testing', link: '/deployment/load_testing' },
        ]
      },
      {
        text: 'Ruby / Rails',
        items: [
          { text: 'Non-Rails usage', link: '/ruby/non_rails' },
          { text: 'CLI', link: '/ruby/cli' },
          { text: 'Configuration', link: '/ruby/configuration' },
          { text: 'HTTP RPC', link: '/ruby/http_rpc' },
          { text: 'Rails extensions', link: '/rails/extensions' },
          { text: 'Authentication', link: '/rails/authentication' },
          { text: 'Channels state', link: '/rails/channels_state' },
          { text: 'gRPC middlewares', link: '/ruby/middlewares' },
          { text: 'Health checking', link: '/ruby/health_checking' },
          { text: 'Logging', link: '/ruby/logging' },
          { text: 'Exceptions handling', link: '/ruby/exceptions' },
          { text: 'Instrumentation via Yabeda', link: 'https://github.com/yabeda-rb/yabeda-anycable' },
          { text: 'Action Cable compatibility', link: '/rails/compatibility' },
          { text: 'Broadcast adapters', link: '/ruby/broadcast_adapters' },
        ]
      },
      {
        text: 'AnyCable-Go',
        items: [
          { text: 'Getting started', link: '/anycable-go/getting_started' },
          { text: 'Configuration', link: '/anycable-go/configuration' },
          { text: 'AnyCable RPC', link: '/anycable-go/rpc' },
          { text: 'Broker deep dive', link: '/anycable-go/broker' },
          { text: 'Pub/sub (node-node)', link: '/anycable-go/pubsub' },
          { text: 'Instrumentation', link: '/anycable-go/instrumentation' },
          { text: 'Health checking', link: '/anycable-go/health_checking' },
          { text: 'Tracing', link: '/anycable-go/tracing' },
          { text: 'OS Tuning', link: '/anycable-go/os_tuning' },
          { text: 'Signed streams', link: '/anycable-go/signed_streams' },
          { text: 'Embedded NATS', link: '/anycable-go/embedded_nats' },
          { text: 'Using as a library', link: '/anycable-go/library' },
          { text: 'Telemetry', link: '/anycable-go/telemetry' },
        ]
      },
      {
        text: 'JavaScript',
        items: [
          { text: 'AnyCable Client SDK', link: 'https://github.com/anycable/anycable-client' },
          { text: 'AnyCable Serverless', link: 'https://github.com/anycable/anycable-serverless-js' },
        ]
      },
      {
        text: 'Misc',
        items: [
          { text: 'Action Cable protocols', link: '/misc/action_cable_protocol' },
          { text: 'Protobuf definitions', link: '/misc/rpc_proto' },
          { text: 'AnyCable server spec', link: '/misc/how_to_anycable_server' },
        ]
      },
      {
        text: 'Upgrade Notes',
        items: [
          { text: 'From v1.4.x to v1.5.0', link: '/upgrade-notes/1_4_0_to_1_5_0' },
          { text: 'From v1.3.x to v1.4.0', link: '/upgrade-notes/1_3_0_to_1_4_0' },
          { text: 'From v1.2.x to v1.3.0', link: '/upgrade-notes/1_2_0_to_1_3_0' },
          { text: 'From v1.0.x to v1.1.0', link: '/upgrade-notes/1_0_0_to_1_1_0' },
          { text: 'From v0.6.x to v1.0.0', link: '/upgrade-notes/0_6_0_to_1_0_0' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/anycable/anycable' },
      { icon: 'discord', link: 'https://discord.com/channels/629472241427415060/944842112862670878' },
      { icon: 'x', link: 'https://twitter.com/any_cable' },
    ],

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/anycable/docs.anycable.io/edit/master/docs/:path'
    },
  }
})
