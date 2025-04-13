<template>
  <ul class="appeal-lists">
    <li v-for="item in items" :key="item">
      <list-item :active-action-menu-id="activeActionMenuId" :game="item" :is-open="activeDropdownId === item.id"
        @toggle="toggleDropdown" @set-active="setActiveMenu" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ListItem from "@/components/ListItem.vue";
const items: Ref = ref([
  { id: 1, name: "DOTA2", items: [{ id: 1, name: 'Head', }, { id: 2, name: 'Weapon', }] },
  { id: 2, name: "CS2", items: [{ id: 1, name: 'Gloves', }, { id: 2, name: 'Heavy' }] },
]);
const activeDropdownId = ref<number | null>(null);
const activeActionMenuId = ref<string | null>(null);


function toggleDropdown(id: number) {
  activeDropdownId.value = activeDropdownId.value === id ? null : id;
}
function setActiveMenu(id: string) {
  activeActionMenuId.value = activeActionMenuId.value === id ? null : id;
}
</script>
