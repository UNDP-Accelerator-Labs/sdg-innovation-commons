'use client';
import React, { useEffect, useState } from 'react';
import Modal from '@/app/ui/components/Modal';
import { Pagination } from '@/app/ui/components/Pagination';
import { Button } from '@/app/ui/components/Button';
import DropDown from '@/app/ui/components/DropDown';
import { MenuItem } from '@headlessui/react';

type Job = {
  id: number | string;
  db_keys: string[];
  format: string;
  status: string;
  blob_url?: string;
  error?: string;
  created_at?: string;
  expires_at?: string;
  requester_name?: string | null;
  requester_email?: string | null;
  params?: any;
};

export default function ExportJobsClient(){
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  async function fetchJobs(force = false){
    if (force || jobs.length === 0) setLoading(true);
    try{
      const res = await fetch('/api/admin/export/jobs');
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'Failed');
      const newJobs = j.jobs || [];
      try {
        const a = JSON.stringify(newJobs || []);
        const b = JSON.stringify(jobs || []);
        if (a !== b) {
          setJobs(newJobs);
          if (force) setPage(1);
        }
      } catch (cmpErr) {
        setJobs(newJobs);
        if (force) setPage(1);
      }
      // Dispatch stats so other panels (cards) can update when user refreshes
      try {
        if (j.stats) {
          const payload = { ...(j.stats || {}), total: (newJobs || []).length };
          window.dispatchEvent(new CustomEvent('exportJobsUpdated', { detail: payload }));
        }
      } catch (evErr) { /* ignore */ }
    }catch(e){ console.error(e); }
    if (force || jobs.length === 0) setLoading(false);
  }

  // Initial load only — no periodic polling. Users must click Refresh to update.
  useEffect(()=>{ fetchJobs(true); },[]);

  const total = jobs.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const current = jobs.slice(start, start + perPage);

  function goto(p: number){
    if (p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    setPage(p);
  }

  return (
    <div>
      <div className="mb-3 flex justify-between items-center">
        <h3 className="text-lg font-medium">{total} Total export jobs</h3>
        <div className="flex items-center gap-2">
          <Button onClick={() => fetchJobs(true)}>Refresh</Button>
        </div>
      </div>

      {loading && <div>Loading…</div>}

      {!loading && jobs.length===0 && <div className="text-sm text-muted-foreground">No export jobs found.</div>}

      {!loading && jobs.length>0 && (
        <div className="bg-white  rounded shadow-sm overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Format</th>
                <th className="p-3">DBs</th>
                <th className="p-3">Status</th>
                <th className="p-3">Requested At</th>
                <th className="p-3">Requester</th>
                <th className="p-3">Email</th>
                <th className="p-3">Error</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.map(j => (
                <tr key={String(j.id)} className="border-t hover:bg-gray-50">
                  <td className="p-3 align-top">#{j.id}</td>
                  <td className="p-3 align-top">{j.format?.toUpperCase() || '??'}</td>
                  <td className="p-3 align-top text-xs text-muted-foreground">{(j.db_keys || []).join(', ')}</td>
                  <td className="p-3 align-top">{j.status}</td>
                  <td className="p-3 align-top text-xs text-muted-foreground">{j.created_at ? new Date(j.created_at).toLocaleString() : '-'}</td>
                  <td className="p-3 align-top"><div className="text-sm font-medium">{j.requester_name || '-'}</div></td>
                  <td className="p-3 align-top text-xs">{j.requester_email ? <a className="underline" href={`mailto:${j.requester_email}`}>{j.requester_email}</a> : '-'}</td>
                  <td className="p-3 align-top text-xs text-red-600">{j.error || '-'}</td>
                  <td className="p-3 align-top">
                    <div className="flex items-center">
                      <DropDown label="Actions">
                        {j.blob_url && (
                          <MenuItem as="button" className="w-full bg-white text-start hover:bg-lime-yellow">
                            <div className="block border-none bg-inherit p-4 text-base text-inherit focus:outline-none" onClick={() => window.open(String(j.blob_url), '_blank')}>Download</div>
                          </MenuItem>
                        )}
                        <MenuItem as="button" className="w-full bg-white text-start hover:bg-lime-yellow">
                          <div className="block border-none bg-inherit p-4 text-base text-inherit focus:outline-none" onClick={() => { setSelectedJob(j); setShowDetailsModal(true); }}>Details</div>
                        </MenuItem>
                      </DropDown>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination mt-4">
            <div className="col-start-2 flex w-full justify-center">
              <Pagination page={page} totalPages={totalPages} />
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title={selectedJob ? `Export #${selectedJob.id} details` : 'Export details'}>
        {selectedJob ? (
          <div className="flex flex-col max-h-[70vh]">
            {/* Scrollable content area */}
            <div className="space-y-3 text-sm overflow-auto pr-2" style={{ maxHeight: '70vh' }}>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-muted-foreground">ID</div><div className="font-medium">#{selectedJob.id}</div>
                <div className="text-muted-foreground">Status</div><div>{selectedJob.status}</div>
                <div className="text-muted-foreground">Format</div><div>{(selectedJob.format || '').toUpperCase()}</div>
                <div className="text-muted-foreground">Kind</div><div>{selectedJob.params?.kind ?? 'full'}</div>
                <div className="text-muted-foreground">Databases</div><div className="text-xs text-muted-foreground">{(selectedJob.db_keys || []).join(', ')}</div>
                <div className="text-muted-foreground">Requested At</div><div className="text-xs text-muted-foreground">{selectedJob.created_at ? new Date(selectedJob.created_at).toLocaleString() : '-'}</div>
                <div className="text-muted-foreground">Requester</div><div className="font-medium">{selectedJob.requester_name || '-'}</div>
                <div className="text-muted-foreground">Requester Email</div><div className="text-xs">{selectedJob.requester_email || '-'}</div>

                <div className="text-muted-foreground">Additional delivery email</div>
                <div className="text-xs">{selectedJob.params?.requester_email || '-'}</div>

                <div className="col-span-2 mt-2"><strong>Selected options</strong></div>

                <div className="text-muted-foreground">Include personal data</div>
                <div>{selectedJob.params?.include_all ? 'All (name, email, uuid)' : [selectedJob.params?.include_name ? 'Name' : null, selectedJob.params?.include_email ? 'Email' : null, selectedJob.params?.include_uuid ? 'UUID' : null].filter(Boolean).join(', ') || 'Default'}</div>

                <div className="text-muted-foreground">Exclude PII</div>
                <div>{selectedJob.params?.exclude_pii ? 'Yes' : 'No'}</div>

                <div className="text-muted-foreground">Exclude owner UUID</div>
                <div>{selectedJob.params?.exclude_owner_uuid ? 'Yes' : 'No'}</div>

                <div className="text-muted-foreground">Include Tags</div>
                <div>{selectedJob.params?.include_tags ? 'Yes' : 'No'}</div>

                <div className="text-muted-foreground">Include Locations</div>
                <div>{selectedJob.params?.include_locations ? 'Yes' : 'No'}</div>

                <div className="text-muted-foreground">Include Metafields</div>
                <div>{selectedJob.params?.include_metafields ? 'Yes' : 'No'}</div>

                <div className="text-muted-foreground">Include Engagement</div>
                <div>{selectedJob.params?.include_engagement ? 'Yes' : 'No'}</div>

                <div className="text-muted-foreground">Include Comments</div>
                <div>{selectedJob.params?.include_comments ? 'Yes' : 'No'}</div>

                <div className="text-muted-foreground">Status filter</div>
                <div>
                  {Array.isArray(selectedJob.params?.statuses) && selectedJob.params.statuses.length ? (
                    selectedJob.params.statuses.map((s:number, i:number) => (
                      <div key={i} className="text-xs">{s === 2 ? 'Preprint (2)' : (s === 3 ? 'Published (3)' : 'Draft (0/1)')}</div>
                    ))
                  ) : <div className="text-xs">None (all statuses)</div>}
                </div>

                <div className="text-muted-foreground">Additional params</div>
                <div className="text-xs">{selectedJob.params ? (Object.keys(selectedJob.params).filter(k=>!['include_all','include_name','include_email','include_uuid','exclude_pii','exclude_owner_uuid','include_tags','include_locations','include_metafields','include_engagement','include_comments','statuses','kind'].includes(k)).length ? <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(selectedJob.params, null, 2)}</pre> : '—' ) : '—'}</div>
              </div>
            </div>

            {/* Sticky footer so actions remain visible even when content scrolls */}
            <div className="mt-4 flex gap-3 sticky bottom-0 bg-white pt-3 border-t">
              <Button onClick={() => setShowDetailsModal(false)}>Close</Button>
              {selectedJob.blob_url && <Button onClick={() => window.open(String(selectedJob.blob_url), '_blank')}>Download</Button>}
            </div>
          </div>
        ) : <div>Loading…</div>}
      </Modal>
    </div>
  );
}
