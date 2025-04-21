export function useDragDrop() {
    const dragged = ref<number | null>(null)

    function onDragStart(id: number) {
      dragged.value = id
    }

    function onDrop(targetList: unknown[], id: number) {
      if (dragged.value === null || dragged.value === id) return

    }

    return { dragged, onDragStart, onDrop }
  }