'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import getSession, { session_name, is_user_logged_in }  from '@/app/lib/session';

interface SharedStateContextType {
  sharedState: any;
  setSharedState: React.Dispatch<React.SetStateAction<any>>;
}

const SharedStateContext = createContext<SharedStateContextType | undefined>(undefined);

export function SharedStateProvider({ children }: { children: ReactNode }) {
  const [sharedState, setSharedState] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      await getSession()
      const data = await session_name(); 
      const isValidUser = await is_user_logged_in()
      setSharedState((prevState: any) => ({
          ...prevState, 
          isLogedIn: isValidUser,
          session: data
      }));
    }

    fetchData();
  },[]);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch('https://experiments.sdg-innovation-commons.org/apis/fetch/pads?pads=628')
      const data = await res.json()
      console.log('Data from frontend ', data)
    }
    fetchPosts()
  }, [])

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
