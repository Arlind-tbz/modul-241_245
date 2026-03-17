<template>
  <div class="min-h-screen pt-24 pb-32 px-6 max-w-7xl mx-auto">
    <div class="mb-12">
      <h1 class="text-4xl font-black uppercase tracking-tighter text-neon animate-glitch">COMMAND_CENTER</h1>
      <p class="font-mono text-xs text-white/50 mt-2">ADMINISTRATOR OVERRIDE ACTIVE</p>
    </div>

    <!-- Metric Bubbles / Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16" ref="statsContainer">
      <div v-for="(stat, i) in stats" :key="i" class="glass-panel p-6 border-l-2 border-neon flex flex-col justify-center">
        <div class="font-mono text-xs text-white/50 mb-2">{{ stat.label }}</div>
        <div class="text-3xl font-black text-white" :ref="el => countRefs[i] = el">{{ stat.value }}</div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Data Grid (Users) -->
      <div class="lg:col-span-2 glass-panel p-6 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.03)_0%,transparent_100%)]"></div>
        
        <h2 class="text-xl font-black uppercase mb-6 relative z-10 flex items-center gap-2">
          <Icon name="ph:users-bold" class="text-neon" /> NETWORK NODES
        </h2>
        
        <div class="overflow-x-auto relative z-10">
          <table class="w-full text-left font-mono text-sm">
            <thead>
              <tr class="text-white/30 border-b border-white/10">
                <th class="pb-4 font-normal">ID</th>
                <th class="pb-4 font-normal">DESIGNATION</th>
                <th class="pb-4 font-normal">ROLE</th>
                <th class="pb-4 font-normal">TIER</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" class="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td class="py-4 text-neon/70">{{ user.id }}</td>
                <td class="py-4">{{ user.name }}</td>
                <td class="py-4 text-white/60">{{ user.role }}</td>
                <td class="py-4">
                  <span class="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] group-hover:border-neon group-hover:text-neon transition-colors">
                    {{ user.subscription }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mock Bar Chart via CSS -->
      <div class="glass-panel p-6 flex flex-col">
        <h2 class="text-xl font-black uppercase mb-6 flex items-center gap-2">
          <Icon name="ph:chart-bar-bold" class="text-neon" /> LOAD BALANCING
        </h2>
        
        <div class="flex-1 flex items-end gap-2 mt-4" ref="chartContainer">
          <div v-for="(val, i) in chartData" :key="i" class="w-full bg-white/10 rounded-t relative group">
            <div 
              class="absolute bottom-0 w-full bg-neon rounded-t transition-all duration-1000"
              :style="{ height: `${val}%` }"
            ></div>
            <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-obsidian border border-neon text-neon text-xs font-mono px-2 py-1 rounded transition-opacity">
              {{ val }}%
            </div>
          </div>
        </div>
        <div class="flex justify-between mt-4 text-[10px] font-mono text-white/30">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import gsap from 'gsap'

const { users, currentUser } = useAuth()
const router = useRouter()

if (currentUser.value?.role !== 'ADMIN') {
  router.push('/')
}

const stats = ref([
  { label: 'ACTIVE_SPOTS', value: 24 },
  { label: 'BOOKING_RATE', value: 89 },
  { label: 'NETWORK_LOAD', value: 42 },
  { label: 'REVENUE_FLOW', value: 9400 }
])
const countRefs = ref([])

const chartData = ref([20, 45, 80, 65, 90, 40, 30])
const statsContainer = ref(null)
const chartContainer = ref(null)

onMounted(() => {
  // Animate Stat numbers
  countRefs.value.forEach((el, i) => {
    if (el) {
      gsap.fromTo(el, 
        { innerHTML: 0 },
        { 
          innerHTML: stats.value[i].value,
          duration: 2,
          ease: 'power3.out',
          snap: { innerHTML: 1 },
          onUpdate: function() {
            el.innerHTML = i === 3 ? `${Math.round(this.targets()[0].innerHTML)} CHF` : 
                           i === 1 || i === 2 ? `${Math.round(this.targets()[0].innerHTML)}%` : 
                           Math.round(this.targets()[0].innerHTML)
          }
        }
      )
    }
  })

  // Entrance animations
  gsap.from(statsContainer.value.children, {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  })
})
</script>
