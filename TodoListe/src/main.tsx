import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { initializeAppStorage } from "./utils/storageMigration";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/responsive.css";

const storageInit = initializeAppStorage();

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App storageInit={storageInit} />
  </StrictMode>,
);
