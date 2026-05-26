"use client";

import { Home, BookOpen, Layers, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabType = "home" | "pathways" | "curriculum" | "profile";

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "pathways", label: "Pathways", icon: BookOpen },
  { id: "curriculum", label: "Curriculum", icon: Layers },
  { id: "profile", label: "Profile", icon: User },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 safe-area-inset-bottom z-50">
      <div className="max-w-md mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-full transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 mb-1 transition-transform duration-200",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    isActive && "font-semibold"
                  )}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
