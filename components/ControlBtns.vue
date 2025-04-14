<template>
  <div class="control__btns">
    <button class="btn secondary-btn" :disabled="!isPrevStepActive" :class="{ disable: !isPrevStepActive }"
      @click="prevStep">
      <img src="@/assets/icons/back-left.svg" alt="back icon" />
    </button>
    <button class="btn secondary-btn" :disabled="!isNextStepActive" :class="{ disable: !isNextStepActive }" @click="nextStep">
      <img src="@/assets/icons/back-left.svg" alt="forward icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isNextStepActive: boolean
  isPrevStepActive: boolean
}>()

const emit = defineEmits<{
  (e: 'next-step'): void
  (e: 'prev-step'): void
}>()

function nextStep() {
  emit('next-step')
}

function prevStep() {
  emit('prev-step')
}
</script>
