<template>
  <div class="scroll-container">
    <ul class="appeal-lists">
      <li v-for="(item, index) in items" :key="item.id" :draggable="activeDropdownId !== item.id"
        @dragstart="onDragStart(index, $event)" @dragover="onDragOver($event)" @drop="onDrop(index, $event)"
        @dragend="onDragEnd">
        <ListItem :game="mapGame(item)" :is-open="activeDropdownId === item.id"
          :active-action-menu-id="activeActionMenuId" @toggle="toggleDropdown" @set-active="setActiveMenu"
          @update-child-order="handleUpdateChildOrder"   @child-drag-start="isChildDragging = true"
          @child-drag-end="isChildDragging = false" />
      </li>
      <li v-if="items.length === 0">No items available</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ListItem from '@/components/ListItem.vue'
import { useAppealStore } from '@/stores/appeals'

// Типы
interface Item {
  id: number
  title: string
  order: number
  children: Item[]
}

const appealStore = useAppealStore()

const activeDropdownId = ref<number | null>(null)
const activeActionMenuId = ref<string | null>(null)
const items = computed(() => appealStore.items)
const isChildDragging = ref(false)
let dragStartIndex: number | null = null

// Маппер данных из стора к ListItem
function mapGame(item: Item) {
  return {
    id: item.id,
    name: item.title,
    order: item.order,
    items: item.children.map(child => ({
      id: child.id,
      name: child.title,
      order: child.order,
    })),
  }
}

// Обновление дочерних элементов в сторе
function handleUpdateChildOrder({ groupId, items }: { groupId: number; items: { id: number; name: string; order: number }[] }) {
  appealStore.updateChildItems(groupId, items)
}

// Открытие/закрытие dropdown
function toggleDropdown(id: number) {
  activeDropdownId.value = activeDropdownId.value === id ? null : id
}

function setActiveMenu(id: string) {
  activeActionMenuId.value = activeActionMenuId.value === id ? null : id
}

// Загрузка данных при монтировании
onMounted(async () => {
  await appealStore.fetchAppeals(appealStore.page)
})

// Drag & Drop групп
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

  const updated = [...items.value]
  const [moved] = updated.splice(dragStartIndex, 1)
  updated.splice(index, 0, moved)

  appealStore.updateItems(updated)
  dragStartIndex = null
}

function onDragEnd(event: DragEvent) {
  dragStartIndex = null
  const el = event.target as HTMLElement
  el.classList.remove('dragging')
}
</script>

