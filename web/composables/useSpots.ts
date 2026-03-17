import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

export interface Spot {
  id: string
  ownerId: string
  title: string
  description: string
  quartier: string
  pricePerHour: number
  available: boolean
  premium: boolean
  coords: { lat: number, lng: number } // Switched to Real Lat/Lng
}

const quartiers = ['Langstrasse', 'Seefeld', 'Enge', 'Altstadt', 'Kreis 5', 'Oerlikon', 'Wiedikon', 'Hardbrücke']

// Center of Zurich
const ZH_LAT = 47.3769
const ZH_LNG = 8.5417

const generateSeedSpots = (): Spot[] => {
  const spots: Spot[] = []
  for (let i = 1; i <= 250; i++) {
    const q = quartiers[Math.floor(Math.random() * quartiers.length)]
    const isPremium = Math.random() > 0.7
    spots.push({
      id: `s_${i}`,
      ownerId: i % 2 === 0 ? 'u_hans' : 'u_reto',
      title: `${q} Spot #${i}`,
      description: `A unique parking experience in the heart of ${q}. Secure, neon-lit, and ready for the night.`,
      quartier: q,
      pricePerHour: Math.floor(Math.random() * 30) + 10,
      available: true,
      premium: isPremium,
      coords: {
        // Generate within a small box around Zurich
        lat: ZH_LAT + (Math.random() - 0.5) * 0.05,
        lng: ZH_LNG + (Math.random() - 0.5) * 0.08
      }
    })
  }
  return spots
}

// Singleton for shared state
const spotsState = useLocalStorage<Spot[]>('wallup_spots', generateSeedSpots())

// Migration: If we have old 'x/y' coords, reset to lat/lng
if (spotsState.value.length > 0 && ('x' in spotsState.value[0].coords)) {
  spotsState.value = generateSeedSpots()
}

export const useSpots = () => {
  const b2bEliteVermieter = computed(() => {
    const counts: Record<string, number> = {}
    spotsState.value.forEach(s => {
      counts[s.ownerId] = (counts[s.ownerId] || 0) + 1
    })
    return Object.entries(counts)
      .filter(([_, count]) => count >= 3)
      .map(([id]) => id)
  })

  const addSpot = (spot: Omit<Spot, 'id'>) => {
    const newSpot = {
      ...spot,
      id: `s_${Date.now()}`
    }
    spotsState.value.push(newSpot)
  }

  const updateSpot = (updatedSpot: Spot) => {
    const index = spotsState.value.findIndex(s => s.id === updatedSpot.id)
    if (index !== -1) {
      spotsState.value[index] = updatedSpot
    }
  }

  const deleteSpot = (id: string) => {
    spotsState.value = spotsState.value.filter(s => s.id !== id)
  }

  return {
    spots: spotsState,
    b2bEliteVermieter,
    addSpot,
    updateSpot,
    deleteSpot
  }
}
