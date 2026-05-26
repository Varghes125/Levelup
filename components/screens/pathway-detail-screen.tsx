"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPathwayById } from "@/lib/api";
import type { Pathway } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PathwayDetailScreenProps {
  pathwayId: number;
  onBack: () => void;
}

export function PathwayDetailScreen({
  pathwayId,
  onBack,
}: PathwayDetailScreenProps) {
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPathwayById(pathwayId);
        setPathway(data || null);
      } catch (error) {
        console.error("[v0] Error loading pathway:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [pathwayId]);

  if (isLoading) {
    return <PathwayDetailSkeleton onBack={onBack} />;
  }

  if (!pathway) {
    return (
      <div className="min-h-screen pb-24 px-5 pt-12">
        <button onClick={onBack} className="flex items-center text-muted-foreground mb-4">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <p className="text-center text-muted-foreground">Pathway not found</p>
      </div>
    );
  }

  const progressPercent = Math.round(
    ((pathway.currentSession - 1) / pathway.totalSessions) * 100
  );

  return (
    <div className="min-h-screen pb-24">
      {/* Header with back button */}
      <header className="px-5 pt-12 pb-6">
        <button
          onClick={onBack}
          className="flex items-center text-muted-foreground mb-4 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-foreground">{pathway.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full",
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
          <span className="text-sm text-muted-foreground">
            {pathway.totalSessions} sessions
          </span>
        </div>
      </header>

      <main className="px-5 space-y-6">
        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">
          {pathway.description}
        </p>

        {/* Progress Card */}
        {pathway.active && (
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">
                Your Progress
              </span>
              <span className="text-sm font-semibold text-foreground">
                {pathway.currentSession - 1} / {pathway.totalSessions} completed
              </span>
            </div>
            <Progress value={progressPercent} className="h-2 mb-4" />
            <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-medium">
              Continue to Session {pathway.currentSession}
            </Button>
          </div>
        )}

        {/* Sessions List */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Curriculum
          </h2>
          <div className="space-y-2">
            {pathway.sessions.map((session, index) => {
              const isCurrent = index + 1 === pathway.currentSession;
              const isLocked = index + 1 > pathway.currentSession;

              return (
                <div
                  key={session.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all",
                    session.completed
                      ? "bg-success/5 border-success/20"
                      : isCurrent
                      ? "bg-primary/5 border-primary/30"
                      : isLocked
                      ? "bg-muted/30 border-border/30"
                      : "bg-card border-border/50"
                  )}
                >
                  {/* Status Icon */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      session.completed
                        ? "bg-success text-success-foreground"
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {session.completed ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Session Info */}
                  <div className="flex-1">
                    <h3
                      className={cn(
                        "font-medium",
                        isLocked ? "text-muted-foreground" : "text-foreground"
                      )}
                    >
                      {session.title}
                    </h3>
                    {isCurrent && (
                      <p className="text-xs text-primary font-medium mt-0.5">
                        Current session
                      </p>
                    )}
                  </div>

                  {/* Time indicator for current */}
                  {isCurrent && (
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function PathwayDetailSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen pb-24">
      <header className="px-5 pt-12 pb-6">
        <button onClick={onBack} className="flex items-center text-muted-foreground mb-4">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </header>
      <main className="px-5 space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </main>
    </div>
  );
}
