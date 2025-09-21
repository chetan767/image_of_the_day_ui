<template>
  <q-page class="page-container">
    <GameBoard />
  </q-page>
</template>

<script setup>
import GameBoard from 'components/GameBoard.vue'
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: 
    linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #cbd5e1 100%),
    radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.08) 0%, transparent 50%);
  position: relative;
  overflow: hidden;
}

.page-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
  pointer-events: none;
}

.page-container::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: 
    conic-gradient(from 0deg at 50% 50%, 
      rgba(102, 126, 234, 0.1) 0deg, 
      rgba(118, 75, 162, 0.1) 120deg, 
      rgba(240, 147, 251, 0.1) 240deg, 
      rgba(102, 126, 234, 0.1) 360deg);
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

@media (max-width: 768px) {
  .page-container::after {
    animation: none;
  }
}

body.body--dark .page-container {
  background: 
    linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%),
    radial-gradient(circle at 20% 80%, rgba(79, 172, 254, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.1) 0%, transparent 50%);
}

body.body--dark .page-container::after {
  background: 
    conic-gradient(from 0deg at 50% 50%, 
      rgba(79, 172, 254, 0.05) 0deg, 
      rgba(168, 85, 247, 0.05) 120deg, 
      rgba(34, 197, 94, 0.05) 240deg, 
      rgba(79, 172, 254, 0.05) 360deg);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
