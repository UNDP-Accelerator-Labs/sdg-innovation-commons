'use client';
import React, { useEffect, useState } from 'react';
import ExportRequestClient from './ExportRequestClient.client';
import ExportJobsClient from './ExportJobsClient.client';

export default function ExportsPanel(){
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [done24Count, setDone24Count] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchStats(){
      try{
        const res = await fetch('/api/admin/export/jobs');
        const j = await res.json();
        if (!res.ok) throw new Error(j?.error || 'Failed');
        if (!mounted) return;
        setPendingCount(j.stats?.pending_count ?? 0);
        setDone24Count(j.stats?.completed_last_24h_count ?? 0);
        setTotalCount((j.jobs || []).length ?? 0);
      }catch(e){
        console.error('Failed to load export stats', e);
      }
    }
    fetchStats();

    function onUpdated(e:any){
      const d = e?.detail || {};
      if (mounted) {
        if (d.pending_count !== undefined) setPendingCount(d.pending_count);
        if (d.completed_last_24h_count !== undefined) setDone24Count(d.completed_last_24h_count);
        // prefer total_done_count from API event if present
        if (d.total_done_count !== undefined) setTotalCount(d.total_done_count);
        else if (d.total !== undefined) setTotalCount(d.total);
      }
    }
    window.addEventListener('exportJobsUpdated', onUpdated as any);

    return () => { mounted = false; window.removeEventListener('exportJobsUpdated', onUpdated as any); };
  }, []);

  return (
    <section className="grid gap-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border-2 rounded bg-white shadow-sm border-black border-solid"> 
          <h3 className="text-lg font-medium">Pending jobs</h3>
          <p className="text-2xl mt-2" id="pending-count">{pendingCount === null ? '—' : String(pendingCount)}</p>
        </div>
        <div className="p-4 border-2 rounded bg-white shadow-sm border-black border-solid">
          <h3 className="text-lg font-medium">Completed Jobs</h3>
          <p className="text-2xl mt-2" id="done-count">{totalCount === null ? '—' : String(totalCount)}</p>
          <div className="text-xs text-muted-foreground mt-1">Last 24h: {done24Count === null ? '—' : String(done24Count)}</div>
        </div>
        <div className="p-4 border-2 rounded bg-white shadow-sm border-black border-solid">
          <h3 className="text-lg font-medium">Total Jobs</h3>
          <p className="text-2xl mt-2">{totalCount === null ? '—' : String(totalCount)}</p>
        </div>
      </div>

      <div className="p-4 border-2 rounded bg-white shadow-sm border-black border-solid">
        <h2 className="font-medium mb-2">Request Export</h2>
        <ExportRequestClient />
      </div>

      <div className="p-4 border-2 rounded bg-white shadow-sm border-black border-solid">
        <h2 className="font-medium mb-2">Recent Jobs</h2>
        <ExportJobsClient />
      </div>
    </section>
  );
}
