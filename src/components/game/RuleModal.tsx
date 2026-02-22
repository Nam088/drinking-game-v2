import { motion } from "framer-motion"
import { Icons } from "../icons"

interface RuleModalProps {
  onClose: () => void
}

export const RuleModal = ({ onClose }: RuleModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{ willChange: "opacity" }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.8 }}
        style={{ willChange: "transform" }}
        className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative max-h-[80vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <Icons.X className="w-5 h-5" />
        </button>
        
        <h3 className="text-xl font-black text-white mb-6 text-center flex items-center justify-center gap-2 uppercase tracking-wider font-display">
          <Icons.Info className="w-6 h-6 text-blue-400" /> Luật Chơi
        </h3>

        <div className="space-y-6 text-sm text-slate-300">
          <div>
            <h4 className="font-bold text-white text-base mb-1 flex items-center gap-2">
              <span className="text-xl">👆</span> Cách Chơi
            </h4>
            <p className="leading-relaxed">
              Các lá bài sẽ úp ở giữa màn hình. Hãy <strong className="text-purple-400">chạm vào lá bài</strong> để lật ngửa xem nội dung. Bạn có thể vuốt trái/phải để qua bài. Dưới mỗi lá bài sẽ là một yêu cầu và mức phạt (thường là số ly).
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-base mb-2 flex items-center gap-2">
              <span className="text-xl">🃏</span> Các Loại Thẻ Bài
            </h4>
            <ul className="space-y-3">
              <li className="flex gap-2 items-start">
                <span className="shrink-0 bg-red-500/20 text-red-400 text-xs font-bold px-1.5 py-0.5 rounded border border-red-500/30">DARE</span>
                <span className="leading-tight">Thử thách hành động. Không dám làm thì uống phạt.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="shrink-0 bg-green-500/20 text-green-400 text-xs font-bold px-1.5 py-0.5 rounded border border-green-500/30">TRUTH</span>
                <span className="leading-tight">Khai thật một bí mật. Trả lời dối hoặc không nói thì đóng họ.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="shrink-0 bg-yellow-500/20 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded border border-yellow-500/30">MINI-GAME</span>
                <span className="leading-tight">Một trò chơi nhỏ giữa 2 người hoặc cả bàn. Kẻ thua uống.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="shrink-0 bg-blue-500/20 text-blue-400 text-xs font-bold px-1.5 py-0.5 rounded border border-blue-500/30">VOTE</span>
                <span className="leading-tight">Đếm 1-2-3 và chỉ tay bình chọn. Ai bị chỉ nhiều nhất uống.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="shrink-0 bg-pink-500/20 text-pink-400 text-xs font-bold px-1.5 py-0.5 rounded border border-pink-500/30">PARTNER / BUDDY</span>
                <span className="leading-tight">Làm nhiệm vụ cùng một người khác hoặc trở thành tri kỷ (uống cùng nhau).</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="shrink-0 bg-purple-500/20 text-purple-400 text-xs font-bold px-1.5 py-0.5 rounded border border-purple-500/30">CURSE</span>
                <span className="leading-tight">Lời nguyền kéo dài 1 vòng chơi (ví dụ: chỉ uống bằng tay trái).</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="shrink-0 bg-orange-500/20 text-orange-400 text-xs font-bold px-1.5 py-0.5 rounded border border-orange-500/30">BRAIN / SKILL</span>
                <span className="leading-tight">Thử thách trí não (như kể tên, tính toán) hoặc khéo léo. Chạm vạch thì uống.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="shrink-0 bg-indigo-500/20 text-indigo-400 text-xs font-bold px-1.5 py-0.5 rounded border border-indigo-500/30">SECRET</span>
                <span className="leading-tight">Thẻ nhiệm vụ ẩn. Bạn phải đọc thầm và lừa người khác sập bẫy. Bị phát hiện thì tự uống.</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-base mb-1 flex items-center gap-2">
              <span className="text-xl">🎁</span> Thẻ Vật Phẩm / Sự Kiện
            </h4>
            <p className="leading-relaxed">
              Các thẻ <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded text-xs border border-white/10 mx-1">ITEM (SỰ KIỆN)</strong> sẽ bắt nhiều người phải cạn ly ngay lập tức. Các thẻ <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded text-xs border border-white/10 mx-1">ITEM (GIỮ LẠI)</strong> có thể được ấn <strong>Cất Vào Túi Đồ</strong> và gán cho bạn. Hãy mở icon Túi Đồ để sử dụng phản lưới, khiên chắn hoặc hãm hại người khác sau này.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors border border-white/5"
        >
          Đã Hiểu!
        </button>
      </motion.div>
    </motion.div>
  )
}
