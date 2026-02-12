import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal/index';
import { Button } from '@/app/ui/components/Button';
import clsx from 'clsx';
import { useSharedState } from '@/app/ui/components/SharedState/Context';

export default function Share() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Access shared state
  const { sharedState, setSharedState } = useSharedState();
  const { isLogedIn, share } = sharedState || {};
  const { _isModalOpen, boardId, platform, email, is_contributor, title } = share || {};


  const [u_email, setEmail] = useState<string>(email || '');

  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmail(email);

    // Basic email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      setDisabled(true);
    } else if (email) {
      setErrorMessage('');
      setDisabled(false);
    } else {
      setErrorMessage('');
      setDisabled(true);
    }
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/contributors/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinboard: boardId, email: u_email }),
      });

      const data = await response.json();
      
      if (!data?.success) throw Error(data);
      setEmail('');
      setSuccessMessage(data?.message);
      setErrorMessage('')
    } catch (error) {
      console.error('Error sharing email:', error);
      setErrorMessage('Failed to share with user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setSharedState((prevState: any) => ({
      ...prevState,
      share: {
        _isModalOpen: false,
        boardId: null,
        email: ''
      },
    }));
  };

  if (!isLogedIn && !_isModalOpen && !is_contributor) return null;
  return (
    <>
      <Modal
        isOpen={_isModalOpen}
        onClose={handleModalClose}
        title="Grant Contributor Access"
      >
        <p className="text-left text-sm text-gray-500">
          Granting contributor access to the board <b>{title}</b> allows the user to manage and contribute to the board.
        </p>
        <p className="text-left text-sm text-gray-500">
          Please provide the user's email address. The user will be granted contributor access and notified via email.
        </p>
        <div className="mt-4">
          <div
            className={clsx(
              'flex items-center overflow-hidden rounded-lg border border-gray-300'
            )}
          >
            <input
              type="email"
              name="email"
              value={u_email}
              onChange={handleSearchChange}
              className="grow border-none bg-white px-3 py-2"
              placeholder="Email"
              disabled={loading}
            />
          </div>
          {errorMessage && (
            <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="mt-2 text-sm text-light-green">{successMessage}</p>
          )}
        </div>

        <div className="mt-10 text-center">
          <Button
            type="button"
            className={clsx(
              'w-full grow-0',
              loading ? 'cursor-wait' : '',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            onClick={handleShare}
            disabled={disabled || loading}
          >
            {loading ? 'Please wait...' : 'Grant Contributor Access'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
