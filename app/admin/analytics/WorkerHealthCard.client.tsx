'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/app/ui/components/Button';

export default function WorkerHealthCard(){
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchStatus(){
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/admin/worker-health');
      if (res.status === 401) {
        setError('Unauthorized'); setStatus(null); return;
      }
      const j = await res.json();
      setStatus(j);
    } catch (e:any){ setError(String(e)); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchStatus(); const t = setInterval(fetchStatus, 30000); return () => clearInterval(t); }, []);

  const lastSeen = status?.worker?.lastSeen ? new Date(status.worker.lastSeen).toLocaleString() : 'Never';
  const uptime = status?.worker?.uptime ? `${Math.round(status.worker.uptime)}s` : '—';

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold">System Worker health</h3>
          <p className="text-xs text-gray-500">System background worker status and last heartbeat</p>
        </div>
        <div>
          <Button onClick={fetchStatus} className="!px-2 !py-1 text-xs">Refresh</Button>
        </div>
      </div>

      <div className="mt-3 text-sm">
        {loading ? <div className="text-xs text-gray-500">Loading…</div> : (
          error ? <div className="text-xs text-red-600">{error}</div> : (
            <div>
              <div className="text-xs text-gray-500">Last seen</div>
              <div className="font-medium">{lastSeen}</div>

              <div className="text-xs text-gray-500 mt-2">PID</div>
              <div className="font-medium">{status?.worker?.pid || '—'}</div>

              <div className="text-xs text-gray-500 mt-2">Uptime</div>
              <div className="font-medium">{uptime}</div>

              {status?.worker?.lastSeen && (new Date().getTime() - new Date(status.worker.lastSeen).getTime() > 60000) && (
                <div className="mt-3 text-xs text-yellow-600">Warning: heartbeat older than 60s</div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
