import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AFDProvider } from "./hooks/useAFD.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AFDProvider>
      <App />
    </AFDProvider>
  </StrictMode>
);
