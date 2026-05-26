"use client";

import { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import { TaskCard } from "@/components/task-card";
import { getTodayTasks, getUser, completeTask, swapTask, getEasierTask } from "@/lib/api";
import type { Task, User } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState<number | null>(null);
  const [swappingTaskId, setSwappingTaskId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [tasksData, userData] = await Promise.all([
          getTodayTasks(),
          getUser(),
        ]);
        setTasks(tasksData);
        setUser(userData);
      } catch (error) {
        console.error("[v0] Error loading home data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleComplete = async (taskId: number) => {
    setCompletingTaskId(taskId);
    try {
      await completeTask(taskId);
      // In a real app, you might refresh or remove the completed task
    } catch (error) {
      console.error("[v0] Error completing task:", error);
    } finally {
      setCompletingTaskId(null);
    }
  };

  const handleSwap = async (taskId: number) => {
    setSwappingTaskId(taskId);
    try {
      const newTask = await swapTask(taskId);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? newTask : t))
      );
    } catch (error) {
      console.error("[v0] Error swapping task:", error);
    } finally {
      setSwappingTaskId(null);
    }
  };

  const handleEasier = async (taskId: number) => {
    setSwappingTaskId(taskId);
    try {
      const easierTask = await getEasierTask(taskId);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? easierTask : t))
      );
    } catch (error) {
      console.error("[v0] Error getting easier task:", error);
    } finally {
      setSwappingTaskId(null);
    }
  };

  if (isLoading) {
    return <HomeScreenSkeleton />;
  }

  const lifeTask = tasks.find((t) => t.type === "life");
  const pathwayTask = tasks.find((t) => t.type === "pathway");

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-5 pt-12 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {getGreeting()}, {user?.name}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Here&apos;s your focus for today
            </p>
          </div>
          {user && user.streak > 0 && (
            <div className="flex items-center gap-1.5 bg-warning/10 text-warning-foreground px-3 py-1.5 rounded-full">
              <Flame className="w-4 h-4 text-warning" />
              <span className="text-sm font-semibold">{user.streak}</span>
            </div>
          )}
        </div>
      </header>

      {/* Today Section */}
      <main className="px-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Today
        </h2>

        <div className="space-y-4">
          {/* Life Task */}
          {lifeTask && (
            <TaskCard
              task={lifeTask}
              onComplete={handleComplete}
              onSwap={handleSwap}
              onEasier={handleEasier}
              isCompleting={completingTaskId === lifeTask.id}
              isSwapping={swappingTaskId === lifeTask.id}
            />
          )}

          {/* Pathway Task */}
          {pathwayTask && (
            <TaskCard
              task={pathwayTask}
              onComplete={handleComplete}
              onSwap={handleSwap}
              onEasier={handleEasier}
              isCompleting={completingTaskId === pathwayTask.id}
              isSwapping={swappingTaskId === pathwayTask.id}
            />
          )}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No tasks for today. Enjoy your rest!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function HomeScreenSkeleton() {
  return (
    <div className="min-h-screen pb-24">
      <header className="px-5 pt-12 pb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-36" />
      </header>
      <main className="px-5">
        <Skeleton className="h-4 w-16 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
