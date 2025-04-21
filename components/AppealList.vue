<template>
  <div class="scroll-container">
    <ul class="appeal-lists">
      <li
v-for="(game, index) in games" :key="game.id" :draggable="activeDropdownId !== game.id"
        @dragstart="onDragStart(index, $event)" @dragover="onDragOver($event)" @drop="onDrop(index, $event)"
        @dragend="onDragEnd">
        <ListItem
:game="game" :is-open="activeDropdownId === game.id" :active-action-menu-id="activeActionMenuId"
          @toggle="toggleDropdown" @set-active="setActiveMenu" @update-child-order="handleUpdateChildOrder"
          @child-drag-start="isChildDragging = true" @child-drag-end="isChildDragging = false" />
      </li>
      <li v-if="games.length === 0">No items available</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, } from 'vue'
import ListItem from '@/components/ListItem.vue'
import { useAppealStore } from '@/stores/appeals'
import { useHistoryStore } from '@/stores/useHistoryStore'



// Stores
const appealStore = useAppealStore()
const historyStore = useHistoryStore()

// local States
const activeDropdownId = ref<number | null>(null)
const activeActionMenuId = ref<string | null>(null)
const games = computed(() => appealStore.items)
const isChildDragging = ref(false)
let dragStartIndex: number | null = null



function handleUpdateChildOrder({
  groupId,
  items,
}: {
  groupId: number
  items: { id: number; title: string; order: number }[]
}) {
  // Clone current data
  const updated = appealStore.items.map((group) => {
    if (group.id === groupId) {
      return {
        ...group,
        children: items.map((item) => ({
          id: item.id,
          title: item.title,
          order: item.order,
        })),
      }
    }
    return group
  })

  appealStore.updateItems(updated)
  historyStore.setItems(updated)
}

// drag and drop controll
function toggleDropdown(id: number) {
  activeDropdownId.value = activeDropdownId.value === id ? null : id
}

function setActiveMenu(id: string) {
  activeActionMenuId.value = activeActionMenuId.value === id ? null : id
}

// Drag & Drop logic
function onDragStart(index: number, event: DragEvent) {
  if (activeDropdownId.value !== null || isChildDragging.value) {
    event.preventDefault()
    return
  }

  dragStartIndex = index
  event.dataTransfer?.setData('text/plain', String(index))
  const el = event.target as HTMLElement
  el.classList.add('dragging')
}

function onDragOver(event: DragEvent) {
  event.preventDefault()

  const container = document.querySelector('.scroll-container') as HTMLElement
  const rect = container.getBoundingClientRect()
  const offset = 50
  const speed = 10

  if (event.clientY < rect.top + offset) container.scrollTop -= speed
  else if (event.clientY > rect.bottom - offset) container.scrollTop += speed
}

function onDrop(index: number, event: DragEvent) {
  event.preventDefault()
  if (dragStartIndex === null || dragStartIndex === index) return

  const updated = [...games.value]
  const [moved] = updated.splice(dragStartIndex, 1)
  updated.splice(index, 0, moved)

  // Save states
  appealStore.updateItems(updated)
  historyStore.setItems(updated)
  dragStartIndex = null
}

function onDragEnd(event: DragEvent) {
  dragStartIndex = null
  const el = event.target as HTMLElement
  el.classList.remove('dragging')
}

// Load data
onMounted(async () => {
  historyStore.loadFromStorage()

  if (historyStore.currentItems.length > 0) {
    appealStore.updateItems(historyStore.currentItems)
  } else {
    await appealStore.fetchAppeals(appealStore.page)
    historyStore.setItems(appealStore.items)
  }
})
</script>
