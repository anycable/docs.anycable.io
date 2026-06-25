<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const route = useRoute()
const { page } = useData()

const sent = ref(false)

// Built once per page, SSR-safe (no `window`/`location` at render time).
const issueUrl = computed(() => {
  const path = route.path
  const source = page.value.relativePath // e.g. "quickstart.md"
  const body = [
    "What's missing, unclear, or wrong on this page?",
    '',
    '',
    '---',
    `Page: https://docs.anycable.io${path}`,
    `Source: docs/${source}`,
  ].join('\n')
  const params = new URLSearchParams({
    title: `Docs feedback: ${path}`,
    body,
  })
  return `https://github.com/anycable/docs.anycable.io/issues/new?${params.toString()}`
})

// Fire the lightweight signal. Free text never goes to Plausible (PII/terms).
function track(event: string) {
  const plausible = (globalThis as any).plausible
  if (typeof plausible === 'function') {
    plausible(event, { props: { path: route.path } })
  }
}

function report() {
  track('Doc Incomplete')
  sent.value = true
}
</script>

<template>
  <div class="doc-feedback">
    <template v-if="!sent">
      <span class="doc-feedback-q">Something missing or unclear on this page?</span>
      <button class="doc-feedback-btn" type="button" @click="report">
        Something's missing
      </button>
    </template>
    <template v-else>
      <span class="doc-feedback-q">Thanks, noted. Want to add specifics?</span>
      <a
        class="doc-feedback-btn"
        :href="issueUrl"
        target="_blank"
        rel="noopener"
        @click="track('Doc Feedback Detail')"
      >
        Add details on GitHub →
      </a>
    </template>
  </div>
</template>

<style scoped>
.doc-feedback {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.75rem;
  line-height: 1.5;
}

.doc-feedback-q {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-2);
}

.doc-feedback-btn {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s;
}

.doc-feedback-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
</style>
