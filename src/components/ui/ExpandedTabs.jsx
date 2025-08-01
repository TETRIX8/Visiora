import React, { useState, useEffect } from "react";
import "./ExpandedTabs.css";

const ExpandedTabs = ({
  tabs,
  activeColor = "text-purple-500",
  className = "",
  onTabChange,
  activeTabIndex = 0,
}) => {
  const [activeTab, setActiveTab] = useState(activeTabIndex);

  // Update internal state when prop changes
  useEffect(() => {
    setActiveTab(activeTabIndex);
  }, [activeTabIndex]);

  const handleTabClick = (index, tab) => {
    if (tab.type !== "separator") {
      setActiveTab(index);
      if (onTabChange) {
        onTabChange(tab.title);
      }
    }
  };

  return (
    <div className={`expanded-tabs-container ${className}`}>
      <div className="expanded-tabs">
        {tabs.map((tab, index) => {
          if (tab.type === "separator") {
            return <div key={`separator-${index}`} className="tab-separator" />;
          }

          const isActive = activeTab === index;
          const IconComponent = tab.icon;

          return (
            <button
              key={index}
              className={`tab-item ${isActive ? "active" : ""}`}
              onClick={() => handleTabClick(index, tab)}
            >
              <div className="tab-content-wrapper">
                {typeof IconComponent === "string" ? (
                  <span className="tab-emoji">{IconComponent}</span>
                ) : (
                  <IconComponent
                    className={`tab-icon ${isActive ? activeColor : ""}`}
                    size={20}
                  />
                )}
                {isActive && (
                  <span className={`tab-text ${isActive ? activeColor : ""}`}>
                    {tab.title}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExpandedTabs;
