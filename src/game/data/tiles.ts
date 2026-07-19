

import type { Tile } from '../types';

/**
 * Bàn cờ 44 ô. Mỗi ô lồng ghép kiến thức Kinh tế chính trị Mác - Lênin,
 * kinh tế thị trường, công nghiệp hoá, hội nhập và kinh tế Việt Nam.
 */
export const TILES: Tile[] = [
{
  id: 0,
  name: 'Xuất Phát',
  category: 'start',
  icon: 'Flag',
  color: '#f5b83d',
  knowledge: 'Điểm khởi đầu của quá trình tái sản xuất. Mỗi vòng quay là một chu kỳ kinh tế mới.',
  story: 'Bạn bước vào nền kinh tế với vốn tri thức ban đầu. Hành trình tích luỹ bắt đầu!',
  fixed: { knowledge: 5, text: 'Qua ô Xuất Phát, nhận +5 tri thức khởi đầu chu kỳ mới.' }
},
{
  id: 1,
  name: 'Sản Xuất Hàng Hoá',
  category: 'knowledge',
  icon: 'Factory',
  color: '#38bdf8',
  knowledge: 'Hàng hoá là sản phẩm của lao động, thoả mãn nhu cầu con người và dùng để trao đổi.',
  story: 'Xưởng của bạn bắt đầu sản xuất. Nhưng làm ra hàng thôi chưa đủ — phải bán được!',
  options: [
  { label: 'Sản xuất đại trà', detail: 'Tăng sản lượng nhanh', assets: 8, strategy: -2, outcome: 'Sản lượng tăng nhưng tồn kho rủi ro. +8 tài sản.' },
  { label: 'Sản xuất theo nhu cầu', detail: 'Bám sát thị trường', assets: 6, strategy: 5, optimal: true, outcome: 'Cân bằng cung cầu, hiệu quả cao. +6 tài sản, +5 chiến lược.' }]

},
{
  id: 2,
  name: 'Giá Trị Sử Dụng',
  category: 'knowledge',
  icon: 'Package',
  color: '#a3e635',
  knowledge: 'Giá trị sử dụng là công dụng của vật, thoả mãn nhu cầu — thuộc tính tự nhiên của hàng hoá.',
  story: 'Một chiếc áo giữ ấm, một ổ bánh mì làm no bụng. Đó chính là giá trị sử dụng.',
  fixed: { knowledge: 8, text: 'Hiểu rõ giá trị sử dụng: +8 tri thức.' }
},
{
  id: 3,
  name: 'Giá Trị',
  category: 'knowledge',
  icon: 'Gem',
  color: '#c084fc',
  knowledge: 'Giá trị hàng hoá là lao động xã hội của người sản xuất kết tinh trong hàng hoá.',
  story: 'Vì sao viên kim cương đắt hơn ly nước? Vì lao động kết tinh trong nó lớn hơn nhiều.',
  fixed: { knowledge: 8, text: 'Nắm bản chất giá trị: +8 tri thức.' }
},
{
  id: 4,
  name: 'Lao Động Cụ Thể',
  category: 'knowledge',
  icon: 'Hammer',
  color: '#fb923c',
  knowledge: 'Lao động cụ thể tạo ra giá trị sử dụng — thợ may, thợ mộc, mỗi nghề một hình thức.',
  story: 'Bàn tay người thợ mộc tạo nên chiếc ghế. Hình thức lao động cụ thể tạo ra vật hữu ích.',
  fixed: { knowledge: 7, text: 'Phân biệt lao động cụ thể: +7 tri thức.' }
},
{
  id: 5,
  name: 'Lao Động Trừu Tượng',
  category: 'knowledge',
  icon: 'Brain',
  color: '#f472b6',
  knowledge: 'Lao động trừu tượng — sự hao phí sức lao động nói chung — tạo ra giá trị hàng hoá.',
  story: 'Dù may áo hay đóng bàn, đều là hao phí sức óc và cơ bắp. Đó là nguồn của giá trị.',
  fixed: { knowledge: 7, text: 'Hiểu lao động trừu tượng: +7 tri thức.' }
},
{
  id: 6,
  name: 'Ô May Mắn',
  category: 'luck',
  icon: 'Clover',
  color: '#22c55e',
  story: 'Vận may kinh tế mỉm cười với bạn hôm nay!',
  fixed: { knowledge: 6, assets: 10, text: 'May mắn gọi tên! +6 tri thức, +10 tài sản.' }
},
{
  id: 7,
  name: 'Thời Gian LĐ Xã Hội',
  category: 'knowledge',
  icon: 'Timer',
  color: '#38bdf8',
  knowledge: 'Thời gian lao động xã hội cần thiết quyết định lượng giá trị của hàng hoá.',
  story: 'Người làm nhanh nhờ máy móc, người làm chậm thủ công — thị trường tính theo mức trung bình xã hội.',
  options: [
  { label: 'Đầu tư máy móc', detail: 'Giảm thời gian LĐ cá biệt', assets: -6, strategy: 8, optimal: true, outcome: 'Năng suất vượt trung bình xã hội, thu lợi thế. -6 tài sản, +8 chiến lược.' },
  { label: 'Giữ thủ công', detail: 'Không đầu tư', strategy: -3, outcome: 'Thời gian LĐ cá biệt cao hơn xã hội, bất lợi. -3 chiến lược.' }]

},
{
  id: 8,
  name: 'Tiền Tệ',
  category: 'knowledge',
  icon: 'Coins',
  color: '#f5b83d',
  knowledge: 'Tiền tệ là hàng hoá đặc biệt, vật ngang giá chung, đo lường giá trị mọi hàng hoá.',
  story: 'Từ vỏ sò đến vàng rồi tiền giấy — tiền ra đời để trao đổi trở nên dễ dàng.',
  fixed: { knowledge: 8, assets: 4, text: 'Làm chủ chức năng tiền tệ: +8 tri thức, +4 tài sản.' }
},
{
  id: 9,
  name: 'Ô Sự Kiện',
  category: 'event',
  icon: 'Newspaper',
  color: '#818cf8',
  story: 'Tin nóng: Một chính sách kinh tế mới vừa được ban hành!',
  options: [
  { label: 'Nắm bắt cơ hội', detail: 'Chủ động thích ứng', assets: 8, strategy: 4, optimal: true, outcome: 'Bạn tận dụng chính sách tốt. +8 tài sản, +4 chiến lược.' },
  { label: 'Chờ quan sát', detail: 'Thận trọng', knowledge: 4, outcome: 'An toàn nhưng bỏ lỡ cơ hội. +4 tri thức.' }]

},
{
  id: 10,
  name: 'Cung Cầu',
  category: 'knowledge',
  icon: 'Scale',
  color: '#2dd4bf',
  knowledge: 'Giá cả thị trường xoay quanh giá trị, chịu tác động của quan hệ cung – cầu.',
  story: 'Mùa vải chín rộ, cung vượt cầu, giá rớt. Khan hàng thì giá vọt lên.',
  options: [
  { label: 'Trữ hàng chờ giá', detail: 'Đầu cơ khi cung dư', assets: 4, strategy: -2, outcome: 'Rủi ro cao nếu giá không tăng. +4 tài sản, -2 chiến lược.' },
  { label: 'Điều tiết theo cầu', detail: 'Bán ra hợp lý', assets: 6, strategy: 5, optimal: true, outcome: 'Cân bằng cung cầu khôn ngoan. +6 tài sản, +5 chiến lược.' }]

},
{
  id: 11,
  name: 'Cạnh Tranh',
  category: 'knowledge',
  icon: 'Swords',
  color: '#f43f5e',
  knowledge: 'Cạnh tranh là động lực của kinh tế thị trường, thúc đẩy cải tiến và hạ giá thành.',
  story: 'Đối thủ tung sản phẩm mới giá rẻ. Bạn phải phản ứng thế nào?',
  options: [
  { label: 'Cải tiến công nghệ', detail: 'Nâng chất lượng', assets: -4, strategy: 8, optimal: true, outcome: 'Cạnh tranh bằng chất lượng bền vững. -4 tài sản, +8 chiến lược.' },
  { label: 'Hạ giá đối đầu', detail: 'Chiến tranh giá', assets: -6, strategy: 2, outcome: 'Giành thị phần nhưng bào mòn lợi nhuận. -6 tài sản, +2 chiến lược.' }]

},
{
  id: 12,
  name: 'Ô Thưởng',
  category: 'reward',
  icon: 'Gift',
  color: '#f5b83d',
  story: 'Doanh nghiệp của bạn đạt cột mốc doanh thu ấn tượng!',
  fixed: { assets: 15, strategy: 3, text: 'Phần thưởng hiệu quả: +15 tài sản, +3 chiến lược.' }
},
{
  id: 13,
  name: 'Độc Quyền',
  category: 'knowledge',
  icon: 'Crown',
  color: '#a855f7',
  knowledge: 'Độc quyền là giai đoạn phát triển cao của CNTB, chi phối giá cả và thị trường.',
  story: 'Nắm độc quyền một mặt hàng thiết yếu — lợi nhuận khổng lồ nhưng gây méo mó thị trường.',
  options: [
  { label: 'Tối đa lợi nhuận', detail: 'Đẩy giá độc quyền', assets: 12, strategy: -4, outcome: 'Lời lớn ngắn hạn, mất thiện cảm xã hội. +12 tài sản, -4 chiến lược.' },
  { label: 'Định giá bền vững', detail: 'Giữ thị phần dài hạn', assets: 6, strategy: 6, optimal: true, outcome: 'Cân bằng lợi nhuận và uy tín. +6 tài sản, +6 chiến lược.' }]

},
{
  id: 14,
  name: 'Ô Thử Thách',
  category: 'challenge',
  icon: 'Zap',
  color: '#fbbf24',
  story: 'Thử thách nhanh: Kiểm chứng bản lĩnh kinh tế của bạn!',
  options: [
  { label: 'Chấp nhận thử thách', detail: 'Rủi ro cao – thưởng lớn', knowledge: 10, strategy: 5, optimal: true, outcome: 'Vượt thử thách xuất sắc! +10 tri thức, +5 chiến lược.' },
  { label: 'Từ chối an toàn', detail: 'Không rủi ro', knowledge: 2, outcome: 'Bảo toàn nhưng bỏ lỡ. +2 tri thức.' }]

},
{
  id: 15,
  name: 'Giá Trị Thặng Dư',
  category: 'knowledge',
  icon: 'TrendingUp',
  color: '#ef4444',
  knowledge: 'Giá trị thặng dư (m) là phần giá trị dôi ra do lao động không được trả công tạo nên — nguồn gốc lợi nhuận tư bản.',
  story: 'Công nhân tạo ra giá trị lớn hơn tiền lương. Phần chênh lệch chính là giá trị thặng dư.',
  options: [
  { label: 'Đầu tư máy móc', detail: 'Tăng giá trị thặng dư tương đối', assets: 10, strategy: 6, optimal: true, outcome: 'Nâng năng suất, tăng m tương đối. +10 tài sản, +6 chiến lược.' },
  { label: 'Thuê thêm lao động', detail: 'Tăng giá trị thặng dư tuyệt đối', assets: 8, strategy: 2, outcome: 'Kéo dài ngày lao động, tăng m tuyệt đối. +8 tài sản, +2 chiến lược.' },
  { label: 'Giữ nguyên', detail: 'Không thay đổi', knowledge: 4, outcome: 'Ổn định nhưng không tăng trưởng. +4 tri thức.' }]

},
{
  id: 16,
  name: 'Tư Bản Bất Biến',
  category: 'knowledge',
  icon: 'Boxes',
  color: '#94a3b8',
  knowledge: 'Tư bản bất biến (c): máy móc, nguyên liệu — chuyển nguyên giá trị vào sản phẩm, không tạo m.',
  story: 'Máy móc dù hiện đại đến đâu cũng chỉ chuyển giá trị cũ, không sinh ra giá trị mới.',
  fixed: { knowledge: 8, text: 'Phân biệt tư bản bất biến (c): +8 tri thức.' }
},
{
  id: 17,
  name: 'Tư Bản Khả Biến',
  category: 'knowledge',
  icon: 'Users',
  color: '#22d3ee',
  knowledge: 'Tư bản khả biến (v): sức lao động — nguồn duy nhất tạo ra giá trị thặng dư.',
  story: 'Chỉ sức lao động con người mới làm giá trị lớn lên. Đó là "chiếc chìa khoá" của lợi nhuận.',
  fixed: { knowledge: 8, text: 'Nắm vai trò tư bản khả biến (v): +8 tri thức.' }
},
{
  id: 18,
  name: 'Ô May Mắn',
  category: 'luck',
  icon: 'Clover',
  color: '#22c55e',
  story: 'Một nhà đầu tư thiên thần rót vốn cho bạn!',
  fixed: { assets: 14, knowledge: 4, text: 'Gọi vốn thành công! +14 tài sản, +4 tri thức.' }
},
{
  id: 19,
  name: 'Công Nghiệp Hoá',
  category: 'knowledge',
  icon: 'Cog',
  color: '#38bdf8',
  knowledge: 'Công nghiệp hoá chuyển nền kinh tế từ lao động thủ công sang cơ khí, hiện đại.',
  story: 'Việt Nam đẩy mạnh CNH-HĐH để trở thành nước công nghiệp theo hướng hiện đại.',
  options: [
  { label: 'Đầu tư nhà máy', detail: 'Cơ khí hoá sản xuất', assets: -5, strategy: 9, optimal: true, outcome: 'Tăng năng lực sản xuất dài hạn. -5 tài sản, +9 chiến lược.' },
  { label: 'Giữ sản xuất nhỏ', detail: 'Ít vốn', strategy: -2, outcome: 'Chậm phát triển, tụt hậu. -2 chiến lược.' }]

},
{
  id: 20,
  name: 'Hiện Đại Hoá',
  category: 'knowledge',
  icon: 'Sparkles',
  color: '#a78bfa',
  knowledge: 'Hiện đại hoá gắn công nghiệp hoá với ứng dụng khoa học – công nghệ tiên tiến.',
  story: 'Không chỉ có máy móc — mà là máy móc thông minh, quy trình số hoá và tự động.',
  fixed: { knowledge: 8, strategy: 4, text: 'Đẩy mạnh hiện đại hoá: +8 tri thức, +4 chiến lược.' }
},
{
  id: 21,
  name: 'Trí Tuệ Nhân Tạo',
  category: 'knowledge',
  icon: 'BrainCircuit',
  color: '#22d3ee',
  knowledge: 'AI là lực lượng sản xuất mới, nâng cao năng suất và biến đổi cơ cấu lao động.',
  story: 'AI giúp bạn phân tích thị trường trong tích tắc. Nhưng đầu tư ban đầu không rẻ.',
  options: [
  { label: 'Ứng dụng AI ngay', detail: 'Đón đầu công nghệ', assets: -6, strategy: 10, optimal: true, outcome: 'Bứt phá năng suất. -6 tài sản, +10 chiến lược.' },
  { label: 'Chờ chín muồi', detail: 'Giảm rủi ro', knowledge: 5, outcome: 'An toàn nhưng chậm chân. +5 tri thức.' }]

},
{
  id: 22,
  name: 'Ô Nhân Đôi Điểm',
  category: 'double',
  icon: 'Star',
  color: '#f5b83d',
  story: 'Điểm số vòng này của bạn được tăng cường mạnh mẽ!',
  fixed: { knowledge: 12, text: 'Nhân đôi thành quả: +12 tri thức thưởng!' }
},
{
  id: 23,
  name: 'Robot Tự Động',
  category: 'knowledge',
  icon: 'Bot',
  color: '#64748b',
  knowledge: 'Tự động hoá bằng robot làm tăng tư bản bất biến, giải phóng sức lao động thủ công.',
  story: 'Dây chuyền robot hoạt động 24/7. Sản lượng tăng vọt nhưng cần lao động tay nghề cao.',
  fixed: { assets: 8, strategy: 4, text: 'Tự động hoá dây chuyền: +8 tài sản, +4 chiến lược.' }
},
{
  id: 24,
  name: 'Ô Phạt',
  category: 'penalty',
  icon: 'AlertTriangle',
  color: '#ef4444',
  story: 'Sự cố sản xuất khiến bạn chịu thiệt hại ngoài dự kiến.',
  fixed: { assets: -10, text: 'Thiệt hại sản xuất: -10 tài sản.' }
},
{
  id: 25,
  name: 'Hội Nhập Kinh Tế',
  category: 'knowledge',
  icon: 'Globe',
  color: '#2dd4bf',
  knowledge: 'Hội nhập kinh tế quốc tế mở rộng thị trường, thu hút vốn và công nghệ, nhưng tăng cạnh tranh.',
  story: 'Cánh cửa thế giới mở ra. Cơ hội lớn đi kèm áp lực cạnh tranh toàn cầu.',
  options: [
  { label: 'Mở rộng xuất khẩu', detail: 'Vươn ra quốc tế', assets: 10, strategy: 5, optimal: true, outcome: 'Tận dụng lợi thế hội nhập. +10 tài sản, +5 chiến lược.' },
  { label: 'Bảo hộ trong nước', detail: 'Giữ thị trường nội', assets: 3, strategy: -2, outcome: 'An toàn ngắn hạn, kém năng động. +3 tài sản, -2 chiến lược.' }]

},
{
  id: 26,
  name: 'WTO',
  category: 'knowledge',
  icon: 'Handshake',
  color: '#38bdf8',
  knowledge: 'Gia nhập WTO (2007) đưa VN vào sân chơi thương mại toàn cầu với luật lệ chung.',
  story: 'Việt Nam cam kết mở cửa, giảm thuế và tuân thủ luật thương mại quốc tế.',
  fixed: { knowledge: 8, assets: 6, text: 'Tận dụng cam kết WTO: +8 tri thức, +6 tài sản.' }
},
{
  id: 27,
  name: 'Xuất Khẩu',
  category: 'knowledge',
  icon: 'Ship',
  color: '#06b6d4',
  knowledge: 'Xuất khẩu là động lực tăng trưởng của kinh tế mở, mang lại ngoại tệ và việc làm.',
  story: 'Container hàng Việt cập cảng quốc tế. Gạo, cà phê, dệt may vươn xa.',
  fixed: { assets: 12, strategy: 2, text: 'Đơn hàng xuất khẩu lớn: +12 tài sản, +2 chiến lược.' }
},
{
  id: 28,
  name: 'Ô Đổi Vị Trí',
  category: 'move',
  icon: 'Repeat',
  color: '#818cf8',
  story: 'Biến động thị trường! Bạn hoán đổi vị trí với một người chơi ngẫu nhiên.',
  fixed: { text: 'Hoán đổi vị trí với một đối thủ ngẫu nhiên trên bàn cờ.' }
},
{
  id: 29,
  name: 'Thuế',
  category: 'penalty',
  icon: 'Landmark',
  color: '#f59e0b',
  knowledge: 'Thuế là nguồn thu ngân sách, công cụ điều tiết vĩ mô nền kinh tế.',
  story: 'Kỳ quyết toán thuế đến. Doanh nghiệp phải thực hiện nghĩa vụ với ngân sách.',
  fixed: { assets: -8, knowledge: 4, text: 'Nộp thuế đúng hạn: -8 tài sản, +4 tri thức (hiểu nghĩa vụ).' }
},
{
  id: 30,
  name: 'Đầu Tư',
  category: 'knowledge',
  icon: 'PiggyBank',
  color: '#22c55e',
  knowledge: 'Đầu tư tích luỹ tư bản để mở rộng tái sản xuất — chìa khoá tăng trưởng.',
  story: 'Có vốn nhàn rỗi. Bạn để tiền "làm việc" như thế nào?',
  options: [
  { label: 'Tái đầu tư mở rộng', detail: 'Tích luỹ tư bản', assets: 12, strategy: 6, optimal: true, outcome: 'Mở rộng tái sản xuất. +12 tài sản, +6 chiến lược.' },
  { label: 'Gửi tiết kiệm', detail: 'An toàn', assets: 4, outcome: 'Sinh lời thấp nhưng chắc chắn. +4 tài sản.' }]

},
{
  id: 31,
  name: 'Ô Dịch Chuyển',
  category: 'move',
  icon: 'Wind',
  color: '#a78bfa',
  story: 'Một làn sóng đầu tư đẩy bạn tiến nhanh về phía trước!',
  fixed: { teleportTo: 36, text: 'Dịch chuyển nhanh tới ô Ngân Hàng!' }
},
{
  id: 32,
  name: 'Khủng Hoảng',
  category: 'penalty',
  icon: 'TrendingDown',
  color: '#dc2626',
  knowledge: 'Khủng hoảng kinh tế là quy luật của CNTB do mâu thuẫn giữa sản xuất và tiêu dùng.',
  story: 'Thị trường lao dốc. Ai chuẩn bị tốt sẽ vượt bão; ai chủ quan sẽ tổn thất.',
  options: [
  { label: 'Cắt giảm & giữ tiền mặt', detail: 'Phòng thủ', assets: -4, strategy: 6, optimal: true, outcome: 'Vững vàng qua khủng hoảng. -4 tài sản, +6 chiến lược.' },
  { label: 'Vay nợ mở rộng', detail: 'Đánh cược', assets: -12, strategy: -2, outcome: 'Ngược sóng, thiệt hại nặng. -12 tài sản, -2 chiến lược.' }]

},
{
  id: 33,
  name: 'Lạm Phát',
  category: 'penalty',
  icon: 'Flame',
  color: '#f97316',
  knowledge: 'Lạm phát là sự tăng giá chung liên tục, làm giảm sức mua của đồng tiền.',
  story: 'Giá cả leo thang. Tiền trong túi bạn "teo" dần theo từng ngày.',
  fixed: { assets: -9, knowledge: 5, text: 'Lạm phát bào mòn tài sản: -9 tài sản, +5 tri thức.' }
},
{
  id: 34,
  name: 'Ô Mất Lượt',
  category: 'skip',
  icon: 'PauseCircle',
  color: '#94a3b8',
  story: 'Tắc nghẽn chuỗi cung ứng khiến bạn phải dừng lại một lượt!',
  fixed: { skipNext: true, text: 'Đứt gãy chuỗi cung ứng — mất lượt kế tiếp.' }
},
{
  id: 35,
  name: 'Công Nghệ',
  category: 'knowledge',
  icon: 'Cpu',
  color: '#06b6d4',
  knowledge: 'Khoa học – công nghệ trở thành lực lượng sản xuất trực tiếp, nâng năng suất lao động.',
  story: 'Nắm công nghệ lõi là nắm lợi thế cạnh tranh của thời đại số.',
  fixed: { knowledge: 8, strategy: 5, text: 'Làm chủ công nghệ lõi: +8 tri thức, +5 chiến lược.' }
},
{
  id: 36,
  name: 'Ngân Hàng',
  category: 'knowledge',
  icon: 'Building2',
  color: '#f5b83d',
  knowledge: 'Ngân hàng là trung gian tín dụng, điều tiết dòng vốn và chính sách tiền tệ.',
  story: 'Bạn được ngân hàng cấp hạn mức tín dụng ưu đãi để mở rộng kinh doanh.',
  fixed: { assets: 10, text: 'Tiếp cận vốn tín dụng: +10 tài sản.' }
},
{
  id: 37,
  name: 'Giáo Dục',
  category: 'knowledge',
  icon: 'GraduationCap',
  color: '#a3e635',
  knowledge: 'Giáo dục – đào tạo nâng cao chất lượng nguồn nhân lực, quốc sách hàng đầu.',
  story: 'Đầu tư vào con người là đầu tư sinh lời nhất cho tương lai kinh tế.',
  fixed: { knowledge: 12, text: 'Đầu tư giáo dục: +12 tri thức.' }
},
{
  id: 38,
  name: 'Ô Boss',
  category: 'boss',
  icon: 'Shield',
  color: '#7c3aed',
  story: 'Cảnh báo: Một thách thức kinh tế lớn đang chờ ở cuối chặng!',
  fixed: { strategy: 6, text: 'Chuẩn bị đối đầu thử thách Boss: +6 chiến lược.' }
},
{
  id: 39,
  name: 'Doanh Nghiệp',
  category: 'knowledge',
  icon: 'Briefcase',
  color: '#38bdf8',
  knowledge: 'Doanh nghiệp là tế bào của nền kinh tế, tạo ra của cải và việc làm.',
  story: 'Bạn tái cấu trúc doanh nghiệp để vận hành hiệu quả hơn.',
  options: [
  { label: 'Đổi mới quản trị', detail: 'Nâng hiệu quả', assets: 8, strategy: 6, optimal: true, outcome: 'Bộ máy tinh gọn, hiệu quả. +8 tài sản, +6 chiến lược.' },
  { label: 'Giữ nguyên hiện trạng', detail: 'Không thay đổi', assets: 2, outcome: 'Ổn định nhưng trì trệ. +2 tài sản.' }]

},
{
  id: 40,
  name: 'Thị Trường',
  category: 'knowledge',
  icon: 'Store',
  color: '#2dd4bf',
  knowledge: 'Kinh tế thị trường định hướng XHCN: cơ chế thị trường có sự quản lý của Nhà nước.',
  story: 'Bàn tay vô hình của thị trường kết hợp bàn tay hữu hình của Nhà nước.',
  fixed: { knowledge: 8, strategy: 4, text: 'Hiểu cơ chế thị trường: +8 tri thức, +4 chiến lược.' }
},
{
  id: 41,
  name: 'Ô Thưởng',
  category: 'reward',
  icon: 'Trophy',
  color: '#f5b83d',
  story: 'Chiến lược kinh doanh của bạn được vinh danh!',
  fixed: { assets: 12, strategy: 5, text: 'Vinh danh chiến lược: +12 tài sản, +5 chiến lược.' }
},
{
  id: 42,
  name: 'Kinh Tế Việt Nam',
  category: 'knowledge',
  icon: 'MapPin',
  color: '#ef4444',
  knowledge: 'VN phát triển kinh tế thị trường định hướng XHCN, đẩy mạnh CNH-HĐH và hội nhập sâu rộng.',
  story: 'Từ Đổi Mới 1986, kinh tế Việt Nam vươn lên mạnh mẽ, hội nhập toàn cầu.',
  fixed: { knowledge: 10, assets: 5, strategy: 3, text: 'Tự hào kinh tế Việt Nam: +10 tri thức, +5 tài sản, +3 chiến lược.' }
},
{
  id: 43,
  name: 'Ô May Mắn',
  category: 'luck',
  icon: 'Clover',
  color: '#22c55e',
  story: 'Trước khi khép lại chu kỳ, vận may lại đến với bạn!',
  fixed: { knowledge: 6, assets: 8, strategy: 3, text: 'May mắn cuối chặng: +6 tri thức, +8 tài sản, +3 chiến lược.' }
}];


export const BOARD_SIZE = TILES.length;