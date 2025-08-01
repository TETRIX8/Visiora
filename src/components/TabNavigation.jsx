// src/components/TabNavigation.jsx

import React, { useState, useEffect } from "react";
import { Wand2, Sparkles, History } from "lucide-react";
import ExpandedTabs from "./ui/ExpandedTabs";
import "./TabNavigation.css";

const TabNavigation = ({ activeTab, setActiveTab, historyCount = 0 }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Map tab names to indices
  const tabMapping = {
    Generate: "generate",
    Enhance: "enhance",
    History: "history",
  };

  const reverseTabMapping = {
    generate: 0,
    enhance: 1,
    history: 2,
  };

  const tabs = [
    { title: "Generate", icon: Wand2 },
    { title: "Enhance", icon: Sparkles },
    { title: "History", icon: History },
  ];

  // Update active tab index when activeTab prop changes
  useEffect(() => {
    const index = reverseTabMapping[activeTab];
    if (index !== undefined) {
      setActiveTabIndex(index);
    }
  }, [activeTab]);

  const handleTabChange = (tabTitle) => {
    const tabId = tabMapping[tabTitle];
    if (tabId) {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="tab-navigation-modern">
      <ExpandedTabs
        tabs={tabs}
        activeColor="text-purple-500"
        onTabChange={handleTabChange}
        activeTabIndex={activeTabIndex}
      />
      {historyCount > 0 && activeTab === "history" && (
        <div className="history-count-badge">{historyCount}</div>
      )}
    </div>
  );
};

export default TabNavigation;
