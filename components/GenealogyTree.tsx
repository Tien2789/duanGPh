'use client';

import React, { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { 
  Node, 
  Edge, 
  Background, 
  BackgroundVariant,
  Controls, 
  Handle, 
  Position,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Member, Gender } from '@/lib/types';
import { Award, User } from 'lucide-react';
import { cn, getKinshipLabel } from '@/lib/utils';
import Image from 'next/image';

const CURRENT_USER_ID = '6'; // Simulating "Tiến Phan" as the logged-in user

// custom node
const MemberNode = ({ data }: { data: { member: Member; members: Member[]; onSelect: (m: Member) => void; selectedMemberId?: string; layoutModel?: 1 | 2 | 3 | 4; spouseIndex?: number } }) => {
  const { member, members, onSelect, selectedMemberId, layoutModel, spouseIndex } = data;
  
  const isFemale = member.gender === Gender.FEMALE;
  const isChief = member.isChief;
  const isMeScope = member.id === CURRENT_USER_ID;
  
  // Polygamy labels
  const spouseLabel = spouseIndex === 0 ? "Chính thất" : spouseIndex !== undefined ? "Thứ thất" : null;
  
  // Highlighting relative to selected member if exists, else relative to current user
  const highlightBaseId = selectedMemberId || CURRENT_USER_ID;
  const isHighlighted = member.id === highlightBaseId;
  
  // Kinship labels ALWAYS relative to original user (Tiến Phan) per user request
  const kinship = getKinshipLabel(member, members, CURRENT_USER_ID);
  
  return (
    <div 
      onClick={() => onSelect(member)}
      className={cn(
        "px-6 py-4 rounded border transition-all hover:shadow-xl active:scale-95 text-center font-serif relative bg-[#FFFDF9]",
        isHighlighted ? "ring-4 ring-[var(--color-son)] ring-offset-4 scale-110 z-50 border-[var(--color-son)]" : "hover:border-[var(--color-dong)]",
        isFemale ? "border-[#FFB6C1] bg-pink-50/10" : "border-[#B0C4DE] bg-blue-50/10",
        isChief && !isHighlighted && "border-2 border-[var(--color-dong)] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
      )}
    >
      <div className="absolute inset-0 border border-black/5 pointer-events-none rounded" />
      
      {/* Universal Handles */}
      <Handle type="target" position={Position.Top} id="top" className="w-2 h-2 !bg-[var(--color-son)] border-white border" />
      <Handle type="target" position={Position.Left} id="left" className="w-2 h-2 !bg-[var(--color-son)] border-white border" />
      <Handle type="target" position={Position.Right} id="right" className="w-2 h-2 !bg-[var(--color-son)] border-white border" />
      <Handle type="target" position={Position.Bottom} id="bottom" className="w-2 h-2 !bg-[var(--color-son)] border-white border" />
      
      <Handle type="source" position={Position.Top} id="top-src" className="w-2 h-2 !bg-[var(--color-son)] border-white border opacity-0" />
      <Handle type="source" position={Position.Left} id="left-src" className="w-2 h-2 !bg-[var(--color-son)] border-white border opacity-0" />
      <Handle type="source" position={Position.Right} id="right-src" className="w-2 h-2 !bg-[var(--color-son)] border-white border opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom-src" className="w-2 h-2 !bg-[var(--color-son)] border-white border opacity-0" />
      
      <div className="flex flex-col items-center relative z-10">
        {member.generation === 1 && (
          <div className="absolute -top-10 bg-[var(--color-son)] text-white text-[9px] px-3 py-0.5 border border-[var(--color-dong)] font-bold uppercase tracking-widest shadow-sm">
            THỦY TỔ
          </div>
        )}
        
        {kinship && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 z-20">
            <div className="px-3 py-0.5 rounded bg-[var(--color-son)] text-white text-[9px] font-bold shadow-sm whitespace-nowrap border border-white/20">
              {kinship.label}
            </div>
            {kinship.subLabel && (
              <div className="text-[8px] text-blue-500 font-bold whitespace-nowrap bg-white/90 px-1.5 py-0.5 rounded shadow-sm border border-blue-100">
                {kinship.subLabel}
              </div>
            )}
          </div>
        )}

        <div className="relative mb-3 group">
          <div className={cn(
            "w-16 h-16 rounded-full overflow-hidden border-2 shadow-inner bg-[var(--color-xuyen)]",
            isHighlighted ? "border-[var(--color-son)]" : "border-[var(--color-dong)]/40"
          )}>
            {member.avatarUrl ? (
              <Image 
                src={member.avatarUrl} 
                alt={member.fullName} 
                width={64} 
                height={64} 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <User size={32} />
              </div>
            )}
          </div>
          {isChief && (
            <div className="absolute -bottom-1 -right-1 bg-[var(--color-dong)] text-white p-1 rounded-full shadow-md">
              <Award size={12} />
            </div>
          )}
        </div>
        
        <p className={cn(
          "text-[10px] uppercase tracking-[0.1em] mb-1 font-sans font-bold",
          isChief ? "text-[var(--color-son)]" : "text-gray-400"
        )}>
          Đời thứ {member.generation}
        </p>
        <p className={cn(
          "font-bold leading-tight text-base",
          isHighlighted ? "text-[var(--color-son)]" : isChief ? "text-[var(--color-son)]" : "text-[#333]"
        )}>
          {isMeScope && !selectedMemberId ? "Tôi" : member.fullName}
        </p>
        
        {spouseLabel && (
          <p className="text-[9px] text-[#C19A6B] font-bold uppercase mt-0.5 tracking-tighter">
            ({spouseLabel})
          </p>
        )}

        {member.hieuName && (
          <p className="text-[11px] italic text-gray-500 mt-1">
            &ldquo;{member.hieuName}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
};

const UnionNode = () => (
  <div className="w-5 h-5 rounded-full bg-[var(--color-son)] border-2 border-white shadow-md flex items-center justify-center relative">
    {/* Explicit handles with better target areas */}
    <Handle type="target" position={Position.Top} id="top" style={{ top: -2, left: '50%', width: 10, height: 10, transform: 'translateX(-50%)' }} className="!bg-[var(--color-son)] opacity-0" />
    <Handle type="source" position={Position.Bottom} id="bottom" style={{ bottom: -2, left: '50%', width: 10, height: 10, transform: 'translateX(-50%)' }} className="!bg-[var(--color-son)] opacity-0" />
    <Handle type="target" position={Position.Left} id="left" style={{ left: -2, top: '50%', width: 10, height: 10, transform: 'translateY(-50%)' }} className="!bg-[var(--color-son)] opacity-0" />
    <Handle type="target" position={Position.Right} id="right" style={{ right: -2, top: '50%', width: 10, height: 10, transform: 'translateY(-50%)' }} className="!bg-[var(--color-son)] opacity-0" />
    <div className="w-2 h-2 rounded-full bg-white opacity-40 animate-pulse" />
  </div>
);

const nodeTypes = {
  member: MemberNode,
  union: UnionNode,
};

function GenealogyTreeContent({ 
  members, 
  onSelectMember, 
  layoutModel = 2, 
  viewMode = 'all',
  selectedMemberId 
}: { 
  members: Member[]; 
  onSelectMember: (m: Member) => void;
  layoutModel?: 1 | 2 | 3 | 4;
  viewMode?: 'all' | 'paternal' | 'maternal' | 'nam-dinh';
  selectedMemberId?: string;
}) {
  const { setCenter } = useReactFlow();

  const filteredMembers = useMemo(() => {
    if (viewMode === 'all') return members;
    
    const result = new Set<string>();
    
    if (viewMode === 'nam-dinh') {
      // Find top ancestors (Generation 1)
      const roots = members.filter(m => m.generation === 1);
      
      const processNamDinh = (mId: string) => {
        const m = members.find(x => x.id === mId);
        if (!m) return;
        
        result.add(m.id);
        
        // Add wives/spouses
        m.spouseIds.forEach(sId => result.add(sId));
        
        // Process children
        m.childrenIds.forEach(cId => {
          const child = members.find(x => x.id === cId);
          if (!child) return;
          
          if (child.gender === Gender.MALE) {
            processNamDinh(child.id);
          } else if (child.spouseIds.length === 0) {
            // Unmarried daughter
            result.add(child.id);
          }
          // Married daughters are included if we want to show the leaf, but their subtree is cut.
          // Based on user: "cộng thêm những người con gái CHƯA có chồng. Cắt bỏ toàn bộ nhánh hậu duệ của con gái đã lấy chồng"
          // This implies if a daughter HAS a husband, she is excluded OR just her branches are cut.
          // Usually "Nam Dinh" excludes married out daughters.
        });
      };
      
      roots.forEach(r => {
        if (r.gender === Gender.MALE) processNamDinh(r.id);
        else {
          // If root is female (unlikely for "Thuy To" usually, but possible in data)
          result.add(r.id);
        }
      });
      
      return members.filter(m => result.has(m.id));
    }

    if (!selectedMemberId) return members;
    const selected = members.find(m => m.id === selectedMemberId);
    if (!selected) return members;

    const addBranch = (rootId: string) => {
      const queue = [rootId];
      const visited = new Set<string>();
      while (queue.length > 0) {
        const id = queue.shift()!;
        if (visited.has(id)) continue;
        visited.add(id);
        result.add(id);
        
        const m = members.find(x => x.id === id);
        if (m) {
          m.childrenIds.forEach(c => queue.push(c));
          m.spouseIds.forEach(s => result.add(s)); 
        }
      }
    };

    if (viewMode === 'paternal') {
      let root = selected;
      while (root.parentId) {
        const p = members.find(m => m.id === root.parentId);
        if (!p) break;
        root = p;
      }
      addBranch(root.id);
    } else if (viewMode === 'maternal') {
      const father = members.find(m => m.id === selected.parentId);
      const motherId = father?.spouseIds.find(sId => {
        const s = members.find(m => m.id === sId);
        return s?.gender === Gender.FEMALE && s.childrenIds.includes(selected.id);
      });
      
      if (motherId) {
        let maternalRoot = members.find(m => m.id === motherId);
        if (maternalRoot) {
          while (maternalRoot.parentId) {
            const p = members.find(m => m.id === maternalRoot!.parentId);
            if (!p) break;
            maternalRoot = p;
          }
          addBranch(maternalRoot.id);
        }
      } else {
        if (selected.gender === Gender.FEMALE) {
          let root = selected;
          while (root.parentId) {
            const p = members.find(m => m.id === root.parentId);
            if (!p) break;
            root = p;
          }
          addBranch(root.id);
        }
        else result.add(selected.id);
      }
    }

    return members.filter(m => result.has(m.id));
  }, [members, viewMode, selectedMemberId]);

  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];
    const membersToRender = filteredMembers;
    const generations = Array.from(new Set(membersToRender.map(m => m.generation))).sort((a, b) => a - b);
    
    // Radial Layout (Model 3)
    if (layoutModel === 3) {
      const centerX = 1000;
      const centerY = 1000;
      const centerId = selectedMemberId || membersToRender.find(m => m.generation === 1)?.id;
      
      if (!centerId) return [];

      const visited = new Set<string>();
      const addRadial = (mId: string, depth: number, angle: number, spread: number) => {
        if (visited.has(mId)) return;
        const member = membersToRender.find(m => m.id === mId);
        if (!member) return;
        visited.add(mId);

        const radius = depth * 350;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        nodes.push({
          id: member.id,
          type: 'member',
          data: { 
            member, 
            members: membersToRender, 
            onSelect: onSelectMember,
            selectedMemberId,
            layoutModel
          },
          position: { x, y },
        });

        // Add children in radial spread (sorted by birthOrder)
        const sortedChildren = [...member.childrenIds].sort((a, b) => {
          const mA = membersToRender.find(m => m.id === a);
          const mB = membersToRender.find(m => m.id === b);
          return (mA?.birthOrder || 0) - (mB?.birthOrder || 0);
        });

        if (sortedChildren.length > 0) {
          const childSpread = spread / (sortedChildren.length + 1);
          sortedChildren.forEach((cId, idx) => {
            const childAngle = angle - spread/2 + childSpread * (idx + 1);
            addRadial(cId, depth + 1, childAngle, spread / 2);
          });
        }

        // Add spouses in radial spread
        member.spouseIds.forEach((sId, sIdx) => {
          if (!visited.has(sId)) {
            const spouse = membersToRender.find(m => m.id === sId);
            if (spouse) {
              visited.add(sId);
              nodes.push({
                id: spouse.id,
                type: 'member',
                data: { 
                  member: spouse, 
                  members: membersToRender, 
                  onSelect: onSelectMember, 
                  selectedMemberId, 
                  layoutModel,
                  spouseIndex: sIdx
                },
                position: { x: x + 150 + (sIdx * 160), y: y + 50 },
              });
            }
          }
        });
      };

      addRadial(centerId, 0, 0, Math.PI * 2);
      return nodes;
    }

    // Horizontal Layout (Model 4) - Dạng cột
    if (layoutModel === 4) {
      const genWidth = 600;
      const memberHeight = 220;
      
      generations.forEach((gen, gIdx) => {
        const genMembers = membersToRender.filter(m => m.generation === gen);
        // Sort gen members? Usually we want to follow parents. 
        // For simplicity we just follow order but sorting by birthOrder helps if they have same parent.
        genMembers.sort((a, b) => (a.birthOrder || 0) - (b.birthOrder || 0));

        let currentY = 0;
        const processedIds = new Set<string>();

        genMembers.forEach(member => {
          if (processedIds.has(member.id)) return;

          nodes.push({
            id: member.id,
            type: 'member',
            data: { 
              member, 
              members: membersToRender, 
              onSelect: onSelectMember,
              selectedMemberId,
              layoutModel
            },
            position: { x: gIdx * genWidth, y: currentY },
          });
          processedIds.add(member.id);

          // All spouses
          member.spouseIds.forEach((sId, sIdx) => {
            const spouse = membersToRender.find(m => m.id === sId && m.generation === gen);
            if (spouse && !processedIds.has(sId)) {
              nodes.push({
                id: spouse.id,
                type: 'member',
                data: { 
                  member: spouse, 
                  members: membersToRender, 
                  onSelect: onSelectMember,
                  selectedMemberId,
                  layoutModel,
                  spouseIndex: sIdx
                },
                position: { x: gIdx * genWidth, y: currentY + (sIdx + 1) * 180 },
              });
              processedIds.add(spouse.id);
            }
          });

          const maxSpouses = member.spouseIds.filter(id => membersToRender.some(m => m.id === id)).length;
          currentY += memberHeight * (maxSpouses + 1);
        });
      });
      return nodes;
    }

    // Vertical Layouts (Model 1 & 2)
    generations.forEach(gen => {
      const genMembers = membersToRender.filter(m => m.generation === gen);
      // Sort by parent then birthOrder for visual grouping
      genMembers.sort((a, b) => {
        if (a.parentId !== b.parentId) return (a.parentId || '').localeCompare(b.parentId || '');
        return (a.birthOrder || 0) - (b.birthOrder || 0);
      });

      let currentX = 0;
      const processedIds = new Set<string>();

      genMembers.forEach(member => {
        if (processedIds.has(member.id)) return;

        nodes.push({
          id: member.id,
          type: 'member',
          data: { 
            member, 
            members: membersToRender, 
            onSelect: onSelectMember,
            selectedMemberId,
            layoutModel
          },
          position: { x: currentX, y: (gen - 1) * 350 },
        });
        processedIds.add(member.id);

        // All spouses
        let spouseX = currentX + 260;
        member.spouseIds.forEach((sId, sIdx) => {
          const spouse = membersToRender.find(m => m.id === sId && m.generation === gen);
          if (spouse && !processedIds.has(sId)) {
            nodes.push({
              id: spouse.id,
              type: 'member',
              data: { 
                member: spouse, 
                members: membersToRender, 
                onSelect: onSelectMember,
                selectedMemberId,
                layoutModel,
                spouseIndex: sIdx
              },
              position: { x: spouseX, y: (gen - 1) * 350 },
            });
            processedIds.add(spouse.id);

            if (layoutModel === 2) {
              const commonChildren = member.childrenIds.filter(id => spouse.childrenIds.includes(id));
              if (commonChildren.length > 0) {
                const unionId = `union-${[member.id, sId].sort().join('-')}`;
                // Calculate center between husband right edge (220) and wife left edge
                const unionX = (currentX + 220 + spouseX) / 2 - 10; // -10 for half w-5 width
                nodes.push({
                  id: unionId,
                  type: 'union',
                  data: { layoutModel },
                  position: { x: unionX, y: (gen - 1) * 350 + 85 },
                });
              }
            }
            spouseX += 260;
          }
        });

        const activeSpouses = member.spouseIds.filter(id => membersToRender.some(m => m.id === id)).length;
        currentX += 340 + (activeSpouses * 260);
      });
    });
    
    return nodes;
  }, [filteredMembers, onSelectMember, layoutModel, selectedMemberId]);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    const membersToRender = filteredMembers;
    const processedSpouseLinks = new Set<string>();

    membersToRender.forEach(member => {
      if (member.parentId) {
        const father = membersToRender.find(m => m.id === member.parentId);
        const mother = father?.spouseIds.length ? membersToRender.find(m => father.spouseIds.includes(m.id) && m.childrenIds.includes(member.id)) : null;

        const isAdopted = member.isAdopted;
        const edgeStyle = isAdopted 
          ? { stroke: '#A0A0A0', strokeWidth: 2, strokeDasharray: '5 5' } 
          : { stroke: '#D4AF37', strokeWidth: 2 };

        if (layoutModel === 2 && father && mother && membersToRender.find(m => m.id === mother.id)) {
          const unionId = `union-${[father.id, mother.id].sort().join('-')}`;
          edges.push({
            id: `e-union-${member.id}`,
            source: unionId,
            target: member.id,
            sourceHandle: 'bottom',
            animated: !isAdopted,
            style: edgeStyle,
          });
        } else {
          const parentInView = membersToRender.find(m => m.id === member.parentId);
          if (parentInView) {
            edges.push({
              id: `e-${member.parentId}-${member.id}`,
              source: member.parentId,
              target: member.id,
              animated: !isAdopted,
              targetHandle: layoutModel === 4 ? 'left' : 'top',
              sourceHandle: layoutModel === 4 ? 'right-src' : 'bottom-src',
              style: edgeStyle,
            });
          }
        }
      }

      member.spouseIds.forEach(spouseId => {
        const pairId = [member.id, spouseId].sort().join('-');
        if (!processedSpouseLinks.has(pairId)) {
          const spouse = membersToRender.find(m => m.id === spouseId);
          if (spouse) {
            const commonChildren = member.childrenIds.filter(id => spouse.childrenIds.includes(id));
            if (layoutModel === 2 && commonChildren.length > 0) {
              const unionId = `union-${[member.id, spouseId].sort().join('-')}`;
              edges.push({
                id: `s-${member.id}-${spouseId}-u-primary`,
                source: member.id,
                target: unionId,
                sourceHandle: 'right-src',
                targetHandle: 'left',
                style: { stroke: '#D4AF37', strokeWidth: 2 },
              });
              edges.push({
                id: `s-${spouseId}-${member.id}-u-secondary`,
                source: spouseId,
                target: unionId,
                sourceHandle: 'left-src',
                targetHandle: 'right',
                style: { stroke: '#D4AF37', strokeWidth: 2 },
              });
            } else {
              edges.push({
                id: `spouse-${pairId}`,
                source: member.id,
                target: spouseId,
                sourceHandle: layoutModel === 4 ? 'bottom-src' : 'right-src',
                targetHandle: layoutModel === 4 ? 'top' : 'left',
                style: { stroke: '#FFB6C1', strokeWidth: 2, strokeDasharray: '5 5' },
                type: 'simplebezier',
              });
            }
            processedSpouseLinks.add(pairId);
          }
        }
      });
    });
    return edges;
  }, [filteredMembers, layoutModel]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Auto-center on selected member
  useEffect(() => {
    if (selectedMemberId) {
      const node = nodes.find(n => n.id === selectedMemberId);
      if (node) {
        setCenter(node.position.x + 80, node.position.y + 100, { duration: 800, zoom: 0.9 });
      }
    }
  }, [selectedMemberId, nodes, setCenter]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView={!selectedMemberId}
        className="relative z-10"
      >
        <Background color="#D4AF37" variant={BackgroundVariant.Dots} gap={25} size={0.5} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default function GenealogyTree(props: any) {
  return (
    <div className="w-full h-[70vh] scroll-bg relative font-serif">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-32 h-32 cloud-pattern opacity-10 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 cloud-pattern opacity-10 animate-pulse delay-700" />
      </div>
      <ReactFlowProvider>
        <GenealogyTreeContent {...props} />
      </ReactFlowProvider>
    </div>
  );
}
