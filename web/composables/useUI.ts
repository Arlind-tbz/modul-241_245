import { ref } from 'vue'

const isSearchOpen = ref(false)

export const useUI = () => {
  const toggleSearch = () => {
    isSearchOpen.value = !isSearchOpen.value
  }

  const openSearch = () => {
    isSearchOpen.value = true
  }

  const closeSearch = () => {
    isSearchOpen.value = false
  }

  return {
    isSearchOpen,
    toggleSearch,
    openSearch,
    closeSearch
  }
}
