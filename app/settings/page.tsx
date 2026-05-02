'use client';

import { useTheme } from '@/components/ThemeContext';
import { Palette, Globe, Shield, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setClan } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header>
        <h2 className="text-3xl font-serif">CÀI ĐẶT WHITE LABEL</h2>
        <p className="text-sm opacity-60 italic">Tùy biến thương hiệu và hạ tầng riêng cho dòng tộc của bạn.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <h3 className="text-xl font-serif border-b border-[var(--color-dong)] pb-2 flex items-center gap-2">
            <Palette size={20} className="text-[var(--color-son)]" />
            Giao diện (Theme)
          </h3>
          
          <div className="space-y-4">
            <p className="text-sm opacity-70">Chọn cấu hình dòng họ để trải nghiệm tính năng White Label:</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setClan('default')}
                className="flex items-center justify-between p-4 bg-white/50 border border-[var(--color-dong)]/20 rounded-2xl hover:border-[var(--color-son)] transition-all"
              >
                <span className="font-serif">Mặc định (Đỏ Son)</span>
                <div className="w-6 h-6 bg-[#8B0000] rounded-full border border-[var(--color-dong)]" />
              </button>
              <button 
                onClick={() => setClan('nguyen')}
                className="flex items-center justify-between p-4 bg-white/50 border border-[var(--color-dong)]/20 rounded-2xl hover:border-[var(--color-son)] transition-all"
              >
                <span className="font-serif">Họ Nguyễn (Lục Thủy)</span>
                <div className="w-6 h-6 bg-[#004d40] rounded-full border border-[#ffab00]" />
              </button>
              <button 
                onClick={() => setClan('tran')}
                className="flex items-center justify-between p-4 bg-white/50 border border-[var(--color-dong)]/20 rounded-2xl hover:border-[var(--color-son)] transition-all"
              >
                <span className="font-serif">Họ Trần (Lam Ngọc)</span>
                <div className="w-6 h-6 bg-[#1a237e] rounded-full border border-[#c6ff00]" />
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-serif border-b border-[var(--color-dong)] pb-2 flex items-center gap-2">
            <Globe size={20} className="text-[var(--color-son)]" />
            Tên miền & Logo
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest opacity-50">Subdomain</label>
              <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-dong)]/5 rounded-xl border border-[var(--color-dong)]/30 font-serif">
                <span>nguyen.dongtocviet.vn</span>
                <Globe size={14} className="ml-auto opacity-30" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest opacity-50">Biểu tượng chi tộc</label>
              <div className="w-20 h-20 bg-white/50 border-2 border-dashed border-[var(--color-dong)] rounded-2xl flex items-center justify-center text-[var(--color-dong)] hover:bg-[var(--color-dong)]/10 cursor-pointer">
                <Plus size={24} />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-serif border-b border-[var(--color-dong)] pb-2 flex items-center gap-2">
            <Shield size={20} className="text-[var(--color-son)]" />
            Quyền riêng tư
          </h3>
          <p className="text-xs opacity-60 leading-relaxed font-serif">Dữ liệu gia phả là tài sản tinh thần của dòng tộc. Chúng tôi áp dụng chuẩn bảo mật Antigravity để đảm bảo chỉ những thành viên được cấp quyền mới có thể truy cập thông tin nhạy cảm.</p>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-serif border-b border-[var(--color-dong)] pb-2 flex items-center gap-2">
            <Smartphone size={20} className="text-[var(--color-son)]" />
            Ứng dụng di động
          </h3>
          <button className="w-full py-4 bg-[var(--color-son)] text-white rounded-xl font-serif tracking-widest hover:bg-[var(--color-muc)] transition-all">
            YÊU CẦU APP RIÊNG
          </button>
        </section>
      </div>
    </div>
  );
}

function Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  );
}
