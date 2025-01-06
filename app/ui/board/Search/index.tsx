'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/components/Button';
import DropDown from '@/app/ui/components/DropDown';
import { MenuItem } from '@headlessui/react';
import UpdateBoardModal from '@/app/ui/board/Update';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import { publish } from '@/app/lib/data/board/main';
import Share from '@/app/ui/board/Share';
import Link from 'next/link';
import DeleteBoard from '@/app/ui/board/Delete';
import RequestBoardContribution from '@/app/ui/board/Request';
import ApproveBoardContribution from '@/app/ui/board/Approve';
import { useRouter } from 'next/navigation';

interface Props {
  searchParams: any;
  title?: string | undefined;
  description?: string | undefined;
  id: number;
  status: number;
  is_contributor: boolean;
  platform?: string;
  total?: number;
}

export default function Section({
  searchParams,
  title,
  description,
  id,
  status,
  is_contributor,
  platform,
  total,
}: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.search || ''
  );

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isRequestOpen, setRequestOpen] = useState<boolean>(false);
  const [isApproveOpen, setApproveOpen] = useState<boolean>(false);

  const { sharedState, setSharedState } = useSharedState();
  const { isLogedIn } = sharedState || {};

  const updateBoard = (e: any) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const publishBoard = async (e: any) => {
    e.preventDefault();
    await publish(status, id);
    const form = e.target.closest('form');
    form.submit();
  };

  const handleShare = (e: any) => {
    e.preventDefault();
    setSharedState((prevState: any) => ({
      ...prevState,
      share: {
        _isModalOpen: true,
        boardId: id,
        platform,
        is_contributor,
        title,
        email: '',
      },
    }));
  };

  const updateUrl = (title: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete('title');
    const updatedQuery =
      new URLSearchParams({ title }).toString() + '&' + params.toString();
    router.push(`?${updatedQuery}`);
  };

  useEffect(() => {
    const { share, title: _title } = searchParams;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (id && title && !_title) {
      updateUrl(title);
    }

    if (share?.length && emailRegex.test(share)) {
      setApproveOpen(true);
    }
  }, [searchParams]);

  return (
    <>
      <form
        id="search-form"
        method="GET"
        className="section-header relative pb-[40px] lg:pb-[80px]"
      >
        <div className="group col-span-9 flex flex-row items-stretch lg:col-span-4">
          <input
            type="text"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="grow !border-r-0 border-black bg-white"
            id="main-search-bar"
            placeholder="What are you looking for?"
          />
          <Button type="submit" className="grow-0 border-l-0">
            Search
          </Button>
        </div>
        <div className="col-span-5 col-start-5 flex flex-row gap-x-5 md:col-span-2 md:col-start-8 lg:col-span-1 lg:col-end-10">
          {isLogedIn ? (
            <DropDown>
              {is_contributor && (
                <>
                  <MenuItem
                    as="button"
                    className="w-full bg-white text-start hover:bg-lime-yellow"
                  >
                    <div
                      className="block cursor-pointer border-none bg-inherit p-4 text-base text-inherit focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
                      onClick={updateBoard}
                    >
                      Update board details
                    </div>
                  </MenuItem>

                  {total && total > 0 ? (
                    <MenuItem
                      as="button"
                      type="submit"
                      className={
                        'w-full bg-white text-start hover:bg-lime-yellow'
                      }
                    >
                      <div
                        className="block cursor-pointer border-none bg-inherit p-4 text-base text-inherit focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
                        onClick={publishBoard}
                      >
                        {status < 3 ? 'Publish board' : 'Unpublish board'}
                      </div>
                    </MenuItem>
                  ) : (
                    ''
                  )}
                  <MenuItem
                    as="button"
                    type="submit"
                    className={
                      'w-full bg-white text-start hover:bg-lime-yellow'
                    }
                  >
                    <div
                      className="block cursor-pointer border-none bg-inherit p-4 text-base text-inherit focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
                      onClick={handleShare}
                    >
                      Grant Contributor Access
                    </div>
                  </MenuItem>
                  <MenuItem
                    as="button"
                    type="submit"
                    className={
                      'w-full bg-white text-start hover:bg-lime-yellow'
                    }
                  >
                    <div
                      className="block cursor-pointer border-none bg-inherit p-4 text-base text-inherit focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
                      onClick={(e) => {
                        e.preventDefault();
                        setDeleteOpen(true);
                      }}
                    >
                      Delete
                    </div>
                  </MenuItem>
                  <MenuItem
                    as="button"
                    type="submit"
                    className={
                      'w-full bg-white text-start hover:bg-lime-yellow'
                    }
                  >
                    <Link
                      className="block cursor-pointer border-none bg-inherit p-4 text-base text-inherit focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
                      href="/search/all"
                      passHref
                    >
                      Add more to board
                    </Link>
                  </MenuItem>
                </>
              )}

              {!is_contributor && (
                <MenuItem
                  as="button"
                  className="w-full bg-white text-start hover:bg-lime-yellow"
                >
                  <div
                    className="block cursor-pointer border-none bg-inherit p-4 text-base text-inherit focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      setRequestOpen(true);
                    }}
                  >
                    Request contributor access
                  </div>
                </MenuItem>
              )}
            </DropDown>
          ) : (
            ''
          )}
        </div>
      </form>

      <UpdateBoardModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        id={id}
        title={title}
        description={description}
      />

      <DeleteBoard
        id={id}
        isOpen={isDeleteOpen}
        onClose={() => setDeleteOpen(false)}
      />

      <RequestBoardContribution
        id={id}
        isOpen={isRequestOpen}
        onClose={() => setRequestOpen(false)}
      />

      <ApproveBoardContribution
        id={id}
        isOpen={isApproveOpen}
        onClose={() => setApproveOpen(false)}
        user={searchParams.share}
        title={title}
      />

      <Share />
    </>
  );
}
