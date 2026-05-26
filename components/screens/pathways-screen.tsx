"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Play, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserPathways, togglePathway } from "@/lib/api";
import type { Pathway } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PathwaysScreenProps {
  onSelectPathway: (pathwayId: number) => void;
}

export function PathwaysScreen({ onSelectPathway }: PathwaysScreenProps) {
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getUserPathways();
        setPathways(data);
      } catch (error) {
        console.error("[v0] Error loading pathways:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleTogglePathway = async (pathwayId: number) => {
    try {
      const result = await togglePathway(pathwayId);
      setPathways((prev) =>
        prev.map((p) =>
          p.id === pathwayId ? { ...p, active: result.active } : p
        )
      );
    } catch (error) {
      console.error("[v0] Error toggling pathway:", error);
    }
  };

  if (isLoading) {
    return <PathwaysScreenSkeleton />;
  }

  const activePathways = pathways.filter((p) => p.active);
  const availablePathways = pathways.filter((p) => !p.active);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Pathways</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Structured learning programs
        </p>
      </header>

      <main className="px-5 space-y-8">
        {/* Active Pathways */}
        {activePathways.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Your Pathways
            </h2>
            <div className="space-y-3">
              {activePathways.map((pathway) => (
                <ActivePathwayCard
                  key={pathway.id}
                  pathway={pathway}
                  onSelect={() => onSelectPathway(pathway.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Explore Pathways */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Explore Pathways
          </h2>
          <div className="space-y-3">
            {availablePathways.map((pathway) => (
              <ExplorePathwayCard
                key={pathway.id}
                pathway={pathway}
                onStart={() => handleTogglePathway(pathway.id)}
                onSelect={() => onSelectPathway(pathway.id)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function ActivePathwayCard({
  pathway,
  onSelect,
}: {
  pathway: Pathway;
  onSelect: () => void;
}) {
  const progressPercent = Math.round(
    ((pathway.currentSession - 1) / pathway.totalSessions) * 100
  );

  return (
    <button
      onClick={onSelect}
      className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border/50 text-left transition-all hover:shadow-md hover:border-primary/20"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{pathway.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Session {pathway.currentSession} of {pathway.totalSessions}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
      <Progress value={progressPercent} className="h-2" />
    </button>
  );
}

function ExplorePathwayCard({
  pathway,
  onStart,
  onSelect,
}: {
  pathway: Pathway;
  onStart: () => void;
  onSelect: () => void;
}) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1" onClick={onSelect}>
          <h3 className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors">
            {pathway.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">
              {pathway.totalSessions} sessions
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                pathway.difficulty === "Beginner" &&
                  "bg-success/10 text-success",
                pathway.difficulty === "Intermediate" &&
                  "bg-warning/10 text-warning-foreground",
                pathway.difficulty === "Advanced" &&
                  "bg-destructive/10 text-destructive"
              )}
            >
              {pathway.difficulty}
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {pathway.description}
      </p>
      <Button
        onClick={onStart}
        size="sm"
        className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Play className="w-3.5 h-3.5 mr-1.5" />
        Start Pathway
      </Button>
    </div>
  );
}

function PathwaysScreenSkeleton() {
  return (
    <div className="min-h-screen pb-24">
      <header className="px-5 pt-12 pb-6">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </header>
      <main className="px-5 space-y-8">
        <section>
          <Skeleton className="h-4 w-28 mb-4" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </section>
        <section>
          <Skeleton className="h-4 w-36 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-36 w-full rounded-2xl" />
            <Skeleton className="h-36 w-full rounded-2xl" />
          </div>
        </section>
      </main>
    </div>
  );
}
