<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <ClientOnly>
      <HeroBackground />
    </ClientOnly>
    
    <!-- Kinetic Typography -->
    <div class="relative z-10 text-center">
      <h1 ref="heroText" class="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-6 mix-blend-difference">
        <span class="block overflow-hidden"><span class="block translate-y-full hero-line">Parkplatz</span></span>
        <span class="block overflow-hidden"><span class="block translate-y-full hero-line text-neon">Sharing</span></span>
        <span class="block overflow-hidden"><span class="block translate-y-full hero-line">Zürich</span></span>
      </h1>
      
      <p ref="subText" class="text-white/60 font-mono text-sm md:text-base max-w-md mx-auto mb-12 opacity-0">
        Boutique parking spaces for the night. No stress, pure neon. Book your spot in 3 clicks.
      </p>

      <div ref="cta" class="opacity-0">
        <NuxtLink to="/spots" class="group relative inline-flex items-center justify-center px-8 py-4 font-mono font-bold text-obsidian bg-neon overflow-hidden rounded-full">
          <div class="absolute inset-0 w-full h-full -translate-x-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out"></div>
          <span class="relative flex items-center gap-2">
            PLATZ FANGE <Icon name="ph:arrow-right-bold" class="w-5 h-5" />
          </span>
        </NuxtLink>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon/10 rounded-full blur-[120px] pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const heroText = ref(null)
const subText = ref(null)
const cta = ref(null)

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  
  tl.to('.hero-line', {
    y: 0,
    duration: 1.2,
    stagger: 0.15,
    delay: 0.2
  })
  .to(subText.value, {
    opacity: 1,
    y: 0,
    duration: 1,
  }, '-=0.8')
  .to(cta.value, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
  }, '-=0.6')
})
</script>
