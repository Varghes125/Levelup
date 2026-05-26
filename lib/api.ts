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
  type User,
  type Domain,
  type Pathway,
  type Task,
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
    why: "Brief positive social interactions boost confidence and create micro-connections that reduce social anxiety.",
    how: [
      "Choose a low-stakes moment (coffee shop, grocery store)",
      "When passing someone, make brief eye contact",
      "Offer a genuine, small smile",
      "Continue with your day—no conversation needed",
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
