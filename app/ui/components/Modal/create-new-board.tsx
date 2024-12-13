"use client";
import React, { FC, useEffect, useState } from "react";
import Modal from "./index";
import { Button } from "@/app/ui/components/Button";
import { updatePinboard } from '@/app/lib/data/platform-api';
import { useRouter } from 'next/navigation'

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const CreateBoard: FC<Props> = ({
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;

    const router = useRouter()

    const [boardTitle, setBoardTitle] = useState<string>("");
    const [boardDescription, setBoardDescription] = useState<string>("");
    const [ disabled, setDisabled] = useState<boolean>(false)
    const [ loading, setLoading] = useState<boolean>(false)

    const create = async () => {
        setLoading(true)
        try {
            const data = await updatePinboard(null,boardTitle, boardDescription);
            console.log('data ', data)
            if (data?.status === 200) {
                return router.push(`/boards/all/${data?.board_id}`)
            } else {
                console.error('Unexpected response status:', data?.status);
                throw new Error
            }
        } catch (error) {
            console.error('Engagement action failed:', error);
        }
        setLoading(false)
        return onClose()
    };

    useEffect(()=>{
        const disabled = boardTitle.length > 1 && boardDescription.length > 2
        setDisabled(!disabled)
    }, [boardDescription, boardTitle])
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Create new board"
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
                    <Button disabled={disabled || loading} type='button' onClick={create} className='w-full border-l-0 grow-0'>
                      {loading ? 'Creating...' : 'Create'}  
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default CreateBoard;
