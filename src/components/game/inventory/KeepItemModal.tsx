"use client"

import { useState } from "react"
import { useGameStore } from "@/store/useGameStore"
import { motion } from "framer-motion"

import { Icons } from "../../icons"

interface KeepItemModalProps {
  card: {
    id: number
    content: string
    penalty: string
    category: string
    difficulty: string
  }
  onClose: () => void
  onSuccess: () => void
}

export const KeepItemModal = ({ card, onClose, onSuccess }: KeepItemModalProps) => {
  const { players, addPlayer, addItem } = useGameStore()
  const [selectedPlayerId, setSelectedPlayerId] = useState("")
  const [newPlayerName, setNewPlayerName] = useState("")

  const handleSave = () => {
    let ownerId = selectedPlayerId
    let ownerName = players.find(p => p.id === selectedPlayerId)?.name || ""

    // If typing a new name, create player first
    if (newPlayerName.trim()) {
      const id = crypto.randomUUID()
      addPlayer(newPlayerName.trim())
      ownerId = id
      // Since addPlayer is async via zustand we use the local variable for the item
      ownerName = newPlayerName.trim()
    }

    if (!ownerId && !newPlayerName.trim()) return

    addItem({
      cardId: card.id,
      ownerId,
      ownerName,
      content: card.content,
      penalty: card.penalty,
      category: card.category,
      difficulty: card.difficulty,
    })

    onSuccess()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_40px_rgba(168,85,247,0.2)] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <Icons.X className="w-5 h-5" />
        </button>
        
        <h3 className="text-xl font-black text-white mb-4 text-center flex items-center justify-center gap-2">
          <Icons.Backpack className="w-6 h-6 text-purple-400" /> Cất Vào Túi
        </h3>
        <p className="text-sm text-slate-400 mb-6 text-center">
          Ai là người nhặt được vật phẩm này?
        </p>

        {players.length > 0 && (
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-bold">
              Chọn người chơi:
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {players.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPlayerId(p.id)
                    setNewPlayerName("")
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedPlayerId === p.id 
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-900" 
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-bold">
            Hoặc nhập tên người mới:
          </label>
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => {
              setNewPlayerName(e.target.value)
              setSelectedPlayerId("")
            }}
            placeholder="Ví dụ: Tuấn..."
            className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedPlayerId && !newPlayerName.trim()}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 transition-all"
          >
            Cất Giữ
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
