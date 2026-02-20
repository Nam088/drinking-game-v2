"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/game/Card"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { InventoryDrawer } from "@/components/game/inventory/InventoryDrawer"
import { KeepItemModal } from "@/components/game/inventory/KeepItemModal"
import { PlayerManager } from "@/components/game/inventory/PlayerManager"
import { RuleModal } from "@/components/game/RuleModal"
import { useGameStore } from "@/store/useGameStore"
import { Icons } from "@/components/icons"

interface CardData {
  id: number
  category: string
  content: string
  penalty: string
  difficulty: string
}

export default function GamePage() {
  const [currentCard, setCurrentCard] = useState<CardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDrawing, setIsDrawing] = useState(false)
  const [exitDirection, setExitDirection] = useState(-300)
  const [dragRotation, setDragRotation] = useState(0)

  // Modals state
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)
  const [isPlayerManagerOpen, setIsPlayerManagerOpen] = useState(false)
  const [isKeepModalOpen, setIsKeepModalOpen] = useState(false)
  const [isRulesOpen, setIsRulesOpen] = useState(false)

  const { items } = useGameStore()

  const drawCard = async () => {
    if (isDrawing) return
    setIsDrawing(true)

    try {
      const res = await fetch("/api/cards/random")
      const data = await res.json()

      if (data.success && data.card) {
        setCurrentCard(data.card)
      }
    } catch (error) {
      console.error("Failed to draw card", error)
    } finally {
      setIsDrawing(false)
      setLoading(false)
    }
  }

  // Auto-draw first card on mount
  useEffect(() => {
    drawCard()
  }, [])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50

    // Swipe left or right to draw next card
    if (Math.abs(info.offset.x) > swipeThreshold) {
      // Set exit direction based on swipe direction
      setExitDirection(info.offset.x > 0 ? 300 : -300)
      setDragRotation(info.offset.x > 0 ? 15 : -15)
      drawCard()
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />

      {/* Top action bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-30">
        <div className="flex gap-2">
          <button
            onClick={() => setIsRulesOpen(true)}
            className="bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md border border-white/10 text-white p-3 rounded-full shadow-lg transition-colors flex items-center justify-center"
          >
            <Icons.Info className="w-5 h-5 text-slate-300" />
          </button>
          <button
            onClick={() => setIsPlayerManagerOpen(true)}
            className="bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md border border-white/10 text-white p-3 rounded-full shadow-lg transition-colors flex items-center justify-center"
          >
            <Icons.Users className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        <button
          onClick={() => setIsInventoryOpen(true)}
          className="relative bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md border border-white/10 text-white p-3 rounded-full shadow-lg transition-colors flex items-center justify-center"
        >
          <Icons.Backpack className="w-5 h-5 text-slate-300" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900">
              {items.length}
            </span>
          )}
        </button>
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center mt-12">
        {/* Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl sm:text-5xl text-white drop-shadow-lg tracking-wide uppercase font-display">
            Không say không về
          </h1>
          <p className="text-slate-400 mt-2 font-medium tracking-wider text-sm">
            Chế độ nhậu vô hạn
          </p>
        </motion.div>

        {/* Card Area with Deck */}
        <div
          className="relative w-full min-h-[480px] flex items-center justify-center"
          style={{ perspective: "1500px" }}
        >
          {/* Stacked Cards - Deck Background (Fixed position with slight rotation) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[3, 2, 1].map((i) => (
              <div
                key={i}
                className="absolute w-full max-w-[90vw] sm:w-[320px] h-[480px] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-4 border-white/10 shadow-xl"
                style={{
                  transform: `translateY(${i * 8}px) translateZ(-${i * 20}px) scale(${1 - i * 0.02}) rotate(${-2 + i * 0.5}deg)`,
                  opacity: 0.3 + (3 - i) * 0.2,
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Dot pattern on deck cards */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
                    backgroundSize: "20px 20px"
                  }}
                />
              </div>
            ))}
          </div>

          {/* Active Card */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center relative z-20"
              >
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : currentCard ? (
              <motion.div
                key={currentCard.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.9}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{
                  x: exitDirection,
                  y: -100,
                  opacity: 0,
                  scale: 0.7,
                  rotate: dragRotation
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-full relative z-20 flex flex-col items-center"
                style={{
                  cursor: "grab"
                }}
                whileDrag={{
                  cursor: "grabbing",
                  scale: 1.05
                }}
              >
                <Card {...currentCard} />

                {/* Keep Item Button overlay below the card if it's an ITEM */}
                {currentCard.category === 'ITEM' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-16 w-full max-w-[90vw] sm:w-[320px]"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsKeepModalOpen(true)
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/25 border border-purple-400/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Icons.Backpack className="w-5 h-5" /> Cất Vào Túi Đồ
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <motion.div
          className="mt-20 text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: currentCard && !loading ? 1 : 0 }}
        >
          <p className="text-white/40 text-xs sm:text-sm font-medium tracking-widest uppercase">
            Chạm Để Lật Bài
          </p>
          <p className="text-white/40 text-xs sm:text-sm font-medium tracking-widest uppercase">
            Vuốt Để Rút Bài Mới
          </p>
        </motion.div>

        {/* Card Count Info */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: currentCard && !loading ? 1 : 0 }}
        >
          <p className="text-white/20 text-xs font-medium">
            Lá bài #{currentCard?.id || 0}
          </p>
        </motion.div>
      </div>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {isRulesOpen && (
          <RuleModal onClose={() => setIsRulesOpen(false)} />
        )}
        {isPlayerManagerOpen && (
          <PlayerManager onClose={() => setIsPlayerManagerOpen(false)} />
        )}
        {isKeepModalOpen && currentCard && (
          <KeepItemModal 
            card={currentCard}
            onClose={() => setIsKeepModalOpen(false)}
            onSuccess={() => {
              setIsKeepModalOpen(false)
              // Auto draw next card after keeping
              setExitDirection(-300)
              setDragRotation(-15)
              drawCard()
            }}
          />
        )}
      </AnimatePresence>

      <InventoryDrawer 
        isOpen={isInventoryOpen} 
        onClose={() => setIsInventoryOpen(false)} 
      />
    </div>
  )
}
