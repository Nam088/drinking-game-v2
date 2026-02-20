"use client"

import { useGameStore, InventoryItem } from "@/store/useGameStore"
import { motion, AnimatePresence } from "framer-motion"
import { CategoryIcon } from "../CategoryIcon"
import { useState } from "react"
import { Icons } from "../../icons"

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
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
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
    </motion.button>
  )
}

export const InventoryDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { items, useItem } = useGameStore()
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [isUsing, setIsUsing] = useState(false)

  const sortedItems = [...items].sort((a, b) => b.acquiredAt - a.acquiredAt)

  const handleUse = () => {
    if (!selectedItem) return
    setIsUsing(true)
    setTimeout(() => {
      useItem(selectedItem.id)
      setSelectedItem(null)
      setIsUsing(false)
    }, 600)
  }

  // Handle close correctly (close detail view first if open)
  const handleClose = () => {
    if (selectedItem) {
      setSelectedItem(null)
    } else {
      onClose()
    }
  }

  const getColors = (diff: string) => {
    const d = diff.toLowerCase().trim()
    if (d === "hard" || d === "dark") return { from: "#ef4444", to: "#b91c1c", text: "text-red-500" }
    if (d === "fun" || d === "easy") return { from: "#4ade80", to: "#16a34a", text: "text-green-500" }
    if (d === "chaos" || d === "drama") return { from: "#a78bfa", to: "#7c3aed", text: "text-purple-500" }
    return { from: "#8b5cf6", to: "#6d28d9", text: "text-indigo-500" }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 w-full md:max-w-md bg-slate-950 border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/50 backdrop-blur shrink-0 max-h-16">
              <div className="flex items-center gap-3">
                {selectedItem && (
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-300 transition-colors"
                  >
                    <Icons.ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <h2 className="text-xl font-black text-white font-display tracking-wider uppercase flex items-center gap-2">
                  <Icons.Backpack className="w-6 h-6 text-purple-400" />
                  {selectedItem ? "Chi Tiết" : "Túi Đồ"}
                  {!selectedItem && <span className="text-purple-400 text-sm">({items.length})</span>}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {!selectedItem ? (
                  /* List View */
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full overflow-y-auto p-4 bg-slate-900/40"
                  >
                    {items.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-50">
                        <Icons.Backpack className="w-16 h-16 text-slate-500 mb-4" />
                        <p className="text-white text-base font-medium">Túi trống không!</p>
                        <p className="text-slate-400 text-sm mt-1">Hãy bốc bài và nhặt vật phẩm</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 pb-8">
                        {sortedItems.map(item => (
                          <ItemCardMini 
                            key={item.id} 
                            item={item} 
                            onClick={() => setSelectedItem(item)} 
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  /* Detail View */
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 50 }}
                    className="h-full overflow-y-auto p-6 flex flex-col items-center"
                  >
                    <div className="w-full max-w-sm flex-1 flex flex-col">
                      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl mb-6 flex-1 flex flex-col">
                        
                        {/* Detail Header */}
                        <div 
                          className="p-6 flex flex-col items-center relative"
                          style={{ background: `linear-gradient(135deg, ${getColors(selectedItem.difficulty).from}, ${getColors(selectedItem.difficulty).to})` }}
                        >
                          <div className="absolute inset-0 bg-black/10" />
                          <CategoryIcon category={selectedItem.category} className="w-16 h-16 text-white drop-shadow-lg relative z-10 mb-2" />
                          <h3 className="text-2xl font-black text-white uppercase tracking-wider text-center relative z-10 drop-shadow-md">
                            {selectedItem.category.replace(/_/g, " ")}
                          </h3>
                        </div>

                        {/* Owner Badge */}
                        <div className="px-6 pt-6 flex justify-center">
                          <div className="bg-slate-900 px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2 shadow-inner">
                            <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Sở hữu:</span>
                            <span className="text-sm text-white font-medium flex items-center gap-1">
                              <Icons.User className="w-4 h-4 text-purple-400" /> {selectedItem.ownerName}
                            </span>
                          </div>
                        </div>

                        {/* Detail Body */}
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex-1 flex items-center justify-center py-4">
                            <p className="text-slate-200 text-lg md:text-xl text-center font-medium leading-relaxed">
                              {selectedItem.content}
                            </p>
                          </div>
                          
                          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mt-4">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1 text-center">Hình Phạt</p>
                            <p className={`text-center font-bold text-lg ${getColors(selectedItem.difficulty).text}`}>
                              {selectedItem.penalty}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Use Action */}
                      <button
                        onClick={handleUse}
                        disabled={isUsing}
                        className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-xl shrink-0 ${
                          isUsing 
                            ? "bg-slate-700 text-slate-500 scale-95" 
                            : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white hover:scale-[1.02]"
                        }`}
                      >
                        <Icons.Zap className="w-6 h-6" />
                        {isUsing ? "ĐANG SỬ DỤNG..." : "DÙNG NGAY!"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
