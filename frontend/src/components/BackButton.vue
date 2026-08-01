<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<template>
  <button class="back-btn" type="button" @click="goBack">
    <span class="back-btn__glow" aria-hidden="true"></span>
    <svg
      class="back-icon"
      width="14"
      height="14"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14.389 7.956v4.374l1.056 0.010c7.335 0.071 11.466 3.333 12.543 9.944-4.029-4.661-8.675-4.663-12.532-4.664h-1.067v4.337l-9.884-7.001 9.884-7zM15.456 5.893l-12.795 9.063 12.795 9.063v-5.332c5.121 0.002 9.869 0.26 13.884 7.42 0-4.547-0.751-14.706-13.884-14.833v-5.381z"
        fill="currentColor"
      />
    </svg>
    <span class="back-btn__label">Back</span>
  </button>
</template>

<style scoped>
.back-btn {
  --back-btn-text: var(--text-secondary, #3f4652);
  --back-btn-text-hover: var(--text-primary, #10131a);
  --back-btn-bg: rgba(255, 255, 255, 0.55);
  --back-btn-bg-hover: rgba(255, 255, 255, 0.75);
  --back-btn-border: rgba(255, 255, 255, 0.6);
  --back-btn-border-hover: rgba(255, 255, 255, 0.85);
  --back-btn-shadow: 0 1px 2px rgba(16, 24, 40, 0.04),
    0 1px 1px rgba(16, 24, 40, 0.02);
  --back-btn-shadow-hover: 0 8px 20px rgba(16, 24, 40, 0.10),
    0 2px 6px rgba(16, 24, 40, 0.06);
  --back-btn-focus-ring: var(--focus-ring, #4d7cfe);

  position: relative;
  isolation: isolate;
  margin-bottom: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: fit-content;
  height: 34px;
  padding: 0 14px;
  border: 1px solid var(--back-btn-border);
  border-radius: 9px;
  background: var(--back-btn-bg);
  color: var(--back-btn-text);
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  font-size: 13px;
  line-height: 1;
  letter-spacing: -0.01em;
  box-shadow: var(--back-btn-shadow);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  overflow: hidden;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.25s ease,
    color 0.2s ease,
    transform 0.15s ease;
}

.back-btn__glow {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0) 60%
  );
  transition: opacity 0.25s ease;
}

.back-btn:hover {
  background: var(--back-btn-bg-hover);
  border-color: var(--back-btn-border-hover);
  color: var(--back-btn-text-hover);
  box-shadow: var(--back-btn-shadow-hover);
  transform: translateY(-1px);
}

.back-btn:hover .back-btn__glow {
  opacity: 1;
}

.back-btn:active {
  transform: translateY(0) scale(0.97);
  box-shadow: var(--back-btn-shadow);
}

.back-btn:focus-visible {
  outline: 2px solid var(--back-btn-focus-ring);
  outline-offset: 2px;
}

.back-icon {
  flex-shrink: 0;
  display: block;
  transition: transform 0.2s ease;
}

.back-btn:hover .back-icon {
  transform: translateX(-2px);
}

.back-btn__label {
  display: inline-block;
}

@media (max-width: 480px) {
  .back-btn {
    height: 32px;
    padding: 0 12px;
    font-size: 12.5px;
  }
}
@media (min-width: 768px) {
  .back-btn {
    display: none;
  }
}
</style>