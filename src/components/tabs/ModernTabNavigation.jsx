// src/components/tabs/ModernTabNavigation.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, History } from 'lucide-react';
import { cn } from '../../utils/cn';

const ModernTabNavigation = ({ activeTab, onTabChange, historyCount = 0 }) => {
  const tabs = [
    { id: 'generate', label: 'Generate', icon: Wand2, description: 'Create new images' },
    { id: 'enhance', label: 'Enhance', icon: Sparkles, description: 'Improve prompts' },
    { id: 'history', label: 'History', icon: History, description: 'View past creations', badge: historyCount }
  ];

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="relative p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        {/* Active tab background */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-purple-600/80 to-pink-600/80 shadow-lg"
          layoutId="activeTab"
          initial={false}
          animate={{
            x: tabs.findIndex(tab => tab.id === activeTab) * (100 / tabs.length) + '%'
          }}
          style={{ width: `${100 / tabs.length}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        <div className="relative z-10 grid grid-cols-3 gap-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-4 py-3 text-sm font-medium transition-all duration-200",
                  "hover:text-white focus:outline-none focus:text-white",
                  isActive ? "text-white" : "text-white/60"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {tab.badge && tab.badge > 0 && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </motion.div>
                  )}
                </div>
                <span className="text-xs">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModernTabNavigation;