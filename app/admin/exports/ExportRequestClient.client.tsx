'use client';
import React, { useEffect, useState } from 'react';
import { Check, Download, AlertCircle } from 'lucide-react';

export default function ExportRequestClient() {
  const [dbKeys, setDbKeys] = useState<string[]>(['solutions']);
  const [format, setFormat] = useState<'xlsx' | 'csv' | 'json'>('xlsx');
  const [kind, setKind] = useState<'full' | 'sample'>('full');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<'success' | 'error' | null>(null);
  const [availableDbs, setAvailableDbs] = useState<Array<{ key: string; label: string }>>([]);

  // PII include options
  const [includeAll, setIncludeAll] = useState(false);
  const [includeName, setIncludeName] = useState(true);
  const [includeEmail, setIncludeEmail] = useState(false);
  const [includeUuid, setIncludeUuid] = useState(false);

  // Metadata include options
  const [includeTags, setIncludeTags] = useState(true);
  const [includeLocations, setIncludeLocations] = useState(true);
  const [includeMetafields, setIncludeMetafields] = useState(true);
  const [includeEngagement, setIncludeEngagement] = useState(true);
  const [includeComments, setIncludeComments] = useState(true);

  // Status filter options
  const [includeDraft, setIncludeDraft] = useState(false);
  const [includePreprint, setIncludePreprint] = useState(false);
  const [includePublished, setIncludePublished] = useState(false);

  useEffect(() => {
    setAvailableDbs([
      { key: 'solutions', label: 'Solutions (what we see)' },
      { key: 'experiment', label: 'Experiments (what we test)' },
      { key: 'learningplan', label: 'Learning Plans (what we test)' },
      { key: 'blogs', label: 'Blogs (what we learn)' },
    ]);
  }, []);

  useEffect(() => {
    if (includeAll) {
      setIncludeName(true);
      setIncludeEmail(true);
      setIncludeUuid(true);
    }
  }, [includeAll]);

  function toggleKey(k: string) {
    setDbKeys((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  }

  function CustomCheckbox({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="h-5 w-5 border border-black flex items-center justify-center bg-white flex-shrink-0"
        style={{ backgroundColor: checked ? '#0072bc' : 'white' }}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </button>
    );
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (dbKeys.length === 0) {
      setMsg('Select at least one database');
      setMsgType('error');
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const body: any = { db_keys: dbKeys, format, kind, requester_email: email };

      const selectedStatuses: number[] = [];
      if (includeDraft) selectedStatuses.push(0, 1);
      if (includePreprint) selectedStatuses.push(2);
      if (includePublished) selectedStatuses.push(3);
      if (selectedStatuses.length) body.statuses = Array.from(new Set(selectedStatuses));

      body.params = {
        include_name: includeName,
        include_email: includeEmail,
        include_uuid: includeUuid,
        include_all: includeAll,
        include_tags: includeTags,
        include_locations: includeLocations,
        include_metafields: includeMetafields,
        include_engagement: includeEngagement,
        include_comments: includeComments,
      };

      const res = await fetch('/api/admin/export/request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'Request failed');
      setMsg('Export enqueued — you will be emailed when ready');
      setMsgType('success');
      setDbKeys(['solutions']);
    } catch (err: any) {
      setMsg(String(err?.message || err));
      setMsgType('error');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {/* Databases Section */}
      <div className="border border-black p-6 bg-white">
        <h3 className="text-sm font-bold font-space-mono mb-2 uppercase tracking-wide">Select Databases</h3>
        <div className="grid grid-cols-2 gap-2">
          {availableDbs.map((d) => (
            <label key={d.key} className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 hover:bg-gray-50">
              <CustomCheckbox checked={dbKeys.includes(d.key)} onChange={() => toggleKey(d.key)} />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{d.label.split('(')[0].trim()}</span>
                <span className="text-xs text-gray-500">{d.label.includes('(') ? '(' + d.label.split('(')[1] : ''}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div className="border border-black px-6 bg-white">
        <h3 className="text-sm font-bold font-space-mono mb-2 uppercase tracking-wide">Export Format</h3>
        <div className="flex gap-6">
          {(['xlsx', 'csv', 'json'] as const).map((fmt) => (
            <label key={fmt} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="format"
                checked={format === fmt}
                onChange={() => setFormat(fmt)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium uppercase">{fmt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Export Type */}
      <div className="border border-black px-6 py-2 bg-white">
        <h3 className="text-sm font-bold font-space-mono mb-4 uppercase tracking-wide">Export Type</h3>
        <div className="flex gap-6">
          {(['full', 'sample'] as const).map((t) => (
            <label key={t} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="kind"
                checked={kind === t}
                onChange={() => setKind(t)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium uppercase">{t === 'full' ? 'Full Dataset' : 'Sample (100 records)'}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Email */}
      <div className="border border-black p-6 bg-white">
        <label className="block text-sm font-bold font-space-mono mb-3 uppercase tracking-wide">Additional Email for Delivery</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-black p-3 text-sm"
          placeholder="you@example.org"
        />
      </div>

      {/* Status Filter */}
      <div className="border border-black px-6 bg-white">
        <h3 className="text-sm font-bold font-space-mono mb-2 uppercase tracking-wide">Status Filter</h3>
        <p className="text-xs text-gray-600 mb-4">Leave unchecked to include all. Draft = 0/1, Preprint = 2, Published = 3.</p>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <CustomCheckbox checked={includeDraft} onChange={setIncludeDraft} />
            <span className="text-sm">Draft (0/1)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <CustomCheckbox checked={includePreprint} onChange={setIncludePreprint} />
            <span className="text-sm">Preprint (2)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <CustomCheckbox checked={includePublished} onChange={setIncludePublished} />
            <span className="text-sm">Published (3)</span>
          </label>
        </div>
      </div>

      {/* Personal Data */}
      <div className="border border-black px-6 py-2 bg-white">
        <h3 className="text-sm font-bold font-space-mono mb-4 uppercase tracking-wide">Include Personal Data</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50">
            <CustomCheckbox checked={includeAll} onChange={setIncludeAll} />
            <span className="text-sm font-medium">Include All</span>
          </label>
          <div className="flex flex-wrap gap-4 pl-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <CustomCheckbox checked={includeName} onChange={setIncludeName} />
              <span className="text-sm">Name</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <CustomCheckbox checked={includeEmail} onChange={setIncludeEmail} />
              <span className="text-sm">Email</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <CustomCheckbox checked={includeUuid} onChange={setIncludeUuid} />
              <span className="text-sm">UUID</span>
            </label>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="border border-black px-6 py-2 bg-white">
        <h3 className="text-sm font-bold font-space-mono mb-4 uppercase tracking-wide">Include Metadata</h3>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <CustomCheckbox checked={includeTags} onChange={setIncludeTags} />
            <span className="text-sm">Tags</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <CustomCheckbox checked={includeLocations} onChange={setIncludeLocations} />
            <span className="text-sm">Locations</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <CustomCheckbox checked={includeMetafields} onChange={setIncludeMetafields} />
            <span className="text-sm">Metadata</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <CustomCheckbox checked={includeEngagement} onChange={setIncludeEngagement} />
            <span className="text-sm">Engagement</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <CustomCheckbox checked={includeComments} onChange={setIncludeComments} />
            <span className="text-sm">Comments</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <br/>
      <button
        type="submit"
        disabled={loading}
        className="detach w-full py-3 px-6 relative z-10 text-black font-bold flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <Download className="h-5 w-5" />
        <span className="relative z-10">{loading ? 'Submitting...' : 'Request Export'}</span>
      </button>

      {/* Message */}
      {msg && (
        <div
          className={`border p-4 flex gap-3 items-start ${
            msgType === 'success'
              ? 'border-green-500 bg-green-50'
              : 'border-red-500 bg-red-50'
          }`}
        >
          {msgType === 'error' && <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />}
          {msgType === 'success' && <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />}
          <p className="text-sm">{msg}</p>
        </div>
      )}
    </form>
  );
}
