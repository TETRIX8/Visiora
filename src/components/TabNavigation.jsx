// src/components/TabNavigation.jsx

import React from "react";
import "./TabNavigation.css";

const TabNavigation = ({ activeTab, setActiveTab, historyCount = 0 }) => {
  const tabs = [
    { id: "generate", label: "Generate", icon: "✨" },
    { id: "enhance", label: "Enhance", icon: "🔮" },
    { id: "history", label: `History (${historyCount})`, icon: "🕐" },
  ];

  return (
    <div className="tab-navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
          data-tab={tab.id}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
