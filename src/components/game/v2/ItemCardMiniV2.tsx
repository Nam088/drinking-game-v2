import { motion } from "framer-motion"
import { Icons } from "../../icons"
import { InventoryItemV2 } from "@/store/useGameStoreV2"
import { CategoryIcon } from "../CategoryIcon"

export const ItemCardMiniV2 = ({ item, onClick }: { item: InventoryItemV2, onClick: () => void }) => {
  const getColors = (vibe: string) => {
    const v = vibe.toLowerCase().trim()
    if (v === "chaos" || v === "drama") return { from: "#a78bfa", to: "#7c3aed" }
    if (v === "social" || v === "friendly") return { from: "#34d399", to: "#059669" }
    if (v === "funny") return { from: "#fbbf24", to: "#d97706" }
    if (v === "strategy" || v === "brain") return { from: "#60a5fa", to: "#2563eb" }
    if (v === "storytelling" || v === "deep") return { from: "#818cf8", to: "#4f46e5" }
    if (v === "hot" || v === "18+") return { from: "#fb7185", to: "#e11d48" }
    return { from: "#fdba74", to: "#ea580c" }
  }

  const colors = getColors(String(item.sophistication_level)) // Fallback or use vibe if added to InventoryItemV2

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{ willChange: "transform", cursor: "pointer" }}
      className="relative rounded-xl overflow-hidden shadow-lg border-2 border-slate-700 bg-slate-800 flex flex-col h-40 text-left w-full transition-colors hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div 
        className="h-10 flex items-center justify-between px-3 gap-2 relative overflow-hidden shrink-0"
        style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="flex items-center gap-2 z-10 w-full">
            <CategoryIcon category={item.category} className="w-5 h-5 text-white shrink-0" />
            <span className="font-bold text-white text-xs truncate font-display tracking-widest uppercase flex-1">
            {item.title || item.category.replace(/_/g, " ")}
            </span>
        </div>
      </div>

      <div className="absolute top-1 right-2 z-20">
        <span className="bg-slate-950/80 backdrop-blur text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/10 shadow-sm flex items-center gap-1">
          <Icons.User className="w-3 h-3 text-indigo-300" /> <span className="max-w-[60px] truncate">{item.ownerName}</span>
        </span>
      </div>

      <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden relative">
        <p className="text-slate-300 text-xs line-clamp-3 font-medium flex-1 pt-1">
          {item.content}
        </p>
        
        {/* V2 metadata brief */}
        <div className="mt-1 flex gap-1 z-10 opacity-70">
            {item.duration.type !== 'instant' && (
                <span className="text-[8px] bg-slate-900 border border-slate-700 px-1 py-0.5 rounded text-slate-400 font-bold">
                    ⏱ {item.duration.value} {item.duration.type}
                </span>
            )}
        </div>

        <div className="mt-2 text-[10px] text-indigo-400 uppercase tracking-widest font-bold flex items-center gap-1">
          <Icons.Info className="w-3 h-3" /> Xem thẻ V2
        </div>
      </div>
    </motion.div>
  )
}
