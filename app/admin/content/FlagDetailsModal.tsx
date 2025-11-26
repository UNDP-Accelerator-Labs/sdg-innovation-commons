'use client';

import { useState, useEffect } from 'react';
import { Eye, User, Calendar, MessageSquare, Flag, ExternalLink, Clock } from 'lucide-react';
import Modal from '@/app/ui/components/Modal';
import Link from 'next/link';

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
  admin_name?: string;
  admin_response?: string;
  created_at?: string;
  updated_at?: string;
  display_url?: string;
  total_actions?: number;
}

interface FlagAction {
  id: number;
  action_type: string;
  admin_response?: string;
  previous_status: string;
  new_status: string;
  created_at: string;
  admin_name: string;
}

interface FlagDetailsModalProps {
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

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  dismissed: 'bg-gray-100 text-gray-800 border-gray-200'
};

export default function FlagDetailsModal({ flag }: FlagDetailsModalProps) {
  const [showModal, setShowModal] = useState(false);
  const [flagActions, setFlagActions] = useState<FlagAction[]>([]);
  const [loadingActions, setLoadingActions] = useState(false);

  // Fetch flag actions when modal opens
  useEffect(() => {
    if (showModal && flag.total_actions && flag.total_actions > 0) {
      fetchFlagActions();
    }
  }, [showModal, flag.id]);

  const fetchFlagActions = async () => {
    setLoadingActions(true);
    try {
      const response = await fetch(`/api/admin/content/flag-actions?flagId=${flag.id}`);
      if (response.ok) {
        const data = await response.json();
        setFlagActions(data.actions || []);
      }
    } catch (error) {
      console.error('Failed to fetch flag actions:', error);
    } finally {
      setLoadingActions(false);
    }
  };

  // Generate content URL based on platform and content type
  const getContentUrl = (flag: Flag) => {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://sdginnovationcommons.org' 
      : 'http://localhost:3000';
    
    if (flag.platform === 'solutions') {
      return `${baseUrl}/solutions/${flag.content_id}`;
    } else if (flag.platform === 'experiments') {
      return `${baseUrl}/experiments/${flag.content_id}`;
    } else if (flag.platform === 'blogs') {
      return `${baseUrl}/blog/${flag.content_id}`;
    }
    return null;
  };

  const contentUrl = flag.display_url || getContentUrl(flag);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded transition-colors"
        title="View flag details"
      >
        <Eye className="h-3 w-3" />
      </button>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Flag Details"
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="p-6 max-w-2xl mx-auto space-y-6">
          {/* Content Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Flag className="h-5 w-5 mr-2 text-red-500" />
                Flagged Content
              </h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${STATUS_COLORS[flag.status]}`}>
                {flag.status.charAt(0).toUpperCase() + flag.status.slice(1)}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Title:</span>
                <div className="mt-1">
                  {contentUrl ? (
                    <Link
                      href={contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
                    >
                      {flag.content_title || `${flag.content_type} #${flag.content_id}`}
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Link>
                  ) : (
                    <span className="text-gray-900">{flag.content_title || `${flag.content_type} #${flag.content_id}`}</span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">Platform:</span>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {flag.platform}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Content Type:</span>
                  <div className="mt-1 text-gray-900">{flag.content_type}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Flag Information */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-red-500" />
              Flag Report
            </h3>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Reason:</span>
                <div className="mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800">
                    {REASON_LABELS[flag.reason] || flag.reason}
                  </span>
                </div>
              </div>
              
              {flag.description && (
                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <div className="mt-1 p-3 bg-white rounded border text-gray-900">
                    {flag.description}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reporter Information */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-500" />
              Reporter Information
            </h3>
            
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">{flag.reporter_name || 'Anonymous'}</span>
              </div>
              {flag.reporter_email && (
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{flag.reporter_email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline & Admin Actions Audit */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              Complete Action History
              {flag.total_actions && flag.total_actions > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {flag.total_actions} action{flag.total_actions > 1 ? 's' : ''}
                </span>
              )}
            </h3>
            
            <div className="space-y-3">
              {/* Initial Flag Report */}
              <div className="flex justify-between items-start py-3 border-b border-gray-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-3 h-3 bg-red-400 rounded-full mt-1.5 mr-3"></div>
                  <div>
                    <div className="font-medium text-gray-900">Flag Reported</div>
                    <div className="text-sm text-gray-600">Initial flag submission</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {flag.created_at ? new Date(flag.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Unknown'}
                  </div>
                  <div className="text-xs text-gray-500">
                    by {flag.reporter_name || flag.reporter_email || 'Anonymous'}
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              {loadingActions ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-sm text-gray-500">Loading action history...</div>
                </div>
              ) : flagActions.length > 0 ? (
                flagActions.map((action, index) => (
                  <div key={action.id} className="flex justify-between items-start py-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1.5 mr-3 ${
                        action.action_type === 'remove' ? 'bg-red-500' :
                        action.action_type === 'resolve' ? 'bg-green-500' :
                        action.action_type === 'dismiss' ? 'bg-gray-500' :
                        action.action_type === 'respond' ? 'bg-yellow-500' :
                        action.action_type === 'reopen' ? 'bg-blue-500' : 'bg-gray-400'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {action.action_type === 'remove' ? 'Content Removed' :
                           action.action_type === 'resolve' ? 'Flag Resolved' :
                           action.action_type === 'dismiss' ? 'Flag Dismissed' :
                           action.action_type === 'respond' ? 'Response Sent' :
                           action.action_type === 'reopen' ? 'Flag Reopened' : action.action_type}
                        </div>
                        <div className="text-sm text-gray-600">
                          Status changed from {action.previous_status} to {action.new_status}
                        </div>
                        {action.admin_response && (
                          <div className="mt-2 p-2 bg-white rounded border text-sm text-gray-800">
                            {action.admin_response}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(action.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        by {action.admin_name}
                      </div>
                    </div>
                  </div>
                ))
              ) : flag.total_actions === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500">
                  No admin actions taken yet
                </div>
              ) : null}
            </div>
          </div>



          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
