"use client"

import { useGameStoreV2, InventoryItemV2 } from "@/store/useGameStoreV2"
import { motion, AnimatePresence } from "framer-motion"
import { CategoryIcon } from "../CategoryIcon"
import { useState } from "react"
import { Icons } from "../../icons"

import { ItemCardMiniV2 } from "./ItemCardMiniV2"

export const InventoryDrawerV2 = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { items, useItem: consumeItem } = useGameStoreV2()
  const [selectedItem, setSelectedItem] = useState<InventoryItemV2 | null>(null)
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

  const handleClose = () => {
    if (selectedItem) {
      setSelectedItem(null)
    } else {
      onClose()
    }
  }

  const getColors = (vibe: string) => {
    const v = vibe.toLowerCase().trim()
    if (v === "chaos" || v === "drama") return { from: "#a78bfa", to: "#7c3aed", text: "text-purple-500" }
    if (v === "social" || v === "friendly") return { from: "#34d399", to: "#059669", text: "text-emerald-500" }
    if (v === "funny") return { from: "#fbbf24", to: "#d97706", text: "text-amber-500" }
    if (v === "strategy" || v === "brain") return { from: "#60a5fa", to: "#2563eb", text: "text-blue-500" }
    if (v === "storytelling" || v === "deep") return { from: "#818cf8", to: "#4f46e5", text: "text-indigo-500" }
    if (v === "hot" || v === "18+") return { from: "#fb7185", to: "#e11d48", text: "text-rose-500" }
    return { from: "#fdba74", to: "#ea580c", text: "text-orange-500" }
  }

  const formatPenalty = (pen: {template: string, value: number} | null) => {
    if (!pen || !pen.template) return "Không có hình phạt"
    return pen.template
        .replace("{value}", String(pen.value))
        .replace("{unit}", pen.value > 1 ? "ly" : "ly")
        .replace("{type}", "rượu/bia")
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
            className="fixed bottom-0 left-0 right-0 z-50 h-[85vh] sm:h-[80vh] bg-slate-900 border-t border-indigo-500/30 rounded-t-3xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex-1 overflow-hidden flex flex-col pt-2 bg-slate-900 rounded-t-3xl">
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
                    <Icons.Backpack className="w-6 h-6 text-indigo-400" />
                    {selectedItem ? "Chi Tiết Vật Phẩm" : "Túi Đồ Chơi Ngải"}
                    {!selectedItem && <span className="text-indigo-400 text-sm">({items.length})</span>}
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
                        <p className="text-slate-400 text-sm mt-1">Hãy bốc bài và cất vật phẩm</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 pb-8">
                        {sortedItems.map(item => (
                          <ItemCardMiniV2 
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
                              background: `linear-gradient(135deg, ${getColors(String(selectedItem.sophistication_level)).from}, ${getColors(String(selectedItem.sophistication_level)).to})`,
                            }}
                          >
                            <div className="absolute inset-0 bg-black/10" />
                            <CategoryIcon
                              category={selectedItem.category}
                              className="w-16 h-16 text-white relative z-10 mb-2"
                            />
                            <h3 className="text-xl font-black text-white uppercase tracking-wider text-center relative z-10 leading-tight">
                              {selectedItem.title || selectedItem.category.replace(/_/g, " ")}
                            </h3>
                            <div className="mt-2 text-white/80 font-bold bg-black/20 px-2 py-0.5 rounded text-xs z-10 border border-white/20 uppercase tracking-widest">
                                KHẨN CẤP
                            </div>
                          </div>

                          {/* Owner Badge */}
                          <div className="px-6 pt-6 flex justify-between gap-2">
                            <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2 shadow-inner w-full justify-center">
                              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                                Sở hữu: 
                              </span>
                              <span className="text-sm text-white font-medium flex items-center gap-1 truncate text-indigo-300">
                                <Icons.User className="w-4 h-4 text-indigo-400" />{" "}
                                {selectedItem.ownerName}
                              </span>
                            </div>
                          </div>

                          {/* Detail Body */}
                          <div className="p-6 flex-1 flex flex-col">
                            <div className="flex gap-2 mb-3 bg-slate-900 p-2 border border-slate-700 rounded-lg shrink-0 overflow-x-auto text-[10px] items-center custom-scrollbar">
                                <div className="text-slate-400 whitespace-nowrap"><span className="text-slate-500 font-bold">Thời gian:</span> {selectedItem.duration.value} {selectedItem.duration.type}</div>
                                <div className="w-px h-3 bg-slate-700" />
                                <div className="text-slate-400 whitespace-nowrap"><span className="text-slate-500 font-bold">Mục tiêu:</span> {selectedItem.target.definition}</div>
                            </div>
                            
                            <div className="flex-1 flex items-center justify-center py-2 sm:py-4">
                              <p className="text-slate-200 text-lg md:text-xl text-center font-medium leading-relaxed">
                                {selectedItem.content}
                              </p>
                            </div>
                            
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mt-4">
                              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1 text-center">
                                Hình Phạt Kèm Theo
                              </p>
                              <p
                                className={`text-center font-bold text-lg ${getColors(String(selectedItem.sophistication_level)).text}`}
                              >
                                {formatPenalty(selectedItem.penalty)}
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
                                : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 text-white hover:scale-[1.02] border border-indigo-400/30"
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
