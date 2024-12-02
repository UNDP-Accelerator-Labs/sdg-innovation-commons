import React, { FC, useState } from "react";
import Modal from "./index";
import { Button } from "@/app/ui/components/Button";
import { pin } from '@/app/lib/data/platform-api';

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
    setMessage,
    setMessageType,
    setSubMessage,
    setShowNotification
}) => {
    if (!isOpen) return null;

    const [collections, setCollections] = useState<Collection[]>(
        boards.map((b: any) => ({
            name: b?.title,
            id: b?.pinboard_id,
            count: b?.total,
            description: b?.description
        })) || []
    );
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [boardId, setBoardId] = useState<number>(0);

    const filteredCollections = collections.filter((collection) =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    let source = platform;
    if(['news', 'blog', 'publications', 'press release'].includes(platform)) source = 'blog'

    type ActionType = 'delete' | 'insert';

    const pinApi = async (action: ActionType,) => {
        try {
            const data = await pin(source, action, boardId, id, searchTerm);
            if (data?.status === 200) {
                setMessage('')
                setMessageType('success')
                setSubMessage(data?.message || '')

                setShowNotification(true)
            } else {
                console.error('Unexpected response status:', data?.status);
                throw new Error
            }
        } catch (error) {
            console.error('Engagement action failed:', error);
            setMessage('')
            setMessageType('warning')
            setSubMessage('Error occured while adding item to board.')

            setShowNotification(true)
        }
        return onClose()
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Add to Board"
            >
                {/* Search Input */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <div className="w-full flex flex-row group items-stretch">
                        <input
                            type="text"
                            name="search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="bg-white border-black !border-r-0 grow px-3 py-2"
                            id="search-bar"
                            placeholder="Find board"
                        />
                        <Button type="button" className="border-l-0 grow-0">
                            🔍
                        </Button>
                    </div>
                </div>

                {/* Board List */}
                <div className="space-y-2 overflow-y-auto max-h-60 my-4">
                    <fieldset>
                        {filteredCollections.length > 0 ? (
                            filteredCollections.map((item, index) => (

                                <div key={index} className="flex items-center my-1">
                                    <input
                                        id={item.name}
                                        type="checkbox"
                                        className="mr-2 border-solid border-1 hover:border-light-blue "
                                        // defaultChecked={true}
                                        name={item.name}
                                        value={item.id}
                                        onChange={() => setBoardId(item.id)}
                                    />
                                    <label className="flex-grow text-gray-800">{item.name}</label>
                                    <span className="text-gray-500">{item.count}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-center">
                                No boards found. Create a new one!
                            </p>
                        )}

                    </fieldset>
                </div>

                {/* Add or Create Button */}
                <div className="text-center mt-4">
                    <Button type='button' disabled={boardId === 0 && filteredCollections.length > 0 } onClick={() => pinApi('insert')} className='border-l-0 grow-0'>
                        {filteredCollections.length > 0 ? "Add to Board" : "Create New Board"}
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default AddToBoard;
