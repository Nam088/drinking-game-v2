import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "@/components/icons"
import { useGameStore } from "@/store/useGameStore"

interface ActionBarProps {
  onOpenRules: () => void
  onOpenPlayerManager: () => void
  onOpenInventory: () => void
}

export const ActionBar = ({ onOpenRules, onOpenPlayerManager, onOpenInventory }: ActionBarProps) => {
  const { items } = useGameStore()

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-30 pointer-events-none">
      <div className="flex gap-3 pointer-events-auto">
        <button
          onClick={onOpenRules}
          className="bg-slate-800/90 hover:bg-slate-700 border border-slate-600/50 text-white w-12 h-12 rounded-full shadow-lg transition-all flex items-center justify-center hover:scale-105 active:scale-95"
        >
          <Icons.Info className="w-5 h-5 text-slate-300" />
        </button>
        <button
          onClick={onOpenPlayerManager}
          className="bg-slate-800/90 hover:bg-slate-700 border border-slate-600/50 text-white w-12 h-12 rounded-full shadow-lg transition-all flex items-center justify-center hover:scale-105 active:scale-95"
        >
          <Icons.Users className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      <motion.button
        onClick={onOpenInventory}
        whileTap={{ scale: 0.9 }}
        animate={items.length > 0 ? {
          boxShadow: ["0px 0px 0px rgba(168,85,247,0)", "0px 0px 20px rgba(168,85,247,0.5)", "0px 0px 0px rgba(168,85,247,0)"],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative pointer-events-auto bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-600/50 hover:border-purple-500/50 text-white w-12 h-12 rounded-full shadow-lg transition-colors flex items-center justify-center"
      >
        <Icons.Backpack className={`w-5 h-5 ${items.length > 0 ? "text-purple-400" : "text-slate-400"}`} />
        
        <AnimatePresence>
          {items.length > 0 && (
            <motion.span 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-[22px] h-[22px] flex items-center justify-center rounded-full border-2 border-slate-900 shadow-md"
            >
              {items.length}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
