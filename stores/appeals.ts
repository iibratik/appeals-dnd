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
  const items = ref<Game[]>([])
  const page = ref(1)
  const perPage = ref(10)
  const totalItems = ref(100)

  const LOCAL_STORAGE_KEY = 'appeal-items'


  const loadFromStorage = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          items.value = parsed
          return true
        }
      } catch (e) {
        console.error('Failed to parse localStorage appeal-items:', e)
      }
    }
    return false
  }


  const saveToStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items.value))
  }

  const fetchAppeals = async (_pageNum: number = page.value) => {
    const hasLocalData = loadFromStorage()
    if (hasLocalData) {
      console.log('Loaded appeals from localStorage.')
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/api/appeals?page=${_pageNum}`)
      if (response.ok) {
        const data = await response.json()
        if (data.items && Array.isArray(data.items)) {
          items.value = data.items
          saveToStorage()
        } else {
          items.value = []
        }
        totalItems.value = data.total || 100
      } else {
        console.error('Error fetching appeals:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching appeals:', error)
    }
  }

  const updateItems = (updatedItems: Game[]) => {
    items.value = updatedItems
    saveToStorage()
  }

  const updateChildItems = (groupId: number, updatedItems: Item[]) => {
    const group = items.value.find(item => item.id === groupId)
    if (group) {
      group.items = updatedItems
      saveToStorage()
    }
  }

  const showingRange = computed(() => {
    const start = (page.value - 1) * perPage.value + 1
    const end = Math.min(page.value * perPage.value, totalItems.value)
    return `${start} - ${end} of ${totalItems.value}`
  })

  const totalPages = computed(() => Math.ceil(totalItems.value / perPage.value))

  const nextPage = () => {
    if (page.value < totalPages.value) {
      page.value += 1
      fetchAppeals(page.value)
    }
  }

  const prevPage = () => {
    if (page.value > 1) {
      page.value -= 1
      fetchAppeals(page.value)
    }
  }

  return {
    items,
    page,
    perPage,
    totalItems,
    showingRange,
    totalPages,
    fetchAppeals,
    updateItems,
    updateChildItems,
    nextPage,
    prevPage,
    loadFromStorage
  }
})
