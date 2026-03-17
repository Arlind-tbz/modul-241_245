<template>
  <div class="min-h-screen pt-24 pb-32 px-6 max-w-7xl mx-auto">
    <ClientOnly>
      <div v-if="currentUser?.role === 'VERMIETER' || currentUser?.role === 'ADMIN'">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h1 class="text-4xl font-black uppercase tracking-tighter text-neon italic">HOST_DASHBOARD</h1>
            <p class="font-mono text-[10px] text-white/40 mt-2 uppercase tracking-widest">Managing nodes for: {{ currentUser.name }}</p>
          </div>
          
          <button 
            @click="showAddForm = !showAddForm"
            class="px-6 py-3 bg-white/5 border border-neon/30 hover:border-neon hover:bg-neon/10 text-neon font-mono text-xs font-bold rounded flex items-center gap-2 transition-all"
          >
            <Icon :name="showAddForm ? 'ph:minus-bold' : 'ph:plus-bold'" class="w-4 h-4" />
            {{ showAddForm ? 'CLOSE_TERMINAL' : 'ADD_NEW_NODE' }}
          </button>
        </div>

        <!-- Metric Hub -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div class="glass-panel p-6 border-l-2 border-neon">
            <div class="text-[10px] font-mono text-white/40 uppercase mb-1">TOTAL_NODES</div>
            <div class="text-3xl font-black">{{ mySpots.length }}</div>
          </div>
          <div class="glass-panel p-6 border-l-2 border-purple-500">
            <div class="text-[10px] font-mono text-white/40 uppercase mb-1">REVENUE_ESTIMATE</div>
            <div class="text-3xl font-black text-purple-400">{{ totalRevenue }} CHF</div>
          </div>
          <div v-if="isElite" class="glass-panel p-6 border-l-2 border-yellow-500 bg-yellow-500/5">
            <div class="text-[10px] font-mono text-yellow-500 uppercase mb-1 font-bold italic">B2B_ELITE_STATUS</div>
            <div class="text-sm font-bold text-white uppercase leading-tight mt-2">Active Sweep Animation Enabled</div>
          </div>
        </div>

        <!-- Add Spot Form (Kinetic) -->
        <Transition name="form-slide">
          <div v-if="showAddForm" class="glass-panel p-8 border-neon/50 mb-12 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-neon animate-pulse"></div>
            <h2 class="text-xl font-bold uppercase mb-6 flex items-center gap-2">
              <Icon name="ph:terminal-bold" class="text-neon" /> NODE_INITIALIZATION
            </h2>
            
            <form @submit.prevent="handleSave" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block font-mono text-[10px] text-white/40 mb-2 uppercase">Node_Title</label>
                  <input v-model="form.title" type="text" class="w-full bg-obsidian border border-white/10 p-3 rounded font-mono text-sm focus:border-neon focus:shadow-glow outline-none transition-all" placeholder="e.g. Seefeld Luxury" required />
                </div>
                <div>
                  <label class="block font-mono text-[10px] text-white/40 mb-2 uppercase">Sector (Quartier)</label>
                  <select v-model="form.quartier" class="w-full bg-obsidian border border-white/10 p-3 rounded font-mono text-sm focus:border-neon outline-none transition-all">
                    <option v-for="q in quartiers" :key="q" :value="q">{{ q }}</option>
                  </select>
                </div>
                <div>
                  <label class="block font-mono text-[10px] text-white/40 mb-2 uppercase">Price / hr (CHF)</label>
                  <input v-model.number="form.pricePerHour" type="number" class="w-full bg-obsidian border border-white/10 p-3 rounded font-mono text-sm focus:border-neon outline-none transition-all" required />
                </div>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block font-mono text-[10px] text-white/40 mb-2 uppercase">Description</label>
                  <textarea v-model="form.description" rows="4" class="w-full bg-obsidian border border-white/10 p-3 rounded font-mono text-sm focus:border-neon outline-none transition-all" placeholder="Enter node specifications..."></textarea>
                </div>
                <div class="flex items-center gap-4">
                  <div class="flex-1">
                    <label class="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" v-model="form.premium" class="sr-only" />
                      <div class="w-10 h-5 bg-white/10 rounded-full relative transition-all group-hover:bg-white/20" :class="{ 'bg-neon/40': form.premium }">
                        <div class="absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all" :class="{ 'translate-x-5 bg-neon shadow-glow': form.premium }"></div>
                      </div>
                      <span class="font-mono text-[10px] uppercase">Premium_Node</span>
                    </label>
                  </div>
                  <button type="submit" class="flex-1 py-3 bg-neon text-obsidian font-mono font-bold rounded uppercase hover:bg-white transition-colors shadow-glow">
                    SYNC_NODE
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Transition>

        <!-- Managed Spots List -->
        <div class="glass-panel p-6 relative overflow-hidden">
          <h2 class="text-xl font-black uppercase mb-6 flex items-center gap-2">
            <Icon name="ph:list-dashes-bold" class="text-neon" /> NODE_MANAGEMENT
          </h2>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left font-mono text-sm">
              <thead class="text-white/30 border-b border-white/10">
                <tr>
                  <th class="pb-4 font-normal">DESIGNATION</th>
                  <th class="pb-4 font-normal">SECTOR</th>
                  <th class="pb-4 font-normal">RATE</th>
                  <th class="pb-4 font-normal">STATUS</th>
                  <th class="pb-4 font-normal text-right">PROTOCOL</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="spot in mySpots" :key="spot.id" class="border-b border-white/5 hover:bg-white/5 group">
                  <td class="py-4">
                    <span class="font-bold text-white uppercase">{{ spot.title }}</span>
                    <span v-if="spot.premium" class="ml-2 px-1 text-[8px] border border-yellow-500 text-yellow-500">PRO</span>
                  </td>
                  <td class="py-4 text-white/60">{{ spot.quartier }}</td>
                  <td class="py-4">{{ spot.pricePerHour }} CHF</td>
                  <td class="py-4">
                    <span class="flex items-center gap-2 text-[10px]">
                      <span class="w-1.5 h-1.5 bg-neon rounded-full animate-pulse"></span> ONLINE
                    </span>
                  </td>
                  <td class="py-4 text-right">
                    <button @click="handleDelete(spot.id)" class="text-white/20 hover:text-red-500 transition-colors p-2">
                      <Icon name="ph:trash-bold" class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                <tr v-if="mySpots.length === 0">
                  <td colspan="5" class="py-12 text-center text-white/20 italic uppercase tracking-widest">
                    No active nodes found in your region.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div v-else class="flex flex-col items-center justify-center py-32 text-center">
        <Icon name="ph:lock-key-bold" class="w-16 h-16 text-white/10 mb-6" />
        <h2 class="text-3xl font-black uppercase mb-4">ACCESS_DENIED</h2>
        <p class="text-white/40 font-mono text-sm max-w-sm">This interface is restricted to Host Protocol authorized users only.</p>
        <NuxtLink to="/profile" class="mt-8 px-6 py-3 border border-white/20 hover:border-neon hover:text-neon transition-all font-mono text-xs uppercase">Initialize Upgrade</NuxtLink>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSpots, type Spot } from '~/composables/useSpots'

const { currentUser } = useAuth()
const { spots, addSpot, deleteSpot, b2bEliteVermieter } = useSpots()

const showAddForm = ref(false)
const quartiers = ['Langstrasse', 'Seefeld', 'Enge', 'Altstadt', 'Kreis 5', 'Oerlikon', 'Wiedikon', 'Hardbrücke']

const form = ref({
  title: '',
  description: '',
  quartier: 'Langstrasse',
  pricePerHour: 15,
  premium: false,
})

const mySpots = computed(() => {
  return spots.value.filter(s => s.ownerId === currentUser.value?.id)
})

const totalRevenue = computed(() => {
  return mySpots.value.reduce((acc, curr) => acc + (curr.pricePerHour * 4), 0)
})

const isElite = computed(() => {
  return currentUser.value ? b2bEliteVermieter.value.includes(currentUser.value.id) : false
})

const handleSave = () => {
  if (!currentUser.value) return
  
  // Zurich center coordinates
  const ZH_LAT = 47.3769
  const ZH_LNG = 8.5417

  addSpot({
    ownerId: currentUser.value.id,
    title: form.value.title,
    description: form.value.description,
    quartier: form.value.quartier,
    pricePerHour: form.value.pricePerHour,
    available: true,
    premium: form.value.premium,
    coords: {
      lat: ZH_LAT + (Math.random() - 0.5) * 0.05,
      lng: ZH_LNG + (Math.random() - 0.5) * 0.08
    }
  })

  // Reset form
  form.value = {
    title: '',
    description: '',
    quartier: 'Langstrasse',
    pricePerHour: 15,
    premium: false,
  }
  showAddForm.value = false
}

const handleDelete = (id: string) => {
  if (confirm('TERMINATE_NODE Protocol: Are you sure?')) {
    deleteSpot(id)
  }
}
</script>

<style scoped>
.form-slide-enter-active,
.form-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 1000px;
}

.form-slide-enter-from,
.form-slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-20px);
}

.shadow-glow {
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
}
</style>
