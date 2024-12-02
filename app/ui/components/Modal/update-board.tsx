import React, { FC, useState } from "react";
import { usePathname } from 'next/navigation'
import Modal from "./index";
import { Button } from "@/app/ui/components/Button";
import { updatePinboard } from '@/app/lib/data/platform-api';


interface Props {
    isOpen: boolean;
    onClose: () => void;
    id: number;

    title?: string,
    description?: string,

    setMessage?: any;
    setSubMessage?: any;
    setMessageType?: any;
    setShowNotification?: any;
}

const UpdateBoard: FC<Props> = ({
    isOpen,
    onClose,
    id,
    title,
    description,
    setMessage,
    setMessageType,
    setSubMessage,
    setShowNotification
}) => {
    if (!isOpen) return null;

    const [boardTitle, setBoardTitle] = useState<string>(title || "");
    const [boardDescription, setBoardDescription] = useState<string>(description || "");

    const pathname = usePathname();

    const update = async () => {
        try {
            const data = await updatePinboard(id, boardTitle, boardDescription);
            if (data?.status === 200) {
                setMessage('')
                setMessageType('success')
                setSubMessage(data?.message || '')

                setShowNotification(true)

                window.history.replaceState(null, '', pathname);
                window.location.reload();
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
                title="Update Board Details"
            >
                <div className="flex flex-col items-center border border-gray-300 rounded-lg gap-5 ">
                    <div className="w-full flex flex-row group items-stretch">
                        <input
                            type="text"
                            name="title"
                            value={boardTitle}
                            onChange={(e:any)=> setBoardTitle(e.target.value)}
                            className="bg-white border-black grow px-3 py-2"
                            placeholder="Board Title"
                        />
                    </div>

                    <div className="w-full flex flex-row group items-stretch">
                        <textarea
                            name="title"
                            value={boardDescription}
                            onChange={(e:any)=> setBoardDescription(e.target.value)}
                            className="bg-white border-black grow px-3 py-2"
                            placeholder="Board Description"
                            rows={5}
                        />
                    </div>

                </div>

                <div className="text-center mt-10">
                    <Button type='button' onClick={update} className='w-full border-l-0 grow-0'>
                        Update
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default UpdateBoard;
