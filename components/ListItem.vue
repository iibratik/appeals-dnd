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
          {{ game.title }}
        </span>
      </div>

      <div class="list__item">
        <span class="list__upper-title">Order</span>
        <span class="list__title">{{ game.order }}</span>
      </div>

      <div class="list__item">
        <span class="list__upper-title">Sub categories</span>
        <span class="list__title">
          {{game.children.map(item => item.title).join(' / ')}}
        </span>
      </div>

      <div class="list-actions-content">
        <div class="list__item-count">
          <span>{{ game.children.length }}</span>
        </div>

        <button class="btn drop-down-btn list-action" @click="toggleDropdown">
          <img v-if="isOpen" src="@/assets/icons/up-icon.svg" alt="up icon">
          <img v-else src="@/assets/icons/down-icon.svg" alt="down icon">
        </button>

        <ActionsBtns :id="`game-${game.id}`" :active-menu-id="activeActionMenuId" @set-active="setActiveMenu" />
      </div>
    </div>

    <!-- DROPDOWN -->
    <Transition name="fade-slide">
      <ul v-if="isOpen" class="appeal-lists__dropdown">
        <li
v-for="(item, index) in localItems" :key="item.id" class="appeal-list__dropdown" :draggable="true"
          @dragstart="onChildDragStart(index, $event)" @dragover="onChildDragOver" @drop="onChildDrop(index, $event)"
          @dragend="onChildDragEnd">
          <div class="list__item">
            <span class="list__upper-title">№</span>
            <span class="list__title">{{ game.id }}.{{ item.id }}</span>
          </div>

          <div class="list__item">
            <span class="list__upper-title">Name</span>
            <span class="list__title">
              <img src="@/assets/icons/folder.svg" alt="folder-icon">
              {{ item.title }}
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
import { ref, watch } from 'vue'

const props = defineProps<{
  game: {
    id: number
    title: string
    order: number
    children: Array<{ id: number; title: string; order: number }>
  }
  isOpen: boolean
  activeActionMenuId: string | null
}>()

const emit = defineEmits<{
  (e: 'toggle', id: number): void
  (e: 'set-active', id: string): void
  (e: 'update-child-order', payload: { groupId: number; items: typeof props.game.children }): void
  (e: 'child-drag-start' | 'child-drag-end'): void
}>()

const localItems = ref([...props.game.children])
const draggedChildIndex = ref<number | null>(null)

watch(() => props.game.children, (newItems) => {
  localItems.value = [...newItems]
})

function onChildDragStart(index: number, event: DragEvent) {
  event.stopPropagation()
  draggedChildIndex.value = index
  event.dataTransfer?.setData('text/plain', String(index))
  event.dataTransfer!.effectAllowed = 'move'
  emit('child-drag-start')
}


function onChildDragOver(event: DragEvent) {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
}

function onChildDrop(dropIndex: number, event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()

  const from = draggedChildIndex.value
  if (from === null || from === dropIndex) return

  const updated = [...localItems.value]
  const [moved] = updated.splice(from, 1)
  updated.splice(dropIndex, 0, moved)

  localItems.value = updated
  draggedChildIndex.value = null

  emit('update-child-order', {
    groupId: props.game.id,
    items: updated,
  })
  emit('child-drag-end')
}

function onChildDragEnd(event: DragEvent) {
  event.stopPropagation()
  draggedChildIndex.value = null
  emit('child-drag-end')
}

function toggleDropdown() {
  emit('toggle', props.game.id)
}
function setActiveMenu(id: string) {
  emit('set-active', id)
}
</script>
