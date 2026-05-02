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
const MemberNode = ({ data }: { data: { member: Member; members: Member[]; onSelect: (m: Member) => void; selectedMemberId?: string; layoutModel?: 1 | 2 | 3 | 4 } }) => {
  const { member, members, onSelect, selectedMemberId, layoutModel } = data;
  
  const isFemale = member.gender === Gender.FEMALE;
  const isChief = member.isChief;
  const isMeScope = member.id === CURRENT_USER_ID;
  
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
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-2 h-2 !bg-[var(--color-son)] border-white border" />
      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !bg-[var(--color-son)] border-white border" />
      
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
  <div className="w-3 h-3 rounded-full bg-[var(--color-son)] border-2 border-white shadow-sm flex items-center justify-center">
    <Handle type="target" position={Position.Top} id="top" className="opacity-0" />
    <Handle type="source" position={Position.Bottom} id="bottom" className="opacity-0" />
    <Handle type="target" position={Position.Left} id="left" className="opacity-0" />
    <Handle type="target" position={Position.Right} id="right" className="opacity-0" />
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
  viewMode?: 'all' | 'paternal' | 'maternal';
  selectedMemberId?: string;
}) {
  const { setCenter } = useReactFlow();

  const filteredMembers = useMemo(() => {
    if (viewMode === 'all' || !selectedMemberId) return members;
    
    const result = new Set<string>();
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
        // Find highest ancestor of the mother to show the full maternal clan
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
          // If selected is female, show her full branch from her highest ancestor
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

        // Add children in radial spread
        if (member.childrenIds.length > 0) {
          const childSpread = spread / (member.childrenIds.length + 1);
          member.childrenIds.forEach((cId, idx) => {
            const childAngle = angle - spread/2 + childSpread * (idx + 1);
            addRadial(cId, depth + 1, childAngle, spread / 2);
          });
        }

        // Add spouse next to member
        member.spouseIds.forEach(sId => {
          if (!visited.has(sId)) {
            const spouse = membersToRender.find(m => m.id === sId);
            if (spouse) {
              visited.add(sId);
              nodes.push({
                id: spouse.id,
                type: 'member',
                data: { member: spouse, members: membersToRender, onSelect: onSelectMember, selectedMemberId, layoutModel },
                position: { x: x + 150, y: y + 50 },
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
      const genWidth = 450;
      const memberHeight = 220;
      
      generations.forEach((gen, gIdx) => {
        const genMembers = membersToRender.filter(m => m.generation === gen);
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

          const spouseId = member.spouseIds[0];
          const spouse = spouseId ? membersToRender.find(m => m.id === spouseId && m.generation === gen) : null;
          
          if (spouse) {
            nodes.push({
              id: spouse.id,
              type: 'member',
              data: { 
                member: spouse, 
                members: membersToRender, 
                onSelect: onSelectMember,
                selectedMemberId,
                layoutModel
              },
              position: { x: gIdx * genWidth, y: currentY + 180 },
            });
            processedIds.add(spouse.id);
            currentY += memberHeight * 2;
          } else {
            currentY += memberHeight;
          }
        });
      });
      return nodes;
    }

    // Vertical Layouts (Model 1 & 2)
    generations.forEach(gen => {
      const genMembers = membersToRender.filter(m => m.generation === gen);
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
          position: { x: currentX, y: (gen - 1) * 320 },
        });
        processedIds.add(member.id);

        const spouseId = member.spouseIds[0];
        const spouse = spouseId ? membersToRender.find(m => m.id === spouseId && m.generation === gen) : null;
        
        if (spouse) {
          nodes.push({
            id: spouse.id,
            type: 'member',
            data: { 
              member: spouse, 
              members: membersToRender, 
              onSelect: onSelectMember,
              selectedMemberId,
              layoutModel
            },
            position: { x: currentX + 260, y: (gen - 1) * 320 },
          });
          processedIds.add(spouse.id);

          if (layoutModel === 2) {
            const commonChildren = member.childrenIds.filter(id => spouse.childrenIds.includes(id));
            if (commonChildren.length > 0) {
              nodes.push({
                id: `union-${member.id}-${spouseId}`,
                type: 'union',
                data: { layoutModel },
                position: { x: currentX + 230, y: (gen - 1) * 320 + 85 },
              });
            }
          }
          currentX += 580; 
        } else {
          currentX += 340; 
        }
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

        if (layoutModel === 2 && father && mother && membersToRender.find(m => m.id === mother.id)) {
          edges.push({
            id: `e-union-${member.id}`,
            source: `union-${father.id}-${mother.id}`,
            target: member.id,
            sourceHandle: 'bottom',
            animated: true,
            style: { stroke: '#D4AF37', strokeWidth: 2 },
          });
        } else {
          const parentInView = membersToRender.find(m => m.id === member.parentId);
          if (parentInView) {
            edges.push({
              id: `e-${member.parentId}-${member.id}`,
              source: member.parentId,
              target: member.id,
              animated: true,
              targetHandle: layoutModel === 4 ? 'left' : 'top',
              sourceHandle: layoutModel === 4 ? 'right' : 'bottom',
              style: { stroke: '#D4AF37', strokeWidth: 2 },
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
              edges.push({
                id: `s-${member.id}-u`,
                source: member.id,
                target: `union-${member.id}-${spouseId}`,
                sourceHandle: 'right',
                targetHandle: 'left',
                style: { stroke: '#D4AF37', strokeWidth: 2 },
              });
              edges.push({
                id: `s-${spouseId}-u`,
                source: spouseId,
                target: `union-${member.id}-${spouseId}`,
                sourceHandle: 'left',
                targetHandle: 'right',
                style: { stroke: '#D4AF37', strokeWidth: 2 },
              });
            } else {
              edges.push({
                id: `spouse-${pairId}`,
                source: member.id,
                target: spouseId,
                sourceHandle: layoutModel === 4 ? 'bottom' : 'right',
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
