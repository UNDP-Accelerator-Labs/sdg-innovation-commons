import React, { FC, useState } from 'react';
import Modal from './index';
import { Button } from '@/app/ui/components/Button';
import { pin } from '@/app/lib/data/platform-api';
import clsx from 'clsx';
import { useRouter } from 'next/navigation'

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

  allObjectIdz?: Record<string, number[]>;
}

const AddToBoard: FC<Props> = ({
  isOpen,
  onClose,
  boards,
  platform,
  id,
  allObjectIdz,
  pinboards,
  setMessage,
  setMessageType,
  setSubMessage,
  setShowNotification,
}) => {
  if (!isOpen) return null;

  const router = useRouter()

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
  if (['news', 'blog', 'publications', 'press release'].includes(platform)) {
    source = 'blog';
  }
  
  type ActionType = 'delete' | 'insert';
  
  const pinApi = async (action: ActionType) => {
    try {
      if (allObjectIdz && Object.keys(allObjectIdz).length > 0) {
        const apiPromises = Object.entries(allObjectIdz).map(([key, ids]) =>{
          let _source = key
          if (['news', 'blog', 'publications', 'press release'].includes(key)) {
            _source = 'blog';
          }
          return pin(_source, action, boardId, ids, searchTerm)
      });
  
        const results = await Promise.all(apiPromises);
  
        const allSuccess = results.every(data => data?.status === 200);
  
        if (allSuccess) {
          setMessage('');
          setMessageType('success');
          setSubMessage('All cards successfully processed.');
          setShowNotification(true);
  
          // Redirect if needed
          if (!boardId && searchTerm) return router.push(`/boards/all/${results[0]?.board_id}`);
        } else {
          console.error('One or more API calls failed:', results);
          throw new Error('Some API calls failed');
        }
      } else {
        const data = await pin(source, action, boardId, id, searchTerm);
        if (data?.status === 200) {
          setMessage('');
          setMessageType('success');
          setSubMessage('Successfully added card to board.');
          setShowNotification(true);
  
          if (!boardId && searchTerm) return router.push(`/boards/all/${data?.board_id}`);
        } else {
          console.error('Unexpected response status:', data?.status);
          throw new Error();
        }
      }
    } catch (error) {
      console.error('Engagement action failed:', error);
      setMessage('');
      setMessageType('warning');
      setSubMessage('Error occurred while adding items to board.');
      setShowNotification(true);
    }
    return onClose();
  };
  

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Add to Board">
        <p className="text-left text-sm text-gray-500">
          To create a new board, enter the desired name and click "Create New Board." Alternatively, select an existing board from the list to add items.
        </p>
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
