'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/app/ui/components/Button';
import Modal from '@/app/ui/components/Modal';
import DropDown from '@/app/ui/components/DropDown';
import { MenuItem } from '@headlessui/react';
import { Pagination } from '@/app/ui/components/Pagination';

type Notification = {
  id: string;
  type: string;
  level: string;
  payload: any;
  metadata?: any;
  related_uuids?: string[];
  status: string;
  created_at: string;
  action_notes?: string | null;
  action_taken_by?: string | null;
  action_taken_at?: string | null;
  action_taken_by_details?: {
    fullName?: string;
    name?: string;
    uuid?: string;
    email?: string;
  };
};

export default function NotificationsClient(){
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<Notification | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const limit = 20;

  // New: filter state for type and status
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // page number derived from offset
  const page = Math.floor(offset / limit) + 1;
  // best-effort totalPages: if we got a full page it's possible there's a next page
  const totalPages = Math.max(1, page + (items.length === limit ? 1 : 0));

  // derive available filter options from current page (best-effort)
  const types = useMemo(() => Array.from(new Set(items.map(i => i.type).filter(Boolean))), [items]);
  const statuses = useMemo(() => Array.from(new Set(items.map(i => i.status).filter(Boolean))), [items]);

  // Helper: ensure info-level notifications are marked closed on the server
  async function ensureInfoClosed(received: Notification[]){
    if (!Array.isArray(received) || received.length === 0) return;
    const toClose = received.filter(i => i.level === 'info' && i.status !== 'closed');
    if (toClose.length === 0) return;
    try {
      // Patch each one and update local state with server response
      for (const it of toClose) {
        try {
          const res = await fetch('/api/admin/notifications', { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id: it.id, status: 'closed' }) });
          const j = await res.json();
          if (j) {
            setItems(prev => prev.map(p => p.id === j.id ? j : p));
          }
        } catch (e) {
          console.error('Failed to auto-close info notification', it.id, e);
        }
      }
    } catch (e) {
      console.error('ensureInfoClosed failed', e);
    }
  }

  async function fetchPage(){
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set('limit', String(limit));
      qs.set('offset', String(offset));
      if (filterType) qs.set('type', filterType);
      if (filterStatus) qs.set('status', filterStatus);
      const res = await fetch(`/api/admin/notifications?${qs.toString()}`);
      const j = await res.json();
      const rows: Notification[] = j.data || [];
      setItems(rows);
      // run auto-close for info notifications in background (persisted)
      ensureInfoClosed(rows);
    } catch (e){
      console.error('Failed to fetch notifications', e);
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchPage(); }, [offset, filterType, filterStatus]);

  async function markAsAcknowledged(id: string){
    try {
      const res = await fetch('/api/admin/notifications', { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id, status: 'acknowledged' }) });
      const j = await res.json();
      setItems(prev => prev.map(it => it.id === id ? (j || it) : it));
    } catch (e){ console.error(e); }
  }

  async function openDetails(id: string){
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/notifications?id=${encodeURIComponent(id)}`);
      const j = await res.json();
      const n = j.data || null;
      setSelected(n);
      setModalOpen(true);
    } catch (e){
      console.error('Failed to fetch notification details', e);
    } finally { setLoading(false); }
  }

  async function saveAction(id: string, status: string, action_notes?: string){
    try {
      const res = await fetch('/api/admin/notifications', { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id, status, action_notes }) });
      const j = await res.json();
      setItems(prev => prev.map(it => it.id === id ? (j || it) : it));
      setSelected(j || null);
      setModalOpen(false);
    } catch (e){
      console.error('Failed to save notification action', e);
      alert('Failed to save action');
    }
  }

  const renderSubject = (n: Notification) => {
    try {
      if (n.payload && typeof n.payload === 'object') return n.payload.subject || n.payload.title || JSON.stringify(n.payload).slice(0,120);
      return String(n.payload || '');
    } catch (e) { return '' }
  }

  function renderKeyValues(obj: any){
    if (!obj || typeof obj !== 'object') return null;
    const keys = Object.keys(obj);
    if (keys.length === 0) return <div className="text-xs text-gray-500">—</div>;
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        {keys.map(k => (
          <React.Fragment key={k}>
            <div className="text-muted-foreground font-medium">{k}</div>
            <div className="text-gray-700">{typeof obj[k] === 'object' ? JSON.stringify(obj[k]) : String(obj[k])}</div>
          </React.Fragment>
        ))}
      </div>
    );
  }

  // Render email history array stored in metadata.email_history
  function renderEmailHistory(meta: any){
    if (!meta || !Array.isArray(meta.email_history) || meta.email_history.length === 0) return null;
    return (
      <div className="col-span-2 mt-2">
        <strong>Correspondence</strong>
        <div className="mt-2 space-y-2 text-xs text-gray-700">
          {meta.email_history.map((h: any, i: number) => (
            <div key={i} className="border rounded p-2 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{h.to || 'unknown'}</div>
                  {/* show who sent the email when available */}
                  { (h.actor_name || h.actor_uuid) && (
                    <div className="text-xs text-gray-500">Sent by: {h.actor_name ? String(h.actor_name) : String(h.actor_uuid)}</div>
                  ) }
                </div>
                <div className="text-xs text-gray-500">{h.status || 'unknown'}</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{h.sent_at || h.attempted_at || ''}</div>
              {h.subject && <div className="text-xs mt-1"><strong>Subject:</strong> {String(h.subject).slice(0,200)}</div>}
              {h.preview && <div className="text-xs mt-1 text-gray-700">{String(h.preview)}</div>}
              {h.error && <div className="text-xs mt-1 text-red-600">Error: {String(h.error).slice(0,300)}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Notifications</h2>
        <div className="flex items-center gap-3">
          {/* Filters: Type and Status */}
          <div>
            <label className="block text-xs text-gray-500">Type</label>
            <select className="p-2 border rounded text-sm" value={filterType} onChange={(e) => { setOffset(0); setFilterType(e.target.value); }}>
              <option value="">All types</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500">Status</label>
            <select className="p-2 border rounded text-sm" value={filterStatus} onChange={(e) => { setOffset(0); setFilterStatus(e.target.value); }}>
              <option value="">All statuses</option>
              {/* include common statuses plus those discovered */}
              <option value="open">open</option>
              <option value="acknowledged">acknowledged</option>
              <option value="closed">closed</option>
              {statuses.filter(s => !['open','acknowledged','closed'].includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <Button onClick={() => { setOffset(0); fetchPage(); }}>{loading ? 'Refreshing...' : 'Refresh'}</Button>
        </div>
      </div>

      <div className="border-t">
        {items.length === 0 ? (
          <div className="py-6 text-gray-500">No notifications</div>
        ) : (
          <div className="overflow-auto bg-white rounded shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-3 px-2 font-bold text-xs text-gray-600">Type</th>
                  <th className="py-3 px-2 font-bold text-xs text-gray-600">Level</th>
                  <th className="py-3 px-2 font-bold text-xs text-gray-600">Subject</th>
                  <th className="py-3 px-2 font-bold text-xs text-gray-600">Status</th>
                  <th className="py-3 px-2 font-bold text-xs text-gray-600">Created</th>
                  <th className="py-3 px-2 font-bold text-xs text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(n => (
                  <tr key={n.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-2 align-top">{n.type || '—'}</td>
                    <td className="py-3 px-2 align-top"><span className="text-xs text-gray-500">{n.level || '—'}</span></td>
                    <td className="py-3 px-2 align-top text-xs text-gray-600">{renderSubject(n)}</td>
                    <td className="py-3 px-2 align-top">
                      {/* Treat info-level as closed for display */}
                      <span className="font-medium">{n.level === 'info' ? 'closed' : (n.status || '—')}</span>
                    </td>
                    <td className="py-3 px-2 align-top text-xs text-gray-400">{(function(){ try { const d = new Date(n.created_at || ''); return isNaN(d.getTime()) ? '—' : d.toLocaleString(); } catch(e){ return '—' } })()}</td>
                    <td className="py-3 px-2 align-top">
                      <div className="flex items-center">
                        <DropDown label="Actions">
                          <MenuItem as="button" className="w-full bg-white text-start hover:bg-lime-yellow">
                            <div className="block border-none bg-inherit p-4 text-base text-inherit focus:outline-none" onClick={() => openDetails(n.id)}>Details</div>
                          </MenuItem>

                          {/* Only show acknowledge for non-info levels */}
                          {n.level !== 'info' && n.status !== 'acknowledged' && (
                            <MenuItem as="button" className="w-full bg-white text-start hover:bg-lime-yellow">
                              <div className="block border-none bg-inherit p-4 text-base text-inherit focus:outline-none" onClick={() => markAsAcknowledged(n.id)}>Acknowledge</div>
                            </MenuItem>
                          )}

                        </DropDown>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination mt-4 p-4">
              <div className="col-start-2 flex w-full justify-center">
                <Pagination page={page} totalPages={totalPages} />
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen && !!selected} onClose={() => { setModalOpen(false); setSelected(null); }} title={selected ? `${selected.type || 'Notification'} — ${selected.level || ''}` : 'Notification details'}>
        {selected ? (
          <div className="flex flex-col max-h-[70vh]">
            <div className="space-y-3 text-sm overflow-auto pr-2" style={{ maxHeight: '70vh' }}>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-muted-foreground">Type</div><div className="font-medium">{selected.type || '—'}</div>
                <div className="text-muted-foreground">Level</div><div>{selected.level || '—'}</div>
                <div className="text-muted-foreground">Status</div><div>{selected.level === 'info' ? 'Info (no action needed) — closed' : (selected.status || '—')}</div>
                <div className="text-muted-foreground">Created At</div><div className="text-xs text-muted-foreground">{(function(){ try { const d = new Date(selected.created_at || ''); return isNaN(d.getTime()) ? '—' : d.toLocaleString(); } catch(e){ return '—' } })()}</div>

                <div className="col-span-2 mt-2"><strong>Payload</strong></div>
                <div className="col-span-2">
                  {selected.payload && typeof selected.payload === 'object' && Object.keys(selected.payload).length > 0 ? renderKeyValues(selected.payload) : <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">{JSON.stringify(selected.payload || {}, null, 2)}</pre>}
                </div>

                <div className="col-span-2 mt-2"><strong>Metadata</strong></div>
                <div className="col-span-2">
                  {selected.metadata && typeof selected.metadata === 'object' && Object.keys(selected.metadata).length > 0 ? renderKeyValues(selected.metadata) : <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">{JSON.stringify(selected.metadata || {}, null, 2)}</pre>}
                </div>

                {/* Show email correspondence if available */}
                {selected.metadata && renderEmailHistory(selected.metadata)}
                
                {/* For action_required notifications, show quick-send form */}
                {selected.level === 'action_required' && (
                  <>
                    <div className="col-span-2 mt-2"><strong>Send email to recipients</strong></div>
                    <div className="col-span-2 text-xs text-gray-600">
                      <SendEmailForm notification={selected} onSent={(newHistory) => {
                        const meta = selected.metadata || {};
                        meta.email_history = Array.isArray(meta.email_history) ? meta.email_history.concat(newHistory) : (newHistory || []);
                        setSelected({ ...selected, metadata: meta });
                        setItems(prev => prev.map(it => it.id === selected.id ? { ...it, metadata: meta } : it));
                      }} />
                    </div>
                  </>
                )}

                <div className="col-span-2 mt-2"><strong>Related</strong></div>
                <div className="col-span-2 text-xs text-gray-600">{(selected.related_uuids || []).join(', ') || '—'}</div>

                <div className="col-span-2 mt-2"><strong>Action</strong></div>
                <div className="col-span-2">
                  {selected.level === 'info' ? (
                    <div className="text-sm text-gray-600">This notification is informational. No action is required.</div>
                  ) : (
                    <ActionForm notification={selected} onSave={saveAction} />
                  )}
                </div>

                {/* New: show who actioned this notification, if available */}
                {selected.action_taken_by_details && (
                  <>
                    <div className="col-span-2 mt-2"><strong>Actioned by</strong></div>
                    <div className="col-span-2 text-xs text-gray-700">{selected.action_taken_by_details.fullName || selected.action_taken_by_details.name || selected.action_taken_by_details.uuid}</div>
                    <div className="col-span-2 text-xs text-gray-500">{selected.action_taken_by_details.email || ''}</div>
                    <div className="col-span-2 text-xs text-gray-400">{(function(){ try { const d = new Date(selected.action_taken_at || ''); return isNaN(d.getTime()) ? '—' : d.toLocaleString(); } catch(e){ return '—' } })()}</div>
                  </>
                )}

              </div>
            </div>

            {/* Sticky footer */}
            <div className="mt-4 flex gap-3 sticky bottom-0 bg-white pt-3 border-t">
              <Button onClick={() => { setModalOpen(false); setSelected(null); }}>Close</Button>
              {/* {selected.metadata?.adminUrl && (
                <Button onClick={() => window.open(String(selected.metadata.adminUrl), '_blank')}>Go to context</Button>
              )} */}
            </div>
          </div>
        ) : <div>Loading…</div>}
      </Modal>
    </div>
  );
}

function ActionForm({ notification, onSave } : { notification: Notification, onSave: (id: string, status: string, action_notes?: string) => Promise<void> }){
  const [status, setStatus] = useState(notification.status || 'open');
  const [notes, setNotes] = useState<string>(notification.action_notes || '');

  useEffect(() => { setStatus(notification.status || 'open'); setNotes(notification.action_notes || ''); }, [notification]);

  return (
    <div className="space-y-2">
      {/* Instructional note for admins */}
      <div className="text-xs text-gray-600 bg-yellow-50 border border-yellow-100 p-3 rounded">
        Please record what action you have taken (if any) in the "Action notes" field below. This record is stored for auditing purposes only and does not send any message outside the system. Use this to track how the notification was handled so other admins can see the action and rationale.
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded text-sm">
          <option value="open">Open</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Action notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full p-2 border rounded text-sm" />
      </div>

      <div className="flex gap-2 justify-end">
        <Button onClick={() => onSave(notification.id, status, notes)}>Save action</Button>
      </div>
    </div>
  );
}

function SendEmailForm({ notification, onSent } : { notification: Notification, onSent: (h:any[]) => void }){
  const [to, setTo] = useState<string>('');
  const [subject, setSubject] = useState<string>(notification.payload?.email_subject || `Action required: ${notification.type}`);
  const [message, setMessage] = useState<string>(notification.payload?.message || '');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const pl = notification.payload || {};
    const r = pl.toEmail || (Array.isArray(pl.toEmails) ? pl.toEmails.join(',') : '') || pl.email || '';
    setTo(String(r || '').trim());
  }, [notification]);

  // simple client-side HTML escaper
  function escapeHtmlClient(s: any){
    if (s === null || typeof s === 'undefined') return '';
    return String(s).replace(/[&"'<>]/g, function(c){
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;', '"':'&quot;', "'":'&#39;' } as any)[c];
    });
  }

  async function sendEmail(){
    if (!to) { alert('Please provide recipient email'); return; }
    setSending(true);
    try {
      const res = await fetch('/api/admin/notifications/send-email', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id: notification.id, to, subject, message }) });
      const j = await res.json();
      if (j && Array.isArray(j.email_history)) {
        onSent(j.email_history);
      } else if (j && j.email_history) {
        onSent([j.email_history]);
      }
    } catch (e) { console.error('Failed to send email', e); alert('Failed to send email'); }
    finally { setSending(false); }
  }

  return (
    <div className="col-span-2 space-y-3">
      {/* Instructional note for admins about sending and recording correspondence */}
      <div className="text-xs text-gray-600 bg-yellow-50 border border-yellow-100 p-3 rounded">
        The message you compose here will be sent directly to the recipient(s) you specify and a record of the attempt (success/failure) will be stored with this notification for auditing.
      </div>

      <div>
        <label className="block text-xs text-gray-500">To</label>
        <input className="w-full p-2 border rounded text-sm" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div>
        <label className="block text-xs text-gray-500">Subject</label>
        <input className="w-full p-2 border rounded text-sm" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div>
        <label className="block text-xs text-gray-500">Message</label>
        <textarea className="w-full p-2 border rounded text-sm" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      {/* Live preview of how the email will look to recipients. Preserve line breaks and basic escaping. */}
      <div>
        <div className="text-xs text-gray-500 mb-2">Preview (how recipient will see the message):</div>
        <div className="bg-gray-50 border rounded p-3 text-sm text-gray-800" style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: escapeHtmlClient(message) }} />
      </div>

      <div className="flex justify-end">
        <Button onClick={sendEmail} disabled={sending}>{sending ? 'Sending…' : 'Send email'}</Button>
      </div>
    </div>
  );
}
