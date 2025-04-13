<template>
  <div class="appeal-list">
    <div class="appeal-list-content">
      <div class="list__item">
        <span class="list__upper-title">№</span>
        <span class="list__title">{{ game.id }}</span>
      </div>

      <div class="list__item">
        <span class="list__upper-title">Name</span>
        <span class="list__title">
          <img src="@/assets/icons/folder.svg" alt="folder-icon">
          {{ game.name }}
        </span>
      </div>

      <div class="list__item">
        <span class="list__upper-title">Order</span>
        <span class="list__title">{{ game.order }}</span>
      </div>

      <div class="list__item">
        <span class="list__upper-title">Sub categories</span>
        <span class="list__title">
          {{game.items.map(item => item.name).join(' / ')}}
        </span>
      </div>

      <div class="list-actions-content">
        <div class="list__item-count">
          <span>{{ game.items.length }}</span>
        </div>

        <button class="btn drop-down-btn list-action" @click="toggleDropdown">
          <img v-if="isOpen" src="@/assets/icons/up-icon.svg" alt="up icon">
          <img v-else src="@/assets/icons/down-icon.svg" alt="down icon">
        </button>

        <ActionsBtns :id="`game-${game.id}`" :active-menu-id="activeActionMenuId" @set-active="setActiveMenu" />
      </div>
    </div>

    <Transition name="fade-slide">
      <ul v-if="isOpen" class="appeal-lists__dropdown">
        <li v-for="item in game.items" :key="item.id" class="appeal-list__dropdown">
          <div class="list__item">
            <span class="list__upper-title">№</span>
            <span class="list__title">{{ game.id }}.{{ item.id }}</span>
          </div>

          <div class="list__item">
            <span class="list__upper-title">Name</span>
            <span class="list__title">
              <img src="@/assets/icons/folder.svg" alt="folder-icon">
              {{ item.name }}
            </span>
          </div>

          <div class="list__item">
            <span class="list__upper-title">Order</span>
            <span class="list__title">{{ item.order }}</span>
          </div>

          <div class="list-actions-content">
            <ActionsBtns :id="`item-${item.id}`" :active-menu-id="activeActionMenuId" @set-active="setActiveMenu" />
          </div>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  game: {
    id: number;
    name: string;
    order: number;
    items: Array<{ id: number; name: string; order: number }>;
  };
  isOpen: boolean;
  activeActionMenuId: string | null;
}>();

const emit = defineEmits<{
  (e: 'toggle', id: number): void;
  (e: 'set-active', id: string): void;
}>();

// Функция для переключения dropdown
function toggleDropdown() {
  emit('toggle', props.game.id); // Используем props для доступа к game
}

// Функция для установки активного меню
function setActiveMenu(id: string) {
  emit('set-active', id);
}
</script>
