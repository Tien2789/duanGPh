import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Member, Gender } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const SOUTHERN_ORDINALS: Record<number, string> = {
  1: 'Hai',
  2: 'Ba',
  3: 'Tư',
  4: 'Năm',
  5: 'Sáu',
  6: 'Bảy',
  7: 'Tám',
  8: 'Chín',
  9: 'Mười',
};

export interface KinshipInfo {
  label: string;
  subLabel?: string;
}

export function getSouthernOrdinal(order?: number) {
  if (!order) return '';
  return SOUTHERN_ORDINALS[order] || (order + 1).toString();
}

export function getKinshipLabel(member: Member, members: Member[], currentUserId: string): KinshipInfo | null {
  if (member.id === currentUserId) return { label: 'Tôi' };
  
  const me = members.find(m => m.id === currentUserId);
  if (!me) return null;

  const order = member.birthOrder;
  const ordinal = getSouthernOrdinal(order);

  // Helper to determine side
  const getSide = (m: Member): 'nội' | 'ngoại' | '' => {
    const father = members.find(x => x.id === me.parentId);
    const mother = members.find(x => (father?.spouseIds.includes(x.id) || x.childrenIds.includes(currentUserId)) && x.gender === Gender.FEMALE);
    
    const getAncestors = (id: string) => {
      const path = new Set<string>();
      let curr = members.find(x => x.id === id);
      while(curr) {
        path.add(curr.id);
        if(!curr.parentId) break;
        curr = members.find(x => x.id === curr!.parentId);
      }
      return path;
    };

    const fatherAncestors = father ? getAncestors(father.id) : new Set<string>();
    const motherAncestors = mother ? getAncestors(mother.id) : new Set<string>();

    let curr: Member | undefined = m;
    while (curr) {
      if (fatherAncestors.has(curr.id)) return 'nội';
      if (motherAncestors.has(curr.id)) return 'ngoại';
      if (!curr.parentId) break;
      curr = members.find(x => x.id === curr!.parentId);
    }
    return '';
  };

  const father = members.find(m => m.id === me.parentId);
  const mother = members.find(m => (father?.spouseIds.includes(m.id) || m.childrenIds.includes(currentUserId)) && m.gender === Gender.FEMALE);

  // 1. Spouse
  if (me.spouseIds.includes(member.id)) {
    return { label: member.gender === Gender.FEMALE ? 'Vợ' : 'Chồng' };
  }

  // 2. Parents
  if (me.parentId === member.id) return { label: 'Ba' }; 
  if (mother && member.id === mother.id) return { label: 'Mẹ' };

  // 3. Children
  if (member.parentId === currentUserId) {
    const base = member.gender === Gender.FEMALE ? 'Con Gái' : 'Con Trai';
    return { label: base, subLabel: `${base} thứ ${ordinal}` };
  }

  // 4. Siblings
  if (member.parentId === me.parentId && member.id !== me.id) {
    const isOlder = (member.birthOrder || 0) < (me.birthOrder || 0);
    const base = member.gender === Gender.MALE ? (isOlder ? 'Anh' : 'Em Trai') : (isOlder ? 'Chị' : 'Em Gái');
    return { label: base, subLabel: `${base} thứ ${ordinal}` };
  }

  // Sibling's spouses
  const sibling = members.find(s => s.parentId === me.parentId && s.spouseIds.includes(member.id));
  if (sibling) {
    const isOlder = (sibling.birthOrder || 0) < (me.birthOrder || 0);
    const sOrdinal = getSouthernOrdinal(sibling.birthOrder);
    if (member.gender === Gender.FEMALE) {
      const base = isOlder ? 'Chị Dâu' : 'Em Dâu';
      return { label: base, subLabel: `${base} thứ ${sOrdinal}` };
    } else {
      const base = isOlder ? 'Anh Rể' : 'Em Rể';
      return { label: base, subLabel: `${base} thứ ${sOrdinal}` };
    }
  }

  // 5. Ancestors & Their Siblings (Queue-based search)
  const queue: { m: Member, depth: number }[] = [];
  if (father) queue.push({ m: father, depth: 1 });
  if (mother) queue.push({ m: mother, depth: 1 });

  const visited = new Set<string>();
  
  while (queue.length > 0) {
    const { m: anc, depth } = queue.shift()!;
    if (visited.has(anc.id)) continue;
    visited.add(anc.id);

    const isDirectAncestor = member.id === anc.id;
    const isAncestorSibling = anc.parentId && member.parentId === anc.parentId && member.id !== anc.id;
    const siblingOfAnc = members.find(s => anc.parentId && s.parentId === anc.parentId && s.spouseIds.includes(member.id));
    const isAncestorSiblingSpouse = !!siblingOfAnc;

    if (isDirectAncestor || isAncestorSibling || isAncestorSiblingSpouse) {
      // Determine side based on the starting branch
      const side = getSide(anc);
      const sideText = side === 'nội' ? 'bên nội' : (side === 'ngoại' ? 'bên ngoại' : '');
      const sideSuffix = side === 'nội' ? 'Nội' : (side === 'ngoại' ? 'Ngoại' : '');

      const targetOrder = isDirectAncestor ? (anc.birthOrder || 0) : (isAncestorSibling ? (member.birthOrder || 0) : (siblingOfAnc!.birthOrder || 0));
      const targetOrdinal = getSouthernOrdinal(targetOrder);
      const ordinalSuffix = targetOrdinal ? ` ${targetOrdinal}` : '';

      // Depth 1: Bác/Chú/Cô/Cậu/Dì
      if (depth === 1) {
        if (isDirectAncestor) { /* Handled previously by direct parents case */ }
        else if (isAncestorSibling) {
          if (side === 'nội') {
            const isOlder = (member.birthOrder || 0) < (anc.birthOrder || 0);
            const base = member.gender === Gender.FEMALE ? 'Cô' : (isOlder ? 'Bác' : 'Chú');
            return { label: `${base}${ordinalSuffix}`, subLabel: `${base} thứ ${targetOrdinal || 'đầu'} ${sideText}` };
          } else {
            const base = member.gender === Gender.FEMALE ? 'Dì' : 'Cậu';
            return { label: `${base}${ordinalSuffix}`, subLabel: `${base} thứ ${targetOrdinal || 'đầu'} ${sideText}` };
          }
        } else if (isAncestorSiblingSpouse) {
          if (side === 'nội') {
            if (member.gender === Gender.FEMALE) {
              const isOlder = (siblingOfAnc!.birthOrder || 0) < (anc.birthOrder || 0);
              const base = isOlder ? 'Bác Gái' : 'Thím';
              return { label: `${base}${ordinalSuffix}`, subLabel: `${base} thứ ${targetOrdinal || 'đầu'} ${sideText}` };
            }
            return { label: `Dượng${ordinalSuffix}`, subLabel: `Dượng thứ ${targetOrdinal || 'đầu'} ${sideText}` };
          } else {
            if (member.gender === Gender.FEMALE) return { label: `Mợ${ordinalSuffix}`, subLabel: `Mợ thứ ${targetOrdinal || 'đầu'} ${sideText}` };
            return { label: `Dượng${ordinalSuffix}`, subLabel: `Dượng thứ ${targetOrdinal || 'đầu'} ${sideText}` };
          }
        }
      }

      // Depth 2: Ông/Bà
      if (depth === 2) {
        const base = member.gender === Gender.FEMALE ? 'Bà' : 'Ông';
        if (isDirectAncestor) {
           return { label: `${base} ${sideSuffix}`, subLabel: `${base} ${sideSuffix.toLowerCase()} trực hệ` };
        }
        // Siblings of grandparents
        const label = `${base}${ordinalSuffix}`;
        return { label, subLabel: `${base} thứ ${targetOrdinal || 'đầu'} ${sideText}` };
      }

      // Depth 3+: Cố/Sơ
      if (depth >= 3) {
        const base = member.gender === Gender.FEMALE ? 'Bà' : 'Ông';
        const prefix = depth === 3 ? 'Cố' : 'Sơ';
        if (isDirectAncestor) {
            return { label: `${base} ${prefix} ${sideSuffix}`, subLabel: `${base} ${prefix} ${sideSuffix.toLowerCase()} trực hệ` };
        }
        const label = `${base} ${prefix}${ordinalSuffix}`;
        return { label, subLabel: `${base} ${prefix} thứ ${targetOrdinal || 'đầu'} ${sideText}` };
      }
    }

    if (depth > 5) continue;

    // Add parents of this ancestor to queue
    if (anc.parentId) {
      const p1 = members.find(p => p.id === anc.parentId);
      if (p1) queue.push({ m: p1, depth: depth + 1 });
      
      const p2 = members.find(p => p.childrenIds.includes(anc.id) && p.id !== anc.parentId);
      if (p2) queue.push({ m: p2, depth: depth + 1 });
    }
  }

  // 9. Cousins (Anh chị em họ)
  if (member.parentId) {
    const pParent = members.find(p => p.id === member.parentId);
    const side = pParent ? getSide(pParent) : '';
    
    if (side && member.parentId !== me.parentId) {
      if (member.generation < me.generation) {
        // This is an Aunt/Uncle from a side branch
        const isOlder = (member.birthOrder || 0) < (father?.birthOrder || 0); // Roughly compared to parent
        const sideText = side === 'nội' ? 'bên nội' : 'bên ngoại';
        let base = '';
        if (side === 'nội') {
          base = member.gender === Gender.FEMALE ? 'Cô' : (isOlder ? 'Bác' : 'Chú');
        } else {
          base = member.gender === Gender.FEMALE ? 'Dì' : 'Cậu';
        }
        return { label: `${base}${ordinal}`, subLabel: `${base} (họ, ${sideText})` };
      }
      
      let label = '';
      const isOlder = member.generation < me.generation || (member.generation === me.generation && (member.birthOrder || 0) < (me.birthOrder || 0));
      
      if (member.gender === Gender.MALE) label = isOlder ? 'Anh Họ' : 'Em Họ';
      else label = isOlder ? 'Chị Họ' : 'Em Họ';
      
      const sideText = side === 'nội' ? 'bên nội' : 'bên ngoại';
      return { 
        label, 
        subLabel: `${label.split(' ')[0]} thứ ${ordinal} (họ, ${sideText})` 
      };
    }
  }

  // 10. Spouse of Cousins
  const spouseOf = members.find(s => s.spouseIds.includes(member.id));
  if (spouseOf) {
    const spouseLabel = getKinshipLabel(spouseOf, members, currentUserId);
    if (spouseLabel?.label.includes('Họ')) {
      const isOlder = spouseOf.generation < me.generation || (spouseOf.generation === me.generation && (spouseOf.birthOrder || 0) < (me.birthOrder || 0));
      let label = '';
      if (member.gender === Gender.FEMALE) label = isOlder ? 'Chị Dâu (họ)' : 'Em Dâu (họ)';
      else label = isOlder ? 'Anh Rể (họ)' : 'Em Rể (họ)';
      return { label, subLabel: `${label} (${spouseLabel.label})` };
    }
  }

  // 11. Grandchildren (Cháu Nội/Ngoại)
  if (member.parentId) {
    const parent = members.find(p => p.id === member.parentId);
    if (parent && parent.parentId === currentUserId) {
      const base = parent.gender === Gender.MALE ? 'Cháu Nội' : 'Cháu Ngoại';
      return { label: base, subLabel: `${base} của bạn (thứ ${ordinal})` };
    }
  }

  // 12. Nieces and Nephews (Cháu - con của anh chị em hoặc anh chị em họ)
  if (member.parentId) {
    const parent = members.find(p => p.id === member.parentId);
    if (parent && parent.id !== currentUserId) {
      const parentLabel = getKinshipLabel(parent, members, currentUserId);
      if (parentLabel?.label.includes('Anh') || parentLabel?.label.includes('Chị') || parentLabel?.label.includes('Em')) {
        const isCousinKid = parentLabel.label.includes('Họ');
        const base = member.gender === Gender.MALE ? 'Cháu Trai' : 'Cháu Gái';
        return { 
          label: isCousinKid ? `${base} (họ)` : base, 
          subLabel: `${base} (con của ${parentLabel.label})` 
        };
      }
    }
  }

  return null;
}
