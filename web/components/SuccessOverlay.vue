<script setup lang="ts">
import { ref, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps<{ 
  show: boolean,
  mode?: 'upgrade' | 'downgrade'
}>()
const emit = defineEmits(['finished'])

const active = ref(false)
const flash = ref(null)
const text = ref(null)
const particleContainer = ref<HTMLElement | null>(null)

watch(() => props.show, (newVal) => {
  if (newVal) {
    startAnimation()
  }
})

const startAnimation = () => {
  active.value = true
  const isDowngrade = props.mode === 'downgrade'
  
  setTimeout(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          active.value = false
          emit('finished')
        }, 1000)
      }
    })

    if (!isDowngrade) {
      // UPGRADE: Flash and scale
      tl.to(flash.value, { opacity: 0.8, duration: 0.1 })
        .to(flash.value, { opacity: 0, duration: 0.5 })
        .to(text.value, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.4')
        .to(text.value, { y: -50, opacity: 0, duration: 0.5, delay: 1.5 })

      if (particleContainer.value) {
        for (let i = 0; i < 40; i++) createParticle('#00ff88')
      }
    } else {
      // DOWNGRADE: Fading, slower, desaturated
      tl.to(text.value, { opacity: 1, scale: 0.9, duration: 1, ease: 'power2.inOut' })
        .to(text.value, { opacity: 0, scale: 0.8, duration: 0.8, delay: 1 })
      
      if (particleContainer.value) {
        for (let i = 0; i < 15; i++) createFallingParticle()
      }
    }
  }, 0)
}

const createParticle = (color: string) => {
  if (!particleContainer.value) return
  const p = document.createElement('div')
  const size = Math.random() * 8 + 4
  p.style.position = 'absolute'
  p.style.width = `${size}px`
  p.style.height = `${size}px`
  p.style.backgroundColor = color
  p.style.left = '50%'
  p.style.top = '50%'
  p.style.borderRadius = '50%'
  p.style.boxShadow = `0 0 15px ${color}`
  particleContainer.value.appendChild(p)
  
  gsap.to(p, {
    x: (Math.random() - 0.5) * 1000,
    y: (Math.random() - 0.5) * 1000,
    opacity: 0,
    duration: Math.random() * 1 + 1,
    ease: 'power4.out',
    onComplete: () => p.remove()
  })
}

const createFallingParticle = () => {
  if (!particleContainer.value) return
  const p = document.createElement('div')
  p.style.position = 'absolute'
  p.style.width = '2px'
  p.style.height = '10px'
  p.style.backgroundColor = '#ffffff'
  p.style.opacity = '0.3'
  p.style.left = `${Math.random() * 100}%`
  p.style.top = '-20px'
  particleContainer.value.appendChild(p)
  
  gsap.to(p, {
    y: window.innerHeight + 50,
    x: '+=50',
    rotation: 45,
    duration: Math.random() * 2 + 2,
    ease: 'none',
    onComplete: () => p.remove()
  })
}
</script>

<template>
  <div v-if="active" class="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none overflow-hidden">
    <div ref="flash" class="absolute inset-0 bg-white opacity-0"></div>
    <div ref="particleContainer" class="absolute inset-0"></div>

    <div ref="text" class="relative z-10 text-center opacity-0">
      <h2 class="text-7xl md:text-9xl font-black uppercase tracking-tighter italic"
          :class="mode === 'downgrade' ? 'text-white/20' : 'text-neon animate-glitch'">
        {{ mode === 'downgrade' ? 'RESET_LEVEL' : 'LEVEL_UP' }}
      </h2>
      <p class="text-white font-mono text-xl mt-4 tracking-widest uppercase opacity-50">
        {{ mode === 'downgrade' ? 'Standard Protocol Active' : 'Protocol Upgraded' }}
      </p>
    </div>
  </div>
</template>
