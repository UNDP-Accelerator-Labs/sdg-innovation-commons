'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import getSession from '@/app/lib/session';
import AddToBoard from '@/app/ui/board/Add';
import Notification from '@/app/ui/components/Notification';

interface SharedStateContextType {
  sharedState: any;
  setSharedState: React.Dispatch<React.SetStateAction<any>>;
}

const SharedStateContext = createContext<SharedStateContextType | undefined>(
  undefined
);

export function SharedStateProvider({ children }: { children: ReactNode }) {
  const [sharedState, setSharedState] = useState<any>(null);

  const addToBoard = sharedState?.addToBoard || {};
  const { showAddToBoardModal, id, allObjectIdz, pinboards, platform } = addToBoard;

  const notification = sharedState?.notification || {}
  const { showNotification, message, submessage, messageType } = notification;

  const closeAddToBoardModal = () => {
    setSharedState((prevState: any) => ({
      ...prevState,
      addToBoard: null,
    }));
  };

  useEffect(() => {
    async function fetchData() {
      const data = await getSession();
      let isValidUser = false;
      if (data && typeof data === 'object' && 'username' in data) {
        isValidUser = true
      }
      setSharedState((prevState: any) => ({
        ...prevState,
        isLogedIn: isValidUser,
        session: data,
      }));
    }

    fetchData();
  }, []);

  return (
    <SharedStateContext.Provider value={{ sharedState, setSharedState }}>
      {children}

      <AddToBoard
        isOpen={showAddToBoardModal}
        onClose={closeAddToBoardModal}
        platform={platform}
        id={id}
        allObjectIdz={allObjectIdz}
        pinboards={pinboards}
      />

      {showNotification && (
        <Notification
          message={message}
          subMessage={submessage}
          type={messageType}
        />
      )}

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
