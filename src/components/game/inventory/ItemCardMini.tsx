import { motion } from "framer-motion"
import { Icons } from "../../icons"
import { InventoryItem } from "@/store/useGameStore"
import { CategoryIcon } from "../CategoryIcon"

export const ItemCardMini = ({ item, onClick }: { item: InventoryItem, onClick: () => void }) => {
  const getColors = (diff: string) => {
    const d = diff.toLowerCase().trim()
    if (d === "hard" || d === "dark") return { from: "#ef4444", to: "#b91c1c" }
    if (d === "fun" || d === "easy") return { from: "#4ade80", to: "#16a34a" }
    if (d === "chaos" || d === "drama") return { from: "#a78bfa", to: "#7c3aed" }
    return { from: "#8b5cf6", to: "#6d28d9" }
  }

  const colors = getColors(item.difficulty)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{ willChange: "transform", cursor: "pointer" }}
      className="relative rounded-xl overflow-hidden shadow-lg border-2 border-slate-700 bg-slate-800 flex flex-col h-40 text-left w-full transition-colors hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <div 
        className="h-10 flex items-center px-3 gap-2 relative overflow-hidden shrink-0"
        style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <CategoryIcon category={item.category} className="w-5 h-5 text-white z-10" />
        <span className="font-bold text-white text-xs z-10 truncate font-display tracking-widest uppercase">
          {item.category.replace(/_/g, " ")}
        </span>
      </div>

      <div className="absolute top-2 right-2 z-20">
        <span className="bg-slate-950/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/10 shadow-sm flex items-center gap-1">
          <Icons.User className="w-3 h-3 text-slate-300" /> {item.ownerName}
        </span>
      </div>

      <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden">
        <p className="text-slate-300 text-xs line-clamp-3 font-medium flex-1">
          {item.content}
        </p>
        <div className="mt-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1">
          <Icons.Info className="w-3 h-3" /> Chi tiết
        </div>
      </div>
    </motion.div>
  )
}
