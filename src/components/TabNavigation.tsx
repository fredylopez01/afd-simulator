// components/TabNavigation.tsx

import React from "react";
import { TabType } from "../types/Index";
import "./TabNavigation.css";

interface Tab {
  id: TabType;
  label: string;
  icon?: string;
}

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
}

const tabs: Tab[] = [
  { id: "create", label: "Crear AFD", icon: "⚙️" },
  { id: "evaluate", label: "Evaluar Cadenas", icon: "🔍" },
  { id: "generate", label: "Generar Cadenas", icon: "✨" },
  { id: "files", label: "Archivos", icon: "📁" },
  { id: "afd", label: "AFD Info", icon: "ℹ️" },
  // { id: "visualize", label: "Visualizar", icon: "👁️" },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div className="tab_navigation">
      <h1 className="app__title">
        <span className="app__icon">🤖</span>
        Simulador de AFD
      </h1>
      <div className={`tabs ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "tab--active" : ""}`}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            {tab.icon && <span className="tab__icon">{tab.icon}</span>}
            <span className="tab__label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
