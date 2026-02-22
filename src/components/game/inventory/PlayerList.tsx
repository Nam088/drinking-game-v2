import { Icons } from "../../icons"
import { Player } from "@/store/useGameStore"

interface PlayerListProps {
  players: Player[]
  selectedPlayerId?: string
  onSelectPlayer: (id: string) => void
  emptyMessage?: string
}

export const PlayerList = ({ 
  players, 
  selectedPlayerId, 
  onSelectPlayer, 
  emptyMessage = "Chưa có ai trong bàn nhậu." 
}: PlayerListProps) => {
  if (players.length === 0) {
    return (
      <div className="mb-6 p-6 border border-dashed border-slate-700 rounded-2xl bg-slate-800/20 text-center flex flex-col items-center justify-center gap-3">
        <Icons.Users className="w-8 h-8 text-slate-600" />
        <p className="text-slate-400 text-sm whitespace-pre-line">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {players.map(p => (
        <button
          key={p.id}
          onClick={() => onSelectPlayer(p.id)}
          className={`px-3 py-3 rounded-xl text-sm font-bold transition-all border flex items-center gap-2 ${
            selectedPlayerId === p.id 
              ? "bg-purple-600/20 text-purple-300 border-purple-500/50 shadow-inner ring-1 ring-purple-500" 
              : "bg-slate-800/50 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center transition-colors ${selectedPlayerId === p.id ? 'bg-purple-500/30' : 'bg-slate-700/50'}`}>
            <Icons.User className={`w-3.5 h-3.5 ${selectedPlayerId === p.id ? 'text-purple-400' : 'text-slate-500'}`} />
          </div>
          <span className="truncate">{p.name}</span>
        </button>
      ))}
    </div>
  )
}
