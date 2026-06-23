import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import llmstxt from 'vitepress-plugin-llms'
import { availableSinceMarkdownPlugin } from './availableSinceMarkdownPlugin'

export default withMermaid(defineConfig({
  title: "AnyCable",
  description: "AnyCable: a realtime server with delivery guarantees for Rails, Laravel, Node.js, Python, and any backend.",

  cleanUrls: true,
  ignoreDeadLinks: true,

  sitemap: {
    hostname: 'https://docs.anycable.io',
    // Drop leftover docsify folder-index stubs (/deployment/Readme, etc.).
    transformItems: (items) => items.filter((i) => !/\/Readme$/i.test(i.url)),
  },

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
    ['meta', { property: 'og:description', content: 'A realtime server with delivery guarantees for Rails, Laravel, Node.js, Python, and any backend.' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@any_cable' }],
    ['meta', { name: 'keywords', content: 'anycable, websockets, real-time, realtime server, delivery guarantees, reliable streams, presence, action-cable, ruby, rails, hotwire, laravel, nodejs, python, go' }],
  ],

  themeConfig: {
    logo: {
      light: '/assets/images/logo.svg',
      dark: '/assets/images/logo_invert.svg',
    },

    nav: [
      { text: 'Guide', link: '/overview', activeMatch: '/' },
      { text: 'anycable.io', link: 'https://anycable.io' },
      { text: 'LLMs', link: '/llms-full.txt' },
    ],

    sidebar: [
      {
        text: 'Start here',
        items: [
          { text: 'What is AnyCable', link: '/overview' },
          { text: 'Quick start', link: '/quickstart' },
          { text: 'Capabilities', link: '/capabilities' },
          { text: '🔥 Troubleshooting', link: '/troubleshooting' },
        ]
      },
      {
        text: 'Build by use case',
        items: [
          { text: 'Overview', link: '/use-cases/' },
          { text: 'AI response streaming', link: '/use-cases/ai-streaming' },
          { text: 'Live dashboards', link: '/use-cases/live-dashboards' },
          { text: 'GPS tracking & dispatch', link: '/use-cases/gps-dispatch' },
          { text: 'Telehealth & collaboration', link: '/use-cases/telehealth' },
        ]
      },
      {
        text: 'By backend',
        items: [
          { text: 'Rails', link: '/rails/getting_started' },
          { text: 'Laravel', link: '/guides/laravel' },
          { text: 'Node.js (serverless)', link: '/guides/serverless' },
          { text: 'Python & any HTTP backend', link: '/guides/python' },
          { text: 'Hotwire', link: '/guides/hotwire' },
          { text: 'Client-side usage', link: '/guides/client-side' },
        ]
      },
      {
        text: 'Capabilities',
        items: [
          { text: 'Reliable streams & recovery', link: '/anycable-go/reliable_streams' },
          { text: 'Presence', link: '/anycable-go/presence' },
          { text: 'Broadcasting', link: '/anycable-go/broadcasting' },
          { text: 'Signed streams', link: '/anycable-go/signed_streams' },
          { text: 'JWT authentication', link: '/anycable-go/jwt_identification' },
          { text: 'Broker deep dive', link: '/anycable-go/broker' },
          { text: 'Pub/sub (node-node)', link: '/anycable-go/pubsub' },
          { text: 'REST API', link: '/anycable-go/api' },
        ]
      },
      {
        text: 'Protocols',
        items: [
          { text: 'Server-sent events', link: '/anycable-go/sse' },
          { text: 'Pusher', link: '/anycable-go/pusher' },
          { text: 'Apollo GraphQL', link: '/anycable-go/apollo' },
          { text: 'Durable Streams', link: '/anycable-go/durable_streams' },
          { text: 'Long polling', link: '/anycable-go/long_polling' },
          { text: 'OCPP support', link: '/anycable-go/ocpp' },
          { text: 'Binary formats', link: '/anycable-go/binary_formats' },
        ]
      },
      {
        text: 'Editions & Pro',
        items: [
          { text: 'Editions', link: '/editions' },
          { text: 'Going Pro', link: '/pro' },
          { text: 'Install Pro', link: '/pro/install' },
        ]
      },
      {
        text: 'Deploy & operate',
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
          { text: 'Instrumentation', link: '/anycable-go/instrumentation' },
          { text: 'Health checking', link: '/anycable-go/health_checking' },
          { text: 'Tracing', link: '/anycable-go/tracing' },
          { text: 'OS Tuning', link: '/anycable-go/os_tuning' },
          { text: 'Telemetry', link: '/anycable-go/telemetry' },
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
        text: 'AnyCable-Go (server)',
        items: [
          { text: 'Configuration', link: '/anycable-go/configuration' },
          { text: 'All server options', link: '/anycable-go/options' },
          { text: 'AnyCable RPC', link: '/anycable-go/rpc' },
          { text: 'Embedded NATS', link: '/anycable-go/embedded_nats' },
          { text: 'Using as a library', link: '/anycable-go/library' },
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
        text: 'Reference',
        items: [
          { text: 'Benchmarks', link: '/benchmarks' },
          { text: 'Action Cable protocols', link: '/misc/action_cable_protocol' },
          { text: 'Protobuf definitions', link: '/misc/rpc_proto' },
          { text: 'AnyCable server spec', link: '/misc/how_to_anycable_server' },
        ]
      },
      {
        text: 'Upgrade Notes',
        items: [
          { text: 'Release Notes', link: '/release_notes' },
          { text: 'From v1.4.x to v1.5.0', link: '/upgrade-notes/1_4_0_to_1_5_0' },
          { text: 'From v1.3.x to v1.4.0', link: '/upgrade-notes/1_3_0_to_1_4_0' },
          { text: 'From v1.2.x to v1.3.0', link: '/upgrade-notes/1_2_0_to_1_3_0' },
          { text: 'From v1.0.x to v1.1.0', link: '/upgrade-notes/1_0_0_to_1_1_0' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/anycable/anycable' },
      { icon: 'x', link: 'https://twitter.com/any_cable' },
    ],

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/anycable/docs.anycable.io/edit/master/docs/:path'
    },
  },

  mermaid: {
    theme: 'base',
    themeVariables: {
      primaryColor: '#FFF5F5',
      primaryTextColor: '#363636',
      primaryBorderColor: '#ff5e5e',
      lineColor: '#ff5e5e',
      secondaryColor: '#fff0e6',
      tertiaryColor: '#ffffff',
    },
  },
}))
