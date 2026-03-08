import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { persist } from 'zustand/middleware'

export interface Player {
  id: string
  name: string
}

export interface InventoryItemV2 {
  id: string
  cardId: number
  ownerId: string
  ownerName: string
  title: string
  content: string
  actionType: string
  duration: {
    type: string
    value: number
  }
  target: {
    type: string
    count: number
    definition: string
  }
  penalty: {
    template: string
    value: number
  } | null
  category: string
  sophistication_level: string | number
  acquiredAt: number
}

interface GameStateV2 {
  players: Player[]
  items: InventoryItemV2[]
  
  // Player Actions
  addPlayer: (name: string) => void
  editPlayer: (id: string, newName: string) => void
  removePlayer: (id: string) => void
  
  // Item Actions
  addItem: (item: Omit<InventoryItemV2, 'id' | 'acquiredAt'>) => void
  useItem: (id: string) => void
}

export const useGameStoreV2 = create<GameStateV2>()(
  persist(
    (set) => ({
      players: [],
      items: [],
      
      addPlayer: (name) => set((state) => ({
        players: [...state.players, { id: uuidv4(), name }]
      })),
      
      editPlayer: (id, newName) => set((state) => ({
        players: state.players.map(p => p.id === id ? { ...p, name: newName } : p),
        items: state.items.map(item => item.ownerId === id ? { ...item, ownerName: newName } : item)
      })),
      
      removePlayer: (id) => set((state) => ({
        players: state.players.filter(p => p.id !== id)
      })),
      
      addItem: (item) => set((state) => ({
        items: [{
          ...item,
          id: uuidv4(),
          acquiredAt: Date.now()
        }, ...state.items]
      })),
      
      useItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      }))
    }),
    {
      name: 'drinking-game-storage-v2'
    }
  )
)
