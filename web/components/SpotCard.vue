<template>
  <div class="relative group glass-panel overflow-hidden transition-all duration-300"
       :class="{
         'glass-panel-hover': canAccess,
         'opacity-50 grayscale pointer-events-none': !canAccess
       }">
    
    <!-- Premium Overlay / Blur -->
    <div v-if="!canAccess" class="absolute inset-0 z-20 backdrop-blur-sm flex flex-col items-center justify-center bg-obsidian/40 pointer-events-auto">
      <Icon name="ph:lock-key-bold" class="w-8 h-8 text-white/50 mb-2" />
      <span class="font-mono text-sm text-white/80 font-bold mb-2">PRO REQUIRED</span>
      <NuxtLink to="/profile" class="px-4 py-1 bg-neon text-obsidian text-xs font-bold rounded-full hover:bg-white transition-colors">
        UPGRADE
      </NuxtLink>
    </div>

    <div class="p-6 relative z-10">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-bold uppercase tracking-tight">{{ spot.title }}</h3>
          <p class="text-neon/80 font-mono text-xs">{{ spot.quartier }}</p>
        </div>
        <div class="text-right">
          <div class="font-mono font-bold text-lg">{{ spot.pricePerHour }} CHF</div>
          <div class="text-[10px] text-white/40">per hr</div>
        </div>
      </div>

      <p class="text-sm text-white/60 mb-6 h-10 line-clamp-2">
        {{ spot.description }}
      </p>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <!-- B2B Elite Badge -->
          <div v-if="isElite" class="relative group/badge">
            <div class="absolute inset-0 bg-yellow-500/20 blur-sm rounded-full animate-pulse"></div>
            <div class="relative w-6 h-6 rounded-full border border-yellow-500 flex items-center justify-center bg-obsidian text-yellow-500">
              <Icon name="ph:star-fill" class="w-3 h-3" />
            </div>
          </div>
          <span v-if="spot.premium" class="px-2 py-0.5 border border-neon text-neon text-[10px] font-mono rounded">PREMIUM</span>
        </div>

        <button @click="$emit('book', spot)" class="px-4 py-2 bg-white/5 hover:bg-neon hover:text-obsidian border border-white/10 hover:border-neon transition-all font-mono text-xs font-bold rounded">
          BUCHE
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import type { Spot } from '~/composables/useSpots'

const props = defineProps<{
  spot: Spot,
  isElite: boolean
}>()

defineEmits(['book'])

const { currentUser } = useAuth()

const canAccess = computed(() => {
  if (!props.spot.premium) return true
  if (!currentUser.value) return false
  
  const sub = currentUser.value.subscription
  const role = currentUser.value.role
  
  // Explicitly check for PRO, ULTRA or ADMIN status
  return ['PRO', 'ULTRA'].includes(sub) || role === 'ADMIN'
})
</script>
