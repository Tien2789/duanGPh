import type { Metadata } from 'next';
import { Lora, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeContext';
import Sidebar from '@/components/Sidebar';
import PageTransition from '@/components/PageTransition';

const lora = Lora({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Dòng Tộc Việt - Bảo tàng số di sản',
  description: 'Nền tảng quản lý gia phả và lưu giữ truyền thống dòng tộc Việt Nam.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${lora.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="overflow-hidden">
        <ThemeProvider>
          <div className="flex h-screen w-screen bg-[var(--color-xuyen)] paper-texture">
            <Sidebar />
            <main className="flex-1 flex flex-col relative overflow-hidden">
              {/* High Density Header */}
              <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 border-b border-[var(--color-dong)]/30 cloud-header-pattern relative z-20 bg-[var(--color-xuyen)]/80 backdrop-blur-sm">
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-son)] leading-tight">Dòng Tộc Việt</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-sans">Hệ Thống Quản Lý Gia Phả Số • v1.0.4</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right font-sans">
                    <p className="text-sm font-bold text-[var(--color-son)] leading-none mb-1">Tiến Phan</p>
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] text-gray-400 leading-none mb-1 italic">phantrantien5@gmail.com</p>
                      <span className="px-2 py-0.5 bg-[var(--color-son)] text-white text-[8px] font-bold uppercase tracking-wider rounded border border-[var(--color-dong)]/40 shadow-sm">
                        Quản trị viên (Admin)
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-[var(--color-dong)]/20 rounded-full flex items-center justify-center border-2 border-[var(--color-dong)] text-[var(--color-son)] font-bold shadow-inner group cursor-pointer hover:bg-[var(--color-dong)]/30 transition-all">
                    TP
                  </div>
                </div>
              </header>

              {/* Main Content Area */}
              <div className="flex-1 relative overflow-auto high-density-grid">
                <div className="relative z-10 p-6 min-h-full">
                  <PageTransition>
                    {children}
                  </PageTransition>
                </div>
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
