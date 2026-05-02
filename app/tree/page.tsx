'use client';

import { useState, useEffect } from 'react';
import GenealogyTree from '@/components/GenealogyTree';
import { Member, Gender } from '@/lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, BookOpen, Camera, FileText, Award } from 'lucide-react';
import Image from 'next/image';
import { getKinshipLabel } from '@/lib/utils';
import { cn } from '@/lib/utils';

const CURRENT_USER_ID = '6';

export default function TreePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [layoutModel, setLayoutModel] = useState<1 | 2 | 3 | 4>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('genealogy-layout-model');
      if (saved) return parseInt(saved) as 1 | 2 | 3 | 4;
    }
    return 2;
  });
  const [viewMode, setViewMode] = useState<'all' | 'paternal' | 'maternal'>('all');

  useEffect(() => {
    fetch('/api/tree')
      .then(res => res.json())
      .then(data => {
        setMembers(data);
        setLoading(false);
      });
  }, []);

  const kinship = selectedMember ? getKinshipLabel(selectedMember, members, CURRENT_USER_ID) : null;

  return (
    <div className="space-y-6 relative h-full">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif">PHẢ ĐỒ DÒNG TỘC</h2>
          <p className="text-sm opacity-60">Hệ thống tự động đồng bộ theo chi, nhánh và thế hệ.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-white/50 border border-[var(--color-dong)]/30 rounded-lg text-xs font-serif hover:bg-[var(--color-dong)]/10 transition-colors">
            XUẤT FILE PDF
          </button>
          <button className="px-4 py-2 bg-[var(--color-son)] text-white rounded-lg text-xs font-serif hover:bg-[var(--color-muc)] transition-colors">
            THÊM THÀNH VIÊN
          </button>
        </div>
      </header>

      <div className="flex justify-end mb-4">
        <div className="flex bg-white/50 p-1 border border-[var(--color-dong)]/20 rounded-xl shadow-sm">
          {[
            { id: 2, label: 'TIÊU CHUẨN' },
            { id: 1, label: 'CỔ ĐIỂN' },
            { id: 4, label: 'DẠNG CỘT' },
            { id: 3, label: 'TỎA TRÒN' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setLayoutModel(m.id as 1 | 2 | 3 | 4);
                localStorage.setItem('genealogy-layout-model', m.id.toString());
              }}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-bold transition-all",
                layoutModel === m.id 
                  ? "bg-[var(--color-son)] text-white shadow-lg" 
                  : "text-[var(--color-son)] hover:bg-[var(--color-dong)]/10"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[70vh]">
        <div className="flex-1 relative bg-white/40 border border-[var(--color-dong)]/20 rounded-2xl overflow-hidden shadow-inner">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="animate-pulse font-serif text-[var(--color-dong)]">Đang kết nối từ đường...</p>
            </div>
          ) : (
            <GenealogyTree 
              members={members} 
              onSelectMember={setSelectedMember} 
              layoutModel={layoutModel}
              viewMode={viewMode}
              selectedMemberId={selectedMember?.id}
            />
          )}
        </div>
 
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ x: 20, opacity: 0, width: 0 }}
              animate={{ x: 0, opacity: 1, width: 400 }}
              exit={{ x: 20, opacity: 0, width: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white rounded-2xl border border-[var(--color-dong)]/20 shadow-xl overflow-hidden flex flex-col"
            >
              <div className="bg-[var(--color-son)] p-6 text-[var(--color-xuyen)] relative shrink-0">
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border-2 border-[var(--color-dong)] overflow-hidden shrink-0">
                    {selectedMember.avatarUrl ? (
                      <Image 
                        src={selectedMember.avatarUrl} 
                        alt={selectedMember.fullName} 
                        width={64} 
                        height={64} 
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User size={30} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                       <h3 className="text-xl font-serif text-[var(--color-dong)] truncate">
                        {selectedMember.fullName}
                      </h3>
                      {kinship && (
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="px-1.5 py-0.5 bg-[var(--color-dong)] text-[var(--color-son)] text-[8px] rounded font-bold uppercase tracking-wider">
                            {kinship.label}
                          </span>
                          {kinship.subLabel && (
                            <span className="text-[7px] text-blue-500 font-medium lowercase">
                              {kinship.subLabel}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 opacity-70 mt-1">
                      <p className="text-[10px] uppercase tracking-widest font-sans">Đời thứ {selectedMember.generation}</p>
                      {selectedMember.isChief && <Award size={12} className="text-[var(--color-dong)]" />}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex bg-black/10 p-1 rounded-lg">
                  <button 
                    onClick={() => setViewMode('all')}
                    className={cn(
                      "flex-1 py-1.5 text-[9px] font-bold rounded transition-all",
                      viewMode === 'all' ? "bg-white text-[var(--color-son)] shadow" : "text-white hover:bg-white/5"
                    )}
                  >
                    TẤT CẢ
                  </button>
                  <button 
                    onClick={() => setViewMode('paternal')}
                    className={cn(
                      "flex-1 py-1.5 text-[9px] font-bold rounded transition-all",
                      viewMode === 'paternal' ? "bg-white text-[var(--color-son)] shadow" : "text-white hover:bg-white/5"
                    )}
                  >
                    BÊN NỘI
                  </button>
                  <button 
                    onClick={() => setViewMode('maternal')}
                    className={cn(
                      "flex-1 py-1.5 text-[9px] font-bold rounded transition-all",
                      viewMode === 'maternal' ? "bg-white text-[var(--color-son)] shadow" : "text-white hover:bg-white/5"
                    )}
                  >
                    BÊN NGOẠI
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6 space-y-6 font-serif">
                <section>
                  <h4 className="flex items-center gap-2 text-[var(--color-son)] text-sm font-bold border-b border-[var(--color-dong)]/20 pb-2 mb-4">
                    <BookOpen size={16} />
                    TIỂU SỬ & DANH XƯNG
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    {selectedMember.hieuName && (
                      <div>
                        <p className="opacity-50 text-[9px]">Tên húy</p>
                        <p className="font-medium">{selectedMember.hieuName}</p>
                      </div>
                    )}
                    {selectedMember.tuName && (
                      <div>
                        <p className="opacity-50 text-[9px]">Tên tự</p>
                        <p className="font-medium">{selectedMember.tuName}</p>
                      </div>
                    )}
                    <div>
                      <p className="opacity-50 text-[9px]">Ngày sinh</p>
                      <p className="font-medium">{selectedMember.birthDate || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <p className="opacity-50 text-[9px]">Ngày hóa</p>
                      <p className="font-medium">{selectedMember.deathDate || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-xs opacity-80 leading-relaxed italic">
                    {selectedMember.bio || 'Tiểu sử đang được cập nhật...'}
                  </div>
                </section>

                <section>
                  <h4 className="flex items-center gap-2 text-[var(--color-son)] text-sm font-bold border-b border-[var(--color-dong)]/20 pb-2 mb-4">
                    <User size={16} />
                    LIÊN KẾT NHANH
                  </h4>
                  <div className="flex flex-col gap-2">
                    {/* Parents */}
                    {(() => {
                      const father = members.find(m => m.id === selectedMember.parentId);
                      const mother = members.find(m => 
                        father?.spouseIds.includes(m.id) && m.childrenIds.includes(selectedMember.id)
                      );
                      
                      return (
                        <>
                          {father && (
                            <button 
                              onClick={() => setSelectedMember(father)}
                              className="flex items-center gap-3 p-2 rounded-lg bg-[var(--color-dong)]/5 hover:bg-[var(--color-dong)]/15 transition-all text-left group"
                            >
                              <div className="w-8 h-8 rounded-full bg-[var(--color-son)]/10 flex items-center justify-center text-[var(--color-son)] shrink-0">
                                <User size={14} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[9px] opacity-50 uppercase font-bold">Thân phụ (Cha)</p>
                                <p className="text-xs font-bold truncate group-hover:text-[var(--color-son)] transition-colors">{father.fullName}</p>
                              </div>
                            </button>
                          )}
                          {mother && (
                            <button 
                              onClick={() => setSelectedMember(mother)}
                              className="flex items-center gap-3 p-2 rounded-lg bg-[var(--color-dong)]/5 hover:bg-[var(--color-dong)]/15 transition-all text-left group"
                            >
                              <div className="w-8 h-8 rounded-full bg-[var(--color-son)]/10 flex items-center justify-center text-[var(--color-son)] shrink-0">
                                <User size={14} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[9px] opacity-50 uppercase font-bold">Thân mẫu (Mẹ)</p>
                                <p className="text-xs font-bold truncate group-hover:text-[var(--color-son)] transition-colors">{mother.fullName}</p>
                              </div>
                            </button>
                          )}
                        </>
                      );
                    })()}

                    {/* Children count / Link to first child? */}
                    {selectedMember.childrenIds.length > 0 && (
                      <div className="mt-1">
                        <p className="text-[9px] opacity-50 uppercase font-bold mb-2 ml-2">Hậu duệ ({selectedMember.childrenIds.length} người con)</p>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedMember.childrenIds.slice(0, 4).map(childId => {
                            const child = members.find(m => m.id === childId);
                            if (!child) return null;
                            return (
                              <button 
                                key={childId}
                                onClick={() => setSelectedMember(child)}
                                className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-[var(--color-dong)]/20 hover:border-[var(--color-son)] transition-all text-left group"
                              >
                                <div className="w-6 h-6 rounded-full bg-[var(--color-dong)]/10 flex items-center justify-center text-[var(--color-son)] shrink-0 text-[10px]">
                                  {child.gender === 'MALE' ? '👦' : '👧'}
                                </div>
                                <p className="text-[10px] font-medium truncate group-hover:text-[var(--color-son)] transition-colors">{child.fullName.split(' ').pop()}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h4 className="flex items-center gap-2 text-[var(--color-son)] text-sm font-bold border-b border-[var(--color-dong)]/20 pb-2 mb-4">
                    <Camera size={16} />
                    KHO KÝ ỨC
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="aspect-square bg-[var(--color-dong)]/10 rounded-lg flex items-center justify-center group cursor-pointer hover:bg-[var(--color-dong)]/20 transition-all">
                        <Camera size={18} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </section>

                <button className="w-full py-3 bg-[var(--color-dong)]/10 border border-[var(--color-dong)]/30 rounded-xl text-[var(--color-son)] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-dong)]/20 transition-all">
                  <FileText size={16} />
                  CHI TIẾT GIA PHẢ
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
