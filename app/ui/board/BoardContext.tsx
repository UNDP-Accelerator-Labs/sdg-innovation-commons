'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface BoardState {
  title?: string;
  description?: string;
  status?: number;
  is_contributor?: boolean;
  contributors?: number;
  total?: number;
  pads?: any;
}

interface BoardContextType {
  boardState: BoardState;
  updateBoardState: (updates: Partial<BoardState>) => void;
  optimisticUpdate: <T,>(
    updateFn: () => Promise<T>,
    optimisticState: Partial<BoardState>
  ) => Promise<T>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState: BoardState;
}) {
  const [boardState, setBoardState] = useState<BoardState>(initialState);

  const updateBoardState = useCallback((updates: Partial<BoardState>) => {
    setBoardState((prev) => ({ ...prev, ...updates }));
  }, []);

  const optimisticUpdate = useCallback(
    async <T,>(
      updateFn: () => Promise<T>,
      optimisticState: Partial<BoardState>
    ): Promise<T> => {
      // Store the previous state for rollback
      const previousState = boardState;

      // Optimistically update the UI
      updateBoardState(optimisticState);

      try {
        // Perform the actual update
        const result = await updateFn();
        return result;
      } catch (error) {
        // Rollback on error
        setBoardState(previousState);
        throw error;
      }
    },
    [boardState, updateBoardState]
  );

  return (
    <BoardContext.Provider value={{ boardState, updateBoardState, optimisticUpdate }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoardContext() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
}
