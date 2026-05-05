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
import dagre from 'dagre';

const CURRENT_USER_ID = '6'; // Simulating "Tiến Phan" as the logged-in user

// custom node
const MemberNode = ({ data }: { data: { member: Member; members: Member[]; onSelect: (m: Member) => void; selectedMemberId?: string; spouseIndex?: number } }) => {
  const { member, members, onSelect, selectedMemberId, spouseIndex } = data;
  
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

// Dagre Layout Helper
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ 
    rankdir: 'TB', 
    nodesep: 50, // More compact horizontal spacing
    ranksep: 100, // More compact vertical spacing
    ranker: 'network-simplex' // Better for compacting small branches
  });

  const nodeWidth = 220;
  const nodeHeight = 180;

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { 
      width: node.type === 'union' ? 10 : nodeWidth, 
      height: node.type === 'union' ? 10 : nodeHeight 
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - (node.type === 'union' ? 5 : nodeWidth / 2),
        y: nodeWithPosition.y - (node.type === 'union' ? 5 : nodeHeight / 2),
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

function GenealogyTreeContent({ 
  members, 
  onSelectMember, 
  viewMode = 'all',
  selectedMemberId 
}: { 
  members: Member[]; 
  onSelectMember: (m: Member) => void;
  viewMode?: 'all' | 'paternal' | 'maternal' | 'nam-dinh';
  selectedMemberId?: string;
}) {
  const { setCenter } = useReactFlow();

  const filteredMembers = useMemo(() => {
    if (viewMode === 'all') return members;
    
    const result = new Set<string>();
    
    if (viewMode === 'nam-dinh') {
      const roots = members.filter(m => m.generation === 1);
      
      const processNamDinh = (mId: string) => {
        const m = members.find(x => x.id === mId);
        if (!m) return;
        
        result.add(m.id);
        m.spouseIds.forEach(sId => result.add(sId));
        
        m.childrenIds.forEach(cId => {
          const child = members.find(x => x.id === cId);
          if (!child) return;
          
          if (child.gender === Gender.MALE) {
            processNamDinh(child.id);
          } else if (child.spouseIds.length === 0) {
            result.add(child.id);
          }
        });
      };
      
      roots.forEach(r => {
        if (r.gender === Gender.MALE) processNamDinh(r.id);
        else result.add(r.id);
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

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    // 1. Create Member Nodes
    const memberNodes: Node[] = filteredMembers.map(member => ({
      id: member.id,
      type: 'member',
      data: {
        member,
        members,
        onSelect: onSelectMember,
        selectedMemberId,
      },
      position: { x: 0, y: 0 },
    }));

    const unionNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const processedUnions = new Set<string>();

    // 2. Generate Union Nodes and Edges
    filteredMembers.forEach(member => {
      member.spouseIds.forEach((spouseId, sIdx) => {
        const spouse = members.find(m => m.id === spouseId);
        if (!spouse) return;

        // Ensure both spouses are in view or at least the link is valid
        // Actually, if a spouse is NOT in filteredMembers, we might still want to show the union if there's a child?
        // But for consistency let's stick to filtered context.
        
        const pairId = [member.id, spouseId].sort().join('-');
        const unionId = `union-${pairId}`;
        
        if (!processedUnions.has(unionId)) {
          processedUnions.add(unionId);

          // Find common children who are in filteredMembers
          const commonChildrenIds = member.childrenIds.filter(cId => 
            spouse.childrenIds.includes(cId) && filteredMembers.some(fm => fm.id === cId)
          );

          // ALWAYS create union node as requested: "nếu một member có spouseIds, BẮT BUỘC tạo một Node trung gian"
          unionNodes.push({
            id: unionId,
            type: 'union',
            data: {},
            position: { x: 0, y: 0 },
          });

          // Edges: member -> union
          newEdges.push({
            id: `e-${member.id}-${unionId}`,
            source: member.id,
            target: unionId,
            type: 'smoothstep',
            style: { stroke: '#D4AF37', strokeWidth: 2 },
          });

          // Edges: spouse -> union
          newEdges.push({
            id: `e-${spouseId}-${unionId}`,
            source: spouseId,
            target: unionId,
            type: 'smoothstep',
            style: { stroke: '#D4AF37', strokeWidth: 2 },
          });

          // Edges: union -> child (common children sorted by birthOrder)
          const sortedChildren = commonChildrenIds
            .map(cId => filteredMembers.find(m => m.id === cId)!)
            .sort((a, b) => (a.birthOrder || 0) - (b.birthOrder || 0));

          sortedChildren.forEach(child => {
            newEdges.push({
              id: `e-${unionId}-${child.id}`,
              source: unionId,
              target: child.id,
              type: 'smoothstep',
              animated: !child.isAdopted,
              style: child.isAdopted 
                ? { stroke: '#A0A0A0', strokeWidth: 2, strokeDasharray: '5 5' } 
                : { stroke: '#D4AF37', strokeWidth: 2 },
            });
          });
        }
      });
    });

    // 3. Handle cases where children don't have a common parent union (e.g. only one parent in data)
    filteredMembers.forEach(child => {
      if (child.parentId && !newEdges.some(e => e.target === child.id)) {
        const parent = filteredMembers.find(m => m.id === child.parentId);
        if (parent) {
          newEdges.push({
            id: `e-${parent.id}-${child.id}`,
            source: parent.id,
            target: child.id,
            type: 'smoothstep',
            animated: !child.isAdopted,
            style: child.isAdopted 
              ? { stroke: '#A0A0A0', strokeWidth: 2, strokeDasharray: '5 5' } 
              : { stroke: '#D4AF37', strokeWidth: 2 },
          });
        }
      }
    });

    // 4. Update Spouse Labels in Data (for UI)
    memberNodes.forEach(node => {
      const m = (node.data as any).member as Member;
      // We can find if this person is a spouse of someone who is "primary" (first parent found)
      // but the current MemberNode already handles spouseIndex if we pass it.
      // However, with dagre, indices might be different. Let's just pass it if possible.
      const firstPrimarySpouse = filteredMembers.find(fm => fm.spouseIds.includes(m.id));
      if (firstPrimarySpouse) {
        node.data = { ...node.data, spouseIndex: firstPrimarySpouse.spouseIds.indexOf(m.id) };
      }
    });

    // 5. Layout with Dagre
    const allNodes = [...memberNodes, ...unionNodes];
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(allNodes, newEdges);

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [filteredMembers, members, onSelectMember, selectedMemberId, setNodes, setEdges]);

  // Auto-center on selected member
  useEffect(() => {
    if (selectedMemberId && nodes.length > 0) {
      const node = nodes.find(n => n.id === selectedMemberId);
      if (node) {
        setCenter(node.position.x + 110, node.position.y + 90, { duration: 800, zoom: 0.9 });
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
