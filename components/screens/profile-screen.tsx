"use client";

import { useState, useEffect } from "react";
import { Clock, Bell, Moon, ChevronRight, Star, Flame, Dumbbell, Users, Brain, Briefcase, Heart, Palette, Wallet, Leaf, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getUser, getUserDomains, updateUserPreferences } from "@/lib/api";
import type { User, Domain } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const domainIcons: Record<string, React.ReactNode> = {
  "Fitness": <Dumbbell className="w-4 h-4" />,
  "Social Confidence": <Users className="w-4 h-4" />,
  "Knowledge": <Brain className="w-4 h-4" />,
  "Career": <Briefcase className="w-4 h-4" />,
  "Emotional": <Heart className="w-4 h-4" />,
  "Creativity": <Palette className="w-4 h-4" />,
  "Finance": <Wallet className="w-4 h-4" />,
  "Lifestyle": <Leaf className="w-4 h-4" />,
};

interface ProfileScreenProps {
  user?: User | null;
}

export function ProfileScreen({ user: propUser }: ProfileScreenProps) {
  const [user, setUser] = useState<User | null>(propUser || null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, domainsData] = await Promise.all([
          propUser ? Promise.resolve(propUser) : getUser(),
          getUserDomains(),
        ]);
        setUser(userData);
        setDomains(domainsData);
      } catch (error) {
        console.error("[v0] Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [propUser]);

  const handleToggleNotifications = async () => {
    if (!user) return;
    try {
      await updateUserPreferences({
        notificationsEnabled: !user.preferences.notificationsEnabled,
      });
      setUser((prev) =>
        prev
          ? {
              ...prev,
              preferences: {
                ...prev.preferences,
                notificationsEnabled: !prev.preferences.notificationsEnabled,
              },
            }
          : null
      );
    } catch (error) {
      console.error("[v0] Error updating notifications:", error);
    }
  };

  const handleToggleDarkMode = async () => {
    if (!user) return;
    try {
      await updateUserPreferences({
        darkMode: !user.preferences.darkMode,
      });
      setUser((prev) =>
        prev
          ? {
              ...prev,
              preferences: {
                ...prev.preferences,
                darkMode: !prev.preferences.darkMode,
              },
            }
          : null
      );
      // Toggle dark mode on document
      document.documentElement.classList.toggle("dark");
    } catch (error) {
      console.error("[v0] Error updating dark mode:", error);
    }
  };

  if (isLoading) {
    return <ProfileScreenSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-screen pb-24 px-5 pt-12">
        <p className="text-center text-muted-foreground">
          Unable to load profile
        </p>
      </div>
    );
  }

  const timeLabels: Record<string, string> = {
    "5min": "5 minutes/day",
    "10min": "10 minutes/day",
    "15min": "15 minutes/day",
  };

  // XP progress to next level
  const xpPerLevel = 100;
  const xpInCurrentLevel = user.xp % xpPerLevel;
  const xpProgress = (xpInCurrentLevel / xpPerLevel) * 100;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your settings and progress
        </p>
      </header>

      <main className="px-5 space-y-6">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-sm border border-border/50"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {user.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Level {user.level} Explorer
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex gap-4 mb-4">
            {/* XP */}
            <div className="flex-1 bg-primary/5 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                <Star className="w-4 h-4" />
                <span className="text-lg font-bold">{user.xp}</span>
              </div>
              <span className="text-xs text-muted-foreground">Total XP</span>
            </div>

            {/* Streak */}
            <div className="flex-1 bg-warning/5 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-warning mb-1">
                <Flame className="w-4 h-4" />
                <span className="text-lg font-bold">{user.streak}</span>
              </div>
              <span className="text-xs text-muted-foreground">Day Streak</span>
            </div>
          </div>

          {/* Level Progress */}
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Level {user.level}</span>
              <span>{xpInCurrentLevel}/{xpPerLevel} XP to Level {user.level + 1}</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
        </motion.div>

        {/* Time Availability */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-5 shadow-sm border border-border/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Time Availability
                </h3>
                <p className="text-sm text-muted-foreground">
                  {timeLabels[user.timeAvailability] || user.timeAvailability}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </motion.div>

        {/* Preferences */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Preferences
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl shadow-sm border border-border/50 divide-y divide-border/50"
          >
            {/* Notifications */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    Daily task reminders
                  </p>
                </div>
              </div>
              <Switch
                checked={user.preferences.notificationsEnabled}
                onCheckedChange={handleToggleNotifications}
              />
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Moon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Dark Mode</h3>
                  <p className="text-xs text-muted-foreground">
                    Easier on the eyes
                  </p>
                </div>
              </div>
              <Switch
                checked={user.preferences.darkMode}
                onCheckedChange={handleToggleDarkMode}
              />
            </div>
          </motion.div>
        </section>

        {/* Active Domains */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Active Domains
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl shadow-sm border border-border/50 divide-y divide-border/50"
          >
            {domains.map((domain) => {
              const icon = domainIcons[domain.name] || <Sparkles className="w-4 h-4" />;
              return (
                <div
                  key={domain.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      domain.priority === "High" && "bg-destructive/10 text-destructive",
                      domain.priority === "Medium" && "bg-warning/10 text-warning",
                      domain.priority === "Low" && "bg-primary/10 text-primary",
                    )}>
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{domain.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {domain.stage} - {domain.progress}%
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium px-2.5 py-1 rounded-full",
                      domain.priority === "High" &&
                        "bg-destructive/10 text-destructive",
                      domain.priority === "Medium" &&
                        "bg-warning/10 text-warning-foreground",
                      domain.priority === "Low" &&
                        "bg-muted text-muted-foreground"
                    )}
                  >
                    {domain.priority}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </section>

        {/* Version Info */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">Life OS v1.1.0</p>
        </div>
      </main>
    </div>
  );
}

function ProfileScreenSkeleton() {
  return (
    <div className="min-h-screen pb-24">
      <header className="px-5 pt-12 pb-6">
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-4 w-40" />
      </header>
      <main className="px-5 space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
