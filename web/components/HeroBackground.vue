<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,136,0.05)_0%,transparent_70%)]"></div>
    
    <svg viewBox="0 0 1000 1000" class="w-full h-full preserve-3d">
      <!-- Street Grid Background -->
      <rect x="0" y="0" width="1000" height="1000" class="fill-obsidian" />
      <g class="text-neon/10 stroke-current">
        <line v-for="i in 21" :key="'h'+i" x1="0" :y1="(i-1)*50" x2="1000" :y2="(i-1)*50" stroke-width="0.5" />
        <line v-for="i in 21" :key="'v'+i" :x1="(i-1)*50" y1="0" :x2="(i-1)*50" y2="1000" stroke-width="0.5" />
      </g>

      <!-- The City Block (Houses) -->
      <g class="fill-surface stroke-white/5 stroke-2">
        <!-- Central Block -->
        <rect x="350" y="350" width="300" height="300" rx="10" />
        <rect x="370" y="370" width="260" height="260" rx="5" class="fill-obsidian" />
        <!-- Top Left Block -->
        <rect x="50" y="50" width="200" height="200" rx="10" />
        <!-- Top Right Block -->
        <rect x="750" y="50" width="200" height="200" rx="10" />
        <!-- Bottom Left Block -->
        <rect x="50" y="750" width="200" height="200" rx="10" />
        <!-- Bottom Right Block -->
        <rect x="750" y="750" width="200" height="200" rx="10" />
      </g>

      <!-- Parking Zones on the Central Block -->
      <g v-for="pos in parkingSpots" :key="pos.id" :transform="`translate(${pos.x}, ${pos.y})`">
        <rect width="60" height="40" fill="none" stroke="rgba(0,255,136,0.2)" stroke-dasharray="3,3" />
        <text x="5" y="25" class="fill-neon/30 font-mono text-[6px]">SPACE_AVAILABLE</text>
      </g>

      <!-- Autonomous Vehicles -->
      <g v-for="i in 4" :key="i" :ref="el => carRefs[i-1] = el" style="visibility: hidden">
        <g class="car-body">
          <rect x="-15" y="-30" width="30" height="60" rx="4" class="fill-obsidian stroke-neon stroke-2" />
          <!-- Headlights -->
          <rect x="-12" y="25" width="6" height="4" rx="1" class="fill-white/80" />
          <rect x="6" y="25" width="6" height="4" rx="1" class="fill-white/80" />
          <!-- Taillights -->
          <rect x="-12" y="-28" width="6" height="4" rx="1" class="fill-red-500/80" />
          <rect x="6" y="-28" width="6" height="4" rx="1" class="fill-red-500/80" />
          <!-- Underglow -->
          <ellipse cx="0" cy="0" rx="25" ry="40" fill="url(#carGlow)" opacity="0.4" />
        </g>
      </g>

      <defs>
        <radialGradient id="carGlow">
          <stop offset="0%" stop-color="#00ff88" />
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const carRefs = ref<any[]>([])

// Parking spots arranged along the right side of the central block
const parkingSpots = [
  { id: 'p1', x: 650, y: 380 },
  { id: 'p2', x: 650, y: 440 },
  { id: 'p3', x: 650, y: 500 },
  { id: 'p4', x: 650, y: 560 }
]

const animateCarOnRoute = (el: any, staggerIndex: number) => {
  if (!el) return

  // The orchestrated route around the central block (350x350 to 650x650)
  // Streets are at X: 300, 700 and Y: 300, 700
  
  // Total loop duration: ~24 seconds. 
  // 4 cars staggered by 6 seconds ensures they never meet.
  const tl = gsap.timeline({ 
    repeat: -1, 
    delay: staggerIndex * 6,
    onStart: () => { el.style.visibility = 'visible' }
  })

  // Start at bottom street, moving right
  tl.set(el, { x: 300, y: 700, rotation: 90 })
    
    // Drive Right along bottom street
    .to(el, { x: 700, duration: 4, ease: 'none' })
    // Turn Up
    .to(el, { rotation: 180, duration: 0.5, ease: 'power1.inOut' })
    // Drive Up along right street
    .to(el, { y: 620, duration: 1, ease: 'none' })
    
    // THE PARKING SEQUENCE (Parallel Park into a spot)
    // 1. Pull up past the spot
    .to(el, { y: 560, duration: 1, ease: 'none' })
    // 2. Angle reverse into spot
    .to(el, { x: 680, y: 580, rotation: 135, duration: 1, ease: 'power1.inOut' })
    // 3. Straighten out in spot
    .to(el, { x: 680, y: 560, rotation: 180, duration: 1, ease: 'power1.inOut' })
    // 4. Wait / "Parked"
    .to(el, { opacity: 0.5, duration: 2 })
    .to(el, { opacity: 1, duration: 0.5 })
    // 5. Pull out of spot
    .to(el, { x: 700, y: 540, rotation: 150, duration: 1, ease: 'power1.inOut' })
    // 6. Straighten on street
    .to(el, { x: 700, y: 520, rotation: 180, duration: 0.5, ease: 'power1.inOut' })

    // Continue Drive Up to top corner
    .to(el, { y: 300, duration: 3, ease: 'none' })
    // Turn Left
    .to(el, { rotation: 270, duration: 0.5, ease: 'power1.inOut' })
    // Drive Left along top street
    .to(el, { x: 300, duration: 4, ease: 'none' })
    // Turn Down
    .to(el, { rotation: 360, duration: 0.5, ease: 'power1.inOut' })
    // Drive Down along left street
    .to(el, { y: 700, duration: 4, ease: 'none' })
    // Turn Right to complete loop
    .to(el, { rotation: 450, duration: 0.5, ease: 'power1.inOut' })
    // Reset rotation for next loop seamlessly
    .set(el, { rotation: 90 })
}

onMounted(() => {
  carRefs.value.forEach((car, i) => {
    animateCarOnRoute(car, i)
  })
})
</script>

<style scoped>
.preserve-3d {
  transform: perspective(1200px) rotateX(60deg) scale(1.6) translateY(-100px);
  transform-origin: center center;
}
</style>
