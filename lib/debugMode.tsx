"use client";

import { createContext, useContext, useState } from "react";

interface DebugModeContextValue {
  debugMode: boolean;
  toggleDebugMode: () => void;
}

const DebugModeContext = createContext<DebugModeContextValue>({
  debugMode: false,
  toggleDebugMode: () => {},
});

export function DebugModeProvider({ children }: { children: React.ReactNode }) {
  /** Always starts off — debug mode is a per-session toggle, not a
   * persisted preference. */
  const [debugMode, setDebugMode] = useState(false);

  return (
    <DebugModeContext.Provider
      value={{
        debugMode,
        toggleDebugMode: () => setDebugMode((v) => !v),
      }}
    >
      {children}
    </DebugModeContext.Provider>
  );
}

export function useDebugMode() {
  return useContext(DebugModeContext);
}
