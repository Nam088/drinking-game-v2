import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Player {
  id: string
  name: string
}

export interface InventoryItem {
  id: string
  cardId: number
  ownerId: string
  ownerName: string
  content: string
  penalty: string
  category: string
  difficulty: string
  acquiredAt: number
}

interface GameState {
  players: Player[]
  items: InventoryItem[]
  
  // Player Actions
  addPlayer: (name: string) => void
  editPlayer: (id: string, newName: string) => void
  removePlayer: (id: string) => void // Note: Items belonging to this player remain unless manually used/cleared
  
  // Item Actions
  addItem: (item: Omit<InventoryItem, 'id' | 'acquiredAt'>) => void
  useItem: (id: string) => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      players: [],
      items: [],
      
      addPlayer: (name) => set((state) => ({
        players: [...state.players, { id: crypto.randomUUID(), name }]
      })),
      
      editPlayer: (id, newName) => set((state) => ({
        players: state.players.map(p => p.id === id ? { ...p, name: newName } : p),
        // Update item owner names as well for consistency
        items: state.items.map(item => item.ownerId === id ? { ...item, ownerName: newName } : item)
      })),
      
      removePlayer: (id) => set((state) => ({
        players: state.players.filter(p => p.id !== id)
      })),
      
      addItem: (item) => set((state) => ({
        items: [{
          ...item,
          id: crypto.randomUUID(),
          acquiredAt: Date.now()
        }, ...state.items]
      })),
      
      useItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      }))
    }),
    {
      name: 'drinking-game-storage'
    }
  )
)
