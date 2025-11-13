'use client';

import React, { useEffect, useState } from 'react';

type TimeseriesPoint = { date: string; count: number };

type ContentPoint = { date: string; solutions?: number; experiment?: number; learningplan?: number; blogs?: number };

export default function StatsClient() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // content timeseries state
  const [contentSeries, setContentSeries] = useState<ContentPoint[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [range, setRange] = useState<'30d' | '6m' | '1y' | 'year'>('30d');
  const [year, setYear] = useState<string | undefined>(undefined);

  // tooltip state for charts
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; title?: string; value?: number | string; color?: string }>({ visible: false, x: 0, y: 0 });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        if (mounted) setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadContent() {
      setContentLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('contentRange', range);
        if (range === 'year' && year) params.set('year', year);
        const res = await fetch(`/api/admin/stats?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch content timeseries');
        const data = await res.json();
        if (mounted) setContentSeries(data.contentTimeseries || []);
      } catch (e) {
        console.error(e);
        if (mounted) setContentSeries([]);
      } finally {
        if (mounted) setContentLoading(false);
      }
    }
    loadContent();
    return () => { mounted = false; };
  }, [range, year]);

  if (loading) return <div>Loading charts...</div>;
  if (!stats) return <div>No stats available.</div>;

  const usersTime: TimeseriesPoint[] = stats.newUsersTimeseries || [];
  const rightsData = Object.entries(stats.usersByRights || {}).map(([name, v]) => ({ name, value: Number(v) }));

  // content sources and colors
  const sources = ['solutions', 'experiment', 'learningplan', 'blogs'];
  const COLORS: Record<string, string> = { solutions: '#0072bc', experiment: '#ff8c00', learningplan: '#10b981', blogs: '#6b7280' };

  // friendly labels for sources and capitalization helper
  const SOURCE_LABELS: Record<string, string> = {
    solutions: 'Solutions',
    experiment: 'Experiments',
    learningplan: 'Learning Plans',
    blogs: 'Blogs/Publications',
  };

  function capitalizeWords(s?: string) {
    if (!s) return s;
    return s.replace(/(^|\s|[-_])([a-z])/g, (_, p1, p2) => `${p1}${p2.toUpperCase()}`);
  }

  function formatTooltipTitle(title?: string) {
    if (!title) return title;
    // if title follows 'source — YYYY-MM-DD' pattern, map the source
    const sep = ' — ';
    if (title.includes(sep)) {
      const [srcRaw, rest] = title.split(sep);
      const src = srcRaw.trim();
      const label = SOURCE_LABELS[src] || capitalizeWords(src);
      return `${label}${sep}${rest}`;
    }
    return capitalizeWords(title);
  }

  // tooltip handlers — use fixed positioning to avoid clipping by overflow-hidden parents
  function showTooltipFromEvent(e: React.MouseEvent, title?: string, value?: number | string, color?: string) {
    const x = (e?.clientX ?? 0) + 12;
    const y = (e?.clientY ?? 0) + 12;
    const formattedTitle = formatTooltipTitle(title);
    setTooltip({ visible: true, x, y, title: formattedTitle, value, color });
  }
  function hideTooltip() {
    setTooltip({ visible: false, x: 0, y: 0, title: undefined, value: undefined, color: undefined });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
      {/* Users timeseries */}
      <div className="md:col-span-3">
        <SimpleBarChart data={usersTime} height={260} onHover={(e, info) => info ? showTooltipFromEvent(e, info.title, info.value, '#0072bc') : hideTooltip()} onLeave={hideTooltip} />
      </div>

      {/* Content production */}
      <div className="md:col-span-3 bg-gray-50 p-4 rounded border-1 border-black border-solid">
        <h4 className="font-bold mb-2">Content production</h4>
        <div className="flex items-center gap-3 mb-3">
          <button className={`px-3 py-1 rounded ${range === '30d' ? 'bg-[#0072bc] text-white' : 'bg-white border'}`} onClick={() => { setRange('30d'); setYear(undefined); }}>30d</button>
          <button className={`px-3 py-1 rounded ${range === '6m' ? 'bg-[#0072bc] text-white' : 'bg-white border'}`} onClick={() => { setRange('6m'); setYear(undefined); }}>6m</button>
          <button className={`px-3 py-1 rounded ${range === '1y' ? 'bg-[#0072bc] text-white' : 'bg-white border'}`} onClick={() => { setRange('1y'); setYear(undefined); }}>1y</button>
          <button className={`px-3 py-1 rounded ${range === 'year' ? 'bg-[#0072bc] text-white' : 'bg-white border'}`} onClick={() => setRange('year')}>Select year</button>

          {range === 'year' && (
            <select value={year || ''} onChange={(e) => setYear(e.target.value)} className="ml-2 border p-1">
              <option value="">-- select year --</option>
              {Array.from({ length: 6 }).map((_, i) => {
                const y = new Date().getFullYear() - i;
                return <option key={y} value={String(y)}>{y}</option>;
              })}
            </select>
          )}

          <div className="ml-auto text-sm text-gray-600">{contentLoading ? 'Loading...' : `${contentSeries.length} points`}</div>
        </div>

        <div className="overflow-auto">
          <StackedBarChart
            data={contentSeries}
            sources={sources}
            colors={COLORS}
            height={220}
            onHover={(e, info) => info ? showTooltipFromEvent(e, info.title, info.value, info.color) : hideTooltip()}
            onLeave={hideTooltip}
          />
        </div>
      </div>

      <div className="md:col-span-3 bg-gray-50 p-4 rounded border-1 border-black border-solid">
        <h4 className="font-bold mb-2">Counts</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Total users: <strong>{stats.totalUsers}</strong></div>
          <div>New (30d): <strong>{stats.newUsers30d}</strong></div>
          <div>Blogs: <strong>{stats.blogsCount}</strong></div>
          <div>Publications: <strong>{stats.publicationsCount}</strong></div>
          <div>Solutions (published): <strong>{stats.solutions?.published ?? 0}</strong></div>
          <div>Solutions (preprint): <strong>{stats.solutions?.preprint ?? 0}</strong></div>
          <div>Solutions (draft): <strong>{stats.solutions?.draft ?? 0}</strong></div>
          <div>Experiments (published): <strong>{stats.experiment?.published ?? 0}</strong></div>
          <div>Experiments (draft): <strong>{stats.experiment?.draft ?? 0}</strong></div>
            <div>Learning Plans (published): <strong>{stats.learningplan?.published ?? 0}</strong></div>
            <div>Learning Plans (draft): <strong>{stats.learningplan?.draft ?? 0}</strong></div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="pointer-events-none bg-white border p-2 rounded shadow text-sm z-50"
          // use fixed so ancestors with overflow hidden don't clip the tooltip
          style={{ position: 'fixed', left: tooltip.x, top: tooltip.y, minWidth: 120 }}
        >
          <div className="font-medium" style={{ color: tooltip.color || '#333' }}>{tooltip.title}</div>
          <div className="mt-1">{tooltip.value}</div>
        </div>
      )}
    </div>
  );
}

function SimpleBarChart({ data, height = 200, onHover, onLeave }: { data: TimeseriesPoint[]; height?: number; onHover?: (e: React.MouseEvent, info: { title: string; value: number } | null) => void; onLeave?: () => void }) {
  const width = 700;
  const margin = { top: 10, right: 10, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const dates = data.map(d => d.date);
  const max = Math.max(1, ...data.map(d => d.count));
  const barWidth = data.length ? innerWidth / data.length : 0;

  return (
    <div onMouseLeave={() => onLeave && onLeave()}>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Users over time">
        <g transform={`translate(${margin.left},${margin.top})`}>
          {data.map((d, i) => {
            const x = i * barWidth;
            const barH = (d.count / max) * innerHeight;
            const y = innerHeight - barH;
            return (
              <rect
                key={d.date}
                x={x}
                y={y}
                width={Math.max(1, barWidth - 2)}
                height={barH}
                fill="#0072bc"
                onMouseEnter={(e) => onHover && onHover(e, { title: d.date, value: d.count })}
                onMouseMove={(e) => onHover && onHover(e, { title: d.date, value: d.count })}
              />
            );
          })}
          {/* x labels */}
          {dates.map((dt, i) => {
            const x = i * barWidth + barWidth / 2;
            return <text key={dt} x={x} y={innerHeight + 14} fontSize={9} textAnchor="middle">{dt.slice(5)}</text>;
          })}
          {/* y axis ticks */}
          {Array.from({ length: 5 }).map((_, idx) => {
            const v = Math.round((max / 4) * idx);
            const y = innerHeight - (v / max) * innerHeight;
            return (
              <g key={`tick-${idx}`}>
                <line x1={-6} x2={0} y1={y} y2={y} stroke="#666" />
                <text x={-10} y={y + 4} fontSize={9} textAnchor="end" fill="#666">{v}</text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

function StackedBarChart({ data, sources, colors, height = 200, onHover, onLeave }: { data: ContentPoint[]; sources: string[]; colors: Record<string,string>; height?: number; onHover?: (e: React.MouseEvent, info: { title: string; value: number; color?: string } | null) => void; onLeave?: () => void }) {
  const width = Math.max(700, (data.length || 1) * 30);
  const margin = { top: 10, right: 10, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const dates = data.map(d => d.date);
  // compute totals
  const totals = data.map(d => sources.reduce((s, k) => s + ((d as any)[k] || 0), 0));
  const max = Math.max(1, ...totals);
  const barWidth = data.length ? innerWidth / data.length : 0;

  return (
    <div onMouseLeave={() => onLeave && onLeave()}>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Content production timeseries">
        <g transform={`translate(${margin.left},${margin.top})`}>
          {data.map((d, i) => {
            let yOffset = innerHeight;
            const x = i * barWidth;
            return (
              <g key={d.date}>
                {sources.map((s, idx) => {
                  const val = (d as any)[s] || 0;
                  const h = (val / max) * innerHeight;
                  const y = yOffset - h;
                  yOffset = y;
                  const color = colors[s] || '#666';
                  return (
                    <rect
                      key={`${d.date}-${s}`}
                      x={x}
                      y={y}
                      width={Math.max(1, barWidth - 2)}
                      height={h}
                      fill={color}
                      onMouseEnter={(e) => onHover && onHover(e, { title: `${s} — ${d.date}`, value: val, color })}
                      onMouseMove={(e) => onHover && onHover(e, { title: `${s} — ${d.date}`, value: val, color })}
                    />
                  );
                })}
                <text x={x + barWidth/2} y={innerHeight + 14} fontSize={9} textAnchor="middle">{d.date.slice(5)}</text>
              </g>
            );
          })}

          {/* y axis ticks */}
          {Array.from({ length: 4 }).map((_, idx) => {
            const v = Math.round((max / 3) * idx);
            const y = innerHeight - (v / max) * innerHeight;
            return (
              <g key={`yt-${idx}`}>
                <line x1={-6} x2={0} y1={y} y2={y} stroke="#666" />
                <text x={-10} y={y + 4} fontSize={9} textAnchor="end" fill="#666">{v}</text>
              </g>
            );
          })}
        </g>

        {/* legend */}
        <g transform={`translate(${margin.left}, ${height - 14})`}>
          {sources.map((s, i) => (
            <g key={s} transform={`translate(${i * 120}, 0)`}>
              <rect x={0} y={-10} width={12} height={12} fill={colors[s]} />
              <text x={16} y={0} fontSize={11} fill="#333">{s}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
