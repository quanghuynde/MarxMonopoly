

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // index
  explain: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
{
  q: 'Hàng hoá có hai thuộc tính cơ bản nào?',
  options: ['Giá cả và lợi nhuận', 'Giá trị sử dụng và giá trị', 'Cung và cầu', 'Vốn và lao động'],
  answer: 1,
  explain: 'Mọi hàng hoá đều có giá trị sử dụng (công dụng) và giá trị (lao động kết tinh).'
},
{
  q: 'Nguồn gốc của giá trị thặng dư (m) là gì?',
  options: ['Máy móc hiện đại', 'Nguyên vật liệu', 'Lao động không được trả công', 'Giá bán cao'],
  answer: 2,
  explain: 'Giá trị thặng dư sinh ra từ phần lao động của công nhân không được trả công.'
},
{
  q: 'Tư bản nào tạo ra giá trị thặng dư?',
  options: ['Tư bản bất biến (c)', 'Tư bản khả biến (v)', 'Cả hai như nhau', 'Không loại nào'],
  answer: 1,
  explain: 'Chỉ tư bản khả biến (sức lao động) mới tạo ra giá trị thặng dư.'
},
{
  q: 'Yếu tố nào quyết định lượng giá trị của hàng hoá?',
  options: ['Sở thích người mua', 'Thời gian lao động xã hội cần thiết', 'Giá nguyên liệu', 'Thương hiệu'],
  answer: 1,
  explain: 'Lượng giá trị được đo bằng thời gian lao động xã hội cần thiết để sản xuất.'
},
{
  q: 'Việt Nam gia nhập WTO vào năm nào?',
  options: ['1995', '2007', '2010', '2001'],
  answer: 1,
  explain: 'Việt Nam chính thức trở thành thành viên WTO năm 2007.'
},
{
  q: 'Tiền tệ về bản chất là gì?',
  options: ['Tờ giấy do nhà nước in', 'Hàng hoá đặc biệt đóng vai trò vật ngang giá chung', 'Kim loại quý', 'Công cụ của ngân hàng'],
  answer: 1,
  explain: 'Tiền tệ là hàng hoá đặc biệt, được tách ra làm vật ngang giá chung.'
},
{
  q: 'Công nghiệp hoá – hiện đại hoá nhằm mục tiêu gì?',
  options: ['Giảm dân số', 'Chuyển sang nền sản xuất cơ khí, hiện đại', 'Tăng nhập khẩu', 'Bảo hộ thương mại'],
  answer: 1,
  explain: 'CNH-HĐH chuyển nền kinh tế từ thủ công sang cơ khí, hiện đại, năng suất cao.'
},
{
  q: 'Cạnh tranh trong kinh tế thị trường có vai trò gì?',
  options: ['Kìm hãm sản xuất', 'Động lực thúc đẩy cải tiến, hạ giá thành', 'Gây lãng phí thuần tuý', 'Không có tác dụng'],
  answer: 1,
  explain: 'Cạnh tranh là động lực thúc đẩy đổi mới, nâng chất lượng và hạ giá thành.'
},
{
  q: 'Lạm phát gây hậu quả gì rõ nhất?',
  options: ['Tăng sức mua đồng tiền', 'Giảm sức mua của đồng tiền', 'Giảm giá hàng hoá', 'Tăng tỷ giá cố định'],
  answer: 1,
  explain: 'Lạm phát làm giá cả tăng liên tục, khiến sức mua của đồng tiền giảm.'
},
{
  q: 'Kinh tế Việt Nam hiện nay theo mô hình nào?',
  options: ['Kế hoạch hoá tập trung', 'Thị trường tự do hoàn toàn', 'Thị trường định hướng XHCN', 'Tự cung tự cấp'],
  answer: 2,
  explain: 'VN phát triển kinh tế thị trường định hướng XHCN có sự quản lý của Nhà nước.'
},
{
  q: 'Giá trị sử dụng của hàng hoá là gì?',
  options: ['Lao động kết tinh', 'Công dụng thoả mãn nhu cầu', 'Giá bán trên thị trường', 'Chi phí sản xuất'],
  answer: 1,
  explain: 'Giá trị sử dụng là công dụng của vật, thoả mãn một nhu cầu nào đó.'
},
{
  q: 'Quan hệ cung – cầu tác động thế nào tới giá cả?',
  options: ['Không liên quan', 'Làm giá xoay quanh giá trị', 'Cố định giá', 'Chỉ tăng giá'],
  answer: 1,
  explain: 'Cung – cầu khiến giá cả thị trường dao động lên xuống quanh giá trị.'
}];