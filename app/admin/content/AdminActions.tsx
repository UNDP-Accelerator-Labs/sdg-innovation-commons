'use client';

import { useState } from 'react';
import { XCircle, MessageSquare, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/app/ui/components/Button';
import Modal from '@/app/ui/components/Modal';

interface Flag {
  id: number;
  content_id: number;
  content_title?: string;
  content_type: string;
  platform: string;
  reason: string;
  description?: string;
  status: string;
  reporter_name?: string;
  reporter_email?: string;
  created_at?: string;
  admin_response?: string;
}

interface AdminActionsProps {
  flag: Flag;
}

const REASON_LABELS: Record<string, string> = {
  inappropriate_content: 'Inappropriate Content',
  spam: 'Spam or Promotional Content',
  harassment: 'Harassment or Abuse',
  misinformation: 'Misinformation or False Claims',
  copyright_violation: 'Copyright Violation',
  other: 'Other'
};

export default function AdminActions({ flag }: AdminActionsProps) {
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'dismiss' | 'resolve' | 'respond' | 'remove' | 'reopen'>('dismiss');
  const [adminResponse, setAdminResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAction = (action: 'dismiss' | 'resolve' | 'respond' | 'remove' | 'reopen') => {
    setActionType(action);
    setAdminResponse('');
    setError(null);
    setSuccess(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
    setSuccess(null);
    setAdminResponse('');
  };

  const submitAction = async () => {
    if ((actionType === 'respond' || actionType === 'remove') && !adminResponse.trim()) {
      setError(`${actionType === 'respond' ? 'Response' : 'Removal reason'} is required`);
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

      const result = await response.json();
      setSuccess(result.message || `Successfully ${actionType === 'dismiss' ? 'dismissed' : actionType === 'resolve' ? 'resolved' : actionType === 'respond' ? 'responded to' : 'removed'} the flagged content.`);
      
      // Wait a moment to show success message, then reload
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Action failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to perform action');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine available actions based on current status
  const getAvailableActions = () => {
    const actions = [];
    
    // Always allow responding
    actions.push(
      <button
        key="respond"
        onClick={() => handleAction('respond')}
        className="inline-flex items-center px-2 py-1 text-xs bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 rounded"
        title="Respond to Reporter"
      >
        <MessageSquare className="h-3 w-3" />
      </button>
    );

    if (flag.status === 'pending') {
      actions.push(
        <button
          key="dismiss"
          onClick={() => handleAction('dismiss')}
          className="inline-flex items-center px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded"
          title="Dismiss Flag"
        >
          <XCircle className="h-3 w-3" />
        </button>
      );
    }

    if (flag.status !== 'resolved') {
      actions.push(
        <button
          key="resolve"
          onClick={() => handleAction('resolve')}
          className="inline-flex items-center px-2 py-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded"
          title="Mark as Resolved"
        >
          <CheckCircle className="h-3 w-3" />
        </button>
      );
    }

    if (flag.status !== 'removed') {
      actions.push(
        <button
          key="remove"
          onClick={() => handleAction('remove')}
          className="inline-flex items-center px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded"
          title="Remove Content"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      );
    }

    if (flag.status === 'dismissed' || flag.status === 'resolved') {
      actions.push(
        <button
          key="reopen"
          onClick={() => handleAction('reopen')}
          className="inline-flex items-center px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded"
          title="Reopen Flag"
        >
          <AlertTriangle className="h-3 w-3" />
        </button>
      );
    }

    return actions;
  };

  return (
    <>
      <div className="flex items-center gap-1 flex-wrap">
        {getAvailableActions()}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={handleCloseModal}
        title={
          actionType === 'dismiss' ? 'Dismiss Flag' :
          actionType === 'resolve' ? 'Resolve Flag' : 
          actionType === 'respond' ? 'Respond to Flag' : 
          actionType === 'remove' ? 'Remove Content' : 'Reopen Flag'
        }
      >
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="p-6 max-w-md mx-auto">
            <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">
              {flag.content_title || `${flag.content_type} #${flag.content_id}`}
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Reason:</strong> {REASON_LABELS[flag.reason] || flag.reason.replace(/_/g, ' ')}
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
               actionType === 'respond' ?
                'Send a response to the person who flagged this content.' :
               actionType === 'remove' ?
                'This will PERMANENTLY REMOVE the content from display and search results. This action cannot be undone.' :
                'This will reopen the flag for further review and change status back to pending.'}
            </p>
            
            {actionType === 'remove' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-sm text-red-700 font-medium">⚠️ Warning: Content Removal</p>
                <p className="text-sm text-red-600">
                  This action will set the content status to 0, remove it from public display, 
                  and remove it from NLP/search indexes. The reporter will be notified.
                </p>
              </div>
            )}
            
            {actionType === 'reopen' && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <p className="text-sm text-blue-700 font-medium">ℹ️ Reopening Flag</p>
                <p className="text-sm text-blue-600">
                  This will change the flag status back to pending and allow for additional review. 
                  The reporter may be notified depending on your response.
                </p>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {actionType === 'dismiss' ? 'Admin Notes (optional)' : 
               actionType === 'resolve' ? 'Resolution Notes (optional)' : 
               actionType === 'respond' ? 'Response to Reporter *' :
               actionType === 'remove' ? 'Removal Reason *' :
               'Reason for Reopening (optional)'}
            </label>
            <textarea
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={
                actionType === 'dismiss' ? 'Internal notes about why this flag was dismissed...' :
                actionType === 'resolve' ? 'Explain how this issue was resolved...' :
                actionType === 'respond' ? 'Your response to the person who flagged this content...' :
                actionType === 'remove' ? 'Explain why this content is being removed (this will be sent to the reporter)...' :
                'Explain why this flag is being reopened...'
              }
              required={actionType === 'respond' || actionType === 'remove'}
            />
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <p className="text-sm text-green-600">{success}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="flex-1  text-gray-700 border-gray-300 !h-[40px] !text-[14px] !px-[20px]"
            >
              Cancel
            </Button>
            <Button
              onClick={submitAction}
              disabled={isSubmitting || (actionType === 'respond' && !adminResponse.trim()) || (actionType === 'remove' && !adminResponse.trim())}
              className={`flex-1 !h-[40px] !text-[14px] !px-[20px] 
              `}
            >
              {isSubmitting ? 'Processing...' : 
               actionType === 'dismiss' ? 'Dismiss' :
               actionType === 'resolve' ? 'Resolve' : 
               actionType === 'respond' ? 'Send Response' : 
               actionType === 'remove' ? 'Remove Content' : 'Reopen Flag'}
            </Button>
          </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
