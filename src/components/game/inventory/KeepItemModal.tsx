"use client"

import { useState } from "react"
import { useGameStore } from "@/store/useGameStore"
import { motion } from "framer-motion"
import { v4 as uuidv4 } from "uuid"

import { Icons } from "../../icons"
import { PlayerList } from "./PlayerList"

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
      const id = uuidv4()
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
        className="w-full max-w-md bg-slate-900 rounded-t-3xl sm:rounded-2xl border-t border-x sm:border border-purple-500/30 p-6 pb-8 shadow-[0_-10px_40px_rgba(168,85,247,0.15)] relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Drag Handle for Mobile */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6 sm:hidden cursor-grab active:cursor-grabbing" />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full"
        >
          <Icons.X className="w-4 h-4" />
        </button>
        
        <h3 className="text-xl font-black text-white mb-2 text-center flex items-center justify-center gap-2">
          <Icons.Backpack className="w-6 h-6 text-purple-400" /> Cất Gói Vật Phẩm
        </h3>
        <p className="text-sm text-slate-400 mb-6 text-center">
          Nhân phẩm tố, hãy chọn chủ sở hữu cho thẻ này!
        </p>

        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 pr-2 custom-scrollbar">
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-3 font-bold">
              Chọn người chơi hiện tại
            </label>
            <PlayerList 
              players={players} 
              selectedPlayerId={selectedPlayerId} 
              onSelectPlayer={(id) => {
                setSelectedPlayerId(id)
                setNewPlayerName("")
              }}
            />
          </div>

          <div className="mb-2">
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-3 font-bold">
              Hoặc gọi thêm người chiến
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.UserPlus className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => {
                  setNewPlayerName(e.target.value)
                  setSelectedPlayerId("")
                }}
                placeholder="Nhập tên người mới..."
                className="w-full bg-slate-950 text-white border border-slate-700 rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder:text-slate-600"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3.5 rounded-xl font-bold text-slate-400 bg-slate-800/80 hover:bg-slate-700 hover:text-white transition-colors"
          >
            Vứt Đi
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedPlayerId && !newPlayerName.trim()}
            className="flex-[2] px-4 py-3.5 rounded-xl font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
          >
            Cất Giữ <Icons.Check className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
