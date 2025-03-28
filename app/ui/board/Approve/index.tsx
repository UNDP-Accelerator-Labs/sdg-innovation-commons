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
  user: string;
  title: string | undefined;
}

export default function Approve({ isOpen, onClose, id, user, title }: Props) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [approval, setApproval] = useState<string>('approve');

  const { sharedState } = useSharedState();
  const { isLogedIn } = sharedState || {};

  const isDisabled = loading;

  if (!isLogedIn && !isOpen) return null;

  const handleApprovalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApproval(event.target.value);
  };

  const handleRequestBoard = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await platformApi(
        { output: 'decide' },
        'experiment',
        'pinboard',
        false,
        'POST',
        {
          pinboard_id: id,
          output: 'decide',
          requestor_email: user,
          decision: approval,
        }
      );

      if (response?.success) {
        setSuccessMessage(
          response?.message || 'Request submitted to contributors.'
        );
      } else {
        setErrorMessage(
          response?.message ||
            'An error occurred while submiting request to the board.'
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
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Approve Contributor Access Request"
      >
        <div className="mt-[-30px] text-left text-sm text-gray-500">
          <p>
            User <b>{user}</b> has requested contributor access to the board{' '}
            <b>{title || ''}</b>. If granted, they will have full contributor
            privileges, including the ability to add and remove cards, update
            the board's title and description, and publish or unpublish the
            board.
          </p>
          <p>Please make your decision below:</p>

          <div className="space-x-5">
            <label>
              <input
                type="radio"
                value="approve"
                checked={approval === 'approve'}
                onChange={handleApprovalChange}
                className="border-1 mr-2 border-solid"
              />
              Approve
            </label>
            <label>
              <input
                type="radio"
                value="deny"
                checked={approval === 'deny'}
                onChange={handleApprovalChange}
                className="border-1 mr-2 border-solid"
              />
              Deny
            </label>
          </div>
          <p className="mt-5">
            The requestor will be notified of the decision.
          </p>
        </div>

        {errorMessage && (
          <p className="mt-4 text-left text-sm text-red-500">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="mt-4 text-left text-sm text-green-500">
            {successMessage}
          </p>
        )}

        <div className="mt-10 flex w-full flex-row space-x-10 text-center">
          <Button
            type="button"
            className={clsx('w-full grow-0 border-l-0', {
              'cursor-not-allowed opacity-50': isDisabled,
            })}
            onClick={handleRequestBoard}
            disabled={isDisabled}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
