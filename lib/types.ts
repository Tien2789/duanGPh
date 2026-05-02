export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export interface Member {
  id: string;
  fullName: string;
  hieuName?: string; // Tên húy
  tuName?: string;   // Tên tự
  thuyHieu?: string; // Thụy hiệu
  birthDate?: string;
  deathDate?: string;
  isLunar: boolean;
  gender: Gender;
  isAdopted: boolean;
  generation: number;
  birthOrder?: number; // Thứ tự sinh (1, 2, 3...)
  bio?: string;
  avatarUrl?: string; // URL ảnh đại diện
  childrenIds: string[];
  spouseIds: string[];
  parentId?: string;
  isChief: boolean; // Trưởng chi
}

export interface Clan {
  id: string;
  clanName: string;
  subdomain: string;
  themeConfig: {
    primaryColor: string;
    secondaryColor: string;
    backgroundPattern: string;
  };
}

export interface MemoryMedia {
  id: string;
  memberId: string;
  type: 'image' | 'video' | 'document';
  url: string;
  title: string;
  description?: string;
  createdAt: string;
}
