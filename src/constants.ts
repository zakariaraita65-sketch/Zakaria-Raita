import { Rank } from "./types";

export const RANK_ORDER = [
  Rank.E,
  Rank.E_PLUS,
  Rank.D,
  Rank.D_PLUS,
  Rank.C,
  Rank.C_PLUS,
  Rank.B,
  Rank.B_PLUS,
  Rank.A,
  Rank.A_PLUS,
  Rank.S,
  Rank.S_PLUS,
  Rank.SS,
  Rank.SS_PLUS,
  Rank.SSS
];

export const RANK_TITLES: Record<string, string> = {
  [Rank.E]: "NOVICE HUNTER",
  [Rank.E_PLUS]: "NOVICE HUNTER+",
  [Rank.D]: "HUNTER",
  [Rank.D_PLUS]: "HUNTER+",
  [Rank.C]: "VETERAN HUNTER",
  [Rank.C_PLUS]: "VETERAN HUNTER+",
  [Rank.B]: "ELITE HUNTER",
  [Rank.B_PLUS]: "ELITE HUNTER+",
  [Rank.A]: "MASTER HUNTER",
  [Rank.A_PLUS]: "MASTER HUNTER+",
  [Rank.S]: "MONARCH",
  [Rank.S_PLUS]: "MONARCH+",
  [Rank.SS]: "NATIONAL LEVEL",
  [Rank.SS_PLUS]: "NATIONAL LEVEL+",
  [Rank.SSS]: "SHADOW MONARCH"
};

export const EXP_PER_LEVEL = 1000;

export const ACADEMIC_PENALTIES = [
  "Solve {n} complex mathematical or logical problems.",
  "Summarize a difficult concept in your field of study for {n} minutes.",
  "Read {n} pages of an academic or technical book.",
  "Explain your current study topic to an imaginary audience for {n} minutes.",
  "Write a {n}-word essay on the importance of discipline.",
  "Complete the failed mission + {n} extra focused sessions.",
  "Review and correct {n} previous mistakes in your work.",
  "Transcribe {n} key definitions or formulas by hand.",
  "Research and summarize {n} new concepts related to your studies.",
  "Practice a skill or language for {n} minutes in one sitting."
];

export const GET_RANDOM_PENALTY = () => {
    const template = ACADEMIC_PENALTIES[Math.floor(Math.random() * ACADEMIC_PENALTIES.length)];
    const n = Math.floor(Math.random() * 20) + 5;
    return template.replace("{n}", n.toString());
};

export const INITIAL_STATS = {
  rank: Rank.E,
  level: 1,
  exp: 0,
  maxExp: 1000,
  gold: 500, // Starting gold
  streak: 0,
  lastActive: new Date().toISOString(),
  totalFocusTime: 0,
  completedQuests: 0,
  activeTitle: "The Awakening",
  titles: ["The Awakening"],
  pardonTickets: 1
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  "Legendary": "text-purple-400 border-purple-900/50 bg-purple-950/20",
  "Hard": "text-red-400 border-red-900/50 bg-red-950/20",
  "Medium": "text-orange-400 border-orange-900/50 bg-orange-950/20",
  "Easy": "text-blue-400 border-blue-900/50 bg-blue-950/20"
};

export const AVAILABLE_TITLES = [
  { id: "awakening", name: "The Awakening", condition: "Initial Title", difficulty: "Easy" },
  { id: "night_stalker", name: "Night Stalker", condition: "Complete 5 Daily Quests", difficulty: "Medium" },
  { id: "void_hunter", name: "Void Hunter", condition: "Complete a quest in every category", difficulty: "Medium" },
  { id: "vampire_lord", name: "Vampire Overlord", condition: "Complete 10 Hard Quests", difficulty: "Hard" },
  { id: "monarch_death", name: "Monarch of Death", condition: "Maintain a 15-day streak", difficulty: "Hard" },
  { id: "abyss_walker", name: "Abyss Walker", condition: "Complete 100 Quests", difficulty: "Hard" },
  { id: "blood_sovereign", name: "Blood Sovereign", condition: "Earn 10,000 Total XP", difficulty: "Hard" },
  { id: "shadow_king", name: "Shadow King", condition: "Reach Level 15", difficulty: "Legendary" }
];

export const STORE_ITEMS = [
  { 
    id: "recovery_potion", 
    name: "Full Recovery Potion", 
    description: "Restores a lost streak and heals penalty damage to your status.",
    cost: 1200,
    icon: "FlaskConical",
    type: "consumable"
  },
  { 
    id: "exp_scroll", 
    name: "EXP Growth Scroll", 
    description: "Multiplies EXP gained from the next 3 missions by 1.5x.",
    cost: 800,
    icon: "Scroll",
    type: "buff"
  },
  { 
    id: "mana_elixir", 
    name: "Focus Mana Elixir", 
    description: "Unlocks advanced focus chamber resonance (+20% Focus Time Efficiency).",
    cost: 2500,
    icon: "Zap",
    type: "buff"
  },
  { 
    id: "system_key", 
    name: "Dungeon Key", 
    description: "Access to 'Hard Mode' main quests with immense rewards.",
    cost: 5000,
    icon: "Key",
    type: "key"
  },
  { 
    id: "royal_pardon", 
    name: "Royal Pardon", 
    description: "A decree from the Monarch that instantly clears any active penalty. Single use.",
    cost: 1500,
    icon: "ShieldAlert",
    type: "consumable"
  }
];

export const SCIENTIFIC_QUOTES = [
  { text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", author: "Albert Einstein" },
  { text: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.", author: "Marie Curie" },
  { text: "Science is a way of thinking much more than it is a body of knowledge.", author: "Carl Sagan" },
  { text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan" },
  { text: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" }
];

export const SUBJECTS = [
  { id: "hg", name: "HG (History/Geog)", icon: "Globe" },
  { id: "french", name: "French", icon: "Languages" },
  { id: "arabic", name: "Arabic", icon: "Languages" },
  { id: "islamic", name: "Islamic Studies", icon: "BookOpen" }
];
