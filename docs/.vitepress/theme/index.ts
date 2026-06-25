// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AvailableSince from './components/AvailableSince.vue'
import DocFeedback from './components/DocFeedback.vue'
import LandingLayout from './layouts/LandingLayout.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      // Right aside (toolbar), under the page outline. Doc pages only, not the
      // LandingLayout homepage.
      'aside-outline-after': () => h(DocFeedback),
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('AvailableSince', AvailableSince)
    app.component('LandingLayout', LandingLayout)
  }
} satisfies Theme
