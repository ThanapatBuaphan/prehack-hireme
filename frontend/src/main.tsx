import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { ProfileProvider } from "./context/ProfileContext";
import { DrawerProvider } from "./context/DrawerContext";
import mainRouter from "./routers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProfileProvider>
      <DrawerProvider>
        <RouterProvider router={mainRouter} />
      </DrawerProvider>
    </ProfileProvider>
  </StrictMode>
);