<template>
  <div class="loading-container">
    <q-spinner-dots color="primary" size="3rem" />
    <div class="text-body1 q-mt-md text-grey-7">{{ message }}</div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Loading...'
  }
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
</style>