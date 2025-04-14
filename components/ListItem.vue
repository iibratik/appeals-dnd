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
          <img src="@/assets/icons/folder.svg" alt="folder-icon" />
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
          <img v-if="isOpen" src="@/assets/icons/up-icon.svg" alt="up icon" />
          <img v-else src="@/assets/icons/down-icon.svg" alt="down icon" />
        </button>

        <ActionsBtns :id="`game-${game.id}`" :active-menu-id="activeActionMenuId" @set-active="setActiveMenu" />
      </div>
    </div>

    <!-- DROPDOWN -->
    <Transition name="fade-slide">
      <ul v-if="isOpen" class="appeal-lists__dropdown">
        <li v-for="(item, index) in localItems" :key="item.id" class="appeal-list__dropdown"
            :draggable="true"
            @dragstart="onChildDragStart(index, $event)"
            @dragover="onChildDragOver($event)"
            @drop="onChildDrop(index, $event)"
            @dragend="onChildDragEnd">
          <div class="list__item">
            <span class="list__upper-title">№</span>
            <span class="list__title">{{ game.id }}.{{ item.id }}</span>
          </div>

          <div class="list__item">
            <span class="list__upper-title">Name</span>
            <span class="list__title">
              <img src="@/assets/icons/folder.svg" alt="folder-icon" />
              {{ item.name }}
            </span>
          </div>

          <div class="list__item">
            <span class="list__upper-title">Order</span>
            <span class="list__title">{{ item.order }}</span>
          </div>

          <div class="list-actions-content">
            <ActionsBtns :id="`item-${item.id}`" :active-menu-id="activeMenuId" @set-active="setActiveMenu" />
          </div>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  game: {
    id: number
    name: string
    order: number
    items: Array<{ id: number; name: string; order: number }>
  }
  isOpen: boolean
  activeActionMenuId: string | null
}>()

const emit = defineEmits<{
  (e: 'toggle', id: number): void
  (e: 'set-active', id: string): void
  (e: 'update-child-order', payload: { groupId: number; items: typeof props.game.items }): void
}>()

// Локальная копия элементов для сортировки
const localItems = ref([...props.game.items])
const draggedChildIndex = ref<number | null>(null)
const draggedGroupId = ref<number | null>(null)

watch(() => props.game.items, (newItems) => {
  localItems.value = [...newItems] // обновляем локальные элементы, если они изменяются
})

// --- drag and drop для вложенных элементов ---
function onChildDragStart(index: number, event: DragEvent) {
  draggedChildIndex.value = index
  draggedGroupId.value = props.game.id
  event.dataTransfer?.setData('text/plain', String(index))
}

function onChildDragOver(event: DragEvent) {
  event.preventDefault()
}

function onChildDrop(dropIndex: number, event: DragEvent) {
  event.preventDefault()

  if (
    draggedChildIndex.value === null ||
    draggedGroupId.value !== props.game.id ||
    draggedChildIndex.value === dropIndex
  ) {
    return
  }

  // Сортируем элементы
  const updated = [...localItems.value]
  const [movedItem] = updated.splice(draggedChildIndex.value, 1)
  updated.splice(dropIndex, 0, movedItem)

  localItems.value = updated // обновляем локальную копию

  // Отправляем обновленные данные родителю
  emit('update-child-order', { groupId: props.game.id, items: updated })

  draggedChildIndex.value = null
  draggedGroupId.value = null
}

function onChildDragEnd() {
  draggedChildIndex.value = null
  draggedGroupId.value = null
}

// --- Взаимодействие с меню ---
function toggleDropdown() {
  emit('toggle', props.game.id)
}

function setActiveMenu(id: string) {
  emit('set-active', id)
}
</script>
