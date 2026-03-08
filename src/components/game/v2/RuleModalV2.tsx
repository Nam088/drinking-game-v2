import { motion } from "framer-motion"
import { Icons } from "../../icons"

interface RuleModalV2Props {
  onClose: () => void
}

export const RuleModalV2 = ({ onClose }: RuleModalV2Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{ willChange: "opacity" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        style={{ willChange: "transform, opacity" }}
        className="bg-slate-900 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-2 bg-slate-800/50 rounded-full z-10"
        >
          <Icons.X className="w-4 h-4" />
        </button>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl font-black text-white mb-6 pr-8 text-center uppercase tracking-widest flex items-center justify-center gap-2">
            <Icons.Info className="w-6 h-6 text-indigo-400" />
            Luật Chơi Bùng Nổ
          </h2>

          <div className="space-y-6 text-sm text-slate-300">
            <div>
              <h4 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                <span className="text-xl">👆</span> Cách Chơi
              </h4>
              <p className="leading-relaxed">
                Ở chế độ <strong className="text-indigo-400">Bùng Nổ</strong>, các lá bài sẽ khốc liệt hơn. Hãy chạm để lật mở, vuốt thẻ bài qua trái/phải để qua bài. Chú ý đọc kỹ <strong className="text-rose-400">Hình Phạt</strong> bên dưới cũng như thông số đếm ngược thời gian nếu có.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                <span className="text-xl">🃏</span> Các Loại Thẻ Bài Bổ Sung
              </h4>
              <ul className="space-y-3">
                <li className="flex gap-2 items-start">
                  <span className="shrink-0 bg-rose-500/20 text-rose-400 text-xs font-bold px-1.5 py-0.5 rounded border border-rose-500/30">ROLE</span>
                  <span className="leading-tight">Nhập vai tự biên tự diễn. Rớt mặt nạ là rớt ly. Cười cũng bị phạt.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="shrink-0 bg-yellow-500/20 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded border border-yellow-500/30">MINI-GAME</span>
                  <span className="leading-tight">Minigame tương tác vật lý (búng nắp chai, thảy xu...). Đòi hỏi thao tác thật.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="shrink-0 bg-blue-500/20 text-blue-400 text-xs font-bold px-1.5 py-0.5 rounded border border-blue-500/30">VOTE</span>
                  <span className="leading-tight">Đọc lệnh bóc phốt, đếm 1-2-3 và chỉ tay bình chọn. Ai bị chỉ nhiều nhất uống.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="shrink-0 bg-purple-500/20 text-purple-400 text-xs font-bold px-1.5 py-0.5 rounded border border-purple-500/30">CURSE</span>
                  <span className="leading-tight">Lời nguyền kéo dài một lượng vòng nhất định (1-2 vòng) để khóa hành vi người chơi.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="shrink-0 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">SECRET_MISSION</span>
                  <span className="leading-tight">Mật vụ ẩn thân. Bạn đọc thầm lệnh và làm theo. Thành công phạt người khác, thất bại phạt mình.</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                <span className="text-xl">🎁</span> Thẻ Vật Phẩm Nâng Cấp
              </h4>
              <p className="leading-relaxed">
                Những lá bài <strong className="text-indigo-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs border border-indigo-500/30 mx-1">ITEM (LƯU TRỮ)</strong> có thể được <strong>Cất Vào Túi Đồ</strong>. Đây là những lá bài tạo đột biến (ví dụ: Chuyển sát thương, miễn nhiễm, buff ly). Hãy dùng thật khôn ngoan!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors border border-white/5"
          >
            Đã Thông Não!
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
