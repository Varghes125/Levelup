"use client";

import { useState } from "react";
import { Check, RefreshCw, Zap, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/mock-data";

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: number) => void;
  onSwap: (taskId: number) => void;
  onEasier: (taskId: number) => void;
  isCompleting?: boolean;
  isSwapping?: boolean;
}

export function TaskCard({
  task,
  onComplete,
  onSwap,
  onEasier,
  isCompleting,
  isSwapping,
}: TaskCardProps) {
  const [showWhy, setShowWhy] = useState(false);
  const [showHow, setShowHow] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete(task.id);
  };

  const isLifeTask = task.type === "life";

  return (
    <div
      className={cn(
        "bg-card rounded-2xl p-5 shadow-sm border border-border/50 transition-all duration-300",
        isCompleted && "opacity-60 scale-[0.98]"
      )}
    >
      {/* Header Label */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full",
              isLifeTask
                ? "bg-primary/10 text-primary"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            {isLifeTask ? "Life Pathway" : task.pathwayTitle}
          </span>
          {!isLifeTask && task.sessionProgress && (
            <span className="text-xs text-muted-foreground">
              {task.sessionProgress}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{task.time}</span>
        </div>
      </div>

      {/* Domain (for life tasks) */}
      {isLifeTask && task.domain && (
        <p className="text-xs text-muted-foreground mb-1.5">{task.domain}</p>
      )}

      {/* Task Title */}
      <h3 className="text-base font-semibold text-foreground leading-snug mb-4">
        {task.title}
      </h3>

      {/* Expandable Sections */}
      <div className="space-y-2 mb-4">
        {/* Why Section */}
        <button
          onClick={() => setShowWhy(!showWhy)}
          className="w-full flex items-center justify-between py-2 px-3 bg-muted/50 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
        >
          <span>Why this works</span>
          {showWhy ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {showWhy && (
          <div className="px-3 py-3 bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {task.why}
            </p>
          </div>
        )}

        {/* How Section */}
        <button
          onClick={() => setShowHow(!showHow)}
          className="w-full flex items-center justify-between py-2 px-3 bg-muted/50 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
        >
          <span>How to do it</span>
          {showHow ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {showHow && (
          <div className="px-3 py-3 bg-muted/30 rounded-xl">
            <ol className="space-y-2">
              {task.how.map((step, index) => (
                <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleComplete}
          disabled={isCompleting || isCompleted}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 font-medium"
        >
          {isCompleting ? (
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          {isCompleted ? "Done!" : "Done"}
        </Button>
        <Button
          onClick={() => onSwap(task.id)}
          disabled={isSwapping || isCompleted}
          variant="outline"
          className="rounded-xl h-11 px-4"
          title="Get a different task"
        >
          <RefreshCw className={cn("w-4 h-4", isSwapping && "animate-spin")} />
        </Button>
        <Button
          onClick={() => onEasier(task.id)}
          disabled={isCompleted}
          variant="outline"
          className="rounded-xl h-11 px-4"
          title="Get an easier version"
        >
          <Zap className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
