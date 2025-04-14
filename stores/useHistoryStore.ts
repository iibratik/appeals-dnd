// stores/useHistoryStore.ts
import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    history: [] as number[], // История страниц
    currentIndex: -1, // Текущий индекс в истории
  }),

  actions: {
    // Инициализация состояния из localStorage при старте
    initialize() {
      const savedHistory = localStorage.getItem('history')
      const savedIndex = localStorage.getItem('currentIndex')

      if (savedHistory && savedIndex) {
        this.history = JSON.parse(savedHistory)
        this.currentIndex = Number(savedIndex)
      }
    },

    // Добавляем новый шаг в историю
    addStep(page: number) {
      // Обрезаем историю, если текущий индекс меньше, чем длина истории
      if (this.currentIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.currentIndex + 1)
      }

      this.history.push(page)
      this.currentIndex++

      // Сохраняем состояние в localStorage
      this.saveState()
    },

    // Отменить (переход на предыдущую страницу)
    undo() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.saveState()
        return this.history[this.currentIndex]
      }
      return null
    },

    // Повторить (переход на следующую страницу)
    redo() {
      if (this.currentIndex < this.history.length - 1) {
        this.currentIndex++
        this.saveState()
        return this.history[this.currentIndex]
      }
      return null
    },

    // Получить текущую страницу из истории
    getCurrentPage() {
      return this.history[this.currentIndex] ?? null
    },

    // Сохранение состояния в localStorage
    saveState() {
      localStorage.setItem('history', JSON.stringify(this.history))
      localStorage.setItem('currentIndex', this.currentIndex.toString())
    },

    // Очистить историю
    resetHistory() {
      this.history = []
      this.currentIndex = -1
      this.saveState()
    },
  },
})
