<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div 
      ref="backdrop"
      class="absolute inset-0 bg-obsidian/90 backdrop-blur-md"
      @click="$emit('close')"
    ></div>

    <!-- Modal Content -->
    <div 
      ref="modal"
      class="glass-panel w-full max-w-md p-8 relative z-10 border-neon/30 overflow-hidden"
    >
      <div class="absolute top-0 left-0 w-full h-1 bg-neon"></div>
      
      <button @click="$emit('close')" class="absolute top-4 right-4 text-white/50 hover:text-neon transition-colors">
        <Icon name="ph:x-bold" class="w-6 h-6" />
      </button>

      <h2 class="text-2xl font-black uppercase mb-1">{{ spot.title }}</h2>
      <p class="text-neon font-mono text-sm mb-8">{{ spot.quartier }}</p>

      <!-- Duration Slider -->
      <div class="mb-8">
        <label class="block font-mono text-xs text-white/50 mb-4">DAUER (MAX 4H)</label>
        <input 
          type="range" 
          v-model="duration" 
          min="1" 
          max="4" 
          step="1"
          class="w-full accent-neon bg-white/10 h-2 rounded-lg appearance-none cursor-pointer"
        />
        <div class="flex justify-between mt-2 font-mono text-xs text-white/40">
          <span>1h</span>
          <span>2h</span>
          <span>3h</span>
          <span>4h</span>
        </div>
      </div>

      <!-- Price Ticker -->
      <div class="flex items-end justify-between mb-8 pb-8 border-b border-white/10">
        <span class="font-mono text-sm text-white/50">TOTAL:</span>
        <div class="text-right">
          <div class="text-4xl font-black text-neon" ref="priceTicker">{{ totalPrice }}</div>
          <div class="font-mono text-[10px] text-white/40">CHF</div>
        </div>
      </div>

      <button 
        @click="confirmBooking"
        class="w-full py-4 bg-neon text-obsidian font-mono font-bold hover:bg-white transition-colors flex items-center justify-center gap-2 rounded"
      >
        <Icon name="ph:check-circle-bold" class="w-5 h-5" />
        BUCHUNG BESTÄTIGEN
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import gsap from 'gsap'
import type { Spot } from '~/composables/useSpots'

const props = defineProps<{ spot: Spot }>()
const emit = defineEmits(['close'])

const duration = ref(1)
const modal = ref(null)
const backdrop = ref(null)
const priceTicker = ref(null)

const totalPrice = computed(() => props.spot.pricePerHour * duration.value)

// Animate price change
watch(totalPrice, (newVal) => {
  if (priceTicker.value) {
    gsap.fromTo(priceTicker.value, 
      { scale: 1.2, color: '#ffffff' },
      { scale: 1, color: '#00ff88', duration: 0.3, ease: 'power2.out' }
    )
  }
})

const confirmBooking = () => {
  // Mock booking confirmation
  gsap.to(modal.value, {
    scale: 0.9,
    opacity: 0,
    y: 20,
    duration: 0.3,
    onComplete: () => {
      emit('close')
    }
  })
}

onMounted(() => {
  gsap.from(backdrop.value, { opacity: 0, duration: 0.4 })
  gsap.from(modal.value, {
    y: 100,
    opacity: 0,
    scale: 0.95,
    duration: 0.6,
    ease: 'back.out(1.2)'
  })
})
</script>

<style scoped>
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #00ff88;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0,255,136,0.5);
}
</style>
