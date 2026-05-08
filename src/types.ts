
export enum Rank {
  E = "E",
  E_PLUS = "E+",
  D = "D",
  D_PLUS = "D+",
  C = "C",
  C_PLUS = "C+",
  B = "B",
  B_PLUS = "B+",
  A = "A",
  A_PLUS = "A+",
  S = "S",
  S_PLUS = "S+",
  SS = "SS",
  SS_PLUS = "SS+",
  SSS = "SSS"
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  expReward: number;
  type: "daily" | "main";
  completed: boolean;
  dueDate: string; // Deprecate or keep as optional/fallback? Let's keep it but it might be null/empty
  category: string;
  duration?: number; // duration in minutes
  status?: "pending" | "active" | "completed" | "failed";
  startedAt?: string; // ISO string
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  exp: number;
  maxExp: number;
  icon: string;
}

export interface UserStats {
  rank: Rank;
  level: number;
  exp: number;
  maxExp: number;
  gold: number; // Added currency
  streak: number;
  lastActive: string;
  totalFocusTime: number; // in minutes
  completedQuests: number;
  displayName?: string;
  photoURL?: string;
  gender?: "male" | "female";
  age?: number;
  penaltyActive?: boolean;
  penaltyReason?: string;
  penaltyDeadline?: string;
  penaltyAssignedAt?: string;
  activeTitle?: string;
  titles?: string[];
  pardonTickets?: number;
  pardonGifted?: boolean;
  height?: number;
  weight?: number;
  bloodType?: string;
  ultimateGoal?: string;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  type: "buff" | "consumable" | "key";
}
