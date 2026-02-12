"use client";

import { useRouter } from 'next/navigation';
import { addComment, deleteComment } from '@/app/lib/data/platform';
import clsx from 'clsx';
import { Button } from '@/app/ui/components/Button';
import { useState } from 'react';
import { useSharedState } from '@/app/ui/components/SharedState/Context';

interface Comment {
  date: string;
  message: string;
  ownername: string;
  message_id: number;
  response_to_message_id: number | null;
  replies: Comment[];
  user_id?: string;
  rights?: number;
}

interface CommentSectionProps {
  platform: string;
  padId: number;
  comments: Comment[];
}

export default function CommentSection({ platform, padId, comments }: CommentSectionProps) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [showAllReplies, setShowAllReplies] = useState<{ [key: number]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sharedState } = useSharedState();
  const { isLogedIn, session } = sharedState || {};
  const { rights, uuid } = session || {};

  const handleCommentSubmit = async (newComment: string, parentId: number | null = null) => {
    if (isSubmitting) return; // Prevent duplicate submissions
    
    try {
      setIsSubmitting(true);
      await addComment(platform, newComment, padId, parentId ?? undefined);
      if (parentId === null) {
        (document.getElementById('newComment') as HTMLInputElement).value = ''; // Clear input field
      } else {
        (document.getElementById(`replyComment-${parentId}`) as HTMLInputElement).value = ''; // Clear reply field
        setReplyingTo(null); // Close reply field
      }
      router.refresh();
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (messageId: number) => {
    try {
      await deleteComment(platform, messageId);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const buildCommentTree = (comments: Comment[]): (Comment & { replies: Comment[] })[] => {
    const commentMap: { [key: number]: Comment & { replies: Comment[] } } = {};
    const roots: (Comment & { replies: Comment[] })[] = [];
  
    comments.forEach((comment) => {
      commentMap[comment.message_id] = { ...comment, replies: [] };
    });
  
    comments.forEach((comment) => {
      if (comment.response_to_message_id) {
        commentMap[comment.response_to_message_id]?.replies.push(commentMap[comment.message_id]);
      } else {
        roots.push(commentMap[comment.message_id]);
      }
    });
  
    return roots.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort roots by most recent
  };

  const renderComments = (comments: (Comment & { replies: Comment[] })[], depth = 0) => {
    return comments.map((comment) => {
      const formattedDate = new Date(comment.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const displayedReplies = showAllReplies[comment.message_id]
        ? comment.replies
        : comment.replies.slice(0, 2);

      return (
        <div key={comment.message_id} className={`mb-[20px] mt-[-1px] box-border border-[1px] border-solid p-[20px] pb-0 ml-[${depth * 20}px]`}>
          <p className="mb-[5px] font-bold">{comment.ownername || ''}</p>
          <p className="mb-[5px] text-sm text-gray-500">{formattedDate}</p>
          <p className="text-sm">{comment.message || ''}</p>
          {isLogedIn && (
            <button
              className="text-sm text-blue-500 hover:underline border-none bg-transparent cursor-pointer"
              onClick={() => setReplyingTo(replyingTo === comment.message_id ? null : comment.message_id)}
            >
              Reply
            </button>
          )}
          {(isLogedIn && (uuid === comment.user_id)) && (
            <button
              className="text-sm text-red-500 hover:underline border-none bg-transparent cursor-pointer"
              onClick={() => handleDeleteComment(comment.message_id)}
            >
              Delete
            </button>
          )}
          {replyingTo === comment.message_id && (
            <div className="mt-[10px] flex items-center">
              <input
                type="text"
                id={`replyComment-${comment.message_id}`}
                placeholder="Write a reply..."
                className="flex-1 border-[1px] border-solid p-[10px] h-[40px]"
              />
              <Button
                className={clsx(
                  '!h-[40px] grow-0 border-l-0 !text-[14px]',
                  '!px-[20px]'
                )}
                disabled={isSubmitting}
                onClick={() => {
                  const replyComment = (document.getElementById(`replyComment-${comment.message_id}`) as HTMLInputElement).value;
                  if (replyComment.trim()) {
                    handleCommentSubmit(replyComment, comment.message_id);
                  }
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          )}
          <div className="my-[20px]">
            {displayedReplies.length > 0 && renderComments(displayedReplies, depth + 1)}
            {comment.replies.length > 2 && (
              <button
                className="text-sm text-blue-500 hover:underline border-none bg-transparent cursor-pointer mt-[10px]"
                onClick={() =>
                  setShowAllReplies((prev) => ({
                    ...prev,
                    [comment.message_id]: !prev[comment.message_id],
                  }))
                }
              >
                {showAllReplies[comment.message_id] ? 'Show less replies' : 'Show more replies'}
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  const commentTree = buildCommentTree(comments);
  const displayedComments = showAll ? commentTree : commentTree.slice(0, 3);

  return (
    <div id="comments" className="inner xxl:px-[80px] mx-auto grid w-[375px] grid-cols-9 gap-[20px] px-[20px] md:w-[744px] lg:w-[1440px] lg:px-[80px] xl:px-[40px]">
      <div className="col-span-9 lg:col-span-5">
        <h3 className="font-space-mono">Comments</h3>
        <hr className="mt-[-30px] border-t-[1px] border-gray-300" />
        {isLogedIn ? (
          <div className="mb-[20px] mt-[20px] flex items-center">
            <input
              type="text"
              id="newComment"
              placeholder="Comment publicly."
              className="flex-1 border-[1px] border-solid p-[10px] h-[60px]"
            />
            <Button
              className={clsx(
                '!h-[60px] grow-0 border-l-0 !text-[14px]',
                '!px-[20px]'
              )}
              disabled={isSubmitting}
              onClick={() => {
                const newComment = (document.getElementById('newComment') as HTMLInputElement).value;
                if (newComment.trim()) {
                  handleCommentSubmit(newComment);
                }
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-[20px] mt-[20px]">
            Log in to add a comment or reply.
          </p>
        )}
        {renderComments(displayedComments)}
        {commentTree.length > 3 && (
          <Button
            className={clsx(
              'mt-[10px] !text-[14px]',
              '!px-[20px]'
            )}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show less' : 'Show more'}
          </Button>
        )}
      </div>
    </div>
  );
}
