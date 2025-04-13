import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Item {
    id: number
    name: string
    order: number
}

interface Game {
    id: number
    name: string
    order: number
    items: Item[]
}

export const useAppealStore = defineStore('appeal', () => {
    // Состояния
    const items = ref<Game[]>([]) // Типизируем как массив объектов Game
    const page = ref(1)
    const perPage = ref(10)
    const totalItems = ref(100)  // Здесь предполагается, что общее количество элементов будет приходить из API

    // Функция для загрузки данных
    const fetchAppeals = async (_pageNum: number = page.value) => {
        try {
          const response = await fetch(`http://localhost:3000/api/appeals?page=${_pageNum}`);
          if (response.ok) {
            const data = await response.json();
            if (data.items && Array.isArray(data.items)) {
              items.value = data.items;
            } else {
              items.value = [];  // Если данных нет или они некорректны, обнуляем
            }
            totalItems.value = data.total || 100;
          } else {
            console.error('Error fetching appeals:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching appeals:', error);
          items.value = [];
          totalItems.value = 0;
        }
    }

    // Вычисляемое свойство для отображения диапазона элементов
    const showingRange = computed(() => {
        const start = (page.value - 1) * perPage.value + 1
        const end = Math.min(page.value * perPage.value, totalItems.value)
        return `${start} - ${end} of ${totalItems.value}`
    })

    // Вычисляемое свойство для подсчета общего числа страниц
    const totalPages = computed(() => Math.ceil(totalItems.value / perPage.value))

    // Возвращаем все состояния и методы для использования в компоненте
    return {
        items,
        page,
        perPage,
        totalItems,
        showingRange,
        totalPages,
        fetchAppeals
    }
})
