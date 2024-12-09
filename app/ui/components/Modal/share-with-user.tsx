import React, { useState, useEffect } from 'react';
import Modal from './index';
import { Button } from '@/app/ui/components/Button';
import platformApi from '@/app/lib/data/platform-api';
import clsx from 'clsx';

export default function Share() {
  const [collections, setCollections] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const filteredCollections = collections.filter((collection) =>
    collection?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await platformApi({}, 'solution', 'contributors');
      console.log(data);
      if (Array.isArray(data) && data?.length) {
        setCollections(data);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <Modal
        isOpen={true}
        onClose={() => true}
        title="Share with other contributors."
      >
        {/* Search Input */}
        <div
          className={clsx(
            'flex items-center overflow-hidden rounded-lg border border-gray-300',
            loading && 'animate-pulse bg-gray-200'
          )}
        >
          <div
            className={clsx(
              'group flex w-full flex-row items-stretch',
              loading && 'animate-pulse bg-gray-200'
            )}
          >
            <input
              type="text"
              name="search"
              value={searchTerm}
              onChange={handleSearchChange}
              className={clsx(
                'grow !border-r-0 border-black bg-white px-3 py-2',
                loading && 'bg-gray-200 text-transparent'
              )}
              id="search-bar"
              placeholder="Find User"
              disabled={loading}
            />
            <Button
              type="button"
              className={clsx(
                'grow-0 border-l-0',
                loading && 'bg-gray-200 text-transparent'
              )}
              disabled={loading}
            >
              🔍
            </Button>
          </div>
        </div>

        {/* List */}
        <div
          className={clsx(
            'my-4 max-h-60 space-y-2 overflow-y-auto',
            loading && 'animate-pulse'
          )}
        >
          <fieldset>
            {loading ? (
              <div className="space-y-2">
                {/* Placeholder for list items */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-8 rounded bg-gray-200" />
                ))}
              </div>
            ) : filteredCollections.length > 0 ? (
              filteredCollections.map((item, index) => {
                const activeBoard = true;
                return (
                  <div key={index} className="my-1 flex items-center">
                    <input
                      id={item.name}
                      type="checkbox"
                      className="border-1 mr-2 border-solid hover:border-light-blue disabled:checked:text-gray-500"
                      name={item.name}
                      value={item.email}
                    />
                    <label
                      className={clsx(
                        'flex-grow',
                        activeBoard ? 'text-gray-500' : 'text-gray-800'
                      )}
                    >
                      {item.name}
                    </label>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-sm">
                No contributors found. Try another search!
              </p>
            )}
          </fieldset>
        </div>

        <div className="mt-4 text-center">
          <Button
            type="button"
            className={clsx(
              'w-full grow-0 border-l-0',
              loading && 'bg-gray-200 text-transparent'
            )}
            disabled={loading}
          >
            Share
          </Button>
        </div>
      </Modal>
    </>
  );
}
