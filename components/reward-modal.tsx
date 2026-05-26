"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Star, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  xpEarned: number;
  newStreak: number;
  levelUp?: boolean;
  newLevel?: number;
}

export function RewardModal({
  isOpen,
  onClose,
  xpEarned,
  newStreak,
  levelUp,
  newLevel,
}: RewardModalProps) {
  const triggerConfetti = useCallback(() => {
    // Light, subtle confetti burst
    const colors = ["#86EFAC", "#22C55E", "#4ADE80"];
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors,
      ticks: 100,
      gravity: 1.2,
      scalar: 0.8,
      shapes: ["circle"],
      disableForReducedMotion: true,
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Slight delay for better UX
      const timer = setTimeout(triggerConfetti, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, triggerConfetti]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-48px)] max-w-sm bg-card rounded-3xl p-6 shadow-xl border border-border/50 z-50"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", damping: 10 }}
                className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4"
              >
                {levelUp ? (
                  <Trophy className="w-10 h-10 text-success" />
                ) : (
                  <Star className="w-10 h-10 text-success" />
                )}
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-foreground mb-2"
              >
                {levelUp ? "Level Up!" : "Nice work!"}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-muted-foreground mb-6"
              >
                {levelUp
                  ? `You reached Level ${newLevel}!`
                  : "You completed your task"}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center gap-6 mb-6"
              >
                {/* XP */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                    <Star className="w-5 h-5" />
                    <span className="text-2xl font-bold">+{xpEarned}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">XP Earned</span>
                </div>

                {/* Streak */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-warning mb-1">
                    <Flame className="w-5 h-5" />
                    <span className="text-2xl font-bold">{newStreak}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Day Streak</span>
                </div>
              </motion.div>

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Button
                  onClick={onClose}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
                >
                  Continue
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
