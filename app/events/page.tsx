'use client';

import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Plus,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const EVENTS = [
  { id: 1, day: 12, month: 3, name: 'Giỗ tổ chi 2', type: 'Giỗ', place: 'Từ đường họ Nguyễn, Huế', time: '08:00' },
  { id: 2, day: 15, month: 4, name: 'Lễ Thanh Minh', type: 'Lễ', place: 'Nghĩa trang dòng họ', time: '07:30' },
  { id: 3, day: 21, month: 5, name: 'Họp hội đồng gia tộc', type: 'Hội', place: 'Văn phòng đại diện', time: '14:00' },
  { id: 4, day: 25, month: 8, name: 'Trao thưởng khuyến học', type: 'Hội', place: 'Nhà thờ họ', time: '09:00' },
];

export default function EventsPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // Start at April 2026 for demo
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = `Tháng ${month + 1}`;
  
  const numDays = daysInMonth(year, month);
  const startOffset = firstDayOfMonth(year, month);
  
  const calendarDays = [];
  for (let i = 0; i < startOffset; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= numDays; i++) {
    calendarDays.push(i);
  }

  const getEventsForDay = (day: number) => {
    return EVENTS.filter(e => e.day === day && e.month === month + 1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif text-[var(--color-son)]">LỊCH SỰ KIỆN & NGÀY GIỖ</h2>
          <p className="text-sm opacity-60 italic font-serif">Theo dõi và đăng ký tham gia các hoạt động tâm linh của dòng tộc.</p>
        </div>
        <button className="flex gap-2 items-center px-6 py-2 bg-[var(--color-son)] text-white rounded-full font-serif text-sm hover:bg-[var(--color-muc)] transition-all shadow-md">
          <Plus size={16} /> ĐÀNH DẤU NGÀY GIỖ
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[700px]">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white border border-[var(--color-dong)]/30 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-[var(--color-dong)]/20 bg-[var(--color-dong)]/5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-serif font-bold text-[var(--color-son)]">{monthName}, {year}</h3>
              <div className="flex gap-1">
                <button onClick={prevMonth} className="p-1 hover:bg-white rounded transition-colors border border-[var(--color-dong)]/20">
                  <ChevronLeft size={16} className="text-[var(--color-son)]" />
                </button>
                <button onClick={nextMonth} className="p-1 hover:bg-white rounded transition-colors border border-[var(--color-dong)]/20">
                  <ChevronRight size={16} className="text-[var(--color-son)]" />
                </button>
              </div>
            </div>
            <button 
              onClick={() => setCurrentDate(new Date(2026, 3, 1))}
              className="text-xs font-serif px-3 py-1 border border-[var(--color-dong)]/40 rounded hover:bg-white transition-colors"
            >
              Hôm nay
            </button>
          </div>

          <div className="flex-1 grid grid-cols-7 text-center font-serif text-xs border-b border-[var(--color-dong)]/10">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
              <div key={d} className="py-3 bg-[var(--color-xuyen)]/30 border-r border-[var(--color-dong)]/10 last:border-0 font-bold opacity-50 uppercase">
                {d}
              </div>
            ))}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto bg-white">
            <div className="grid grid-cols-7 border-l border-[var(--color-dong)]/10">
              {calendarDays.map((day, idx) => {
                const dayEvents = day ? getEventsForDay(day) : [];
                const isToday = day === 1 && month === 3 && year === 2026; // Simulating today
                
                return (
                  <div 
                    key={idx} 
                    onClick={() => day && setSelectedDay(day)}
                    className={cn(
                      "border-r border-b border-[var(--color-dong)]/10 p-2 min-h-[120px] transition-all hover:bg-[var(--color-dong)]/5 cursor-pointer flex flex-col gap-1",
                      !day && "bg-gray-100/20",
                      selectedDay === day && "bg-[var(--color-dong)]/5"
                    )}
                  >
                    {day && (
                      <>
                        <div className="flex justify-between items-start mb-1">
                          <span className={cn(
                            "text-xs font-bold font-sans w-6 h-6 flex items-center justify-center rounded-full transition-colors",
                            isToday ? "bg-[var(--color-son)] text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
                          )}>
                            {day}
                          </span>
                          {dayEvents.length > 0 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-son)] animate-pulse" />
                          )}
                        </div>
                        <div className="space-y-1 overflow-hidden">
                          {dayEvents.map(e => (
                            <div 
                              key={e.id} 
                              className={cn(
                                "text-[9px] px-1.5 py-0.5 rounded border leading-tight font-serif truncate transition-transform hover:scale-[1.02]",
                                e.type === 'Giỗ' ? "bg-[var(--color-son)] text-white border-transparent" : "bg-[var(--color-dong)]/20 border-[var(--color-dong)]/30 text-[#856404]"
                              )}
                            >
                              <span className="opacity-80 mr-1">{e.time}</span> {e.name}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Event Detail List Sidebar */}
        <aside className="bg-white border border-[var(--color-dong)]/30 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 bg-[var(--color-son)] text-white">
            <h3 className="font-bold uppercase text-xs tracking-widest font-serif flex items-center gap-2">
              <CalendarIcon size={14} /> Sự kiện trong tháng
            </h3>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <AnimatePresence mode="wait">
              {EVENTS.filter(e => e.month === month + 1).length > 0 ? (
                EVENTS.filter(e => e.month === month + 1).map((event, i) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-[var(--color-xuyen)]/50 border border-[var(--color-dong)]/20 rounded group hover:border-[var(--color-son)] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-[var(--color-dong)]/20 text-[var(--color-son)] text-[9px] rounded font-bold uppercase tracking-widest">{event.type}</span>
                      <span className="text-[10px] text-gray-400 font-sans ml-auto">{event.day}/{event.month}</span>
                    </div>
                    <h4 className="font-serif font-bold text-[var(--color-son)] group-hover:underline">{event.name}</h4>
                    <div className="mt-3 space-y-1 text-[11px] text-gray-500 font-serif">
                      <div className="flex items-center gap-2 text-xs truncate"><MapPin size={12} className="text-[var(--color-dong)] flex-shrink-0" /> {event.place}</div>
                      <div className="flex items-center gap-2 text-xs"><Clock size={12} className="text-[var(--color-dong)] flex-shrink-0" /> {event.time}</div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 italic text-sm text-center px-8 font-serif">
                  <CalendarIcon size={48} className="mb-4" />
                  Không có sự kiện nào được ghi nhận trong tháng này.
                </div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="p-4 border-t border-[var(--color-dong)]/10 bg-[var(--color-dong)]/5">
            <div className="p-4 bg-white border border-[var(--color-dong)]/20 rounded shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-12 h-12 cloud-pattern opacity-10" />
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-2 tracking-widest font-sans">Đăng ký giỗ</p>
              <p className="text-xs font-serif leading-relaxed mb-3">Bạn có muốn đăng ký tổ chức ngày giỗ cho người thân tại từ đường?</p>
              <button className="w-full py-2 bg-[var(--color-son)] text-white text-[10px] font-bold uppercase tracking-widest rounded flex items-center justify-center gap-2">
                MỞ FORM ĐĂNG KÝ <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
