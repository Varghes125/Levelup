"use client";

import { useState, useEffect } from "react";
import { Flame, Star } from "lucide-react";
import { motion } from "framer-motion";
import { TaskCard } from "@/components/task-card";
import { RewardModal } from "@/components/reward-modal";
import { getTodayTasks, getUser, completeTask, swapTask, getEasierTask, awardXP, updateStreak } from "@/lib/api";
import type { Task, User } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

interface HomeScreenProps {
  user?: User | null;
  onUserUpdate?: (user: User) => void;
}

export function HomeScreen({ user: propUser, onUserUpdate }: HomeScreenProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(propUser || null);
  const [isLoading, setIsLoading] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState<number | null>(null);
  const [swappingTaskId, setSwappingTaskId] = useState<number | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  
  // Reward modal state
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState({
    xpEarned: 0,
    newStreak: 0,
    levelUp: false,
    newLevel: 1,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [tasksData, userData] = await Promise.all([
          getTodayTasks(),
          propUser ? Promise.resolve(propUser) : getUser(),
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
  }, [propUser]);

  const handleComplete = async (taskId: number, xpReward: number) => {
    setCompletingTaskId(taskId);
    try {
      await completeTask(taskId);
      
      // Award XP
      const xpResult = await awardXP(xpReward);
      
      // Update streak
      const streakResult = await updateStreak();
      
      // Update local user state
      const updatedUser: User = {
        ...user!,
        xp: xpResult.newXP,
        level: xpResult.newLevel,
        streak: streakResult.newStreak,
      };
      setUser(updatedUser);
      onUserUpdate?.(updatedUser);
      
      // Show reward modal
      setRewardData({
        xpEarned: xpReward,
        newStreak: streakResult.newStreak,
        levelUp: xpResult.levelUp,
        newLevel: xpResult.newLevel,
      });
      setShowReward(true);
      
      setCompletedCount((prev) => prev + 1);
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
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  
  // XP progress to next level
  const xpPerLevel = 100;
  const xpInCurrentLevel = user ? user.xp % xpPerLevel : 0;
  const xpProgress = (xpInCurrentLevel / xpPerLevel) * 100;

  return (
    <div className="min-h-screen pb-24">
      {/* Enhanced Header */}
      <header className="px-5 pt-10 pb-6">
        {/* Top Row - XP and Streak */}
        <div className="flex items-center justify-between mb-4">
          {/* XP Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {user?.xp || 0} XP
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Lvl {user?.level || 1}
            </span>
          </motion.div>

          {/* Streak Display */}
          {user && user.streak > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 bg-warning/10 text-warning-foreground px-3 py-1.5 rounded-full"
            >
              <Flame className="w-4 h-4 text-warning" />
              <span className="text-sm font-semibold">{user.streak}</span>
            </motion.div>
          )}
        </div>

        {/* Level Progress Bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Level {user?.level || 1}</span>
            <span>{xpInCurrentLevel}/{xpPerLevel} XP</span>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>

        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}, {user?.name}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Here&apos;s your focus for today
          </p>
        </div>
      </header>

      {/* Daily Progress */}
      {totalTasks > 0 && (
        <div className="px-5 mb-4">
          <div className="bg-card rounded-xl p-4 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Daily Progress
              </span>
              <span className="text-sm text-muted-foreground">
                {completedCount}/{totalTasks} tasks
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>
      )}

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

      {/* Reward Modal */}
      <RewardModal
        isOpen={showReward}
        onClose={() => setShowReward(false)}
        xpEarned={rewardData.xpEarned}
        newStreak={rewardData.newStreak}
        levelUp={rewardData.levelUp}
        newLevel={rewardData.newLevel}
      />
    </div>
  );
}

function HomeScreenSkeleton() {
  return (
    <div className="min-h-screen pb-24">
      <header className="px-5 pt-10 pb-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
        <Skeleton className="h-2 w-full rounded mb-5" />
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
