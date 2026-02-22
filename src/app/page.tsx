"use client"

import { useEffect, useState, useCallback } from "react"
import { Card } from "@/components/game/Card"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { InventoryDrawer } from "@/components/game/inventory/InventoryDrawer"
import { ActionBar } from "@/components/game/ActionBar"
import { KeepItemModal } from "@/components/game/inventory/KeepItemModal"
import { PlayerManager } from "@/components/game/inventory/PlayerManager"
import { RuleModal } from "@/components/game/RuleModal"
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
  const [nextCard, setNextCard] = useState<CardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDrawing, setIsDrawing] = useState(false)

  const preloadNextCard = useCallback(async () => {
    try {
      const res = await fetch("/api/cards/random")
      const data = await res.json()
      if (data.success && data.card) {
        setNextCard(data.card)
      }
    } catch (error) {
      console.error("Failed to preload next card", error)
    }
  }, [])
  const [exitDirection, setExitDirection] = useState(-300)
  const [dragRotation, setDragRotation] = useState(0)
  const [isCardFlipped, setIsCardFlipped] = useState(false)

  // Modals state
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)
  const [isPlayerManagerOpen, setIsPlayerManagerOpen] = useState(false)
  const [isKeepModalOpen, setIsKeepModalOpen] = useState(false)
  const [isRulesOpen, setIsRulesOpen] = useState(false)

  const drawCard = useCallback(async () => {
    if (loading || isDrawing) return
    setIsDrawing(true)
    setLoading(true) // Set loading to true when drawing a new card
    setIsCardFlipped(false) // Reset card flip state

    try {
      let cardToDraw: CardData | null = null
      if (nextCard) {
        cardToDraw = nextCard
        setNextCard(null) // Clear nextCard after using it
      } else {
        // Fallback if nextCard isn't preloaded
        const res = await fetch("/api/cards/random")
        const data = await res.json()
        if (data.success && data.card) {
          cardToDraw = data.card
        }
      }

      if (cardToDraw) {
        setCurrentCard(cardToDraw)
      }
    } catch (error) {
      console.error("Failed to draw card:", error)
    } finally {
      setLoading(false)
      setIsDrawing(false)
      preloadNextCard() // Preload the *next* card
    }
  }, [loading, isDrawing, nextCard, preloadNextCard])

  // Auto-draw first card on mount
  useEffect(() => {
    drawCard()
  }, [drawCard])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative bg-slate-950">
      
      {/* Top action bar */}
      <ActionBar 
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenPlayerManager={() => setIsPlayerManagerOpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
      />

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
          style={{ perspective: "1500px", contain: "layout style" }}
        >
          {/* Stacked Cards - Deck Background (Fixed position with slight rotation) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[3, 2, 1].map((i) => (
              <div
                key={i}
                className="absolute w-full max-w-[90vw] sm:w-[320px] h-[480px] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-4 border-white/10 shadow-xl"
                style={{
                  transform: `translateY(${i * 8}px) scale(${1 - i * 0.02}) rotate(${-2 + i * 0.5}deg)`,
                  opacity: 0.3 + (3 - i) * 0.2,
                  willChange: "transform"
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
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{
                  x: exitDirection,
                  y: -50,
                  opacity: 0,
                  scale: 0.8,
                  rotate: dragRotation
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.8 }}
                className="w-full relative z-20 flex flex-col items-center"
                style={{
                  cursor: "grab",
                  touchAction: "none",
                  willChange: "transform"
                }}
                whileDrag={{
                  cursor: "grabbing",
                  scale: 1.02
                }}
              >
                <Card {...currentCard} onFlip={setIsCardFlipped} />

                {/* Keep Item Button overlay below the card if it's an ITEM */}
                <AnimatePresence>
                  {currentCard.category === 'ITEM' && isCardFlipped && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.2 }}
                      className="absolute -bottom-20 w-[95%] sm:w-full z-50 pointer-events-auto"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsKeepModalOpen(true)
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 rounded-xl shadow-[0_10px_30px_rgba(168,85,247,0.4)] border border-purple-400/50 transition-transform active:scale-95 flex items-center justify-center gap-2 text-lg tracking-wide"
                      >
                        <Icons.Backpack className="w-5 h-5" /> Cất Vào Túi Đồ
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <AnimatePresence>
          {currentCard && !loading && !isCardFlipped && (
            <motion.div
              className="mt-16 text-center space-y-2 pointer-events-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-white/40 text-xs sm:text-sm font-medium tracking-widest uppercase animate-pulse">
                Chạm Để Lật Bài
              </p>
            </motion.div>
          )}
          
          {currentCard && !loading && isCardFlipped && (
            <motion.div
              className="mt-16 flex items-center justify-center gap-4 text-white/30 text-[10px] font-bold tracking-widest uppercase pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Icons.ChevronLeft className="w-4 h-4" /> Vuốt bỏ <Icons.ChevronRight className="w-4 h-4 ml-2" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Count Info */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: currentCard && !loading ? 1 : 0 }}
        >
          <p className="text-white/10 font-mono text-xs font-bold tracking-widest">
            # {currentCard?.id?.toString().padStart(4, '0') || '0000'}
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
