import React, { useState } from 'react';
import Modal from '@/app/ui/components/Modal';
import { Button } from '@/app/ui/components/Button';
import platformApi from '@/app/lib/data/platform-api';
import clsx from 'clsx';
import { useSharedState } from '@/app/ui/components/SharedState/Context';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: number;
}

export default function Request({ isOpen, onClose, id }: Props) {

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { sharedState } = useSharedState();
  const { isLogedIn } = sharedState || {};

  const isDisabled = loading;

  if (!isLogedIn && !isOpen) return null;

  const handleRequestBoard = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await platformApi(
        { output: 'request' },
        'solution',
        'pinboard',
        false,
        'POST',
        {
          pinboard_id: id,
          output: 'request',
        }
      );

      if (response?.success) {
        setSuccessMessage(response?.message || 'Request submitted to contributors.');
      } else {
        setErrorMessage(
          response?.message || 'An error occurred while submiting request to the board.'
        );
      }
    } catch (error) {
      console.error('Error deleting board:', error);
      setErrorMessage('Unable to submit request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Request to contribute to this board.">
        <p className="mt-[-30px] text-left text-sm text-gray-500">
            By submitting this request, a notification will be sent to the current contributors of the board. They will review your request and decide whether to approve or decline your participation.
            Please note that you will be notified once a decision is made. If approved, you will gain access to contribute to the board and collaborate with other contributors.
        </p>
        <p className="text-left text-sm text-gray-500">
            Are you sure you want to send this request?
        </p>

        {errorMessage && (
          <p className="mt-4 text-left  text-sm text-red-500">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="mt-4 text-left  text-sm text-green-500">
            {successMessage}
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
            onClick={handleRequestBoard}
            disabled={isDisabled}
          >
            {loading ? 'Requesting...' : 'Request'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
