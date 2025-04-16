<template>
  <div class="scroll-container">
    <ul class="appeal-lists">
      <li
v-for="(game, index) in games" :key="game.id" :class="{ dragging: dragStartIndex === index }"
        :draggable="!isChildDragging && activeDropdownId !== game.id" @dragstart="onDragStart(index, $event)"
        @dragover="onDragOver($event)" @drop="onDrop(index, $event)" @dragend="onDragEnd">
        <ListItem
:game="mapGame(game)" :is-open="activeDropdownId === game.id"
          :active-action-menu-id="activeActionMenuId" @toggle="toggleDropdown" @set-active="setActiveMenu"
          @update-child-order="handleUpdateChildOrder" @child-drag-start="isChildDragging = true"
          @child-drag-end="isChildDragging = false" />
      </li>
      <li v-if="games.length === 0">No items available</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ListItem from '@/components/ListItem.vue'
import { useAppealStore } from '@/stores/appeals'
import { useHistoryStore } from '@/stores/useHistoryStore'

interface Item {
  id: number
  name: string
  order: number
  items: {
    id: number
    name: string
    order: number
  }[]
}

const appealStore = useAppealStore()
const historyStore = useHistoryStore()

const activeDropdownId = ref<number | null>(null)
const activeActionMenuId = ref<string | null>(null)
const isChildDragging = ref(false)
const dragStartIndex = ref<number | null>(null)

const games = computed(() => appealStore.items)

function mapGame(item: Item) {
  return {
    id: item.id,
    name: item.name,
    order: item.order,
    items: item.items.map((child) => ({
      id: child.id,
      name: child.name,
      order: child.order,
    })),
  }
}

function toggleDropdown(id: number) {
  activeDropdownId.value = activeDropdownId.value === id ? null : id
}

function setActiveMenu(id: string) {
  activeActionMenuId.value = activeActionMenuId.value === id ? null : id
}

function handleUpdateChildOrder({
  groupId,
  items,
}: {
  groupId: number
  items: { id: number; name: string; order: number }[]
}) {
  const updated = appealStore.items.map((group) => {
    if (group.id === groupId) {
      return {
        ...group,
        children: items.map((item, idx) => ({
          id: item.id,
          title: item.name,
          order: idx + 1,
        })),
      }
    }
    return group
  })

  appealStore.updateItems(updated)
  historyStore.setItems(updated)
}

function onDragStart(index: number, event: DragEvent) {
  if (activeDropdownId.value !== null || isChildDragging.value) {
    event.preventDefault()
    return
  }

  dragStartIndex.value = index
  event.dataTransfer?.setData('text/plain', String(index))
  event.dataTransfer!.effectAllowed = 'move'
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

  if (dragStartIndex.value === null || dragStartIndex.value === index) return

  const updated = [...games.value]
  const [moved] = updated.splice(dragStartIndex.value, 1)
  updated.splice(index, 0, moved)

  const normalized = updated.map((game, idx) => ({
    ...game,
    order: idx + 1,
  }))

  appealStore.updateItems(normalized)
  historyStore.setItems(normalized)
  dragStartIndex.value = null
}

function onDragEnd() {
  dragStartIndex.value = null
}

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
