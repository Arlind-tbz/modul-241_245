<template>
  <div class="relative w-full h-[600px] glass-panel overflow-hidden border-white/5 group">
    <!-- Map Container -->
    <div ref="mapElement" class="absolute inset-0 z-0 bg-obsidian"></div>

    <!-- UI Overlays (Stay on top of Leaflet) -->
    <div class="absolute top-6 left-6 z-10 flex flex-col gap-2 pointer-events-none">
      <div class="glass-panel px-4 py-2 border-neon/30 flex items-center gap-3">
        <Icon name="ph:map-trifold-bold" class="text-neon" />
        <div class="font-mono text-[10px] uppercase">
          <div class="text-white/40">Network_Region</div>
          <div class="text-white font-bold">ZÜRICH_CH</div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-6 right-6 z-10 flex flex-col items-end gap-2 pointer-events-none">
      <div v-if="hoveredSpot" class="glass-panel p-4 border-neon/50 animate-glitch mb-4 pointer-events-auto max-w-xs backdrop-blur-xl">
        <div class="text-neon font-mono text-[10px] uppercase mb-1 flex justify-between">
           <span>SELECTED_NODE</span>
           <span v-if="hoveredSpot.premium" class="text-yellow-500 font-bold">PREMIUM</span>
        </div>
        <div class="text-sm font-bold uppercase mb-2">{{ hoveredSpot.title }}</div>
        <div class="flex justify-between items-end gap-4">
           <span class="text-white/50 text-[10px] font-mono leading-none">{{ hoveredSpot.quartier }}<br/>{{ hoveredSpot.pricePerHour }} CHF/h</span>
           <button @click="$emit('select-spot', hoveredSpot)" class="px-3 py-1 bg-neon text-obsidian text-[10px] font-bold rounded uppercase tracking-tighter">
             PLATZ FANGE
           </button>
        </div>
      </div>
      
      <div class="glass-panel px-4 py-2 border-neon/30 flex items-center gap-3">
        <div class="w-2 h-2 bg-neon rounded-full animate-pulse"></div>
        <div class="font-mono text-[10px] text-white/80 uppercase">GEO_NODES: {{ spots.length }}</div>
      </div>
    </div>

    <!-- Map Noise Overlay -->
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-[5]"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Spot } from '~/composables/useSpots'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{ spots: Spot[] }>()
const emit = defineEmits(['select-spot'])

const mapElement = ref<HTMLElement | null>(null)
let map: any = null
const hoveredSpot = ref<Spot | null>(null)

// Custom Marker Generator
const createNeonIcon = (isPremium: boolean) => {
  const color = isPremium ? '#f59e0b' : '#00ff88'
  return L.divIcon({
    className: 'custom-neon-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-6 h-6 rounded-full opacity-20 animate-ping" style="background-color: ${color}"></div>
        <div class="w-3 h-3 rounded-full border-2 border-white/20 shadow-[0_0_10px_${color}]" style="background-color: ${color}"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })
}

let L: any = null

onMounted(async () => {
  if (process.client) {
    const leaflet = await import('leaflet')
    L = leaflet.default

    if (!mapElement.value) return

    map = L.map(mapElement.value, {
      zoomControl: false,
      attributionControl: false
    }).setView([47.3769, 8.5417], 14)

    // CartoDB Dark Matter Tiles (The actual "Neo-Night" map)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map)

    // Render initial spots
    renderMarkers()
  }
})

const markerGroup = ref<any>(null)

const renderMarkers = () => {
  if (!map || !L) return

  if (markerGroup.value) {
    map.removeLayer(markerGroup.value)
  }

  markerGroup.value = L.layerGroup().addTo(map)

  props.spots.forEach(spot => {
    if (!spot.coords) return
    
    const marker = L.marker([spot.coords.lat, spot.coords.lng], {
      icon: createNeonIcon(spot.premium)
    })

    marker.on('mouseover', () => {
      hoveredSpot.value = spot
    })

    marker.on('click', () => {
      emit('select-spot', spot)
    })

    marker.addTo(markerGroup.value)
  })
}

// Re-render markers when filtered
watch(() => props.spots, renderMarkers, { deep: true })

onUnmounted(() => {
  if (map) map.remove()
})
</script>

<style>
/* Leaflet Overrides for Neo-Night Aesthetic */
.leaflet-container {
  background: #050505 !important;
}

.leaflet-tile {
  /* High contrast neon-dark look: Invert once, then push contrast and brightness */
  filter: grayscale(1) invert(1) brightness(0.4) contrast(1.8) !important;
  opacity: 1 !important;
}

.leaflet-grab {
  cursor: grab !important;
}

.leaflet-grabbing {
  cursor: grabbing !important;
}

/* Ensure our marker icons stay visible above filters */
.custom-neon-marker {
  z-index: 100 !important;
}
</style>
