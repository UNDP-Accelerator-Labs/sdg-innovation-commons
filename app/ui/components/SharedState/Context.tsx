'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface SharedStateContextType {
  sharedState: any;
  setSharedState: React.Dispatch<React.SetStateAction<any>>;
}

const SharedStateContext = createContext<SharedStateContextType | undefined>(undefined);

export function SharedStateProvider({ children }: { children: ReactNode }) {
  const [sharedState, setSharedState] = useState<any>(null);

  return (
    <SharedStateContext.Provider value={{ sharedState, setSharedState }}>
      {children}
    </SharedStateContext.Provider>
  );
}


export function useSharedState() {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error('useSharedState must be used within a SharedStateProvider');
  }
  return context;
}
