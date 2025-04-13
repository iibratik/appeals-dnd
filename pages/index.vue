<template>
  <section class="list games-list">
    <div class="list-content container">
      <div class="list__header">
        <div class="header__title">
          <h2 class="title list__title">Games List</h2>
          <button class="btn primary-btn">Found: {{ foundedItems }}</button>
        </div>
        <control-btns />
      </div>
      <div class="list__body">
        <appeal-list />
      </div>
      <div class="list-footer">
        <span class="footer-title">Showing 10 of 100</span>
        <div class="footer-pagination">
          <button class="pagination-btn prev-pagination" @click="changePage(currentPage - 1)">
            <img src="@/assets/icons/left-btn-icon.svg" alt="prev icon">
          </button>
          <div class="footer-pagination-items">
            <div v-for="item in paginationPages" :key="item" :class="currentPage == item ? 'active' : null"
              class="footer-pagination-item" @click="changePage(item)">
              {{ item === '...' ? '...' : item }}
            </div>
          </div>
          <button class="pagination-btn next-pagination" @click="changePage(currentPage + 1)">
            <img src="@/assets/icons/left-btn-icon.svg" alt="next icon">
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'


const pageCount = 10;
const currentPage = ref(1);
const foundedItems: number = 4;

const paginationPages = computed(() => {
  const pages: (number | string)[] = [];

  if (pageCount <= 7) {
    // если страниц мало — просто все показать
    for (let i = 1; i <= pageCount; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage.value > 4) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage.value);
    const end = Math.min(currentPage.value + 2, pageCount - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < pageCount - 1) {
      pages.push('...');
    }

    pages.push(pageCount);
  }

  return pages;
});

// Функция для изменения текущей страницы
function changePage(page: number | string) {
  if (page === '...') {
    return; // не делаем ничего, если это '...'
  }

  if (typeof page === 'number') {
    if (page >= 1 && page <= pageCount) {
      currentPage.value = page;
    }
  }
}
</script>
