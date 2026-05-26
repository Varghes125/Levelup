"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ArrowLeft, Plus, Dumbbell, Users, Brain, Briefcase, Heart, Palette, Wallet, Leaf, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getUserDomains, updateDomainPriority, getDomainById, addCustomDomain } from "@/lib/api";
import type { Domain, DomainOption } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const domainIcons: Record<string, React.ReactNode> = {
  "Fitness": <Dumbbell className="w-6 h-6" />,
  "Social Confidence": <Users className="w-6 h-6" />,
  "Knowledge": <Brain className="w-6 h-6" />,
  "Career": <Briefcase className="w-6 h-6" />,
  "Emotional": <Heart className="w-6 h-6" />,
  "Creativity": <Palette className="w-6 h-6" />,
  "Finance": <Wallet className="w-6 h-6" />,
  "Lifestyle": <Leaf className="w-6 h-6" />,
};

export function CurriculumScreen() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [newDomainName, setNewDomainName] = useState("");

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

  const handleAddCustomDomain = async () => {
    if (!newDomainName.trim()) return;
    try {
      const result = await addCustomDomain({
        name: newDomainName.trim(),
        icon: "sparkles",
      });
      // In a real app, this would add the domain to the user's curriculum
      console.log("[v0] Custom domain added:", result.domain);
      setNewDomainName("");
      setShowAddDomain(false);
    } catch (error) {
      console.error("[v0] Error adding custom domain:", error);
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
        {/* Domain Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {domains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DomainCard
                domain={domain}
                onSelect={() => handleSelectDomain(domain.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Add Custom Domain */}
        <AnimatePresence>
          {!showAddDomain ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowAddDomain(true)}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 transition-all text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">Add Domain</span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-card rounded-2xl p-4 border border-border/50"
            >
              <Input
                value={newDomainName}
                onChange={(e) => setNewDomainName(e.target.value)}
                placeholder="Domain name"
                className="mb-3 rounded-xl"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomDomain()}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddCustomDomain}
                  disabled={!newDomainName.trim()}
                  className="flex-1 rounded-xl"
                >
                  Add
                </Button>
                <Button
                  onClick={() => {
                    setShowAddDomain(false);
                    setNewDomainName("");
                  }}
                  variant="outline"
                  className="rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function DomainCard({
  domain,
  onSelect,
}: {
  domain: Domain;
  onSelect: () => void;
}) {
  const icon = domainIcons[domain.name] || <Sparkles className="w-6 h-6" />;
  
  return (
    <button
      onClick={onSelect}
      className="w-full bg-card rounded-2xl p-4 shadow-sm border border-border/50 text-left transition-all hover:shadow-md hover:border-primary/20 active:scale-[0.98]"
    >
      {/* Icon */}
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
        domain.priority === "High" && "bg-destructive/10 text-destructive",
        domain.priority === "Medium" && "bg-warning/10 text-warning",
        domain.priority === "Low" && "bg-primary/10 text-primary",
      )}>
        {icon}
      </div>

      {/* Name */}
      <h3 className="font-semibold text-foreground text-sm mb-1">
        {domain.name}
      </h3>

      {/* Stage Badge */}
      <span
        className={cn(
          "text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-3",
          domain.stage === "Foundation" && "bg-primary/10 text-primary",
          domain.stage === "Skill" && "bg-warning/10 text-warning-foreground",
          domain.stage === "Mastery" && "bg-success/10 text-success"
        )}
      >
        {domain.stage}
      </span>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
        <span>Progress</span>
        <span>{domain.progress}%</span>
      </div>
      <Progress value={domain.progress} className="h-1.5" />
    </button>
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
  const icon = domainIcons[domain.name] || <Sparkles className="w-8 h-8" />;

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
        
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center",
            domain.priority === "High" && "bg-destructive/10 text-destructive",
            domain.priority === "Medium" && "bg-warning/10 text-warning",
            domain.priority === "Low" && "bg-primary/10 text-primary",
          )}>
            {icon}
          </div>
          <div>
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
          </div>
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
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
