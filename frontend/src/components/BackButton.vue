<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<template>
  <button class="back-btn" @click="goBack">
<!-- License: PD. Made by pixeden.com: https://pixeden.com -->
<svg width="800px" height="800px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="icomoon-ignore">
</g>
<path d="M14.389 7.956v4.374l1.056 0.010c7.335 0.071 11.466 3.333 12.543 9.944-4.029-4.661-8.675-4.663-12.532-4.664h-1.067v4.337l-9.884-7.001 9.884-7zM15.456 5.893l-12.795 9.063 12.795 9.063v-5.332c5.121 0.002 9.869 0.26 13.884 7.42 0-4.547-0.751-14.706-13.884-14.833v-5.381z" fill="currentcolor">

</path>
</svg>
    Back
  </button>
</template>

<style scoped>
.back-btn {
    margin-bottom:20px;
  display: inline-flex;
  align-items:center;
  gap:6px;
  border:1px solid var(--border);
  background:white;
  padding:9px 16px;
  border-radius:10px;
  cursor:pointer;
  font-weight:600;
  width: fit-content;
}

.back-btn svg{
  width:16px;
  height:16px;
}
</style>