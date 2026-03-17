<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="glass-panel w-full max-w-md p-8 relative overflow-hidden" ref="loginPanel">
      <div class="absolute top-0 left-0 w-full h-1 bg-neon opacity-50"></div>
      
      <h2 class="text-3xl font-black mb-2 uppercase tracking-wider" :class="{ 'animate-glitch text-neon': isGlitching }">
        System_Login
      </h2>
      <p class="text-white/50 font-mono text-sm mb-8">Access the Wallup Network.</p>

      <div class="space-y-4 font-mono">
        <button
          v-for="user in users"
          :key="user.id"
          @click="handleLogin(user.id)"
          @mouseenter="triggerGlitch"
          class="w-full text-left p-4 border border-white/10 rounded-xl hover:border-neon hover:bg-neon/5 transition-all group flex justify-between items-center"
        >
          <div>
            <div class="text-white group-hover:text-neon transition-colors">{{ user.name }}</div>
            <div class="text-xs text-white/40">{{ user.role }} • {{ user.subscription }}</div>
          </div>
          <Icon name="ph:caret-right-bold" class="w-5 h-5 opacity-0 group-hover:opacity-100 text-neon transition-all transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import gsap from 'gsap'

const { users, login } = useAuth()
const router = useRouter()
const loginPanel = ref(null)
const isGlitching = ref(false)

const handleLogin = (id: string) => {
  login(id)
  
  // Glitch exit animation
  gsap.to(loginPanel.value, {
    scale: 0.9,
    opacity: 0,
    y: 20,
    duration: 0.4,
    ease: 'power3.in',
    onComplete: () => {
      router.push('/spots')
    }
  })
}

const triggerGlitch = () => {
  isGlitching.value = true
  setTimeout(() => {
    isGlitching.value = false
  }, 200)
}

onMounted(() => {
  gsap.from(loginPanel.value, {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'elastic.out(1, 0.75)'
  })
})
</script>
