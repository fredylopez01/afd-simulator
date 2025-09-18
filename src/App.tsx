// App.tsx

import React, { useState } from "react";
import { TabNavigation } from "./components/TabNavigation";
import { AFDInfo } from "./components/AFDInfo";
import { AFDCreator } from "./components/AFDCreator";
import { StringEvaluator } from "./components/StringEvaluator";
import { StringGenerator } from "./components/StringGenerator";
import { FileManager } from "./components/FileManager";
import { useAFD } from "./hooks/useAFD";
import { TabType } from "./types/Index";
import "./App.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("create");
  const {
    currentAFD,
    transitions,
    isCreated,
    createAFD,
    addTransition,
    removeTransition,
    clearTransitions,
    evaluateString,
    generateStrings,
    saveAFD,
    loadAFD,
  } = useAFD();

  const renderTabContent = () => {
    switch (activeTab) {
      case "create":
        return (
          <AFDCreator
            transitions={transitions}
            onCreateAFD={createAFD}
            onAddTransition={addTransition}
            onRemoveTransition={removeTransition}
            onClearTransitions={clearTransitions}
          />
        );

      case "evaluate":
        return <StringEvaluator onEvaluateString={evaluateString} />;

      case "generate":
        return (
          <>
            <StringGenerator onGenerateStrings={generateStrings} />
          </>
        );

      case "files":
        return (
          <FileManager
            onSaveAFD={saveAFD}
            onLoadAFD={loadAFD}
            hasAFD={isCreated}
          />
        );

      case "afd":
        return (
          <AFDInfo afd={currentAFD} transitionsCount={transitions.length} />
        );

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
