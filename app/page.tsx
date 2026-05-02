'use client';

import { motion } from 'motion/react';
import { useTheme } from '@/components/ThemeContext';
import { Calendar, Users, History, Award } from 'lucide-react';

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng thành viên', value: '1,248', icon: Users, delay: 0.1 },
          { label: 'Số đời (Thế hệ)', value: '18', icon: History, delay: 0.2 },
          { label: 'Ngày giỗ sắp tới', value: '12/03', icon: Calendar, delay: 0.3 },
          { label: 'Kỷ vật lưu trữ', value: '852', icon: Award, delay: 0.4 },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
            className="bg-white border border-[var(--color-dong)]/20 p-4 rounded shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider font-sans">{stat.label}</p>
              <stat.icon className="text-[var(--color-dong)] opacity-40 group-hover:opacity-100 transition-opacity" size={20} />
            </div>
            <p className="text-3xl font-bold text-[var(--color-son)] font-serif mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </section>

      <div className="flex gap-6 overflow-hidden h-[600px]">
        {/* Main Historical Content */}
        <div className="flex-1 bg-white border border-[var(--color-dong)]/40 rounded flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[var(--color-dong)]/20 flex justify-between items-center bg-[var(--color-dong)]/5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-son)] font-serif">
              Lịch sử Dòng tộc
            </h3>
            <span className="text-[10px] text-[var(--color-dong)] font-bold border border-[var(--color-dong)] px-2 py-0.5 uppercase tracking-widest">
              Biên niên sử
            </span>
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="prose prose-stone max-w-none prose-sm leading-relaxed text-[var(--color-muc)] font-serif"
            >
              <p className="text-lg italic text-[var(--color-son)]/80 text-center mb-8 border-b border-[var(--color-dong)]/10 pb-4">
                &ldquo;Cây có gốc mới nở cành xanh ngọn, nước có nguồn mới biển rộng sông sâu.&rdquo;
              </p>
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {`Dòng họ ${theme.name} có nguồn gốc từ vùng đất tổ, trôi dạt theo dòng sử Việt mà khai cơ lập nghiệp. Trải qua bao thăng trầm, con cháu vẫn giữ vững nề nếp gia phong, hướng về cội nguồn.

Hằng năm, vào ngày lễ Thanh Minh và các ngày giỗ tổ, con cháu khắp nơi lại hội tụ về từ đường để dâng hương kính cáo tiên tổ, thắt chặt tình thân tộc. Phả đồ được ghi chép cẩn mật, truyền đời qua các thế hệ như một minh chứng cho sức sống mãnh liệt của huyết thống.`}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-[var(--color-xuyen)] border border-[var(--color-dong)]/10 rounded italic text-xs">
                  &ldquo;Uống nước nhớ nguồn là đạo lý ngàn đời của dân tộc ta, dòng họ ta.&rdquo; - Trưởng tộc đời thứ 12.
                </div>
                <div className="p-4 bg-[var(--color-xuyen)] border border-[var(--color-dong)]/10 rounded italic text-xs">
                  Di huấn tiên tổ: &ldquo;Lấy đức làm gốc, lấy học làm đầu, lấy hiếu làm trọng.&rdquo;
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="p-4 bg-[var(--color-xuyen)] border-t border-[var(--color-dong)]/20 flex justify-end">
            <button className="px-6 py-2 bg-[var(--color-son)] text-white text-xs font-bold uppercase tracking-[0.2em] rounded hover:bg-[var(--color-muc)] transition-colors">
              XEM CHI TIẾT SỬ LƯỢC
            </button>
          </div>
        </div>

        {/* Sidebar-like panel for Profile/News */}
        <aside className="w-80 bg-white border border-[var(--color-dong)]/30 rounded flex flex-col overflow-hidden">
          <div className="p-4 bg-[var(--color-son)] text-white">
            <h3 className="font-bold uppercase text-[10px] tracking-widest font-sans flex justify-between items-center">
              Thông cáo mới 
              <span className="animate-pulse w-2 h-2 bg-[var(--color-dong)] rounded-full"></span>
            </h3>
          </div>
          
          <div className="p-5 flex-1 space-y-6 overflow-y-auto">
             <div className="space-y-4">
               {[
                  { title: "Họp hội đồng gia tộc quý II", date: "20/04" },
                  { title: "Trùng tu lăng mộ Thủy Tổ", date: "15/04" },
                  { title: "Phát động quỹ khuyến học 2024", date: "10/04" },
                  { title: "Lễ viếng ông Nguyễn Văn X", date: "05/04" }
               ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group cursor-pointer border-b border-[var(--color-dong)]/5 pb-3 last:border-0">
                    <div className="text-[10px] text-[var(--color-dong)] font-bold mt-1 font-sans">{item.date}</div>
                    <div className="text-xs font-serif group-hover:text-[var(--color-son)] transition-colors leading-tight">{item.title}</div>
                  </div>
               ))}
             </div>

             <div className="pt-6 border-t border-[var(--color-dong)]/10">
               <p className="text-[10px] text-gray-400 uppercase font-bold mb-3 tracking-widest font-sans">Sự kiện tiêu biểu</p>
               <div className="aspect-video bg-[var(--color-dong)]/5 rounded border border-[var(--color-dong)]/10 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 cloud-header-pattern opacity-10 group-hover:scale-110 transition-transform"></div>
                  <Users size={32} className="text-[var(--color-dong)] opacity-30" />
               </div>
               <p className="text-[11px] font-serif mt-2 italic text-center opacity-60">Lễ đại tế xuân 2024</p>
             </div>
          </div>
          
          <button className="m-4 py-3 bg-[var(--color-dong)] text-white font-bold text-[10px] uppercase tracking-widest rounded hover:bg-[#B8860B] font-sans shadow-sm">
            QUẢN TRỊ VIÊN ĐĂNG TIN
          </button>
        </aside>
      </div>
    </div>
  );
}
