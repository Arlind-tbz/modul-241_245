<template>
  <ClientOnly>
    <div v-if="currentUser" class="fixed top-6 right-6 z-[60] flex items-center gap-4">
      <div class="glass-panel px-4 py-2 flex items-center gap-3 border-neon/30">
        <div class="relative">
          <div class="w-2 h-2 bg-neon rounded-full animate-pulse shadow-[0_0_8px_#00ff88]"></div>
        </div>
        <div class="font-mono text-[10px] uppercase leading-none">
          <div class="text-white/40 mb-1">CONNECTED_USER</div>
          <div class="text-white font-bold flex items-center gap-2">
            {{ currentUser.name }} 
            <span class="px-1.5 py-0.5 bg-neon/10 text-neon border border-neon/20 rounded text-[8px]">{{ currentUser.subscription }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="currentUser.role === 'ADMIN'" class="w-8 h-8 rounded-full border border-neon/30 flex items-center justify-center bg-surface text-neon animate-pulse">
        <Icon name="ph:shield-check-bold" class="w-4 h-4" />
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { currentUser } = useAuth()
</script>
