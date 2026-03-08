import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "@/components/icons"
import { DiceTool } from "./tools/DiceTool"
import { CoinTool } from "./tools/CoinTool"
import { BottleTool } from "./tools/BottleTool"
import { RngTool } from "./tools/RngTool"

interface ToolModalV2Props {
  isOpen: boolean
  toolType: string | null
  onClose: () => void
  onOpenTimers?: () => void
  onToolSelect?: (toolType: string) => void
}

export const ToolModalV2 = ({ isOpen, toolType, onClose, onOpenTimers, onToolSelect }: ToolModalV2Props) => {

  const renderToolContent = () => {
    switch (toolType) {
      case "MENU":
        return (
          <div className="flex flex-col gap-3 py-2 px-2 max-h-[60vh] overflow-y-auto">
            <button 
              onClick={() => onToolSelect?.("DICE_ROLL")}
              className="w-full bg-indigo-900/40 hover:bg-indigo-800/60 border border-indigo-700/50 rounded-xl p-3 flex items-center gap-4 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-2xl shrink-0">🎲</div>
              <div className="flex-1">
                <h4 className="text-indigo-300 font-bold uppercase tracking-wider text-sm">Đổ Xúc Xắc</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Lắc xúc xắc 6 mặt ngẫu nhiên</p>
              </div>
            </button>
            <button 
              onClick={() => onToolSelect?.("COIN_FLIP")}
              className="w-full bg-amber-900/40 hover:bg-amber-800/60 border border-amber-700/50 rounded-xl p-3 flex items-center gap-4 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center text-2xl shrink-0">🪙</div>
              <div className="flex-1">
                <h4 className="text-amber-300 font-bold uppercase tracking-wider text-sm">Lật Đồng Xu</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Thử vận may sấp hay ngửa</p>
              </div>
            </button>
            <button 
              onClick={() => onToolSelect?.("BOTTLE_SPIN")}
              className="w-full bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/50 rounded-xl p-3 flex items-center gap-4 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center text-2xl shrink-0">🍾</div>
              <div className="flex-1">
                <h4 className="text-emerald-300 font-bold uppercase tracking-wider text-sm">Xoay Chai</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Tìm người chịu phạt ngẫu nhiên</p>
              </div>
            </button>
            <button 
              onClick={() => onToolSelect?.("RNG_PICKER")}
              className="w-full bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/50 rounded-xl p-3 flex items-center gap-4 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-2xl shrink-0">🎰</div>
              <div className="flex-1">
                <h4 className="text-blue-300 font-bold uppercase tracking-wider text-sm">Máy Quay Số</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Chọn từ 1 đến N người</p>
              </div>
            </button>
          </div>
        )
        
      case "DICE_ROLL":
        return <DiceTool />
      
      case "COIN_FLIP":
        return <CoinTool />
      
      case "BOTTLE_SPIN":
        return <BottleTool />

      case "RNG_PICKER":
        return <RngTool />

      case "TIMER_COUNTDOWN":
        return (
          <div className="flex flex-col items-center gap-6 py-4 text-center px-4">
            <h3 className="text-xl font-black text-rose-400 uppercase tracking-widest">Bộ Đếm Giờ</h3>
            <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-rose-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <Icons.Timer className="w-12 h-12 text-rose-400" />
            </div>
            <p className="text-slate-300 font-medium">Bật bộ đếm giờ riêng ở menu để theo dõi thời gian phạt!</p>
            <button 
              onClick={() => {
                onClose();
                if(onOpenTimers) onOpenTimers();
              }}
              className="mt-2 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 px-8 rounded-full transition-transform active:scale-95 tracking-wider shadow-lg shadow-rose-500/30 flex items-center gap-2"
            >
              MỞ ĐỒNG HỒ <Icons.Timer className="w-5 h-5" />
            </button>
          </div>
        )
      case "CAMERA_SHOT":
      case "SOCIAL_POST":
        return (
           <div className="flex flex-col items-center gap-6 py-4 text-center px-4">
              <h3 className="text-xl font-black text-indigo-400 uppercase tracking-widest">
                {toolType === "CAMERA_SHOT" ? "Máy Ảnh" : "Mạng Xã Hội"}
              </h3>
              <div className="w-24 h-24 rounded-3xl bg-slate-800 border-4 border-indigo-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                {toolType === "CAMERA_SHOT" ? (
                  <span className="text-4xl">📸</span>
                ) : (
                  <span className="text-4xl">📱</span>
                )}
              </div>
              <p className="text-slate-300 font-medium text-sm">
                {toolType === "CAMERA_SHOT" 
                  ? "Hãy lấy điện thoại ra và chụp một tấm ảnh lưu niệm ngay tắp lự!"
                  : "Mở ứng dụng mạng xã hội của bạn và làm theo yêu cầu của thẻ bài."}
              </p>
           </div>
        )

      default:
        return (
          <div className="flex flex-col items-center gap-6 py-4 text-center px-4">
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Công Cụ: {toolType}</h3>
             <p className="text-slate-500">Chức năng công cụ này chưa được hỗ trợ giao diện riêng.</p>
          </div>
        )
    }
  }

  return (
    <AnimatePresence>
      {isOpen && toolType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-slate-900 border border-slate-700/80 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-2">
                {toolType !== "MENU" && (
                  <button 
                    onClick={() => onToolSelect ? onToolSelect("MENU") : onClose()}
                    className="p-1 mr-1 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"
                  >
                    <Icons.ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                {toolType === "MENU" && <Icons.Wrench className="w-5 h-5 text-indigo-400" />}
                <h2 className="text-sm font-black text-white uppercase tracking-widest">
                  {toolType === "MENU" ? "Công Cụ Bổ Trợ" : "Bộ Công Cụ"}
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 text-slate-500 hover:text-white bg-slate-800 rounded-full transition-colors disabled:opacity-50"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 bg-[url('/noise.png')]">
              {renderToolContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
