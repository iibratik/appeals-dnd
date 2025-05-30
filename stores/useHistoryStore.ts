import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Game {
  id: number
  title: string
  order: number
  children: { id: number; title: string; order: number }[]
}

export const useHistoryStore = defineStore('history', () => {
  const past = ref<Game[][]>([])
  const future = ref<Game[][]>([])
  const currentItems = ref<Game[]>([])

  const MAX_HISTORY = 20

  function setItems(newItems: Game[]) {
    const cloned = JSON.parse(JSON.stringify(newItems))

    if (JSON.stringify(cloned) !== JSON.stringify(currentItems.value)) {
      if (past.value.length >= MAX_HISTORY) past.value.shift()
      past.value.push(JSON.parse(JSON.stringify(currentItems.value)))
      currentItems.value = cloned
      future.value = []
      saveToStorage()
    }
  }

  function undo() {
    if (past.value.length === 0) return
    future.value.unshift(JSON.parse(JSON.stringify(currentItems.value)))
    currentItems.value = past.value.pop()!
    saveToStorage()
  }

  function redo() {
    if (future.value.length === 0) return
    past.value.push(JSON.parse(JSON.stringify(currentItems.value)))
    currentItems.value = future.value.shift()!
    saveToStorage()
  }

  function saveToStorage() {
    localStorage.setItem('appeal-history', JSON.stringify({
      past: past.value,
      current: currentItems.value,
      future: future.value,
    }))
  }

  function loadFromStorage() {
    const data = localStorage.getItem('appeal-history')
    if (!data) return
    try {
      const parsed = JSON.parse(data)
      past.value = parsed.past || []
      currentItems.value = parsed.current || []
      future.value = parsed.future || []
    } catch (e) {
      console.error('Failed to parse appeal-history:', e)
    }
  }

  return {
    currentItems,
    past,
    future,
    setItems,
    undo,
    redo,
    loadFromStorage,
  }
})
