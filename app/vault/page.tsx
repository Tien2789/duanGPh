'use client';

import { Archive, Search, Filter, Plus } from 'lucide-react';

export default function VaultPage() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif">KHO KÝ ỨC</h2>
          <p className="text-sm opacity-60 italic">Nơi lưu giữ những hình ảnh, thước phim và tài liệu quý giá của dòng tộc.</p>
        </div>
        <button className="flex gap-2 items-center px-6 py-3 bg-[var(--color-son)] text-white rounded-full font-serif tracking-widest text-sm hover:bg-[var(--color-muc)] transition-colors shadow-lg">
          <Plus size={18} />
          ĐÓNG GÓP KÝ ỨC
        </button>
      </header>

      <div className="flex gap-4 p-4 bg-white/40 border border-[var(--color-dong)]/20 rounded-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên người, sự kiện hoặc năm..." 
            className="w-full pl-12 pr-4 py-3 bg-transparent border-b border-[var(--color-dong)]/30 focus:border-[var(--color-son)] outline-none font-serif text-sm transition-colors"
          />
        </div>
        <button className="px-4 py-2 border border-[var(--color-dong)]/30 rounded-xl flex items-center gap-2 text-xs font-serif opacity-70 hover:opacity-100 transition-all">
          <Filter size={16} /> LỌC
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-[3/4] bg-[var(--color-dong)]/5 border border-[var(--color-dong)]/20 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                <Archive size={48} />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[var(--color-son)]/80 to-transparent text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-xs font-serif">Năm 19{50 + i}</p>
                <p className="text-[10px] opacity-70">Lễ đại tế tại từ đường</p>
              </div>
            </div>
            <p className="mt-2 text-sm font-serif font-medium text-center">Ký ức #{i}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
