import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "../icons"
import { useTimerStore, Timer } from "@/store/useTimerStore"
import { useState, useEffect, useRef } from "react"

interface TimerPanelProps {
  isOpen: boolean
  onClose: () => void
}

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const centiseconds = Math.floor((ms % 1000) / 10) // 2 digits

  const pad = (num: number) => num.toString().padStart(2, "0")

  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`
}

const TimerItem = ({ timer }: { timer: Timer }) => {
  const { toggleTimer, resetTimer, removeTimer, updateLabel, setTimerDuration } = useTimerStore()
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [isEditingTime, setIsEditingTime] = useState(false)
  const [editLabelValue, setEditLabelValue] = useState(timer.label)
  
  // Format for input duration edit (e.g. "05:00")
  const inputDurationStr = formatTime(timer.durationMs)
  const [editTimeValue, setEditTimeValue] = useState(inputDurationStr)

  const labelInputRef = useRef<HTMLInputElement>(null)
  const timeInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditingLabel && labelInputRef.current) {
      labelInputRef.current.focus()
      labelInputRef.current.select()
    }
  }, [isEditingLabel])

  useEffect(() => {
    if (isEditingTime && timeInputRef.current) {
      timeInputRef.current.focus()
      timeInputRef.current.select()
    }
  }, [isEditingTime])

  const handleLabelEditComplete = () => {
    setIsEditingLabel(false)
    if (editLabelValue.trim() !== "") {
      updateLabel(timer.id, editLabelValue.trim())
    } else {
      setEditLabelValue(timer.label)
    }
  }

  const handleTimeEditComplete = () => {
    setIsEditingTime(false)
    
    // Parse MM:SS or generic seconds, ignore milliseconds for input simplicity
    let newDuration = timer.durationMs
    let timeStr = editTimeValue.trim()
    
    // Remove millisecond part if user left it in from the formatted string
    if (timeStr.includes('.')) {
      timeStr = timeStr.split('.')[0]
    }

    if (timeStr.includes(':')) {
      const [m, s] = timeStr.split(':')
      const mins = parseInt(m) || 0
      const secs = parseInt(s) || 0
      newDuration = (mins * 60 + secs) * 1000
    } else {
      const secs = parseInt(timeStr)
      if (!isNaN(secs)) {
        newDuration = secs * 1000
      }
    }
    
    // Minimum 1 second, Maximum 99:59
    newDuration = Math.max(1000, Math.min(newDuration, (99 * 60 + 59) * 1000))
    setTimerDuration(timer.id, newDuration)
    setEditTimeValue(formatTime(newDuration))
  }

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLabelEditComplete()
    } else if (e.key === "Escape") {
      setIsEditingLabel(false)
      setEditLabelValue(timer.label)
    }
  }

  const handleTimeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTimeEditComplete()
    } else if (e.key === "Escape") {
      setIsEditingTime(false)
      setEditTimeValue(formatTime(timer.durationMs))
    }
  }

  const isFinished = timer.remainingMs === 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`bg-slate-800/80 rounded-2xl p-5 border relative overflow-hidden transition-colors ${
        isFinished ? "border-red-500/80 bg-red-950/40 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse" :
        timer.isRunning ? "border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]" : "border-white/10"
      }`}
    >
      {/* Background Pulse if running */}
      <AnimatePresence>
        {timer.isRunning && !isFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 bg-purple-500 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col gap-3">
        {/* Header: Label and Delete */}
        <div className="flex justify-between items-center">
          {isEditingLabel ? (
            <input
              ref={labelInputRef}
              value={editLabelValue}
              onChange={(e) => setEditLabelValue(e.target.value)}
              onBlur={handleLabelEditComplete}
              onKeyDown={handleLabelKeyDown}
              className="bg-slate-900/50 text-white px-3 py-1 rounded border border-purple-500/50 outline-none w-[60%] text-sm font-bold"
            />
          ) : (
            <h3 
              onClick={() => setIsEditingLabel(true)}
              className="text-white font-bold text-sm tracking-wide truncate max-w-[70%] cursor-pointer hover:text-purple-300 transition-colors flex items-center gap-2"
            >
              {timer.label}
              <Icons.Plus className="w-3 h-3 opacity-0 group-hover:opacity-100" />
            </h3>
          )}

          <button
            onClick={() => removeTimer(timer.id)}
            className="text-slate-500 hover:text-red-400 p-1.5 rounded-full hover:bg-slate-700/50 transition-colors"
          >
            <Icons.Trash className="w-4 h-4" />
          </button>
        </div>

        {/* Timer Display */}
        <div className="flex justify-center py-2">
          {isEditingTime ? (
            <div className="flex flex-col items-center">
              <input
                ref={timeInputRef}
                value={editTimeValue}
                onChange={(e) => setEditTimeValue(e.target.value)}
                onBlur={handleTimeEditComplete}
                onKeyDown={handleTimeKeyDown}
                className="bg-slate-900 text-center text-4xl sm:text-5xl font-display tracking-wider text-white border-b-2 border-purple-500 outline-none w-[160px]"
                placeholder="00:00"
              />
              <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Nhập giây hoặc Phút:Giây (VD: 90 hoặc 01:30)</span>
            </div>
          ) : (
            <div 
              onClick={() => {
                if (!timer.isRunning && !isFinished) {
                  // When editing, just show MM:SS without milliseconds for easier editing
                  const totalSeconds = Math.floor(timer.durationMs / 1000)
                  const minutes = Math.floor(totalSeconds / 60)
                  const seconds = totalSeconds % 60
                  const pad = (num: number) => num.toString().padStart(2, "0")
                  setEditTimeValue(`${pad(minutes)}:${pad(seconds)}`)
                  setIsEditingTime(true)
                }
              }}
              className={`text-5xl sm:text-6xl font-display tracking-widest tabular-nums transition-colors ${
                isFinished 
                  ? "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                  : !timer.isRunning 
                    ? "text-slate-200 cursor-pointer hover:text-white"
                    : "text-purple-400"
              }`}
            >
              {formatTime(timer.remainingMs)}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-900/50 rounded-full overflow-hidden mb-2">
          <motion.div 
            className={`h-full ${isFinished ? 'bg-red-500' : 'bg-purple-500'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${Math.max(0, Math.min(100, (timer.remainingMs / timer.durationMs) * 100))}%` }}
            transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
          />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              if (isFinished) resetTimer(timer.id)
              else toggleTimer(timer.id)
            }}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isFinished 
                ? "bg-slate-800 text-white hover:bg-slate-700 ring-2 ring-red-500/50"
              : timer.isRunning 
                ? "bg-slate-700 text-yellow-400 hover:bg-slate-600" 
                : "bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)]"
            }`}
          >
            {isFinished ? <Icons.RotateCcw className="w-6 h-6" /> : timer.isRunning ? <Icons.Pause className="w-6 h-6" /> : <Icons.Play className="w-6 h-6 ml-1" />}
          </button>

          <button
            onClick={() => resetTimer(timer.id)}
            disabled={timer.remainingMs === timer.durationMs}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all self-center ${
              timer.remainingMs === timer.durationMs 
                ? "bg-slate-800/50 text-slate-700 cursor-not-allowed" 
                : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-700"
            }`}
          >
            <Icons.RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export const TimerPanel = ({ isOpen, onClose }: TimerPanelProps) => {
  const { timers, addTimer, tick } = useTimerStore()

  // Global ticker for updating the UI for running timers
  useEffect(() => {
    if (!isOpen) return

    const hasRunningTimers = timers.some(t => t.isRunning)
    if (!hasRunningTimers) return

    const intervalId = setInterval(() => {
      tick()
    }, 50) // Update every 50ms for smooth centiseconds

    return () => clearInterval(intervalId)
  }, [isOpen, timers, tick])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-slate-900 w-full max-w-md h-[85vh] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-800/50 shrink-0">
              <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Icons.Timer className="w-5 h-5 text-purple-400" />
                Bấm Giờ
              </h2>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-white transition-colors p-2 bg-slate-800/80 rounded-full"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            {/* Timer List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {timers.map((timer) => (
                  <TimerItem key={timer.id} timer={timer} />
                ))}
              </AnimatePresence>

              {timers.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-3 opacity-60">
                  <Icons.Timer className="w-12 h-12" />
                  <p className="text-sm font-medium">Chưa có bộ đếm nào</p>
                </div>
              )}
              
              {/* Add Presets List instead of simple button */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <motion.button
                  layout
                  onClick={() => addTimer(30 * 1000, "30 Giây")}
                  className="py-3 rounded-xl border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/80 text-slate-300 transition-colors flex flex-col items-center justify-center gap-1 font-bold text-xs"
                >
                  <Icons.Timer className="w-4 h-4 text-purple-400" /> 30s
                </motion.button>
                <motion.button
                  layout
                  onClick={() => addTimer(60 * 1000, "1 Phút")}
                  className="py-3 rounded-xl border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/80 text-slate-300 transition-colors flex flex-col items-center justify-center gap-1 font-bold text-xs"
                >
                  <Icons.Timer className="w-4 h-4 text-purple-400" /> 1 Phút
                </motion.button>
                <motion.button
                  layout
                  onClick={() => addTimer(3 * 60 * 1000, "3 Phút")}
                  className="py-3 rounded-xl border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/80 text-slate-300 transition-colors flex flex-col items-center justify-center gap-1 font-bold text-xs"
                >
                  <Icons.Timer className="w-4 h-4 text-purple-400" /> 3 Phút
                </motion.button>
                <motion.button
                  layout
                  onClick={() => addTimer(5 * 60 * 1000, "5 Phút")}
                  className="py-3 rounded-xl border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/80 text-slate-300 transition-colors flex flex-col items-center justify-center gap-1 font-bold text-xs"
                >
                  <Icons.Timer className="w-4 h-4 text-purple-400" /> 5 Phút
                </motion.button>
              </div>
              
              <motion.button
                layout
                onClick={() => addTimer(60 * 1000, "Tùy Chọn")}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/50 text-slate-400 hover:text-purple-300 transition-colors flex items-center justify-center gap-2 font-bold mb-4"
              >
                <Icons.Plus className="w-5 h-5" /> Thêm Bộ Đếm Mới (Chạm số để sửa giờ)
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
