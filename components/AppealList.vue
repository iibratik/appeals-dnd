<template>
  <div class="scroll-container">
    <ul class="appeal-lists">
      <li v-for="(item, index) in items" :key="item.id" :draggable="activeDropdownId !== item.id"
        @dragstart="onDragStart(index, $event)" @dragover="onDragOver($event)" @drop="onDrop(index, $event)"
        @dragend="onDragEnd">
        <list-item @update-child-order="handleUpdateChildOrder" :active-action-menu-id="activeActionMenuId"
          :game="mapGame(item)" :is-open="activeDropdownId === item.id" @toggle="toggleDropdown"
          @set-active="setActiveMenu" />
      </li>
      <li v-if="items.length === 0">No items available</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import ListItem from '@/components/ListItem.vue'
import { useAppealStore } from '@/stores/appeals'

// Типы для данных
interface Item {
  id: number
  title: string
  order: number
  children: Item[]
}

// Типизация для игры (Game)
interface Game {
  id: number
  title: string
  order: number
  children: Item[]
}

// Подключаем Pinia Store
const appealStore = useAppealStore()

// Данные для активного dropdown и меню
const activeDropdownId = ref<number | null>(null)
const activeActionMenuId = ref<string | null>(null)

// Получаем текущие данные из стора с явной типизацией
const items = computed(() => appealStore.items)

let dragStartIndex: number | null = null

// Функция для преобразования данных
function mapGame(item: Game) {
  return {
    id: item.id,
    name: item.title, // Используем title вместо name
    order: item.order,
    items: item.children.map((child) => ({
      id: child.id,
      name: child.title, // Используем title вместо name
      order: child.order,
    })),
  }
}

// Функция для переключения dropdown
function toggleDropdown(id: number) {
  activeDropdownId.value = activeDropdownId.value === id ? null : id
}

// Функция для установки активного меню
function setActiveMenu(id: string) {
  activeActionMenuId.value = activeActionMenuId.value === id ? null : id
}

// Загружаем данные при монтировании компонента
onMounted(async () => {
  // Загружаем данные для текущей страницы
  await appealStore.fetchAppeals(appealStore.page)
})

// Обработчик начала перетаскивания
function onDragStart(index: number, event: DragEvent) {
  // Если меню открыто — блокируем перетаскивание
  if (activeDropdownId.value !== null) {
    event.preventDefault()
    return
  }

  dragStartIndex = index
  event.dataTransfer?.setData('text/plain', String(index))

  const target = event.target as HTMLElement
  target.classList.add('dragging')
}

function onDragOver(event: DragEvent) {
  event.preventDefault()

  const container = document.querySelector('.scroll-container') as HTMLElement
  const rect = container.getBoundingClientRect()
  const offset = 50 // Порог от краев
  const scrollSpeed = 10 // Скорость прокрутки

  if (event.clientY < rect.top + offset) {
    container.scrollTop -= scrollSpeed
  } else if (event.clientY > rect.bottom - offset) {
    container.scrollTop += scrollSpeed
  }
}

// Обработчик окончания перетаскивания
function onDrop(index: number, event: DragEvent) {
  event.preventDefault()

  if (dragStartIndex === null || dragStartIndex === index) return

  const draggedItem = items.value[dragStartIndex]
  // Перемещаем элемент в новый индекс
  const updatedItems = [...items.value]
  updatedItems.splice(dragStartIndex, 1)
  updatedItems.splice(index, 0, draggedItem)

  // Обновляем данные
  appealStore.updateItems(updatedItems)
  dragStartIndex = null
}
function onDragEnd(event: DragEvent) {
  dragStartIndex = null

  const target = event.target as HTMLElement
  target.classList.remove('dragging')
}
</script>

<style scoped></style>
