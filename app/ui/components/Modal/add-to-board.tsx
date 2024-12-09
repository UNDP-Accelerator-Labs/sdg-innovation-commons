import React, { FC, useState } from 'react';
import Modal from './index';
import { Button } from '@/app/ui/components/Button';
import { pin } from '@/app/lib/data/platform-api';
import clsx from 'clsx';

interface Collection {
  name: string;
  count: number;
  id: number;
  description: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  boards: any[];
  platform: string;
  id: number | number[];
  pinboards?: any[];

  setMessage: any;
  setSubMessage: any;
  setMessageType: any;
  setShowNotification: any;
}

const AddToBoard: FC<Props> = ({
  isOpen,
  onClose,
  boards,
  platform,
  id,
  pinboards,
  setMessage,
  setMessageType,
  setSubMessage,
  setShowNotification,
}) => {
  if (!isOpen) return null;

  const [collections, setCollections] = useState<Collection[]>(
    boards.map((b: any) => ({
      name: b?.title,
      id: b?.pinboard_id,
      count: b?.total,
      description: b?.description,
    })) || []
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [boardId, setBoardId] = useState<number>(0);

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  let source = platform;
  if (['news', 'blog', 'publications', 'press release'].includes(platform))
    source = 'blog';

  type ActionType = 'delete' | 'insert';

  const pinApi = async (action: ActionType) => {
    try {
      const data = await pin(source, action, boardId, id, searchTerm);
      if (data?.status === 200) {
        setMessage('');
        setMessageType('success');
        setSubMessage(data?.message || '');

        setShowNotification(true);
      } else {
        console.error('Unexpected response status:', data?.status);
        throw new Error();
      }
    } catch (error) {
      console.error('Engagement action failed:', error);
      setMessage('');
      setMessageType('warning');
      setSubMessage('Error occured while adding item to board.');

      setShowNotification(true);
    }
    return onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Add to Board">
        {/* Search Input */}
        <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
          <div className="group flex w-full flex-row items-stretch">
            <input
              type="text"
              name="search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="grow !border-r-0 border-black bg-white px-3 py-2"
              id="search-bar"
              placeholder="Find board"
            />
            <Button type="button" className="grow-0 border-l-0">
              🔍
            </Button>
          </div>
        </div>

        {/* Board List */}
        <div className="my-4 max-h-60 space-y-2 overflow-y-auto">
          <fieldset>
            {filteredCollections.length > 0 ? (
              filteredCollections.map((item, index) => {
                const activeBoard = !!pinboards?.find(
                  (p) => p?.pinboard_id === item.id
                );
                return (
                  <div key={index} className="my-1 flex items-center">
                    <input
                      id={item.name}
                      type="radio"
                      className="border-1 mr-2 border-solid hover:border-light-blue disabled:checked:text-gray-500"
                      disabled={activeBoard}
                      name={activeBoard ? item.name : 'boardSelection'}
                      value={item.id}
                      onChange={() => setBoardId(item.id)}
                      checked={activeBoard || boardId === item.id}
                    />
                    <label
                      className={clsx(
                        'flex-grow',
                        activeBoard ? 'text-gray-500' : 'text-gray-800'
                      )}
                    >
                      {item.name}
                    </label>
                    <span className="text-gray-500">{item.count}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-sm">
                No boards found. Create a new one!
              </p>
            )}
          </fieldset>
        </div>

        {/* Add or Create Button */}
        <div className="mt-4 text-center">
          <Button
            type="button"
            disabled={boardId === 0 && filteredCollections.length > 0}
            onClick={() => pinApi('insert')}
            className="w-full grow-0 border-l-0"
          >
            {filteredCollections.length > 0
              ? 'Add to Board'
              : 'Create New Board'}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AddToBoard;
