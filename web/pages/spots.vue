<template>
  <div class="min-h-screen pt-24 pb-32 px-6 max-w-7xl mx-auto relative">
    
    <!-- Command Palette Search -->
    <div class="mb-12 relative max-w-2xl mx-auto z-20" ref="searchContainer">
      <div class="glass-panel p-2 flex items-center gap-3 relative focus-within:shadow-glow focus-within:border-neon/50 transition-all">
        <Icon name="ph:magnifying-glass-bold" class="w-6 h-6 text-white/50 ml-3" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search Quartier or Spot..."
          class="w-full bg-transparent border-none outline-none text-lg font-mono placeholder:text-white/30 text-white py-3"
        />
        <div v-if="searchQuery" @click="searchQuery = ''" class="cursor-pointer mr-3 text-white/50 hover:text-neon">
          <Icon name="ph:x-bold" class="w-5 h-5" />
        </div>
      </div>
    </div>

    <ClientOnly>
      <!-- Map visualizer -->
      <div class="mb-12">
        <ZurichMap :spots="filteredSpots" @select-spot="openBookingModal" />
      </div>

      <!-- Spots Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref="spotsGrid">
        <SpotCard 
          v-for="spot in displayedSpots" 
          :key="spot.id" 
          :spot="spot"
          :is-elite="b2bEliteVermieter.includes(spot.ownerId)"
          @book="openBookingModal"
          class="spot-item"
        />
      </div>
    </ClientOnly>

    <BookingModal 
      v-if="selectedSpot" 
      :spot="selectedSpot" 
      @close="selectedSpot = null" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSpots, type Spot } from '~/composables/useSpots'
import gsap from 'gsap'

const { spots, b2bEliteVermieter } = useSpots()
const searchQuery = ref('')
const searchContainer = ref(null)
const spotsGrid = ref(null)

const selectedSpot = ref<Spot | null>(null)

const filteredSpots = computed(() => {
  if (!searchQuery.value) return spots.value
  const q = searchQuery.value.toLowerCase()
  return spots.value.filter(s => 
    s.quartier.toLowerCase().includes(q) || 
    s.title.toLowerCase().includes(q)
  )
})

// Performance: Only render first 50 cards, but show all on map
const displayedSpots = computed(() => filteredSpots.value.slice(0, 50))

const openBookingModal = (spot: Spot) => {
  selectedSpot.value = spot
}

onMounted(() => {
  gsap.from(searchContainer.value, {
    y: -30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    clearProps: 'all'
  })

  // Stagger grid items - Wait for ClientOnly hydration
  setTimeout(() => {
    gsap.from('.spot-item', {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05, // Faster stagger
      ease: 'power2.out',
      clearProps: 'all'
    })
  }, 200)
})
</script>
