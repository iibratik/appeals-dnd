export function useDragDrop() {
    const dragged = ref<number | null>(null)

    function onDragStart(id: number) {
      dragged.value = id
    }

    function onDrop(targetList: unknown[], id: number) {
      if (dragged.value === null || dragged.value === id) return
      // Реализация перемещения: извлечь элемент и вставить в нужное место
    }

    return { dragged, onDragStart, onDrop }
  }