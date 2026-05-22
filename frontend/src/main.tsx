import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ProfileProvider } from "./context/ProfileContext";
import { DrawerProvider } from "./context/DrawerContext";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProfileProvider>
      <DrawerProvider>
        <App />
      </DrawerProvider>
    </ProfileProvider>
  </StrictMode>
);