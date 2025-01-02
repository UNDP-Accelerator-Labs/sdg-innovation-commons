import React, { useState } from 'react';
import Modal from '@/app/ui/components/Modal';
import { Button } from '@/app/ui/components/Button';
import platformApi from '@/app/lib/data/platform-api';
import clsx from 'clsx';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import { useRouter } from 'next/navigation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Create({ isOpen, onClose }: Props) {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [boardTitle, setBoardTitle] = useState<string>('');
  const [boardDescription, setBoardDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { sharedState } = useSharedState();
  const { isLogedIn } = sharedState || {};

  const isDisabled = !boardTitle.trim() || !boardDescription.trim() || loading;

  if (!isLogedIn && !isOpen) return null;

  const handleCreateBoard = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await platformApi(
        { output: 'create' },
        'solution',
        'pinboard',
        false,
        'POST',
        {
          title: boardTitle.trim(),
          description: boardDescription.trim(),
          output: 'create',
        }
      );

      if (response?.success) {
        setSuccessMessage('Board created successfully!');
        setBoardTitle('');
        setBoardDescription('');
        return router.push(`/boards/all/${response?.pinboard?.id}`);
      } else {
        setErrorMessage(
          response?.message || 'An error occurred while creating the board.'
        );
      }
    } catch (error) {
      console.error('Error creating board:', error);
      setErrorMessage('Unable to create board. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Create New Board">
        <p className="mt-[-30px] text-left text-sm text-gray-500">
          By default, all new boards are private. They are only accessible to
          the board owner and any collaborators you choose to share them with.
          To manage your boards, click 'My Boards' in the bottom right corner of
          the page, where you can add new contributor, update, publish, or delete them.
        </p>

        <div className="flex flex-col items-center gap-5 rounded-lg border border-gray-300">
          <div className="group flex w-full flex-row items-stretch">
            <input
              type="text"
              name="title"
              className="grow border border-black bg-white px-3 py-2"
              placeholder="Board title"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
            />
          </div>

          <div className="group flex w-full flex-row items-stretch">
            <textarea
              name="description"
              className="grow border border-black bg-white px-3 py-2"
              placeholder="Board description"
              rows={5}
              value={boardDescription}
              onChange={(e) => setBoardDescription(e.target.value)}
            />
          </div>
        </div>

        {errorMessage && (
          <p className="mt-4 text-center text-sm text-red-500">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="mt-4 text-center text-sm text-green-500">
            {successMessage}
          </p>
        )}

        <div className="mt-10 text-center">
          <Button
            type="button"
            className={clsx('w-full grow-0 border-l-0', {
              'cursor-not-allowed opacity-50': isDisabled,
            })}
            onClick={handleCreateBoard}
            disabled={isDisabled}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
