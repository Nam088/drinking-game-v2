"use client"

import { useState } from "react"
import { useGameStore } from "@/store/useGameStore"
import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "../../icons"

export const PlayerManager = ({ onClose }: { onClose: () => void }) => {
  const { players, addPlayer, removePlayer } = useGameStore()
  const [newName, setNewName] = useState("")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (newName.trim()) {
      addPlayer(newName.trim())
      setNewName("")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{ willChange: "opacity" }}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/80 backdrop-blur-[2px] sm:items-center sm:p-4"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 400, mass: 0.8 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose()
        }}
        style={{ willChange: "transform" }}
        className="w-full max-w-md bg-slate-900 rounded-t-3xl sm:rounded-2xl border-t border-x sm:border border-purple-500/30 p-6 pb-8 shadow-[0_-10px_40px_rgba(168,85,247,0.15)] relative flex flex-col max-h-[90vh]"
      >
        {/* Drag Handle for Mobile */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6 sm:hidden cursor-grab active:cursor-grabbing shrink-0" />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full z-10"
        >
          <Icons.X className="w-4 h-4" />
        </button>
        
        <div className="shrink-0 mb-6 relative">
          <h3 className="text-xl font-black text-white text-center flex items-center justify-center gap-2">
            <Icons.Users className="w-6 h-6 text-purple-400" /> Quản Lý Hội Nhậu
          </h3>
          <p className="text-sm text-slate-400 text-center mt-1">
            Tổng cộng: {players.length} người
          </p>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2 mb-6 shrink-0 relative z-10">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.UserPlus className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Tên chiến hữu..."
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder:text-slate-600"
            />
          </div>
          <button
            type="submit"
            disabled={!newName.trim()}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:grayscale text-white px-6 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center gap-1"
          >
            Thêm
          </button>
        </form>

        <div className="flex-1 overflow-y-auto px-1 -mx-1 custom-scrollbar min-h-[100px]">
          <AnimatePresence>
            {players.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="h-full flex flex-col items-center justify-center p-6 border border-dashed border-slate-700/50 rounded-2xl bg-slate-800/20"
              >
                <Icons.Users className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-center text-slate-400 text-sm font-medium">
                  Chưa có ai tham gia.<br/>Nhập tên để bắt đầu!
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pb-6">
                {players.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-between bg-slate-800/40 border border-white/5 p-3 rounded-xl gap-2"
                  >
                    <div className="w-full flex items-center gap-2 overflow-hidden">
                      <div className="w-6 h-6 shrink-0 rounded-full bg-slate-700/50 flex items-center justify-center">
                        <Icons.User className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <span className="text-white font-bold text-sm truncate">{p.name}</span>
                    </div>
                    <button
                      onClick={() => removePlayer(p.id)}
                      className="w-full text-rose-400 hover:text-white text-xs font-bold py-1.5 rounded-lg hover:bg-rose-500 transition-colors border border-rose-500/30 hover:border-transparent flex items-center justify-center gap-1 mt-1"
                    >
                      <Icons.X className="w-3 h-3" /> Xóa
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
