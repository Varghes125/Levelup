"use client";

import { useState, useEffect } from "react";
import { Clock, Bell, Moon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUser, getUserDomains, updateUserPreferences } from "@/lib/api";
import type { User, Domain } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

export function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, domainsData] = await Promise.all([
          getUser(),
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
  }, []);

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

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your settings and preferences
        </p>
      </header>

      <main className="px-5 space-y-6">
        {/* User Info Card */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50">
          <div className="flex items-center gap-4 mb-4">
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
                Life OS Member
              </p>
            </div>
          </div>
        </div>

        {/* Time Availability */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50">
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
                  {user.timeAvailability}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Preferences */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Preferences
          </h2>
          <div className="bg-card rounded-2xl shadow-sm border border-border/50 divide-y divide-border/50">
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
          </div>
        </section>

        {/* Active Domains */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Active Domains
          </h2>
          <div className="bg-card rounded-2xl shadow-sm border border-border/50 divide-y divide-border/50">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <h3 className="font-medium text-foreground">{domain.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {domain.stage} • {domain.progress}% complete
                  </p>
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
            ))}
          </div>
        </section>

        {/* Version Info */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">Life OS v1.0.0</p>
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
        <Skeleton className="h-24 w-full rounded-2xl" />
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
