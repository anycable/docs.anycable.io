<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<template>
  <div class="landing">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-heading">
          <picture>
            <source v-if="isDark" srcset="/assets/images/logo_invert.svg">
            <img
              class="hero-logo"
              src="/assets/images/logo.svg"
              alt="AnyCable"
            />
          </picture>
          <div class="hero-text">
            <h1 class="hero-title">AnyCable Documentation</h1>
            <p class="hero-tagline">A real-time server for Rails, Laravel, Node.js, and Hotwire applications</p>
          </div>
        </div>
        <div class="hero-actions">
          <a class="btn btn-brand" href="/getting_started">Get Started</a>
          <a
            class="btn btn-alt"
            href="https://github.com/anycable/anycable"
            target="_blank"
            rel="noopener"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>

    <!-- Getting Started -->
    <section class="getting-started">
      <div class="getting-started-inner">
        <h2>Choose your path</h2>
        <div class="path-grid">
          <a class="path-card" href="/rails/getting_started">
            <h3>Rails</h3>
            <p>Add real-time features to your Ruby on Rails application</p>
          </a>
          <a class="path-card" href="/guides/hotwire">
            <h3>Hotwire</h3>
            <p>Build reactive frontends with Turbo Streams and AnyCable</p>
          </a>
          <a class="path-card" href="/guides/serverless">
            <h3>Serverless JS</h3>
            <p>Use AnyCable as a real-time server for serverless JavaScript</p>
          </a>
          <a class="path-card" href="/guides/laravel">
            <h3>Laravel</h3>
            <p>Integrate real-time capabilities into your Laravel app</p>
          </a>
          <a class="path-card" href="/ruby/non_rails">
            <h3>Other Ruby</h3>
            <p>Use AnyCable with any Ruby framework</p>
          </a>
          <a class="path-card" href="/architecture">
            <h3>Architecture</h3>
            <p>Understand how AnyCable works under the hood</p>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <div class="footer-inner">
        <div class="footer-sponsors">
          <a href="https://evilmartians.com/" target="_blank" rel="noopener">
            <picture>
              <source v-if="isDark" srcset="https://evilmartians.com/badges/sponsored-by-evil-martians_v2.0_for-dark-bg.svg">
              <img alt="Sponsored by Evil Martians" src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg" width="236" height="54">
            </picture>
          </a>
        </div>
        <p class="footer-links">
          <a href="https://anycable.io" target="_blank" rel="noopener">Website</a>
          <span class="sep">&middot;</span>
          <a href="https://anycable.io/blog" target="_blank" rel="noopener">Blog</a>
          <span class="sep">&middot;</span>
          <a href="https://github.com/anycable/anycable" target="_blank" rel="noopener">GitHub</a>
          <span class="sep">&middot;</span>
          <a href="https://discord.com/channels/629472241427415060/944842112862670878" target="_blank" rel="noopener">Discord</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.landing {
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-1);
}

/* Hero */
.hero {
  text-align: center;
  padding: 80px 24px 64px;
}

.hero-inner {
  max-width: 720px;
  margin: 0 auto;
}

.hero-heading {
  display: flex;
  align-items: center;
  gap: 32px;
  justify-content: center;
  margin-bottom: 8px;
}

.hero-text {
  text-align: left;
}

.hero-logo {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.hero-title {
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--vp-c-brand-2);
  margin: 0 0 8px;
}

.hero-tagline {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 32px;
}

.btn {
  display: inline-block;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
}

.btn-brand {
  background-color: var(--vp-c-brand-3);
  color: var(--vp-c-white);
}

.btn-brand:hover {
  background-color: var(--vp-c-brand-1);
}

.btn-alt {
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.btn-alt:hover {
  background-color: var(--vp-c-default-3);
}

/* Getting Started */
.getting-started {
  padding: 48px 24px 64px;
  background-color: var(--vp-c-bg-soft);
}

.getting-started-inner {
  max-width: 960px;
  margin: 0 auto;
}

.getting-started-inner h2 {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 32px;
}

.path-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.path-card {
  display: block;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.path-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: var(--vp-c-brand-1);
}

.path-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--vp-c-brand-1);
}

.path-card p {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
}

/* Footer */
.landing-footer {
  padding: 40px 24px;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
}

.footer-sponsors {
  margin-bottom: 20px;
}

.footer-links {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.footer-inner a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.footer-inner a:hover {
  text-decoration: underline;
}

.sep {
  margin: 0 8px;
  color: var(--vp-c-text-3);
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 48px 20px 40px;
  }

  .hero-heading {
    flex-direction: column;
    gap: 16px;
  }

  .hero-text {
    text-align: center;
  }

  .hero-logo {
    width: 90px;
    height: 90px;
  }

  .hero-title {
    font-size: 1.6rem;
  }

  .path-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (min-width: 769px) and (max-width: 960px) {
  .path-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
