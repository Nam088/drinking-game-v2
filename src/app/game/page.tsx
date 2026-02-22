"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/game/Card"
import { motion, AnimatePresence, PanInfo } from "framer-motion"

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

            <div className="relative z-10 w-full max-w-md flex flex-col items-center">
                {/* Title */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-5xl sm:text-6xl font-black text-white drop-shadow-lg tracking-tighter">
                        Nhậu đê
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
                                dragElastic={0.7}
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
                                transition={{ type: "spring", stiffness: 260, damping: 25 }}
                                className="w-full relative z-20"
                                style={{
                                    cursor: "grab"
                                }}
                                whileDrag={{
                                    cursor: "grabbing",
                                    scale: 1.05
                                }}
                            >
                                <Card {...currentCard} />
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>

                {/* Instructions */}
                <motion.div
                    className="mt-8 text-center space-y-2"
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
        </div>
    )
}
