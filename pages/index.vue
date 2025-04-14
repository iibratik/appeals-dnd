<template>
  <section class="list games-list">
    <div class="list-content container">
      <div class="list__header">
        <div class="header__title">
          <h2 class="title list__title">Games List</h2>
          <button class="btn primary-btn">Found: {{ appealStore.totalItems }}</button>
        </div>
        <control-btns
          @next-step="redoStep"
          @prev-step="undoStep"
          :isNextStepActive="canRedo"
          :isPrevStepActive="canUndo"
        />
      </div>

      <div class="list__body">
        <appeal-list />
      </div>

      <div class="list-footer">
        <span class="footer-title">Showing {{ appealStore.showingRange }}</span>
        <div class="footer-pagination">
          <button class="pagination-btn prev-pagination" @click="changePage(appealStore.page - 1)"
            :disabled="appealStore.page <= 1">
            <img src="@/assets/icons/left-btn-icon.svg" alt="prev icon" />
          </button>
          <div class="footer-pagination-items">
            <div
              v-for="item in paginationPages"
              :key="item"
              :class="appealStore.page === item ? 'active' : null"
              class="footer-pagination-item"
              @click="changePage(item)"
            >
              {{ item === '...' ? '...' : item }}
            </div>
          </div>
          <button class="pagination-btn next-pagination" @click="changePage(appealStore.page + 1)"
            :disabled="appealStore.page >= appealStore.totalPages">
            <img src="@/assets/icons/left-btn-icon.svg" alt="next icon" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppealStore } from '@/stores/appeals'
import { useHistoryStore } from '@/stores/useHistoryStore'

const appealStore = useAppealStore()
const historyStore = useHistoryStore()


onMounted(async () => {
  await appealStore.fetchAppeals()

  historyStore.loadFromStorage()


  if (historyStore.currentItems.length > 0) {
    appealStore.updateItems(historyStore.currentItems)
  }
})

function undoStep() {
  historyStore.undo()
  appealStore.updateItems(historyStore.currentItems)
}

function redoStep() {
  historyStore.redo()
  appealStore.updateItems(historyStore.currentItems)
}

const canUndo = computed(() => historyStore.past.length > 1)
const canRedo = computed(() => historyStore.future.length > 0)


const paginationPages = computed(() => {
  const pageCount = appealStore.totalPages
  const current = appealStore.page
  const pages: (number | string)[] = []

  if (pageCount <= 7) {
    for (let i = 1; i <= pageCount; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (current > 4) pages.push('...')

    const start = Math.max(2, current)
    const end = Math.min(current + 2, pageCount - 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < pageCount - 1) pages.push('...')

    pages.push(pageCount)
  }

  return pages
})

function changePage(page: number | string) {
  if (page === '...') return

  const pageNumber = Number(page)
  if (pageNumber >= 1 && pageNumber <= appealStore.totalPages) {
    appealStore.page = pageNumber
    appealStore.fetchAppeals(pageNumber)
  }
}
</script>