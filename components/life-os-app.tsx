"use client";

import { useState } from "react";
import { BottomNav, type TabType } from "@/components/bottom-nav";
import { HomeScreen } from "@/components/screens/home-screen";
import { PathwaysScreen } from "@/components/screens/pathways-screen";
import { PathwayDetailScreen } from "@/components/screens/pathway-detail-screen";
import { CurriculumScreen } from "@/components/screens/curriculum-screen";
import { ProfileScreen } from "@/components/screens/profile-screen";

export function LifeOSApp() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [selectedPathwayId, setSelectedPathwayId] = useState<number | null>(null);

  const handleSelectPathway = (pathwayId: number) => {
    setSelectedPathwayId(pathwayId);
  };

  const handleBackFromPathway = () => {
    setSelectedPathwayId(null);
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
        return <HomeScreen />;
      case "pathways":
        return <PathwaysScreen onSelectPathway={handleSelectPathway} />;
      case "curriculum":
        return <CurriculumScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Reset pathway selection when changing tabs
    if (tab !== "pathways") {
      setSelectedPathwayId(null);
    }
  };

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
