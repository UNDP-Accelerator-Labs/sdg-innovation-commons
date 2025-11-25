'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/components/Button';
import { Flag, Eye, Trash2, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import Modal from '@/app/ui/components/Modal';

interface ContentFlag {
  id: string;
  content_id: string;
  platform: string;
  content_type: string;
  content_title: string | null;
  content_url: string | null;
  reason: string;
  description: string | null;
  reporter_uuid: string;
  reporter_name: string | null;
  reporter_email: string | null;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  admin_response: string | null;
  admin_uuid: string | null;
  admin_name: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

const REASON_LABELS: Record<string, string> = {
  inappropriate_content: 'Inappropriate Content',
  spam: 'Spam or Promotional Content',
  harassment: 'Harassment or Abuse',
  misinformation: 'Misinformation or False Claims',
  copyright_violation: 'Copyright Violation',
  other: 'Other'
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  dismissed: 'bg-gray-100 text-gray-800 border-gray-200'
};

export default function FlaggedContentList() {
  const [flags, setFlags] = useState<ContentFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlag, setSelectedFlag] = useState<ContentFlag | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'dismiss' | 'resolve' | 'respond'>('dismiss');
  const [adminResponse, setAdminResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content/flag');
      if (!response.ok) {
        throw new Error('Failed to fetch flagged content');
      }
      const data = await response.json();
      setFlags(data.flags || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch flagged content');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (flag: ContentFlag, action: 'dismiss' | 'resolve' | 'respond') => {
    setSelectedFlag(flag);
    setActionType(action);
    setAdminResponse('');
    setShowActionModal(true);
  };

  const submitAction = async () => {
    if (!selectedFlag) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/content/flag-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flagId: selectedFlag.id,
          action: actionType,
          adminResponse: adminResponse.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to perform action');
      }

      // Refresh the flags list
      await fetchFlags();
      setShowActionModal(false);
      setSelectedFlag(null);
      setAdminResponse('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform action');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
        <Button 
          onClick={fetchFlags}
          className="mt-2 bg-red-600 hover:bg-red-700 text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Flagged Content ({flags.length})
            </h2>
            <Button
              onClick={fetchFlags}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 !h-[40px] !text-[14px] !px-[20px]"
            >
              Refresh
            </Button>
          </div>
        </div>

        {flags.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No flagged content
            </h3>
            <p className="text-gray-500">
              All reported content has been reviewed or there are no reports yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {flags.map((flag) => (
              <div key={flag.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[flag.status]}`}>
                        {flag.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {REASON_LABELS[flag.reason] || flag.reason}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {flag.content_title || `${flag.content_type} #${flag.content_id}`}
                    </h3>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Platform:</span> {flag.platform}
                      </p>
                      <p>
                        <span className="font-medium">Reported by:</span> {flag.reporter_name || flag.reporter_email}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span> {new Date(flag.created_at).toLocaleDateString()}
                      </p>
                      {flag.description && (
                        <p>
                          <span className="font-medium">Description:</span> {flag.description}
                        </p>
                      )}
                      {flag.admin_response && (
                        <p>
                          <span className="font-medium">Admin Response:</span> {flag.admin_response}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {flag.content_url && (
                      <Button
                        onClick={() => window.open(flag.content_url!, '_blank')}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 !h-[36px] !text-[12px] !px-[12px]"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}

                    {flag.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleAction(flag, 'dismiss')}
                          className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 !h-[36px] !text-[12px] !px-[12px]"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                        
                        <Button
                          onClick={() => handleAction(flag, 'respond')}
                          className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200 !h-[36px] !text-[12px] !px-[12px]"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Respond
                        </Button>
                        
                        <Button
                          onClick={() => handleAction(flag, 'resolve')}
                          className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 !h-[36px] !text-[12px] !px-[12px]"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      <Modal 
        isOpen={showActionModal} 
        onClose={() => setShowActionModal(false)}
        title={
          actionType === 'dismiss' ? 'Dismiss Flag' :
          actionType === 'resolve' ? 'Resolve Flag' : 'Respond to Flag'
        }
      >
        <div className="p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {actionType === 'dismiss' ? 'Dismiss Flag' :
             actionType === 'resolve' ? 'Resolve Flag' : 'Respond to Flag'}
          </h3>

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

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => setShowActionModal(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={submitAction}
              disabled={isSubmitting || (actionType === 'respond' && !adminResponse.trim())}
              className={`flex-1 text-white ${
                actionType === 'dismiss' ? 'bg-gray-600 hover:bg-gray-700' :
                actionType === 'resolve' ? 'bg-green-600 hover:bg-green-700' :
                'bg-blue-600 hover:bg-blue-700'
              }`}
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
