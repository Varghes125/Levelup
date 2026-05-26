"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Users,
  Brain,
  Briefcase,
  Heart,
  Palette,
  Wallet,
  Leaf,
  Plus,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DomainOption } from "@/lib/mock-data";

interface OnboardingFlowProps {
  onComplete: (data: {
    name: string;
    selectedDomains: string[];
    timeAvailability: "5min" | "10min" | "15min";
  }) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  dumbbell: <Dumbbell className="w-6 h-6" />,
  users: <Users className="w-6 h-6" />,
  brain: <Brain className="w-6 h-6" />,
  briefcase: <Briefcase className="w-6 h-6" />,
  heart: <Heart className="w-6 h-6" />,
  palette: <Palette className="w-6 h-6" />,
  wallet: <Wallet className="w-6 h-6" />,
  leaf: <Leaf className="w-6 h-6" />,
};

const defaultDomains: DomainOption[] = [
  { id: "fitness", name: "Fitness", icon: "dumbbell" },
  { id: "social", name: "Social", icon: "users" },
  { id: "knowledge", name: "Knowledge", icon: "brain" },
  { id: "career", name: "Career", icon: "briefcase" },
  { id: "emotional", name: "Emotional", icon: "heart" },
  { id: "creativity", name: "Creativity", icon: "palette" },
  { id: "finance", name: "Finance", icon: "wallet" },
  { id: "lifestyle", name: "Lifestyle", icon: "leaf" },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [timeAvailability, setTimeAvailability] = useState<"5min" | "10min" | "15min">("10min");
  const [customDomains, setCustomDomains] = useState<DomainOption[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDomainName, setCustomDomainName] = useState("");

  const allDomains = [...defaultDomains, ...customDomains];

  const toggleDomain = (domainId: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domainId)
        ? prev.filter((id) => id !== domainId)
        : [...prev, domainId]
    );
  };

  const addCustomDomain = () => {
    if (customDomainName.trim()) {
      const newDomain: DomainOption = {
        id: customDomainName.toLowerCase().replace(/\s+/g, "-"),
        name: customDomainName.trim(),
        icon: "sparkles",
        custom: true,
      };
      setCustomDomains((prev) => [...prev, newDomain]);
      setSelectedDomains((prev) => [...prev, newDomain.id]);
      setCustomDomainName("");
      setShowCustomInput(false);
    }
  };

  const handleComplete = () => {
    onComplete({
      name: name || "Friend",
      selectedDomains,
      timeAvailability,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <WelcomeScreen
            key="welcome"
            name={name}
            setName={setName}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <DomainsScreen
            key="domains"
            domains={allDomains}
            selectedDomains={selectedDomains}
            onToggle={toggleDomain}
            showCustomInput={showCustomInput}
            setShowCustomInput={setShowCustomInput}
            customDomainName={customDomainName}
            setCustomDomainName={setCustomDomainName}
            onAddCustom={addCustomDomain}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <TimeScreen
            key="time"
            timeAvailability={timeAvailability}
            setTimeAvailability={setTimeAvailability}
            onComplete={handleComplete}
            onBack={() => setStep(2)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function WelcomeScreen({
  name,
  setName,
  onNext,
}: {
  name: string;
  setName: (name: string) => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col justify-center px-8 py-12"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
        >
          <Sparkles className="w-10 h-10 text-primary" />
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Welcome to Life OS
        </h1>
        <p className="text-muted-foreground text-lg">
          Build your life, one action at a time
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            What should we call you?
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="h-14 text-lg rounded-xl border-border/50 focus:border-primary"
          />
        </div>

        <Button
          onClick={onNext}
          className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90"
        >
          Get Started
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-12">
        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        <div className="w-2.5 h-2.5 rounded-full bg-muted" />
        <div className="w-2.5 h-2.5 rounded-full bg-muted" />
      </div>
    </motion.div>
  );
}

function DomainsScreen({
  domains,
  selectedDomains,
  onToggle,
  showCustomInput,
  setShowCustomInput,
  customDomainName,
  setCustomDomainName,
  onAddCustom,
  onNext,
  onBack,
}: {
  domains: DomainOption[];
  selectedDomains: string[];
  onToggle: (id: string) => void;
  showCustomInput: boolean;
  setShowCustomInput: (show: boolean) => void;
  customDomainName: string;
  setCustomDomainName: (name: string) => void;
  onAddCustom: () => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col px-6 py-12"
    >
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-muted-foreground text-sm mb-4 hover:text-foreground transition-colors"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Choose Your Domains
        </h1>
        <p className="text-muted-foreground">
          Select the areas of life you want to grow in
        </p>
      </div>

      {/* Domain Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {domains.map((domain) => {
          const isSelected = selectedDomains.includes(domain.id);
          return (
            <motion.button
              key={domain.id}
              onClick={() => onToggle(domain.id)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border/50 bg-card hover:border-border"
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              )}
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors",
                  isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {domain.custom ? (
                  <Sparkles className="w-6 h-6" />
                ) : (
                  iconMap[domain.icon] || <Sparkles className="w-6 h-6" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {domain.name}
              </span>
            </motion.button>
          );
        })}

        {/* Add Custom Domain */}
        {!showCustomInput ? (
          <motion.button
            onClick={() => setShowCustomInput(true)}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-2">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Add Custom
            </span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-primary bg-primary/5"
          >
            <Input
              value={customDomainName}
              onChange={(e) => setCustomDomainName(e.target.value)}
              placeholder="Domain name"
              className="h-10 text-sm rounded-lg mb-2"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && onAddCustom()}
            />
            <div className="flex gap-2 w-full">
              <Button
                onClick={onAddCustom}
                size="sm"
                className="flex-1 rounded-lg"
                disabled={!customDomainName.trim()}
              >
                Add
              </Button>
              <Button
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomDomainName("");
                }}
                size="sm"
                variant="outline"
                className="rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Continue Button */}
      <div className="mt-6">
        <Button
          onClick={onNext}
          disabled={selectedDomains.length === 0}
          className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-3">
          {selectedDomains.length} domain{selectedDomains.length !== 1 ? "s" : ""} selected
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-6">
        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        <div className="w-2.5 h-2.5 rounded-full bg-muted" />
      </div>
    </motion.div>
  );
}

function TimeScreen({
  timeAvailability,
  setTimeAvailability,
  onComplete,
  onBack,
}: {
  timeAvailability: "5min" | "10min" | "15min";
  setTimeAvailability: (time: "5min" | "10min" | "15min") => void;
  onComplete: () => void;
  onBack: () => void;
}) {
  const timeOptions: { value: "5min" | "10min" | "15min"; label: string; description: string }[] = [
    { value: "5min", label: "5 min/day", description: "Quick daily actions" },
    { value: "10min", label: "10 min/day", description: "Balanced growth" },
    { value: "15min", label: "15 min/day", description: "Deeper practice" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col justify-center px-6 py-12"
    >
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-muted-foreground text-sm mb-4 hover:text-foreground transition-colors"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          How much time can you give?
        </h1>
        <p className="text-muted-foreground">
          We&apos;ll tailor your daily tasks accordingly
        </p>
      </div>

      {/* Time Options */}
      <div className="space-y-3 flex-1">
        {timeOptions.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => setTimeAvailability(option.value)}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full p-5 rounded-2xl border-2 text-left transition-all",
              timeAvailability === option.value
                ? "border-primary bg-primary/5"
                : "border-border/50 bg-card hover:border-border"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground text-lg">
                  {option.label}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {option.description}
                </p>
              </div>
              {timeAvailability === option.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Complete Button */}
      <div className="mt-6">
        <Button
          onClick={onComplete}
          className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90"
        >
          Start My Journey
          <Sparkles className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-6">
        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
      </div>
    </motion.div>
  );
}
