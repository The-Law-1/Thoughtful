import { defineStore } from 'pinia'

export const useNavbarStore = defineStore('navbar', {
  state: () => {
    return { sidebarOpen: false }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    toggleSidebar() {
        this.$state.sidebarOpen = !this.$state.sidebarOpen
    },
  },
})