<template>
  <nav class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
    <ClientOnly>
      <div class="glass-panel px-6 py-4 flex items-center gap-8 shadow-2xl">
        <NuxtLink to="/" class="nav-item group" active-class="active">
          <Icon name="ph:house-bold" class="w-6 h-6 text-white/50 group-hover:text-neon transition-colors" />
          <span class="sr-only">Home</span>
        </NuxtLink>
        
        <NuxtLink to="/spots" class="nav-item group" active-class="active">
          <Icon name="ph:map-pin-bold" class="w-6 h-6 text-white/50 group-hover:text-neon transition-colors" />
          <span class="sr-only">Spots</span>
        </NuxtLink>

        <!-- Center Action Button (e.g. Command Palette Trigger) -->
        <button @click="toggleSearch" class="nav-item group relative">
          <div class="absolute inset-0 bg-neon/20 rounded-full blur-md group-hover:bg-neon/40 transition-all"></div>
          <div class="relative bg-obsidian border border-neon text-neon w-12 h-12 flex items-center justify-center rounded-full">
            <Icon name="ph:magnifying-glass-bold" class="w-6 h-6" />
          </div>
        </button>
        <NuxtLink v-if="currentUser?.role === 'ADMIN'" to="/admin" class="nav-item group" active-class="active">
          <Icon name="ph:terminal-window-bold" class="w-6 h-6 text-white/50 group-hover:text-neon transition-colors" />
          <span class="sr-only">Admin</span>
        </NuxtLink>

        <NuxtLink v-if="currentUser?.role === 'VERMIETER' || currentUser?.role === 'ADMIN'" to="/manage" class="nav-item group" active-class="active">
          <Icon name="ph:layout-bold" class="w-6 h-6 text-white/50 group-hover:text-neon transition-colors" />
          <span class="sr-only">Manage</span>
        </NuxtLink>

        <NuxtLink v-if="currentUser" to="/profile" class="nav-item group" active-class="active">          <Icon name="ph:user-bold" class="w-6 h-6 text-white/50 group-hover:text-neon transition-colors" />
          <span class="sr-only">Profile</span>
        </NuxtLink>

        <NuxtLink v-else to="/login" class="nav-item group" active-class="active">
          <Icon name="ph:sign-in-bold" class="w-6 h-6 text-white/50 group-hover:text-neon transition-colors" />
          <span class="sr-only">Login</span>
        </NuxtLink>
      </div>
    </ClientOnly>
  </nav>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useUI } from '~/composables/useUI'

const { currentUser } = useAuth()
const { toggleSearch } = useUI()
</script>

<style scoped>
.nav-item {
  @apply relative flex items-center justify-center transition-all duration-300 transform hover:scale-110;
}
.nav-item.active svg {
  @apply text-neon;
  filter: drop-shadow(0 0 8px rgba(0, 255, 136, 0.8));
}
</style>
