"use client"

import { useGameStore, InventoryItem } from "@/store/useGameStore"
import { motion, AnimatePresence } from "framer-motion"
import { CategoryIcon } from "../CategoryIcon"
import { useState } from "react"
import { Icons } from "../../icons"

import { ItemCardMini } from "./ItemCardMini"

export const InventoryDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { items, useItem: consumeItem } = useGameStore()
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [isUsing, setIsUsing] = useState(false)

  const sortedItems = [...items].sort((a, b) => b.acquiredAt - a.acquiredAt)

  const handleUse = () => {
    if (!selectedItem) return
    setIsUsing(true)
    setTimeout(() => {
      consumeItem(selectedItem.id)
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
            transition={{ duration: 0.15 }}
            style={{ willChange: "opacity" }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/80"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.8 }}
            style={{ willChange: "transform" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) handleClose()
            }}
            className="fixed bottom-0 left-0 right-0 z-50 h-[85vh] sm:h-[80vh] bg-slate-900 border-t border-purple-500/30 rounded-t-3xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex-1 overflow-hidden flex flex-col pt-2 bg-slate-900 rounded-t-3xl">
              {/* Drag indicator / Handle */}
              <div className="w-12 h-1.5 bg-slate-700/50 rounded-full mx-auto my-3 cursor-grab active:cursor-grabbing" />
              
              <div className="flex items-center justify-between px-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  {selectedItem && (
                    <button 
                      onClick={() => setSelectedItem(null)}
                      className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-300 transition-colors"
                    >
                      <Icons.ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Icons.Backpack className="w-6 h-6 text-purple-400" />
                    {selectedItem ? "Chi Tiết" : "Túi Đồ"}
                    {!selectedItem && <span className="text-purple-400 text-sm">({items.length})</span>}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
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
                      className="h-full overflow-y-auto p-4 sm:p-6 flex flex-col items-center pb-12"
                    >
                      <div className="w-full max-w-sm flex-1 flex flex-col">
                        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl mb-4 sm:mb-6 flex-1 flex flex-col">
                          {/* Detail Header */}
                          <div
                            className="p-6 flex flex-col items-center relative"
                            style={{
                              background: `linear-gradient(135deg, ${getColors(selectedItem.difficulty).from}, ${getColors(selectedItem.difficulty).to})`,
                            }}
                          >
                            <div className="absolute inset-0 bg-black/10" />
                            <CategoryIcon
                              category={selectedItem.category}
                              className="w-16 h-16 text-white relative z-10 mb-2"
                            />
                            <h3 className="text-2xl font-black text-white uppercase tracking-wider text-center relative z-10">
                              {selectedItem.category.replace(/_/g, " ")}
                            </h3>
                          </div>

                          {/* Owner Badge */}
                          <div className="px-6 pt-6 flex justify-center">
                            <div className="bg-slate-900 px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2 shadow-inner">
                              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                                Sở hữu:
                              </span>
                              <span className="text-sm text-white font-medium flex items-center gap-1">
                                <Icons.User className="w-4 h-4 text-purple-400" />{" "}
                                {selectedItem.ownerName}
                              </span>
                            </div>
                          </div>

                          {/* Detail Body */}
                          <div className="p-6 flex-1 flex flex-col">
                            <div className="flex-1 flex items-center justify-center py-2 sm:py-4">
                              <p className="text-slate-200 text-lg md:text-xl text-center font-medium leading-relaxed">
                                {selectedItem.content}
                              </p>
                            </div>
                            
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mt-4">
                              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1 text-center">
                                Hình Phạt
                              </p>
                              <p
                                className={`text-center font-bold text-lg ${getColors(selectedItem.difficulty).text}`}
                              >
                                {selectedItem.penalty}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-auto shrink-0">
                          <button
                            onClick={() => {
                              consumeItem(selectedItem.id);
                              setSelectedItem(null);
                            }}
                            className="flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md bg-slate-800 text-rose-400 hover:bg-slate-700 hover:text-rose-300 border border-slate-700/50"
                          >
                            Xóa Bỏ
                          </button>
                          
                          <button
                            onClick={handleUse}
                            disabled={isUsing}
                            className={`flex-[2] py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-xl ${
                              isUsing 
                                ? "bg-slate-700 text-slate-500 scale-95" 
                                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white hover:scale-[1.02]"
                            }`}
                          >
                            <Icons.Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                            {isUsing ? "ĐANG SỬ DỤNG..." : "DÙNG NGAY!"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
