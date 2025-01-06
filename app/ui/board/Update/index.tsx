'use client';
import React, { FC, useState } from 'react';
import { usePathname } from 'next/navigation';
import Modal from '@/app/ui/components/Modal';
import { Button } from '@/app/ui/components/Button';
import { updatePinboard } from '@/app/lib/data/platform-api';
import { useSharedState } from '@/app/ui/components/SharedState/Context';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: number;

  title?: string;
  description?: string;
}

const UpdateBoard: FC<Props> = ({
  isOpen,
  onClose,
  id,
  title,
  description,
}) => {
  if (!isOpen) return null;
  const { sharedState, setSharedState } = useSharedState();

  const [boardTitle, setBoardTitle] = useState<string>(title || '');
  const [boardDescription, setBoardDescription] = useState<string>(
    description || ''
  );

  const pathname = usePathname();

  const update = async () => {
    try {
      const data = await updatePinboard(id, boardTitle, boardDescription);
      if (data?.status === 200) {
        setSharedState((prevState: any) => ({
          ...prevState,
          notification: {
            showNotification: true,
            message: '',
            submessage: data?.message || '',
            messageType: 'success',
          },
        }));

        window.history.replaceState(null, '', pathname);
        window.location.reload();
      } else {
        console.error('Unexpected response status:', data?.status);
        throw new Error();
      }
    } catch (error) {
      console.error('Engagement action failed:', error);
      setSharedState((prevState: any) => ({
        ...prevState,
        notification: {
          showNotification: true,
          message: '',
          submessage: 'Error occured while adding item to board.',
          messageType: 'warning',
        },
      }));
    }
    return onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Update Board Details">
        <div className="flex flex-col items-center gap-5 rounded-lg border border-gray-300">
          <div className="group flex w-full flex-row items-stretch">
            <input
              type="text"
              name="title"
              value={boardTitle}
              onChange={(e: any) => setBoardTitle(e.target.value)}
              className="grow border-black bg-white px-3 py-2"
              placeholder="Board Title"
            />
          </div>

          <div className="group flex w-full flex-row items-stretch">
            <textarea
              name="title"
              value={boardDescription}
              onChange={(e: any) => setBoardDescription(e.target.value)}
              className="grow border-black bg-white px-3 py-2"
              placeholder="Board Description"
              rows={5}
            />
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button
            type="button"
            onClick={update}
            className="w-full grow-0 border-l-0"
          >
            Update
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default UpdateBoard;
