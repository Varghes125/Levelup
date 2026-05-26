/**
 * API Service Layer for Life OS
 * 
 * This file contains mock API functions that simulate backend calls.
 * When integrating with a real backend, replace these functions with actual API calls.
 * 
 * Expected API Endpoints:
 * - GET /api/tasks/today
 * - GET /api/domains
 * - GET /api/pathways
 * - GET /api/pathways/:id
 * - GET /api/user
 * - PATCH /api/tasks/:id/complete
 * - PATCH /api/tasks/:id/swap
 * - PATCH /api/domains/:id/priority
 */

import {
  mockUser,
  mockDomains,
  mockPathways,
  mockTodayTasks,
  availableDomains,
  generalGrowthPathway,
  type User,
  type Domain,
  type Pathway,
  type Task,
  type DomainOption,
} from "./mock-data";

// Simulate network delay for realistic UX
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get today's tasks for the user
 * Replace this mock function with backend API call: GET /api/tasks/today
 */
export async function getTodayTasks(): Promise<Task[]> {
  await delay(300);
  return mockTodayTasks;
}

/**
 * Get user profile data
 * Replace this mock function with backend API call: GET /api/user
 */
export async function getUser(): Promise<User> {
  await delay(200);
  return mockUser;
}

/**
 * Get all user domains (Life Pathway curriculum)
 * Replace this mock function with backend API call: GET /api/domains
 */
export async function getUserDomains(): Promise<Domain[]> {
  await delay(300);
  return mockDomains;
}

/**
 * Get a specific domain by ID
 * Replace this mock function with backend API call: GET /api/domains/:id
 */
export async function getDomainById(id: number): Promise<Domain | undefined> {
  await delay(200);
  return mockDomains.find((d) => d.id === id);
}

/**
 * Get all pathways (both active and available)
 * Replace this mock function with backend API call: GET /api/pathways
 */
export async function getUserPathways(): Promise<Pathway[]> {
  await delay(300);
  return mockPathways;
}

/**
 * Get a specific pathway by ID
 * Replace this mock function with backend API call: GET /api/pathways/:id
 */
export async function getPathwayById(id: number): Promise<Pathway | undefined> {
  await delay(200);
  return mockPathways.find((p) => p.id === id);
}

/**
 * Mark a task as complete
 * Replace this mock function with backend API call: PATCH /api/tasks/:id/complete
 */
export async function completeTask(taskId: number): Promise<{ success: boolean }> {
  await delay(400);
  // In a real implementation, this would update the database
  console.log(`[API] Task ${taskId} marked as complete`);
  return { success: true };
}

/**
 * Request a task swap (get a different task)
 * Replace this mock function with backend API call: PATCH /api/tasks/:id/swap
 */
export async function swapTask(taskId: number): Promise<Task> {
  await delay(500);
  // In a real implementation, this would generate a new task
  console.log(`[API] Swapping task ${taskId}`);
  return {
    id: taskId,
    type: "life",
    domain: "Social Confidence",
    title: "Make eye contact and smile at one person during your day",
    time: "1 min",
    xpReward: 10,
    why: "Brief positive social interactions boost confidence and create micro-connections that reduce social anxiety.",
    how: [
      "Choose a low-stakes moment (coffee shop, grocery store)",
      "When passing someone, make brief eye contact",
      "Offer a genuine, small smile",
      "Continue with your day - no conversation needed",
    ],
  };
}

/**
 * Get an easier version of a task
 * Replace this mock function with backend API call: PATCH /api/tasks/:id/easier
 */
export async function getEasierTask(taskId: number): Promise<Task> {
  await delay(500);
  console.log(`[API] Getting easier version of task ${taskId}`);
  return {
    id: taskId,
    type: "life",
    domain: "Social Confidence",
    title: "Sit near a window at home and watch people pass by for 3 minutes",
    time: "3 min",
    xpReward: 5,
    why: "Sometimes we need to ease into social exposure. Observing from a safe space still builds awareness and comfort.",
    how: [
      "Find a comfortable spot near a window",
      "Set a 3-minute timer",
      "Simply watch people walking by",
      "Notice your thoughts without judgment",
    ],
  };
}

/**
 * Update domain priority
 * Replace this mock function with backend API call: PATCH /api/domains/:id/priority
 */
export async function updateDomainPriority(
  domainId: number,
  priority: "Low" | "Medium" | "High"
): Promise<{ success: boolean }> {
  await delay(300);
  console.log(`[API] Updated domain ${domainId} priority to ${priority}`);
  return { success: true };
}

/**
 * Toggle pathway active status
 * Replace this mock function with backend API call: PATCH /api/pathways/:id/toggle
 */
export async function togglePathway(pathwayId: number): Promise<{ success: boolean; active: boolean }> {
  await delay(300);
  const pathway = mockPathways.find((p) => p.id === pathwayId);
  const newActive = !pathway?.active;
  console.log(`[API] Toggled pathway ${pathwayId} active status to ${newActive}`);
  return { success: true, active: newActive };
}

/**
 * Update user preferences
 * Replace this mock function with backend API call: PATCH /api/user/preferences
 */
export async function updateUserPreferences(
  preferences: Partial<User["preferences"]>
): Promise<{ success: boolean }> {
  await delay(300);
  console.log(`[API] Updated user preferences:`, preferences);
  return { success: true };
}

/**
 * Update user time availability
 * Replace this mock function with backend API call: PATCH /api/user/time
 */
export async function updateUserTimeAvailability(
  minutes: number
): Promise<{ success: boolean }> {
  await delay(300);
  console.log(`[API] Updated user time availability:`, minutes);
  return { success: true };
}

/**
 * Get available domain options for onboarding
 * Replace this mock function with backend API call: GET /api/domains/available
 */
export async function getAvailableDomains(): Promise<DomainOption[]> {
  await delay(200);
  return availableDomains;
}

/**
 * Get the General Growth pathway (always active)
 * Replace this mock function with backend API call: GET /api/pathways/general
 */
export async function getGeneralGrowthPathway(): Promise<Pathway> {
  await delay(200);
  return generalGrowthPathway;
}

/**
 * Complete onboarding and save user preferences
 * Replace this mock function with backend API call: POST /api/user/onboarding
 */
export async function completeOnboarding(data: {
  name: string;
  selectedDomains: string[];
  timeAvailability: number;
}): Promise<{ success: boolean; user: User }> {
  await delay(500);
  console.log(`[API] Completing onboarding:`, data);
  const updatedUser: User = {
    ...mockUser,
    name: data.name,
    selectedDomains: data.selectedDomains,
    timeAvailability: data.timeAvailability,
    onboardingComplete: true,
  };
  return { success: true, user: updatedUser };
}

/**
 * Add a custom domain
 * Replace this mock function with backend API call: POST /api/domains/custom
 */
export async function addCustomDomain(domain: {
  name: string;
  icon: string;
}): Promise<{ success: boolean; domain: DomainOption }> {
  await delay(300);
  console.log(`[API] Adding custom domain:`, domain);
  const newDomain: DomainOption = {
    id: domain.name.toLowerCase().replace(/\s+/g, "-"),
    name: domain.name,
    icon: domain.icon,
    custom: true,
  };
  return { success: true, domain: newDomain };
}

/**
 * Award XP to user after task completion
 * Replace this mock function with backend API call: POST /api/user/xp
 */
export async function awardXP(xpAmount: number): Promise<{ 
  success: boolean; 
  newXP: number; 
  newLevel: number;
  levelUp: boolean;
}> {
  await delay(200);
  const newXP = mockUser.xp + xpAmount;
  const xpPerLevel = 100;
  const newLevel = Math.floor(newXP / xpPerLevel) + 1;
  const levelUp = newLevel > mockUser.level;
  console.log(`[API] Awarded ${xpAmount} XP. New total: ${newXP}, Level: ${newLevel}`);
  return { success: true, newXP, newLevel, levelUp };
}

/**
 * Update user streak
 * Replace this mock function with backend API call: PATCH /api/user/streak
 */
export async function updateStreak(): Promise<{ 
  success: boolean; 
  newStreak: number 
}> {
  await delay(200);
  const newStreak = mockUser.streak + 1;
  console.log(`[API] Updated streak to ${newStreak}`);
  return { success: true, newStreak };
}
