// App.tsx

import React, { useState } from "react";
import { TabNavigation } from "./components/TabNavigation";
import { AFDInfo } from "./components/AFDInfo";
import { AFDCreator } from "./components/AFDCreator";
import { StringEvaluator } from "./components/StringEvaluator";
import { StringGenerator } from "./components/StringGenerator";
import { FileManager } from "./components/FileManager";
import { TabType } from "./types/Index";
import "./App.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("create");

  const renderTabContent = () => {
    switch (activeTab) {
      case "create":
        return <AFDCreator />;

      case "evaluate":
        return <StringEvaluator />;

      case "generate":
        return <StringGenerator />;

      case "files":
        return <FileManager />;

      case "afd":
        return <AFDInfo />;

      default:
        return null;
    }
  };

  return (
    <div className="app__container">
      <main className="app__main">
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="app__tabs"
        />
        <div className="app__content">{renderTabContent()}</div>
      </main>
    </div>
  );
};

export default App;
