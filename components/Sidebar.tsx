'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GitGraph, Archive, Calendar, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const MENU_ITEMS = [
  { name: 'Tổng quan', icon: Home, href: '/' },
  { name: 'Phả đồ', icon: GitGraph, href: '/tree' },
  { name: 'Kho ký ức', icon: Archive, href: '/vault' },
  { name: 'Sự kiện', icon: Calendar, href: '/events' },
  { name: 'White Label', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-[var(--color-dong)] bg-[var(--color-son)] flex flex-col h-full z-30">
      <div className="p-6 flex items-center space-x-3 border-b border-[var(--color-dong)]/30">
        <div className="w-10 h-10 border-2 border-[var(--color-dong)] rounded-full flex items-center justify-center text-[var(--color-dong)] font-bold text-xl">
          🇻🇳
        </div>
        <div>
          <h1 className="text-[var(--color-dong)] font-bold text-lg leading-tight tracking-tight uppercase font-serif">
            Dòng Tộc Việt
          </h1>
          <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-sans">
            Bảo tàng số di sản
          </p>
        </div>
      </div>
      
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 transition-colors cursor-pointer text-sm font-serif tracking-wide",
                isActive 
                  ? "bg-[var(--color-dong)]/20 text-[var(--color-dong)] border-l-4 border-[var(--color-dong)] font-bold" 
                  : "text-white/70 hover:bg-white/5"
              )}
            >
              <Icon size={18} className={cn(isActive ? "text-[var(--color-dong)]" : "text-white/40")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-[var(--color-dong)]/20 bg-black/10">
        <div className="flex items-center space-x-2 text-[var(--color-dong)] text-[10px] mb-2 uppercase tracking-[0.3em] opacity-80">
          <span className="font-sans">Hào Khí Việt Nam</span>
        </div>
        <svg width="200" height="30" viewBox="0 0 200 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
          <path d="M0 15C20 5 30 25 50 15C70 5 80 25 100 15C120 5 130 25 150 15C170 5 180 25 200 15" stroke="var(--color-dong)" strokeWidth="1" />
        </svg>
      </div>
    </aside>
  );
}
