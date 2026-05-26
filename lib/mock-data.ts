/**
 * Mock Data for Life OS
 * This file contains all mock data structured like API responses.
 * Replace these with actual API calls when backend is ready.
 */

// Types
export interface User {
  id: string;
  name: string;
  timeAvailability: string;
  streak: number;
  preferences: {
    notificationsEnabled: boolean;
    darkMode: boolean;
  };
}

export interface Domain {
  id: number;
  name: string;
  stage: "Foundation" | "Skill" | "Mastery";
  progress: number;
  priority: "Low" | "Medium" | "High";
  lastDone: string;
  streak: number;
  description: string;
  subskills: Subskill[];
  currentFocus: string;
  recentTasks: RecentTask[];
}

export interface Subskill {
  id: number;
  name: string;
  progress: number;
}

export interface RecentTask {
  id: number;
  title: string;
  completedAt: string;
}

export interface Pathway {
  id: number;
  title: string;
  totalSessions: number;
  currentSession: number;
  description: string;
  active: boolean;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  sessions: PathwaySession[];
}

export interface PathwaySession {
  id: number;
  title: string;
  completed: boolean;
}

export interface Task {
  id: number;
  type: "life" | "pathway";
  domain?: string;
  pathwayId?: number;
  pathwayTitle?: string;
  title: string;
  time: string;
  why: string;
  how: string[];
  sessionProgress?: string;
}

// Mock User Data
export const mockUser: User = {
  id: "user_1",
  name: "Haifa",
  timeAvailability: "5-10 mins/day",
  streak: 7,
  preferences: {
    notificationsEnabled: true,
    darkMode: false,
  },
};

// Mock Domains Data
export const mockDomains: Domain[] = [
  {
    id: 1,
    name: "Fitness",
    stage: "Foundation",
    progress: 30,
    priority: "High",
    lastDone: "2026-05-24",
    streak: 2,
    description: "Build physical strength and healthy movement habits",
    currentFocus: "Basic mobility and body awareness",
    subskills: [
      { id: 1, name: "Flexibility", progress: 40 },
      { id: 2, name: "Strength", progress: 20 },
      { id: 3, name: "Cardio", progress: 30 },
    ],
    recentTasks: [
      { id: 1, title: "5-minute morning stretch routine", completedAt: "2026-05-24" },
      { id: 2, title: "Walk for 10 minutes after lunch", completedAt: "2026-05-23" },
    ],
  },
  {
    id: 2,
    name: "Social Confidence",
    stage: "Foundation",
    progress: 10,
    priority: "Medium",
    lastDone: "2026-05-22",
    streak: 0,
    description: "Develop comfort in social situations and meaningful connections",
    currentFocus: "Low-pressure social exposure",
    subskills: [
      { id: 1, name: "Small Talk", progress: 15 },
      { id: 2, name: "Eye Contact", progress: 10 },
      { id: 3, name: "Active Listening", progress: 5 },
    ],
    recentTasks: [
      { id: 1, title: "Smile at 3 strangers today", completedAt: "2026-05-22" },
    ],
  },
  {
    id: 3,
    name: "Knowledge",
    stage: "Skill",
    progress: 55,
    priority: "Medium",
    lastDone: "2026-05-25",
    streak: 5,
    description: "Expand intellectual horizons and learning capacity",
    currentFocus: "Daily reading habit",
    subskills: [
      { id: 1, name: "Reading", progress: 60 },
      { id: 2, name: "Note-taking", progress: 50 },
      { id: 3, name: "Critical Thinking", progress: 45 },
    ],
    recentTasks: [
      { id: 1, title: "Read one article and summarize the key point", completedAt: "2026-05-25" },
      { id: 2, title: "Listen to a 5-minute educational podcast", completedAt: "2026-05-24" },
    ],
  },
  {
    id: 4,
    name: "Creativity",
    stage: "Foundation",
    progress: 15,
    priority: "Low",
    lastDone: "2026-05-20",
    streak: 0,
    description: "Unlock creative expression and innovative thinking",
    currentFocus: "Overcoming creative blocks",
    subskills: [
      { id: 1, name: "Brainstorming", progress: 20 },
      { id: 2, name: "Visual Thinking", progress: 10 },
      { id: 3, name: "Creative Writing", progress: 15 },
    ],
    recentTasks: [
      { id: 1, title: "Doodle freely for 5 minutes", completedAt: "2026-05-20" },
    ],
  },
];

// Mock Pathways Data
export const mockPathways: Pathway[] = [
  {
    id: 1,
    title: "Cooking Basics",
    totalSessions: 21,
    currentSession: 5,
    description: "Learn essential cooking skills from scratch. From knife skills to flavor building, master the fundamentals that will serve you for life.",
    active: true,
    difficulty: "Beginner",
    sessions: [
      { id: 1, title: "Kitchen Setup & Safety", completed: true },
      { id: 2, title: "Basic Knife Skills", completed: true },
      { id: 3, title: "Understanding Heat", completed: true },
      { id: 4, title: "Seasoning Fundamentals", completed: true },
      { id: 5, title: "Your First Simple Dish", completed: false },
      { id: 6, title: "Reading Recipes", completed: false },
      { id: 7, title: "Breakfast Essentials", completed: false },
      { id: 8, title: "Quick Lunch Ideas", completed: false },
      { id: 9, title: "One-Pan Dinners", completed: false },
      { id: 10, title: "Batch Cooking Intro", completed: false },
    ],
  },
  {
    id: 2,
    title: "Mindfulness Foundations",
    totalSessions: 14,
    currentSession: 1,
    description: "Build a sustainable mindfulness practice with gentle, progressive exercises that fit into your daily routine.",
    active: false,
    difficulty: "Beginner",
    sessions: [
      { id: 1, title: "What is Mindfulness?", completed: false },
      { id: 2, title: "Your First 2-Minute Practice", completed: false },
      { id: 3, title: "Breathing Awareness", completed: false },
      { id: 4, title: "Body Scan Basics", completed: false },
      { id: 5, title: "Mindful Eating", completed: false },
    ],
  },
  {
    id: 3,
    title: "Public Speaking",
    totalSessions: 28,
    currentSession: 1,
    description: "Overcome speaking anxiety and develop confident communication skills through structured, low-pressure exercises.",
    active: false,
    difficulty: "Intermediate",
    sessions: [
      { id: 1, title: "Understanding Speaking Anxiety", completed: false },
      { id: 2, title: "Voice Warm-ups", completed: false },
      { id: 3, title: "Posture & Presence", completed: false },
      { id: 4, title: "The Power of Pause", completed: false },
      { id: 5, title: "Storytelling Basics", completed: false },
    ],
  },
  {
    id: 4,
    title: "Financial Literacy",
    totalSessions: 18,
    currentSession: 1,
    description: "Master the basics of personal finance, from budgeting to understanding investments, one concept at a time.",
    active: false,
    difficulty: "Beginner",
    sessions: [
      { id: 1, title: "Your Money Mindset", completed: false },
      { id: 2, title: "Tracking Spending", completed: false },
      { id: 3, title: "Simple Budgeting", completed: false },
      { id: 4, title: "Emergency Fund Basics", completed: false },
      { id: 5, title: "Understanding Interest", completed: false },
    ],
  },
];

// Mock Today's Tasks
export const mockTodayTasks: Task[] = [
  {
    id: 1,
    type: "life",
    domain: "Social Confidence",
    title: "Spend 5 minutes sitting alone in a café observing people",
    time: "5 min",
    why: "Low-pressure exposure reduces social anxiety over time. By simply being present in a social environment without the pressure to interact, you build comfort and familiarity with public spaces.",
    how: [
      "Find a quiet café or public place",
      "Order something simple if you'd like",
      "Sit alone without using your phone",
      "Observe your surroundings calmly",
      "Notice how you feel without judgment",
    ],
  },
  {
    id: 2,
    type: "pathway",
    pathwayId: 1,
    pathwayTitle: "Cooking Basics",
    title: "Cook a simple dish: scrambled eggs with one seasoning",
    time: "10 min",
    why: "Mastering simple dishes builds confidence and muscle memory. Scrambled eggs teach you heat control and timing—fundamental skills for any cooking.",
    how: [
      "Gather: 2 eggs, butter, salt, and one herb (try chives or parsley)",
      "Crack eggs into a bowl and whisk gently",
      "Heat pan on medium-low with a small knob of butter",
      "Pour in eggs and stir slowly with a spatula",
      "Remove from heat when still slightly wet",
      "Season with salt and your chosen herb",
    ],
    sessionProgress: "5/21",
  },
];
