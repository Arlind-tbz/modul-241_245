<template>
  <div class="min-h-screen pt-24 pb-32 px-6 max-w-6xl mx-auto">
    <ClientOnly>
      <SuccessOverlay 
        :show="showUpgradeAnimation" 
        :mode="animationMode"
        @finished="showUpgradeAnimation = false" 
      />
      
      <div v-if="currentUser" class="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
        <div>
          <h1 class="text-4xl md:text-6xl font-black uppercase tracking-tighter">{{ currentUser?.name || 'GUEST' }}</h1>
          <p class="text-neon font-mono text-sm mt-2">NETWORK STATUS: <span class="animate-pulse">ONLINE</span></p>
        </div>
        <button @click="handleLogout" class="text-white/50 hover:text-neon font-mono text-sm uppercase flex items-center gap-2 transition-colors">
          <Icon name="ph:power-bold" class="w-5 h-5" />
          DISCONNECT
        </button>
      </div>

      <div v-if="currentUser" class="mb-12 flex justify-between items-center">
        <h2 class="text-2xl font-black uppercase tracking-tight">SUBSCRIPTION PROTOCOLS</h2>
        <button 
          v-if="currentUser.subscription !== 'FREE'"
          @click="handleDowngrade('FREE')"
          class="text-[10px] font-mono text-white/20 hover:text-red-500 uppercase tracking-widest transition-colors"
        >
          [ DEACTIVATE_ALL_PROTOCOLS ]
        </button>
      </div>
      
      <div v-if="currentUser" class="flex flex-col md:flex-row gap-6 md:min-h-[500px]" ref="totemsContainer">
        <!-- Totem: PLUS -->
        <div class="totem group flex-1 glass-panel p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-500 hover:flex-[1.5]">
          <div class="relative z-10">
            <h3 class="text-2xl font-black uppercase text-white/50 group-hover:text-white transition-colors">PLUS</h3>
            <p class="font-mono text-sm text-white/30 mt-2">Basic access. Standard spots.</p>
          </div>
          <div class="relative z-10 mt-12">
            <div class="text-3xl font-black font-mono">10<span class="text-sm text-white/50 font-sans">/mo</span></div>
            <button 
              v-if="currentUser?.subscription !== 'PLUS'" 
              @click="handleTierChange('PLUS')"
              class="w-full mt-4 py-3 border border-white/20 rounded font-mono text-sm hover:border-neon hover:text-neon transition-colors"
            >
              {{ isHigherTier('PLUS') ? 'INITIALIZE' : 'DOWNGRADE' }}
            </button>
            <div v-else class="w-full mt-4 py-3 bg-neon/10 text-neon font-mono text-sm font-bold text-center rounded border border-neon">
              ACTIVE
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <!-- Totem: PRO -->
        <div class="totem group flex-1 glass-panel p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-500 hover:flex-[1.5] border-neon/30 hover:border-neon hover:shadow-glow">
          <div class="absolute top-0 left-0 w-full h-1 bg-neon"></div>
          <div class="relative z-10">
            <h3 class="text-2xl font-black uppercase text-neon">PRO</h3>
            <p class="font-mono text-sm text-white/50 mt-2">Premium spots unlocked. Early access.</p>
          </div>
          <div class="relative z-10 mt-12">
            <div class="text-3xl font-black font-mono text-neon">25<span class="text-sm text-white/50 font-sans">/mo</span></div>
            <button 
              v-if="currentUser?.subscription !== 'PRO'" 
              @click="handleTierChange('PRO')"
              class="w-full mt-4 py-3 bg-neon text-obsidian rounded font-mono text-sm font-bold hover:bg-white transition-colors shadow-glow"
            >
              {{ isHigherTier('PRO') ? 'UPGRADE' : 'DOWNGRADE' }}
            </button>
            <div v-else class="w-full mt-4 py-3 bg-neon/10 text-neon font-mono text-sm font-bold text-center rounded border border-neon">
              ACTIVE
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <!-- Totem: ULTRA -->
        <div class="totem group flex-1 glass-panel p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-500 hover:flex-[1.5]">
          <div class="relative z-10">
            <h3 class="text-2xl font-black uppercase text-purple-500 group-hover:text-purple-400 transition-colors text-shadow-purple">ULTRA</h3>
            <p class="font-mono text-sm text-white/50 mt-2">Valet simulation. Priority booking.</p>
          </div>
          <div class="relative z-10 mt-12">
            <div class="text-3xl font-black font-mono">50<span class="text-sm text-white/50 font-sans">/mo</span></div>
            <button 
              v-if="currentUser?.subscription !== 'ULTRA'" 
              @click="handleTierChange('ULTRA')"
              class="w-full mt-4 py-3 border border-purple-500/50 text-purple-400 rounded font-mono text-sm hover:border-purple-400 hover:bg-purple-500/10 transition-colors"
            >
              INITIALIZE
            </button>
            <div v-else class="w-full mt-4 py-3 bg-purple-500/10 text-purple-400 font-mono text-sm font-bold text-center rounded border border-purple-500">
              ACTIVE
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth, type SubTier } from '~/composables/useAuth'
import gsap from 'gsap'

const { currentUser, logout, updateSubscription } = useAuth()
const router = useRouter()
const totemsContainer = ref(null)
const showUpgradeAnimation = ref(false)
const animationMode = ref<'upgrade' | 'downgrade'>('upgrade')

const tierOrder: SubTier[] = ['FREE', 'PLUS', 'PRO', 'ULTRA']

const isHigherTier = (newTier: SubTier) => {
  if (!currentUser.value) return true
  return tierOrder.indexOf(newTier) > tierOrder.indexOf(currentUser.value.subscription)
}

const handleLogout = () => {
  logout()
  router.push('/login')
}

const handleTierChange = (tier: SubTier) => {
  const isUpgrade = isHigherTier(tier)
  animationMode.value = isUpgrade ? 'upgrade' : 'downgrade'
  updateSubscription(tier)
  showUpgradeAnimation.value = true
}

const handleDowngrade = (tier: SubTier) => {
  animationMode.value = 'downgrade'
  updateSubscription(tier)
  showUpgradeAnimation.value = true
}

onMounted(() => {
  if (!currentUser.value) {
    router.push('/login')
    return
  }

  setTimeout(() => {
    gsap.from('.totem', {
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      clearProps: 'all'
    })
  }, 100)
})
</script>

<style scoped>
.text-shadow-purple {
  text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
}
.shadow-glow {
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
}
</style>
