"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { CategoryIcon } from "./CategoryIcon"

interface CardProps {
    category: string
    content: string
    penalty: string
    difficulty: string
    onFlip?: (flipped: boolean) => void
}

export const Card = ({ category, content, penalty, difficulty, onFlip }: CardProps) => {
    const [isFlipped, setIsFlipped] = useState(false)

    const handleFlip = () => {
        const nextState = !isFlipped
        setIsFlipped(nextState)
        if (onFlip) onFlip(nextState)
    }

    // Comprehensive Color Mapping
    const getColors = (diff: string) => {
        const d = diff.toLowerCase().trim()
        switch (d) {
            case "hard":
            case "dark":
                return { from: "#ef4444", to: "#b91c1c", badge: "bg-red-500" }
            case "fun":
            case "easy":
                return { from: "#4ade80", to: "#16a34a", badge: "bg-green-500" }
            case "chaos":
            case "drama":
                return { from: "#a78bfa", to: "#7c3aed", badge: "bg-purple-500" }
            case "tactical":
            case "service":
                return { from: "#60a5fa", to: "#2563eb", badge: "bg-blue-500" }
            case "skill":
            case "brain":
                return { from: "#fbbf24", to: "#d97706", badge: "bg-amber-500" }
            case "18+":
            case "hot":
                return { from: "#fb7185", to: "#e11d48", badge: "bg-rose-500" }
            case "physical":
            case "body":
                return { from: "#fdba74", to: "#ea580c", badge: "bg-orange-500" }
            case "luck":
                return { from: "#34d399", to: "#059669", badge: "bg-emerald-500" }
            case "deep":
                return { from: "#818cf8", to: "#4f46e5", badge: "bg-indigo-500" }
            case "bựa":
                return { from: "#a3e635", to: "#65a30d", badge: "bg-lime-500" }
            case "roleplay":
                return { from: "#f472b6", to: "#db2777", badge: "bg-pink-500" }
            default:
                return { from: "#9ca3af", to: "#4b5563", badge: "bg-gray-500" }
        }
    }

    const colors = getColors(difficulty)

    // Category Vietnamese Mapping
    const getCategoryInfo = (cat: string) => {
        const c = cat.toUpperCase().trim().replace(/_/g, "-")
        switch (c) {
            case "DARE":
                return {
                    name: "Thử Thách",
                    desc: "Thực hiện hành động điên rồ. Không làm thì uống."
                }
            case "TRUTH":
                return {
                    name: "Sự Thật",
                    desc: "Trả lời thật lòng câu hỏi nhạy cảm. Không trả lời thì uống."
                }
            case "GROUP-TRUTH":
            case "GROUP_TRUTH":
                return {
                    name: "Hội Đồng Thú Tội",
                    desc: "Ai đã từng làm thì tự giác uống."
                }
            case "PARTNER":
                return {
                    name: "Cặp Đôi",
                    desc: "Chọn người khác để cùng thực hiện thử thách."
                }
            case "MINI-GAME":
            case "MINI_GAME":
                return {
                    name: "Trò Chơi Nhỏ",
                    desc: "Trò chơi ngắn để phân thắng thua."
                }
            case "VOTE":
                return {
                    name: "Bầu Chọn",
                    desc: "Ai bị chỉ nhiều nhất thì uống."
                }
            case "BRAIN":
                return {
                    name: "Hack Não",
                    desc: "Trí tuệ, kiến thức. Sai thì uống."
                }
            case "SKILL":
                return {
                    name: "Khéo Léo",
                    desc: "Kỹ năng vận động tinh. Thất bại thì uống."
                }
            case "CURSE":
                return {
                    name: "Lời Nguyền",
                    desc: "Luật cấm có hiệu lực trong một khoảng thời gian."
                }
            case "BUDDY":
                return {
                    name: "Đồng Minh",
                    desc: "Kết nối vận mệnh. Người này uống thì người kia cũng uống."
                }
            case "ITEM":
                return {
                    name: "Vật Phẩm",
                    desc: "Quyền năng có thể giữ lại để dùng sau."
                }
            case "SECRET":
                return {
                    name: "Mật Vụ",
                    desc: "Nhiệm vụ bí mật. Lừa người khác vào bẫy."
                }
            default:
                return { name: cat.replace(/_/g, " "), desc: "" }
        }
    }

const categoryInfo = getCategoryInfo(category)

    return (
        <div
            className="relative w-full max-w-[90vw] sm:w-[320px] h-[480px] mx-auto"
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
                    className="absolute inset-0 rounded-2xl overflow-hidden border-[6px] border-white shadow-lg bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 pointer-events-none"
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

                    {/* Central Logo */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {/* Outer Glow Circle */}
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
                    className="absolute inset-0 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white flex flex-col pointer-events-none"
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
                        <div className="absolute inset-0 bg-black/10" />

                        {/* Icon Background */}
                        <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 select-none text-white">
                            <CategoryIcon category={category} className="w-24 h-24" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-1">
                            <CategoryIcon category={category} className="w-12 h-12 text-white" />
                            <h2 className="text-xl font-black text-white uppercase tracking-wide text-center px-3 leading-tight">
                                {categoryInfo.name}
                            </h2>
                            {categoryInfo.desc && (
                                <p className="text-white/80 text-[10px] italic font-medium tracking-wide">
                                    {categoryInfo.desc}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col flex-1 relative overflow-hidden">
                        {/* Content */}
                        <div className="flex-1 flex items-center justify-center overflow-hidden min-h-[100px] py-2">
                            <p className="text-center text-slate-800 font-bold text-lg leading-relaxed px-2 line-clamp-6">
                                {content}
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-slate-200 my-2 shrink-0" />

                        {/* Penalty */}
                        {category !== "ITEM" ? (
                            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 shrink-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 text-center">Hình Phạt</p>
                                <p className="text-center font-black text-base" style={{ color: colors.to }}>
                                    {penalty}
                                </p>
                            </div>
                        ) : (
                            <div className="shrink-0 flex justify-center pb-8 sm:pb-0">
                                {/* The keep button will be rendered by the parent if needed, 
                                    or we just show a hint here since the drag action is the main interaction */}
                                <div className="bg-purple-50 rounded-xl p-2.5 border border-purple-100 w-full mb-4 sm:mb-0">
                                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-0.5 text-center">Vật Phẩm</p>
                                    <p className="text-center font-bold text-purple-600 text-sm">
                                        Giữ thẻ này để dùng sau!
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Difficulty Badge */}
                        <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 rounded text-[9px] font-bold text-white shadow-sm ${colors.badge}`}>
                                {difficulty}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}
