import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

const DrawerContext = createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
}>({ open: false, setOpen: () => {} });

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  return useContext(DrawerContext);
}