'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/ui/components/Button';
import Modal from '@/app/ui/components/Modal';
import { Flag, X } from 'lucide-react';
import { useSharedState } from '@/app/ui/components/SharedState/Context';


interface FlagContentProps {
  contentId: string | number;
  platform: string;
  contentType?: string;
  contentTitle?: string;
  contentUrl?: string;
}

const REASON_OPTIONS = [
  { value: 'inappropriate_content', label: 'Inappropriate Content' },
  { value: 'spam', label: 'Spam or Promotional Content' },
  { value: 'harassment', label: 'Harassment or Abuse' },
  { value: 'misinformation', label: 'Misinformation or False Claims' },
  { value: 'copyright_violation', label: 'Copyright Violation' },
  { value: 'other', label: 'Other' }
];

export default function FlagContent({
  contentId,
  platform,
  contentType = 'pad',
  contentTitle,
  contentUrl
}: FlagContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentUrl, setCurrentUrl] = useState<string>('');

  const { sharedState } = useSharedState();
  const isLoggedIn = sharedState?.isLogedIn;

  // Capture current URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const resetForm = () => {
    setSelectedReason('');
    setDescription('');
    setSubmitStatus('idle');
    setErrorMessage('');
  };

  const handleOpenModal = () => {
    if (!isLoggedIn) {
      alert('Please sign in to flag content.');
      return;
    }
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReason) {
      setErrorMessage('Please select a reason for flagging this content.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/content/flag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId: String(contentId),
          platform,
          contentType,
          reason: selectedReason,
          description: description.trim() || undefined,
          contentTitle,
          contentUrl:  window.location.href || currentUrl // Use captured current URL
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Failed to flag content. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return null; // Don't show flag button to non-logged-in users
  }

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className="text-gray-600 hover:text-red-600 border-gray-300 hover:border-red-300 bg-transparent hover:bg-red-50 !h-[36px] !text-[14px] !px-[16px]"
      >
        <Flag className="h-4 w-4 mr-2" />
        Flag Content
      </Button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Flag Content">
        <div className="p-6 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Flag Content</h3>
          </div>

          {submitStatus === 'success' ? (
            <div className="text-center py-4">
              <div className="text-green-600 mb-2">
                <Flag className="h-8 w-8 mx-auto mb-2" />
              </div>
              <h4 className="text-lg font-semibold text-green-800 mb-2">
                Content Flagged Successfully
              </h4>
              <p className="text-green-700 text-sm">
                Thank you for your report. An administrator will review this content shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Why are you flagging this content? Your report will be reviewed by our moderation team.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for flagging *
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a reason...</option>
                  {REASON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional details (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please provide any additional context about why you're flagging this content..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length}/500 characters
                </p>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 h-[60px] font-bold font-space-mono text-[18px] px-[40px]"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedReason}
                >
                  {isSubmitting ? 'Flagging...' : 'Flag Content'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}
