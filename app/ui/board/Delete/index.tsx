import React, { useState } from 'react';
import Modal from '@/app/ui/components/Modal';
import { Button } from '@/app/ui/components/Button';
import clsx from 'clsx';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import { useRouter } from 'next/navigation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: number;
}

export default function Delete({ isOpen, onClose, id }: Props) {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { sharedState } = useSharedState();
  const { isLogedIn } = sharedState || {};

  const isDisabled = loading;

  if (!isLogedIn && !isOpen) return null;

  const handleDeleteBoard = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/pinboards/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinboard: id }),
      });

      const data = await response.json();

      if (data?.success) {
        return router.push(`/boards`);
      } else {
        setErrorMessage(
          data?.message || 'An error occurred while deleting the board.'
        );
      }
    } catch (error) {
      console.error('Error deleting board:', error);
      setErrorMessage('Unable to delete board. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Delete Board">
        <p className="mt-[-30px] text-left text-sm text-gray-500">
          Deleting a board is a permanent action and cannot be undone. Once
          deleted, the board will no longer be accessible to you, the public (if
          it was published), or any contributors you previously shared it with.
          Are you sure you want to proceed with deleting this board?
        </p>

        <div className="flex flex-col items-center gap-5 rounded-lg border border-gray-300"></div>

        {errorMessage && (
          <p className="mt-4 text-center text-sm text-red-500">
            {errorMessage}
          </p>
        )}

        <div className="mt-10 flex w-full flex-row space-x-10 text-center">
          <button
            onClick={onClose}
            className="w-full grow-0 cursor-pointer border border-black bg-transparent font-space-mono text-lg font-bold hover:bg-gray-200"
          >
            Cancel
          </button>

          <Button
            type="button"
            className={clsx('w-full grow-0 border-l-0', {
              'cursor-not-allowed opacity-50': isDisabled,
            })}
            onClick={handleDeleteBoard}
            disabled={isDisabled}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
