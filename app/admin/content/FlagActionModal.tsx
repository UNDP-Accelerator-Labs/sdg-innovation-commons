'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/components/Button';
import { XCircle, MessageSquare, CheckCircle } from 'lucide-react';
import Modal from '@/app/ui/components/Modal';

interface FlagActionModalProps {
  flag: any;
}

export default function FlagActionModal({ flag }: FlagActionModalProps) {
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'dismiss' | 'resolve' | 'respond'>('dismiss');
  const [adminResponse, setAdminResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = (action: 'dismiss' | 'resolve' | 'respond') => {
    setActionType(action);
    setAdminResponse('');
    setError(null);
    setShowModal(true);
  };

  const submitAction = async () => {
    if (actionType === 'respond' && !adminResponse.trim()) {
      setError('Response is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/content/flag-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flagId: flag.id,
          action: actionType,
          adminResponse: adminResponse.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to perform action');
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform action');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleAction('dismiss')}
          className="inline-flex items-center px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded"
          title="Dismiss Flag"
        >
          <XCircle className="h-3 w-3" />
        </button>
        
        <button
          onClick={() => handleAction('respond')}
          className="inline-flex items-center px-2 py-1 text-xs bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 rounded"
          title="Respond to Reporter"
        >
          <MessageSquare className="h-3 w-3" />
        </button>
        
        <button
          onClick={() => handleAction('resolve')}
          className="inline-flex items-center px-2 py-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded"
          title="Mark as Resolved"
        >
          <CheckCircle className="h-3 w-3" />
        </button>
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={
          actionType === 'dismiss' ? 'Dismiss Flag' :
          actionType === 'resolve' ? 'Resolve Flag' : 'Respond to Flag'
        }
      >
        <div className="p-6 max-w-md mx-auto">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">
              {flag.content_title || `${flag.content_type} #${flag.content_id}`}
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Reason:</strong> {flag.reason.replace(/_/g, ' ')}
            </p>
            {flag.description && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>Description:</strong> {flag.description}
              </p>
            )}
            <p className="text-sm text-gray-600">
              <strong>Reporter:</strong> {flag.reporter_name || flag.reporter_email || 'Anonymous'}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              {actionType === 'dismiss' ? 
                'This will mark the flag as dismissed. The reporter will not receive any notification.' :
               actionType === 'resolve' ?
                'This will mark the flag as resolved. You can optionally send a response to the reporter.' :
                'Send a response to the person who flagged this content.'}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {actionType === 'dismiss' ? 'Admin Notes (optional)' : 
               actionType === 'resolve' ? 'Resolution Notes (optional)' : 
               'Response to Reporter *'}
            </label>
            <textarea
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={
                actionType === 'dismiss' ? 'Internal notes about why this flag was dismissed...' :
                actionType === 'resolve' ? 'Explain how this issue was resolved...' :
                'Your response to the person who flagged this content...'
              }
              required={actionType === 'respond'}
            />
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 text-gray-700 border-gray-300 !h-[40px] !text-[14px] !px-[20px]"
            >
              Cancel
            </Button>
            <Button
              onClick={submitAction}
              disabled={isSubmitting || (actionType === 'respond' && !adminResponse.trim())}
              className={`flex-1 text-white !h-[40px] !text-[14px] !px-[20px] `}
            >
              {isSubmitting ? 'Processing...' : 
               actionType === 'dismiss' ? 'Dismiss' :
               actionType === 'resolve' ? 'Resolve' : 'Send Response'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
