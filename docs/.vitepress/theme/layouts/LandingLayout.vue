<script setup lang="ts">
</script>

<template>
  <div class="landing">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-heading">
          <img
            class="hero-logo light-only"
            src="/assets/images/logo.svg"
            alt="AnyCable"
          />
          <img
            class="hero-logo dark-only"
            src="/assets/images/logo_invert.svg"
            alt="AnyCable"
          />
          <div class="hero-text">
            <h1 class="hero-title">AnyCable Documentation</h1>
            <p class="hero-tagline">Realtime server for reliable two-way communication</p>
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
          <a class="path-card" href="/guides/laravel">
            <h3>Laravel</h3>
            <p>Integrate real-time capabilities into your Laravel app</p>
          </a>
          <a class="path-card" href="/guides/hotwire">
            <h3>Hotwire</h3>
            <p>Build reactive frontends with Turbo Streams and AnyCable</p>
          </a>
          <a class="path-card" href="/guides/serverless">
            <h3>TS/JS</h3>
            <p>Use AnyCable as a real-time server for (serverless) JavaScript apps</p>
          </a>
          <a class="path-card" href="/anycable-go/pusher">
            <h3>Pusher</h3>
            <p>Drop-in Pusher-compatible real-time server</p>
          </a>
          <a class="path-card" href="/anycable-go/durable_streams">
            <h3>Durable Streams</h3>
            <p>Reliable message delivery with automatic catch-up</p>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <div class="footer-inner">
        <div class="footer-sponsors">
          <a href="https://evilmartians.com/" target="_blank" rel="noopener">
            <img class="light-only" alt="Sponsored by Evil Martians" src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg" width="236" height="54">
            <img class="dark-only" alt="Sponsored by Evil Martians" src="https://evilmartians.com/badges/sponsored-by-evil-martians_v2.0_for-dark-bg.svg" width="236" height="54">
          </a>
        </div>
        <p class="footer-links">
          <a href="https://anycable.io" target="_blank" rel="noopener">Website</a>
          <span class="sep">&middot;</span>
          <a href="https://blog.anycable.io" target="_blank" rel="noopener">Blog</a>
          <span class="sep">&middot;</span>
          <a href="https://github.com/anycable/anycable" target="_blank" rel="noopener">GitHub</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.landing {
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-1);
  position: relative;
  overflow: hidden;
}

/* Gradient mesh background */
.landing::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(
      ellipse 60% 50% at 15% 20%,
      rgba(255, 94, 94, 0.06),
      transparent 50%
    ),
    radial-gradient(
      ellipse 50% 40% at 85% 15%,
      rgba(246, 66, 66, 0.04),
      transparent 50%
    ),
    radial-gradient(
      ellipse 40% 50% at 50% 80%,
      rgba(255, 94, 94, 0.03),
      transparent 50%
    );
  pointer-events: none;
  z-index: 0;
}

/* Subtle noise texture */
.landing::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.02;
  pointer-events: none;
  z-index: 0;
}

:deep(.dark) .landing::before {
  background:
    radial-gradient(
      ellipse 60% 50% at 15% 20%,
      rgba(255, 94, 94, 0.08),
      transparent 50%
    ),
    radial-gradient(
      ellipse 50% 40% at 85% 15%,
      rgba(246, 66, 66, 0.05),
      transparent 50%
    ),
    radial-gradient(
      ellipse 40% 50% at 50% 80%,
      rgba(255, 94, 94, 0.04),
      transparent 50%
    );
}

/* Hero */
.hero {
  text-align: center;
  padding: 80px 24px 64px;
  position: relative;
  z-index: 1;
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
  filter: drop-shadow(0 8px 24px rgba(255, 94, 94, 0.15));
  transition: filter 0.4s ease;
}

.hero-logo:hover {
  filter: drop-shadow(0 12px 32px rgba(255, 94, 94, 0.25));
}

.hero-title {
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--vp-c-brand-2);
  margin: 0 0 8px;
  letter-spacing: -0.02em;
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
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-brand {
  background: linear-gradient(135deg, var(--vp-c-brand-3) 0%, var(--vp-c-brand-1) 100%);
  color: var(--vp-c-white);
  box-shadow:
    0 2px 8px rgba(224, 48, 48, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-brand:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 20px rgba(224, 48, 48, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.btn-alt {
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  backdrop-filter: blur(8px);
}

.btn-alt:hover {
  border-color: var(--vp-c-text-3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

/* Getting Started */
.getting-started {
  padding: 48px 24px 64px;
  position: relative;
  z-index: 1;
  background-color: var(--vp-c-bg-soft);
}

/* Subtle glow above card section */
.getting-started::before {
  content: '';
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 160px;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 94, 94, 0.06) 0%,
    transparent 70%
  );
  pointer-events: none;
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
  position: relative;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  overflow: hidden;
  transition:
    box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.path-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow:
    0 4px 16px rgba(255, 94, 94, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.04);
  transform: translateY(-3px);
}

.path-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--vp-c-brand-1);
  transition: color 0.3s ease;
}

.path-card:hover h3 {
  color: var(--vp-c-brand-3);
}

.path-card p {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
}

/* Dark mode card enhancements */
:global(.dark) .path-card {
  background-color: rgba(30, 30, 32, 0.8);
  backdrop-filter: blur(8px);
}

:global(.dark) .path-card:hover {
  box-shadow:
    0 4px 20px rgba(255, 94, 94, 0.12),
    0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Footer */
.landing-footer {
  padding: 40px 24px;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
  position: relative;
  z-index: 1;
}

.footer-sponsors {
  display: flex;
  justify-content: center;
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
  transition: opacity 0.2s ease;
}

.footer-inner a:hover {
  opacity: 0.8;
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

  .path-card:hover {
    transform: none;
  }
}

@media (min-width: 769px) and (max-width: 960px) {
  .path-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
