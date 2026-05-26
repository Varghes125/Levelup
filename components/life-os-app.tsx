"use client";

import { useState, useEffect } from "react";
import { BottomNav, type TabType } from "@/components/bottom-nav";
import { HomeScreen } from "@/components/screens/home-screen";
import { PathwaysScreen } from "@/components/screens/pathways-screen";
import { PathwayDetailScreen } from "@/components/screens/pathway-detail-screen";
import { CurriculumScreen } from "@/components/screens/curriculum-screen";
import { ProfileScreen } from "@/components/screens/profile-screen";
import { OnboardingFlow } from "@/components/onboarding-flow";
import { getUser, completeOnboarding } from "@/lib/api";
import type { User } from "@/lib/mock-data";

export function LifeOSApp() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [selectedPathwayId, setSelectedPathwayId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getUser();
        setUser(userData);
        // For demo purposes, we can toggle this to show onboarding
        // In production, this would check userData.onboardingComplete
        setShowOnboarding(!userData.onboardingComplete);
      } catch (error) {
        console.error("[v0] Error loading user:", error);
        // If no user, show onboarding
        setShowOnboarding(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleOnboardingComplete = async (data: {
    name: string;
    selectedDomains: string[];
    timeAvailability: "5min" | "10min" | "15min";
  }) => {
    try {
      const result = await completeOnboarding(data);
      setUser(result.user);
      setShowOnboarding(false);
    } catch (error) {
      console.error("[v0] Error completing onboarding:", error);
    }
  };

  const handleSelectPathway = (pathwayId: number) => {
    setSelectedPathwayId(pathwayId);
  };

  const handleBackFromPathway = () => {
    setSelectedPathwayId(null);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const renderScreen = () => {
    // If viewing a specific pathway detail
    if (activeTab === "pathways" && selectedPathwayId !== null) {
      return (
        <PathwayDetailScreen
          pathwayId={selectedPathwayId}
          onBack={handleBackFromPathway}
        />
      );
    }

    switch (activeTab) {
      case "home":
        return <HomeScreen user={user} onUserUpdate={handleUserUpdate} />;
      case "pathways":
        return <PathwaysScreen onSelectPathway={handleSelectPathway} />;
      case "curriculum":
        return <CurriculumScreen />;
      case "profile":
        return <ProfileScreen user={user} />;
      default:
        return <HomeScreen user={user} onUserUpdate={handleUserUpdate} />;
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Reset pathway selection when changing tabs
    if (tab !== "pathways") {
      setSelectedPathwayId(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show onboarding if needed
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto relative">
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      {/* Mobile frame for desktop viewing */}
      <div className="min-h-screen">
        {renderScreen()}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
