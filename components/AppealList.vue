<template>
  <ul class="appeal-lists">
    <!-- Проверка наличия данных перед рендером -->
    <li v-for="item in items" :key="item.id">
      <list-item
        :active-action-menu-id="activeActionMenuId"
        :game="mapGame(item)"
        :is-open="activeDropdownId === item.id"
        @toggle="toggleDropdown"
        @set-active="setActiveMenu"
      />
    </li>
    <!-- Сообщение, если нет элементов -->
    <li v-if="items.length === 0">No items available</li>
  </ul>
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
</script>
