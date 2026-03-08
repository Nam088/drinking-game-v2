"use client"

import { useEffect, useState, useCallback } from "react"
import { CardV2 } from "@/components/game/CardV2"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { InventoryDrawerV2 } from "@/components/game/v2/InventoryDrawerV2"
import { ActionBarV2 } from "@/components/game/v2/ActionBarV2"
import { PlayerManagerV2 } from "@/components/game/v2/PlayerManagerV2"
import { RuleModalV2 } from "@/components/game/v2/RuleModalV2"
import { TimerPanelV2 } from "@/components/game/v2/TimerPanelV2"
import { KeepItemModalV2 } from "@/components/game/v2/KeepItemModalV2"
import { ToolModalV2 } from "@/components/game/v2/ToolModalV2"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { useTimerStore } from "@/store/useTimerStore"

interface CardV2Data {
    id: number
    title: string
    category: string
    actionType: string
    tools: string[]
    duration: {
        type: string
        value: number
    }
    content: string
    target: {
        type: string
        count: number
        definition: string
    }
    penalty: {
        template: string
        value: number
    } | null
    metadata: {
        vibe: string
        sophistication_level: string | number
    }
}

export default function GamePageV2() {
  const [currentCard, setCurrentCard] = useState<CardV2Data | null>(null)
  const [nextCard, setNextCard] = useState<CardV2Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDrawing, setIsDrawing] = useState(false)
  
  // Track seen cards to prevent duplicates
  const [excludeIds, setExcludeIds] = useState<number[]>([])

  const preloadNextCard = useCallback(async (currentExcludeIds: number[]) => {
    try {
      const res = await fetch("/api/cards-v2/random", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excludeIds: currentExcludeIds })
      })
      const data = await res.json()
      if (data.success && data.card) {
        setNextCard(data.card)
      }
    } catch (error) {
      console.error("Failed to preload next card v2", error)
    }
  }, [])

  const [exitDirection, setExitDirection] = useState(-300)
  const [dragRotation, setDragRotation] = useState(0)
  const [isCardFlipped, setIsCardFlipped] = useState(false)

  // Modals state
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)
  const [isPlayerManagerOpen, setIsPlayerManagerOpen] = useState(false)
  const [isRulesOpen, setIsRulesOpen] = useState(false)
  const [isTimersOpen, setIsTimersOpen] = useState(false)
  const [isKeepItemModalOpen, setIsKeepItemModalOpen] = useState(false)
  const [activeTool, setActiveTool] = useState<string | null>(null)

  const { addTimer, clearTimers } = useTimerStore()

  const drawCard = useCallback(async (forceEmptyExclude = false) => {
    if (isDrawing) return
    setIsDrawing(true)
    setLoading(true)
    setIsCardFlipped(false)

    try {
      let cardToDraw: CardV2Data | null = null
      const currentExcludes = forceEmptyExclude ? [] : excludeIds
      let updatedExcludeIds = [...currentExcludes]

      if (nextCard && !forceEmptyExclude) {
        cardToDraw = nextCard
        setNextCard(null)
      } else {
        const res = await fetch("/api/cards-v2/random", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ excludeIds: currentExcludes })
        })
        const data = await res.json()
        if (data.success && data.card) {
          cardToDraw = data.card
        }
      }

      if (cardToDraw) {
        // Clear all old timers before showing new card
        clearTimers()
        
        setCurrentCard(cardToDraw)
        updatedExcludeIds = [...currentExcludes, cardToDraw.id]
        setExcludeIds(updatedExcludeIds)
        localStorage.setItem('v2_excludeIds', JSON.stringify(updatedExcludeIds))
      }
      
      // Preload the next card with the newly updated excludeIds
      preloadNextCard(updatedExcludeIds)

    } catch (error) {
      console.error("Failed to draw card v2:", error)
    } finally {
      setLoading(false)
      setIsDrawing(false)
    }
  }, [isDrawing, nextCard, excludeIds, preloadNextCard, clearTimers])

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)

  // Load seen cards from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('v2_excludeIds')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setExcludeIds(parsed)
        }
      } catch (e) {
        console.error("Failed to parse saved excludeIds", e)
      }
    }
  }, [])

  // Actually trigger the first draw right away safely
  useEffect(() => {
    // Only auto-draw if currentCard is empty to avoid double fetch
    // But since localStorage might be async, we defer drawing slightly
    const timer = setTimeout(() => {
        if(!currentCard && !isDrawing) drawCard()
    }, 100)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50

    if (Math.abs(info.offset.x) > swipeThreshold) {
      setExitDirection(info.offset.x > 0 ? 300 : -300)
      setDragRotation(info.offset.x > 0 ? 15 : -15)
      drawCard()
    }
  }

  const handleResetDeck = () => {
    setExcludeIds([])
    localStorage.removeItem('v2_excludeIds')
    setIsResetConfirmOpen(false)
    setNextCard(null)
    setCurrentCard(null) // force reset
    // drawCard will trigger because of the useEffect below if we set isDrawing to false
    setTimeout(() => {
        setIsDrawing(false)
        setLoading(false)
        // Manual draw
        drawCard(true) 
    }, 100)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative bg-slate-950">
      
      <ActionBarV2 
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenPlayerManager={() => setIsPlayerManagerOpen(true)}
        onOpenTimers={() => setIsTimersOpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
      />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center mt-6 sm:mt-8">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4 sm:mb-6 text-center"
        >
          <div className="flex items-center justify-center gap-4 relative">
             <h1 className="text-3xl sm:text-5xl text-white drop-shadow-lg tracking-wide uppercase font-display select-none">
               Chế Độ: <span className="text-indigo-400">Bùng Nổ</span>
             </h1>
          </div>
          <p className="text-slate-400 mt-2 font-medium tracking-wider text-sm select-none">
            Phiên bản nâng cấp luật chơi
          </p>
          <Link href="/" className="mt-4 px-4 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors inline-block select-none">
            ← Trở về Bản Cũ (V1)
          </Link>
        </motion.div>

        <div
          className="relative w-full h-[65dvh] max-h-[520px] min-h-[420px] flex items-center justify-center"
          style={{ perspective: "1500px", contain: "layout style" }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[3, 2, 1].map((i) => (
              <div
                key={i}
                className="absolute w-full max-w-[90vw] sm:w-[340px] h-full sm:h-[520px] max-h-full rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 border-4 border-white/10"
                style={{
                  transform: `translateY(${i * 8}px) scale(${1 - i * 0.02}) rotate(${-2 + i * 0.5}deg)`,
                  opacity: 0.3 + (3 - i) * 0.2,
                  willChange: "transform"
                }}
              >
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
                    backgroundSize: "20px 20px"
                  }}
                />
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center relative z-20"
              >
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
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
                <CardV2 
                  {...currentCard} 
                  onFlip={setIsCardFlipped} 
                  onToolClick={(tool) => {
                    if (tool === "TIMER_COUNTDOWN") {
                      if (currentCard.duration.type === 'timer' && currentCard.duration.value > 0) {
                        addTimer(currentCard.duration.value * 1000, currentCard.title)
                      } else {
                        addTimer(30 * 1000, "Đếm Giờ")
                      }
                      setIsTimersOpen(true)
                    } else {
                      setActiveTool(tool)
                    }
                  }}
                />

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
                          setIsKeepItemModalOpen(true)
                        }}
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black py-4 rounded-xl border border-indigo-400/50 transition-transform active:scale-95 flex items-center justify-center gap-2 text-lg tracking-wide shadow-lg shadow-indigo-600/30"
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

        <motion.div
          className="mt-4 w-full flex items-center justify-between px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: currentCard && !loading ? 1 : 0 }}
        >
          <p className="text-white/20 font-mono text-xs font-bold tracking-widest">
            # {currentCard?.id?.toString().padStart(4, '0') || '0000'} | Đã xem: {excludeIds.length}
          </p>
          
          <button 
           onClick={() => setIsResetConfirmOpen(true)}
           className="text-white/40 hover:text-white/80 active:scale-95 transition-all flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded"
          >
           <Icons.RotateCcw className="w-3 h-3" /> Reset Bàn Mới
          </button>
        </motion.div>
      </div>

      {/* Floating Action Button for Tools Menu */}
      <button
        onClick={() => setActiveTool("MENU")}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(79,70,229,0.5)] border-2 border-indigo-400/30 transition-transform active:scale-95"
      >
        <Icons.Wrench className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isRulesOpen && (
          <RuleModalV2 onClose={() => setIsRulesOpen(false)} />
        )}
        {isPlayerManagerOpen && (
          <PlayerManagerV2 onClose={() => setIsPlayerManagerOpen(false)} />
        )}
        {isKeepItemModalOpen && currentCard && (
          <KeepItemModalV2 
            card={currentCard}
            onClose={() => setIsKeepItemModalOpen(false)}
            onSuccess={() => {
              setIsKeepItemModalOpen(false)
              drawCard()
            }}
          />
        )}
        {activeTool && (
          <ToolModalV2 
            isOpen={!!activeTool} 
            toolType={activeTool} 
            onClose={() => setActiveTool(null)} 
            onToolSelect={(tool) => setActiveTool(tool)}
            onOpenTimers={() => {
              setActiveTool(null)
              setIsTimersOpen(true)
            }}
          />
        )}
      </AnimatePresence>

      <TimerPanelV2 isOpen={isTimersOpen} onClose={() => setIsTimersOpen(false)} />

      <InventoryDrawerV2 
        isOpen={isInventoryOpen} 
        onClose={() => setIsInventoryOpen(false)} 
      />

      <AnimatePresence>
         {isResetConfirmOpen && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
             onClick={(e) => e.target === e.currentTarget && setIsResetConfirmOpen(false)}
           >
             <motion.div
               initial={{ scale: 0.9, y: 20, opacity: 0 }}
               animate={{ scale: 1, y: 0, opacity: 1 }}
               exit={{ scale: 0.9, y: 20, opacity: 0 }}
               className="bg-slate-900 border border-slate-700/80 w-full max-w-sm rounded-3xl shadow-2xl p-6 relative flex flex-col items-center"
             >
                <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-4">
                  <Icons.Trash className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-rose-500 uppercase tracking-widest text-center mb-2">Trộn Lại Bài?</h3>
                <p className="text-slate-400 text-sm text-center mb-6">
                  Bạn có chắc muốn xoá lịch sử ({excludeIds.length} lá) và bắt đầu một bàn chơi mới? Các lá bài đã rút có thể sẽ xuất hiện lại.
                </p>
                
                <div className="w-full flex gap-3">
                   <button 
                     onClick={() => setIsResetConfirmOpen(false)}
                     className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition-colors"
                   >
                     HỦY
                   </button>
                   <button 
                     onClick={handleResetDeck}
                     className="flex-1 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-rose-500/20"
                   >
                     XOÁ TRÍ NHỚ
                   </button>
                </div>
             </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  )
}
