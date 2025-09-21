import { defineStore } from 'pinia'
import { Dark } from 'quasar'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: Dark.isActive
  }),

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      Dark.set(this.isDark)
      localStorage.setItem('darkMode', this.isDark)
    },

    initTheme() {
      const saved = localStorage.getItem('darkMode')
      if (saved !== null) {
        this.isDark = saved === 'true'
        Dark.set(this.isDark)
      }
    }
  }
})