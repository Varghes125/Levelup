"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserDomains, updateDomainPriority, getDomainById } from "@/lib/api";
import type { Domain } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export function CurriculumScreen() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getUserDomains();
        setDomains(data);
      } catch (error) {
        console.error("[v0] Error loading domains:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePriorityChange = async (
    domainId: number,
    priority: "Low" | "Medium" | "High"
  ) => {
    try {
      await updateDomainPriority(domainId, priority);
      setDomains((prev) =>
        prev.map((d) => (d.id === domainId ? { ...d, priority } : d))
      );
      if (selectedDomain?.id === domainId) {
        setSelectedDomain((prev) => (prev ? { ...prev, priority } : null));
      }
    } catch (error) {
      console.error("[v0] Error updating priority:", error);
    }
  };

  const handleSelectDomain = async (domainId: number) => {
    try {
      const domain = await getDomainById(domainId);
      setSelectedDomain(domain || null);
    } catch (error) {
      console.error("[v0] Error loading domain:", error);
    }
  };

  if (isLoading) {
    return <CurriculumScreenSkeleton />;
  }

  // Domain Detail View
  if (selectedDomain) {
    return (
      <DomainDetailView
        domain={selectedDomain}
        onBack={() => setSelectedDomain(null)}
        onPriorityChange={handlePriorityChange}
      />
    );
  }

  // Domain List View
  return (
    <div className="min-h-screen pb-24">
      <header className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Curriculum</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your Life Pathway domains
        </p>
      </header>

      <main className="px-5">
        <div className="space-y-3">
          {domains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              onSelect={() => handleSelectDomain(domain.id)}
              onPriorityChange={handlePriorityChange}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function DomainCard({
  domain,
  onSelect,
  onPriorityChange,
}: {
  domain: Domain;
  onSelect: () => void;
  onPriorityChange: (id: number, priority: "Low" | "Medium" | "High") => void;
}) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50">
      <div className="flex items-start justify-between mb-3">
        <button onClick={onSelect} className="text-left flex-1">
          <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
            {domain.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Stage: {domain.stage}
          </p>
        </button>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>Progress</span>
          <span>{domain.progress}%</span>
        </div>
        <Progress value={domain.progress} className="h-2" />
      </div>

      {/* Priority Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground mr-2">Priority:</span>
        {(["Low", "Medium", "High"] as const).map((priority) => (
          <button
            key={priority}
            onClick={() => onPriorityChange(domain.id, priority)}
            className={cn(
              "text-xs font-medium px-3 py-1.5 rounded-full transition-all",
              domain.priority === priority
                ? priority === "High"
                  ? "bg-destructive/10 text-destructive"
                  : priority === "Medium"
                  ? "bg-warning/10 text-warning-foreground"
                  : "bg-muted text-muted-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            {priority}
          </button>
        ))}
      </div>
    </div>
  );
}

function DomainDetailView({
  domain,
  onBack,
  onPriorityChange,
}: {
  domain: Domain;
  onBack: () => void;
  onPriorityChange: (id: number, priority: "Low" | "Medium" | "High") => void;
}) {
  return (
    <div className="min-h-screen pb-24">
      <header className="px-5 pt-12 pb-6">
        <button
          onClick={onBack}
          className="flex items-center text-muted-foreground mb-4 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-foreground">{domain.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full",
              domain.stage === "Foundation" && "bg-primary/10 text-primary",
              domain.stage === "Skill" && "bg-warning/10 text-warning-foreground",
              domain.stage === "Mastery" && "bg-success/10 text-success"
            )}
          >
            {domain.stage}
          </span>
          <span className="text-sm text-muted-foreground">
            {domain.progress}% complete
          </span>
        </div>
      </header>

      <main className="px-5 space-y-6">
        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">
          {domain.description}
        </p>

        {/* Current Focus */}
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Current Focus
          </h3>
          <p className="text-sm text-muted-foreground">{domain.currentFocus}</p>
        </div>

        {/* Priority Selector */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Priority Level
          </h3>
          <div className="flex items-center gap-2">
            {(["Low", "Medium", "High"] as const).map((priority) => (
              <button
                key={priority}
                onClick={() => onPriorityChange(domain.id, priority)}
                className={cn(
                  "flex-1 text-sm font-medium py-2.5 rounded-xl transition-all",
                  domain.priority === priority
                    ? priority === "High"
                      ? "bg-destructive/10 text-destructive"
                      : priority === "Medium"
                      ? "bg-warning/10 text-warning-foreground"
                      : "bg-muted text-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        {/* Subskills */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Subskills
          </h3>
          <div className="space-y-3">
            {domain.subskills.map((subskill) => (
              <div
                key={subskill.id}
                className="bg-card rounded-xl p-4 shadow-sm border border-border/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground text-sm">
                    {subskill.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {subskill.progress}%
                  </span>
                </div>
                <Progress value={subskill.progress} className="h-1.5" />
              </div>
            ))}
          </div>
        </section>

        {/* Recent Tasks */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Recent Tasks
          </h3>
          <div className="space-y-2">
            {domain.recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl"
              >
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-success" />
                </div>
                <div>
                  <p className="text-sm text-foreground">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {task.completedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stage Explanation */}
        <section className="bg-muted/30 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            About the {domain.stage} Stage
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {domain.stage === "Foundation" &&
              "Building fundamental awareness and basic habits. Tasks focus on low-pressure exposure and simple actions."}
            {domain.stage === "Skill" &&
              "Developing practical skills through consistent practice. Tasks become more challenging and build on previous foundations."}
            {domain.stage === "Mastery" &&
              "Refining and integrating skills into daily life. Tasks focus on advanced techniques and maintaining excellence."}
          </p>
        </section>
      </main>
    </div>
  );
}

function CurriculumScreenSkeleton() {
  return (
    <div className="min-h-screen pb-24">
      <header className="px-5 pt-12 pb-6">
        <Skeleton className="h-8 w-36 mb-2" />
        <Skeleton className="h-4 w-48" />
      </header>
      <main className="px-5">
        <div className="space-y-3">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
