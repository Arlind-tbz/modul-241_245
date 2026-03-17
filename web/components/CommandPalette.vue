<template>
  <div v-if="isSearchOpen" class="fixed inset-0 z-[1000] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div ref="backdrop" class="absolute inset-0 bg-obsidian/95 backdrop-blur-md" @click="closeSearch"></div>

    <!-- Palette Content -->
    <div ref="palette" class="glass-panel w-full max-w-2xl p-6 relative z-10 border-neon/30 shadow-[0_0_50px_rgba(0,255,136,0.2)]">
      <div class="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
        <Icon name="ph:magnifying-glass-bold" class="w-6 h-6 text-neon animate-pulse" />
        <input 
          ref="searchInput"
          v-model="searchQuery" 
          type="text" 
          placeholder="SEARCH_THE_NETWORK..."
          class="w-full bg-transparent border-none outline-none text-xl font-mono text-white placeholder:text-white/20 uppercase"
          @keydown.esc="closeSearch"
        />
        <div class="flex items-center gap-2">
          <span class="px-2 py-1 bg-white/5 border border-white/10 text-[10px] text-white/40 font-mono rounded">ESC</span>
        </div>
      </div>

      <!-- Results -->
      <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
        <div v-if="filteredResults.length > 0" class="space-y-2">
          <div 
            v-for="spot in filteredResults" 
            :key="spot.id"
            @click="selectSpot(spot)"
            class="group p-4 glass-panel border-transparent hover:border-neon/30 hover:bg-neon/5 cursor-pointer transition-all flex justify-between items-center"
          >
            <div>
              <div class="text-white font-bold uppercase tracking-tight group-hover:text-neon transition-colors">{{ spot.title }}</div>
              <div class="text-[10px] font-mono text-white/40 uppercase">{{ spot.quartier }} • {{ spot.pricePerHour }} CHF/h</div>
            </div>
            <Icon name="ph:caret-right-bold" class="w-5 h-5 text-white/20 group-hover:text-neon group-hover:translate-x-1 transition-all" />
          </div>
        </div>
        <div v-else-if="searchQuery" class="py-12 text-center">
          <div class="text-white/20 font-mono text-sm">NO_MATCHES_FOUND_IN_SECTOR</div>
        </div>
        <div v-else class="py-8">
           <div class="text-[10px] font-mono text-white/20 uppercase mb-4">SUGGESTED_SECTORS</div>
           <div class="flex flex-wrap gap-2">
             <button v-for="q in ['Langstrasse', 'Seefeld', 'Kreis 5', 'Altstadt']" :key="q" 
                     @click="searchQuery = q"
                     class="px-3 py-1 bg-white/5 hover:bg-neon/10 border border-white/10 hover:border-neon/30 rounded text-xs font-mono transition-all">
               #{{ q }}
             </button>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUI } from '~/composables/useUI'
import { useSpots, type Spot } from '~/composables/useSpots'
import gsap from 'gsap'

const { isSearchOpen, closeSearch } = useUI()
const { spots } = useSpots()
const router = useRouter()

const searchQuery = ref('')
const backdrop = ref(null)
const palette = ref(null)
const searchInput = ref<HTMLInputElement | null>(null)

const filteredResults = computed(() => {
  if (!searchQuery.value) return []
  const q = searchQuery.value.toLowerCase()
  return spots.value.filter(s => 
    s.title.toLowerCase().includes(q) || 
    s.quartier.toLowerCase().includes(q)
  ).slice(0, 10)
})

const selectSpot = (spot: Spot) => {
  closeSearch()
  router.push('/spots')
}

watch(isSearchOpen, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      searchInput.value?.focus()
      
      gsap.from(backdrop.value, { opacity: 0, duration: 0.4 })
      gsap.from(palette.value, {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: 'power4.out'
      })
    }, 0)
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #00ff88;
  border-radius: 10px;
}
</style>
