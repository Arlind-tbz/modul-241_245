import { useLocalStorage } from '@vueuse/core'

export type Role = 'ADMIN' | 'VERMIETER' | 'FAHRER'
export type SubTier = 'FREE' | 'PLUS' | 'PRO' | 'ULTRA'

export interface User {
  id: string
  name: string
  role: Role
  subscription: SubTier
  avatar?: string
}

const seedUsers: User[] = [
  { id: 'u_admin', name: 'Admin (System)', role: 'ADMIN', subscription: 'ULTRA' },
  { id: 'u_hans', name: 'Hans', role: 'VERMIETER', subscription: 'FREE' },
  { id: 'u_fabia', name: 'Fabia', role: 'FAHRER', subscription: 'PRO' },
  { id: 'u_reto', name: 'Reto', role: 'VERMIETER', subscription: 'PLUS' },
]

// Singletons for shared state
const usersState = useLocalStorage<User[]>('wallup_users', seedUsers)
const currentUserState = useLocalStorage<User | null>('wallup_session', null)

export const useAuth = () => {
  const login = (userId: string) => {
    const user = usersState.value.find(u => u.id === userId)
    if (user) {
      currentUserState.value = { ...user }
    }
  }

  const logout = () => {
    currentUserState.value = null
  }

  const updateSubscription = (tier: SubTier) => {
    if (currentUserState.value) {
      // Re-assign to ensure deep reactivity triggers across all components
      currentUserState.value = { 
        ...currentUserState.value, 
        subscription: tier 
      }
      
      // Update the user in the main list too
      const index = usersState.value.findIndex(u => u.id === currentUserState.value?.id)
      if (index !== -1) {
        usersState.value[index] = { 
          ...usersState.value[index], 
          subscription: tier 
        }
      }
    }
  }

  return {
    users: usersState,
    currentUser: currentUserState,
    login,
    logout,
    updateSubscription
  }
}
