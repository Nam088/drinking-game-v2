import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { persist } from 'zustand/middleware'

export interface Timer {
  id: string
  label: string
  durationMs: number // Total configured duration for countdown
  remainingMs: number // Current remaining time
  isRunning: boolean
  startedAt: number | null
}

interface TimerState {
  timers: Timer[]
  
  // Actions
  addTimer: (durationMs?: number, label?: string) => void
  removeTimer: (id: string) => void
  updateLabel: (id: string, label: string) => void
  setTimerDuration: (id: string, durationMs: number) => void
  toggleTimer: (id: string) => void
  resetTimer: (id: string) => void
  tick: () => void // Called in a global interval to update all running timers
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      timers: [],
      
      addTimer: (durationMs = 60 * 1000, label = 'Đếm Ngược') => set((state) => ({
        timers: [...state.timers, { 
          id: uuidv4(), 
          label: `${label} ${state.timers.length + 1}`,
          durationMs,
          remainingMs: durationMs,
          isRunning: false,
          startedAt: null
        }]
      })),
      
      removeTimer: (id) => set((state) => ({
        timers: state.timers.filter(t => t.id !== id)
      })),
      
      updateLabel: (id, label) => set((state) => ({
        timers: state.timers.map(t => 
          t.id === id ? { ...t, label } : t
        )
      })),

      toggleTimer: (id) => set((state) => {
        const now = Date.now();
        return {
          timers: state.timers.map(t => {
            if (t.id !== id) return t;
            
            if (t.isRunning) {
              // Pause timer
              return {
                ...t,
                isRunning: false,
                startedAt: null
              };
            } else {
              // Start timer - remainingMs is what's left. We calculate new startedAt as if it just started from that remaining time
              return {
                ...t,
                isRunning: true,
                startedAt: now - (t.durationMs - t.remainingMs)
              };
            }
          })
        };
      }),

      setTimerDuration: (id: string, durationMs: number) => set((state) => ({
        timers: state.timers.map(t => 
          t.id === id ? { 
            ...t, 
            durationMs, 
            remainingMs: t.isRunning ? t.remainingMs : durationMs, // Only reset remaining if not running
            // If running, adjust startedAt so remainingMs calculation is still correct
            startedAt: t.startedAt ? Date.now() - (durationMs - t.remainingMs) : null
          } : t
        )
      })),

      resetTimer: (id) => set((state) => ({
        timers: state.timers.map(t => 
          t.id === id ? { ...t, remainingMs: t.durationMs, isRunning: false, startedAt: null } : t
        )
      })),

      tick: () => set((state) => {
        const now = Date.now();
        let changed = false;

        const updatedTimers = state.timers.map(t => {
          if (t.isRunning && t.startedAt) {
            changed = true;
            const elapsed = now - t.startedAt;
            const newRemaining = Math.max(0, t.durationMs - elapsed);
            
            if (newRemaining === 0) {
              // Timer finished
              return {
                ...t,
                remainingMs: 0,
                isRunning: false,
                startedAt: null
              }
            }
            
            return {
              ...t,
              remainingMs: newRemaining
            };
          }
          return t;
        });

        // Only trigger re-render if something actually changed
        if (!changed) return state;

        return { timers: updatedTimers };
      })
    }),
    {
      name: 'drinking-game-timers'
    }
  )
)
