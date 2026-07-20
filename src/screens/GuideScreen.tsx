





import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../game/GameContext';
import { playSound } from '../game/sound';
import { ArrowLeft, Dices, Map, Swords, Trophy, Award, Brain, Coins, Target, Gamepad2 } from 'lucide-react';

const STEPS = [
{ icon: Dices, title: '1. Tung xúc xắc', text: 'Lần lượt 4 người tung xúc xắc và di chuyển token theo số ô trên bàn cờ 44 ô.' },
{ icon: Map, title: '2. Xử lý ô', text: 'Mỗi ô là một kiến thức kinh tế. Đọc nội dung, nghe câu chuyện và đưa ra quyết định ảnh hưởng đến điểm.' },
{ icon: Swords, title: '3. Mini game', text: 'Sau khi cả 4 người đi xong, hệ thống chọn ngẫu nhiên 1 trong 5 mini game để cả 4 tranh tài.' },
{ icon: Trophy, title: '4. Cộng điểm', text: 'Xếp hạng mini game cộng 100 / 70 / 40 / 20 điểm. Cứ mỗi 5 vòng sẽ có một trận Boss.' },
{ icon: Award, title: '5. Tổng kết', text: 'Sau số vòng quy định, tổng hợp điểm và trao danh hiệu cho nhà vô địch cùng các kỷ lục.' }];


const SCORES = [
{ icon: Brain, color: 'text-sky-400', name: 'Tri thức', text: 'Từ ô kiến thức, câu hỏi đúng' },
{ icon: Coins, color: 'text-brass-400', name: 'Tài sản', text: 'Từ đầu tư, xuất khẩu, phần thưởng' },
{ icon: Target, color: 'text-lime-400', name: 'Chiến lược', text: 'Từ quyết định tối ưu' },
{ icon: Gamepad2, color: 'text-purple-400', name: 'Mini game', text: 'Từ xếp hạng các mini game' }];


export function GuideScreen() {
  const { dispatch } = useGame();
  return (
    <div className="min-h-full w-full overflow-y-auto bg-ink-950 bg-grid px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <button onClick={() => {playSound('click');dispatch({ type: 'SET_SCREEN', screen: 'home' });}} className="mb-6 flex items-center gap-2 text-sm font-bold text-white/60 transition-colors hover:text-white">
          <ArrowLeft size={18} /> Về trang chủ
        </button>
        <h1 className="font-display text-4xl font-extrabold text-white text-shadow-lg">Hướng dẫn chơi</h1>
        <p className="mt-2 text-white/60">Học kinh tế qua trải nghiệm — cạnh tranh để trở thành nhà vô địch.</p>

        <h2 className="mb-3 mt-8 font-display text-xl font-extrabold text-brass-400">Luồng chơi</h2>
        <div className="space-y-3">
          {STEPS.map((s, i) =>
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-ink-850 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brass-400/15 text-brass-400"><s.icon size={20} /></span>
              <div>
                <div className="font-bold text-white">{s.title}</div>
                <div className="text-sm text-white/60">{s.text}</div>
              </div>
            </motion.div>
          )}
        </div>

        <h2 className="mb-3 mt-8 font-display text-xl font-extrabold text-brass-400">Hệ thống điểm</h2>
        <div className="grid grid-cols-2 gap-3">
          {SCORES.map((s, i) =>
          <div key={i} className="rounded-2xl border border-white/10 bg-ink-850 p-4">
              <s.icon className={`mb-2 ${s.color}`} size={22} />
              <div className="font-bold text-white">{s.name}</div>
              <div className="text-xs text-white/55">{s.text}</div>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-brass-400/20 bg-brass-400/5 p-4 text-sm text-white/75">
          <span className="font-bold text-brass-400">Điểm cuối cùng:</span> 40% điểm bàn cờ + 40% điểm mini game + 20% thành tích đặc biệt (chiến lược, quyết định tối ưu, số lần thắng mini game).
        </div>
      </div>
    </div>);

}