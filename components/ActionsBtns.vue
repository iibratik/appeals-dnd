
<template>
    <div class="action-btn">
      <button
        class="btn list-action"
        :class="{ active: isActive }"
        @click="toggleMenu"
      >
        <img
          v-if="isActive"
          src="@/assets/icons/dots-active.svg"
          alt="dots icon"
        >
        <img
          v-else
          src="@/assets/icons/dots-icon.svg"
          alt="dots icon"
        >
      </button>

      <Transition name="fade-slide">
        <div v-if="isActive" class="list-actions__menu">
          <span class="list-menu__item">
            <img src="@/assets/icons/pencil.svg" alt="edit icon" >
            Edit
          </span>
          <span class="list-menu__item">
            <img src="@/assets/icons/trash.svg" alt="trash icon" >
            Remove
          </span>
        </div>
      </Transition>
    </div>
  </template>

  <script setup lang="ts">
  const props = defineProps<{
    id: string;
    activeMenuId: string | null;
  }>();

  const emit = defineEmits<{
    (e: 'set-active', id: string): void;
  }>();

  const isActive = computed(() => props.id === props.activeMenuId);

  function toggleMenu() {
    emit('set-active', isActive.value ? '' : props.id);
  }
  </script>