"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { CategoryIcon } from "./CategoryIcon"
import { Icons } from "@/components/icons"

interface CardV2Props {
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
    onFlip?: (flipped: boolean) => void
    onToolClick?: (tool: string) => void
}

export const CardV2 = ({ 
    title, category, actionType, tools, duration, 
    content, target, penalty, metadata, onFlip, onToolClick 
}: CardV2Props) => {
    const [isFlipped, setIsFlipped] = useState(false)
    const [isRevealed, setIsRevealed] = useState(false)

    const handleFlip = () => {
        const nextState = !isFlipped
        setIsFlipped(nextState)
        if (onFlip) onFlip(nextState)
    }

    // Color mapping based on vibe (similar to difficulty in V1)
    const getColors = (vibe: string) => {
        const v = vibe.toLowerCase().trim()
        switch (v) {
            case "chaos":
            case "drama":
                return { from: "#a78bfa", to: "#7c3aed", badge: "bg-purple-500" }
            case "social":
            case "friendly":
                return { from: "#34d399", to: "#059669", badge: "bg-emerald-500" }
            case "funny":
                return { from: "#fbbf24", to: "#d97706", badge: "bg-amber-500" }
            case "strategy":
            case "brain":
                return { from: "#60a5fa", to: "#2563eb", badge: "bg-blue-500" }
            case "storytelling":
            case "deep":
                return { from: "#818cf8", to: "#4f46e5", badge: "bg-indigo-500" }
            case "hot":
            case "18+":
                return { from: "#fb7185", to: "#e11d48", badge: "bg-rose-500" }
            default:
                return { from: "#fdba74", to: "#ea580c", badge: "bg-orange-500" }
        }
    }

    const colors = getColors(metadata.vibe)

    const getCategoryName = (c: string) => {
        switch(c) {
            case "DARE": return "Thử Thách"
            case "TRUTH": return "Sự Thật"
            case "VOTE": return "Bầu Chọn"
            case "MINI_GAME": return "Trò Chơi Bàn"
            case "ROLE": return "Nhập Vai"
            case "SECRET_MISSION": return "Mật Vụ"
            case "ITEM": return "Vật Phẩm"
            case "EVENT": return "Sự Kiện"
            case "CURSE": return "Lời Nguyền"
            default: return c.replace(/_/g, " ")
        }
    }

    const renderActionType = (type: string, cat: string) => {
        if (type === "KEEP") {
            if (cat === "SECRET_MISSION") {
                return <span className="text-[10px] bg-slate-900/80 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded shadow-sm font-bold uppercase tracking-wider backdrop-blur-sm">GIỮ BÍ MẬT</span>
            }
            return <span className="text-[10px] bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded shadow-sm font-bold uppercase tracking-wider">LƯU TRỮ</span>
        }
        if (type === "GLOBAL_RULE") return <span className="text-[10px] bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded shadow-sm font-bold uppercase tracking-wider">LUẬT CHUNG</span>
        return <span className="text-[10px] bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded shadow-sm font-bold uppercase tracking-wider">TỨC THÌ</span>
    }

    const formatPenalty = (pen: {template: string, value: number} | null) => {
        if (!pen || !pen.template) return "Không có hình phạt"
        
        const beerAmount = pen.value / 2
        const beerText = beerAmount === 0.5 ? "nửa cốc bia" : `${beerAmount} cốc bia`
        
        return pen.template
            .replace("{value}", String(pen.value))
            .replace("{unit}", pen.value > 1 ? "ly" : "ly") // Custom dynamic units could be expanded
            .replace("{type}", `rượu (hoặc ${beerText})`)
    }

    return (
        <div
            className="relative w-full max-w-[90vw] sm:w-[340px] h-[65dvh] max-h-[520px] min-h-[420px] mx-auto"
            style={{ perspective: "1000px" }}
        >
            <motion.div
                className="w-full h-full relative cursor-pointer"
                onClick={handleFlip}
                whileTap={{ scale: 0.98 }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    mass: 0.8
                }}
                style={{
                    transformStyle: "preserve-3d",
                    willChange: "transform"
                }}
            >
                {/* FRONT (Card Back) */}
                <motion.div
                    className="absolute inset-0 rounded-2xl overflow-hidden border-[6px] border-white bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 pointer-events-none shadow-2xl"
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden"
                    }}
                >
                    {/* Decorative Frame */}
                    <div className="absolute inset-3 border-2 border-white/20 rounded-xl" />
                    <div className="absolute inset-4 border border-white/10 rounded-lg" />

                    {/* Corner Accents */}
                    <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
                    <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
                    <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
                    <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-lg" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/20 rounded-full" />
                            <div className="w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center bg-slate-900/80 relative z-10">
                                <div className="w-24 h-24 rounded-full border-2 border-white/10 flex items-center justify-center">
                                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-200 to-purple-400" style={{ fontFamily: 'serif' }}>DG</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <div className="text-white/60 font-bold tracking-[0.3em] text-[10px] uppercase mb-1">Drinking Game</div>
                            <div className="text-white font-black tracking-widest text-xl uppercase">Không say không về</div>
                        </div>
                        <div className="absolute bottom-12 text-white/40 text-[10px] font-medium tracking-widest uppercase animate-pulse">
                            Chạm để lật
                        </div>
                    </div>
                </motion.div>

                {/* BACK (Content) */}
                <motion.div
                    className="absolute inset-0 rounded-2xl overflow-hidden border-4 border-white bg-slate-50 flex flex-col pointer-events-none shadow-xl"
                    style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden"
                    }}
                >
                    {/* Header */}
                    <div
                        className="h-28 flex flex-col items-center justify-center relative overflow-hidden shrink-0"
                        style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
                    >
                        <div className="absolute inset-0 bg-black/15" />
                        <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 select-none text-white">
                            <CategoryIcon category={category} className="w-24 h-24" />
                        </div>
                        <div className="relative z-10 flex flex-col items-center gap-1 w-full px-2">
                            <div className="flex items-center gap-2 justify-between w-full">
                                {renderActionType(actionType, category)}
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm border border-white/20 ${colors.badge}`}>
                                    Lv.{metadata.sophistication_level}
                                </span>
                            </div>
                            <h2 className="text-[16px] sm:text-[18px] font-black text-white uppercase tracking-wide text-center leading-tight mt-1 px-3 line-clamp-3 drop-shadow-sm">
                                {title}
                            </h2>
                            <p className="text-white/80 text-[11px] font-bold tracking-widest uppercase mt-0.5">
                                — {getCategoryName(category)} —
                            </p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col flex-1 relative overflow-hidden bg-white">
                        
                        {/* Target & Duration Metadata Row */}
                        <div className="flex flex-wrap gap-2 mb-4 shrink-0 justify-center">
                            {duration.type !== "instant" && (
                                <div className="bg-slate-100 text-slate-600 border border-slate-200 text-[11px] px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 shadow-sm">
                                    <Icons.Timer className="w-3.5 h-3.5 text-slate-400" />
                                    {duration.value} {duration.type === 'timer' ? 'giây' : duration.type === 'turn' ? 'vòng' : duration.type}
                                </div>
                            )}
                            <div className="bg-slate-100 text-slate-600 border border-slate-200 text-[11px] px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 shadow-sm">
                                <Icons.Target className="w-3.5 h-3.5 text-slate-400" />
                                <span>{target.definition}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex items-center justify-center overflow-auto min-h-[100px] py-2 relative">
                            {category === "SECRET_MISSION" && !isRevealed ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsRevealed(true)
                                    }}
                                    className="absolute inset-2 z-10 bg-slate-100/80 backdrop-blur-md border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:bg-slate-200/90 active:scale-95 group shadow-sm pointer-events-auto"
                                >
                                    <Icons.EyeOff className="w-8 h-8 text-slate-400 group-hover:text-purple-500 transition-colors" />
                                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-purple-600">
                                        Chạm để xem Mật Vụ
                                    </span>
                                </button>
                            ) : null}

                            <p className={`text-center text-slate-800 font-bold text-[16px] sm:text-[17px] leading-relaxed px-2 transition-opacity duration-300 ${category === "SECRET_MISSION" && !isRevealed ? "opacity-0" : "opacity-100"}`}>
                                {content}
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="w-full flex justify-center my-3 shrink-0">
                             <div className="w-12 h-1 rounded-full bg-slate-200" />
                        </div>

                        {/* Penalty */}
                        {actionType !== "KEEP" ? (
                            <div 
                                className="rounded-xl p-3 border shadow-sm shrink-0 flex flex-col items-center justify-center relative overflow-hidden"
                                style={{
                                    backgroundColor: `${colors.from}10`, // 10% opacity hex
                                    borderColor: `${colors.from}30`
                                }}
                            >
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-60" style={{ color: colors.to }}>
                                    HÌNH PHẠT
                                </p>
                                <p className="text-center font-black text-[15px] leading-tight" style={{ color: colors.to }}>
                                    {formatPenalty(penalty)}
                                </p>
                            </div>
                        ) : (
                            <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/50 w-full shrink-0 shadow-sm flex flex-col items-center justify-center">
                                <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-80 ${category === "SECRET_MISSION" ? "text-purple-400" : "text-indigo-400"}`}>
                                    {category === "SECRET_MISSION" ? "MẬT VỤ" : "VẬT PHẨM"}
                                </p>
                                <p className={`text-center font-black text-[15px] leading-tight ${category === "SECRET_MISSION" ? "text-purple-600" : "text-indigo-600"}`}>
                                    {category === "SECRET_MISSION" ? "Hoàn thành nhiệm vụ bí mật này!" : "Giữ thẻ này để dùng sau!"}
                                </p>
                            </div>
                        )}

                        {/* Tools footer (if any) */}
                        {tools && tools.length > 0 && tools[0] !== "NONE" && (
                            <div className="mt-2 w-full flex flex-col gap-2 shrink-0 z-30 pointer-events-auto">
                                {tools.map((tool) => {
                                    // Parse icon from tool text
                                    const getToolIcon = () => {
                                        if (tool === "DICE_ROLL") return <Icons.Dices className="w-3.5 h-3.5 mb-[1px]" />
                                        if (tool === "COIN_FLIP") return <Icons.Coins className="w-3.5 h-3.5 mb-[1px]" />
                                        if (tool === "TIMER_COUNTDOWN") return <Icons.Timer className="w-3.5 h-3.5 mb-[1px]" />
                                        if (tool === "BOTTLE_SPIN") return <Icons.Bottle className="w-3.5 h-3.5 mb-[1px]" />
                                        if (tool === "CAMERA_SHOT") return <Icons.Camera className="w-3.5 h-3.5 mb-[1px]" />
                                        if (tool === "SOCIAL_POST") return <Icons.Smartphone className="w-3.5 h-3.5 mb-[1px]" />
                                        if (tool === "RNG_PICKER") return <Icons.Hash className="w-3.5 h-3.5 mb-[1px]" />
                                        return <Icons.Wrench className="w-3.5 h-3.5 mb-[1px]" />
                                    }

                                    return (
                                        <button 
                                            key={tool}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (onToolClick) onToolClick(tool)
                                            }}
                                            className="w-full text-white text-[13px] font-black py-2.5 rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide border border-white/20"
                                            style={{
                                                background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                                                boxShadow: `0 4px 10px ${colors.from}40`
                                            }}
                                        >
                                            {getToolIcon()} {tool.replace(/_/g, " ")}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}
