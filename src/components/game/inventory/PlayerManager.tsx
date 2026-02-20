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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <Icons.X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-wider font-display flex items-center gap-2">
          <Icons.Users className="w-6 h-6 text-purple-400" /> Người Chơi
        </h2>

        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tên người mới..."
            className="flex-1 bg-slate-800 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!newName.trim()}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold transition-colors"
          >
            Thêm
          </button>
        </form>

        <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
          <AnimatePresence>
            {players.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center text-white/40 py-4 text-sm"
              >
                Chưa có ai chơi. Thêm người đi bro!
              </motion.p>
            ) : (
              players.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between bg-slate-800/50 border border-white/5 p-3 rounded-lg"
                >
                  <span className="text-white font-medium flex items-center gap-2">
                    <Icons.User className="w-4 h-4 text-slate-400" /> {p.name}
                  </span>
                  <button
                    onClick={() => removePlayer(p.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium px-2 py-1 rounded hover:bg-red-400/10 transition-colors"
                  >
                    Xóa
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
