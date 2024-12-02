'use client';
import { useState } from 'react';
import { Button } from '@/app/ui/components/Button';
import DropDown from '@/app/ui/components/DropDown';
import { MenuItem } from '@headlessui/react'
import UpdateBoardModal from '@/app/ui/components/Modal/update-board';
import Notification from '@/app/ui/components/Notification';

interface Props {
    searchParams: any;
    title?: string | undefined;
    description?: string | undefined;
    id: number;
}

export default function Section({
    searchParams,
    title,
    description,
    id
}: Props) {
    const { search } = searchParams;
    const [filterVisibility, setFilterVisibility] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>(searchParams.search || '');

    //Notification DOM states
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState<string>("Action Required!");
    const [submessage, setSubMessage] = useState<string>("You need to log in to engage with this post.");
    const [messageType, setMessageType] = useState<string>("warning");
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const updateBoard = (e: any) => {
        e.preventDefault();
        setModalOpen(true)
    }

    return (
        <>
            <form id='search-form' method='GET' className='section-header relative pb-[40px] lg:pb-[80px]'>
                <div className='col-span-9 lg:col-span-4 flex flex-row group items-stretch'>
                    <input type='text' name='search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='What are you looking for?' />
                    <Button type='submit' className='border-l-0 grow-0'>
                        Search
                    </Button>
                </div>
                <div className='col-span-5 col-start-5 md:col-span-2 md:col-start-8 lg:col-end-10 lg:col-span-1 flex flex-row gap-x-5'>
                    <button type='button' className='w-full h-[60px] text-[18px] bg-white border-black border-[1px] flex justify-center items-center' onClick={(e) => setFilterVisibility(!filterVisibility)}>
                        <img src='/images/icon-filter.svg' alt='Filter icon' className='mr-[10px]' />
                        {!filterVisibility ? (
                            'Filters'
                        ) : (
                            'Close'
                        )}
                    </button>

                    <DropDown>
                        <MenuItem as="button" className={'bg-white'}>
                            <div
                                className="block p-4 text-inherit text-base focus:bg-gray-100 focus:text-gray-900 focus:outline-none bg-inherit border-none cursor-pointer"
                                onClick={updateBoard}
                            >
                                Update Board Details
                            </div>
                        </MenuItem>
                    </DropDown>
                </div>
                <div className='col-span-9'>
                    {/*<Filters 
                    className={clsx(filterVisibility ? '' : 'hidden')}
                    searchParams={searchParams}
                />*/}
                </div>
            </form>

            <UpdateBoardModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                id={id}
                title={title}
                description={description}

                setMessage={setMessage}
                setSubMessage={setSubMessage}
                setMessageType={setMessageType}
                setShowNotification={setShowNotification}
            />

            {showNotification && (
                <Notification
                    message={message}
                    subMessage={submessage}
                    type={messageType}
                />

            )}
        </>
    )
}