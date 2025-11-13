'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/app/ui/components/Modal';
import { Button } from '@/app/ui/components/Button';
import DropDown from '@/app/ui/components/DropDown';
import { MenuItem } from '@headlessui/react';

// fallback static list (kept minimal) used if API fails
const FALLBACK_COUNTRIES = [
  { code: 'USA', name: 'United States' },
  { code: 'GBR', name: 'United Kingdom' },
  { code: 'CAN', name: 'Canada' },
  { code: 'IND', name: 'India' }
];

function findCodeByName(name?: string) {
  if (!name) return '';
  const n = String(name).trim().toLowerCase();
  const byCode = FALLBACK_COUNTRIES.find(c => c.code.toLowerCase() === n.toLowerCase());
  if (byCode) return byCode.code;
  const byName = FALLBACK_COUNTRIES.find(c => c.name.toLowerCase() === n.toLowerCase());
  return byName ? byName.code : '';
}

function findNameByCode(code?: string) {
  if (!code) return '';
  const c = FALLBACK_COUNTRIES.find(x => x.code.toLowerCase() === String(code).toLowerCase());
  return c ? c.name : String(code);
}

export default function UserAction({ uuid, rights, deleted, name, email, country }: { uuid: string; rights: number; deleted: boolean; name?: string; email?: string; country?: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ rights: number; deleted: boolean }>({ rights: rights || 1, deleted: !!deleted });

  // modal state
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [showDemoteModal, setShowDemoteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // edit form state
  const [editName, setEditName] = useState<string>(name || '');
  const [editEmail, setEditEmail] = useState<string>(email || '');
  // store iso3 code in state; will initialize in effect when modal opens
  const [editCountry, setEditCountry] = useState<string>('');
  const [editRights, setEditRights] = useState<number>(rights || 1);
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<string>('');

  const [remoteCountries, setRemoteCountries] = useState<{ code: string; name: string }[] | null>(null);
  const [countriesLoading, setCountriesLoading] = useState(false);

  useEffect(() => {
    if (showEditModal && !remoteCountries && !countriesLoading) {
      setCountriesLoading(true);
      fetch('/api/admin/countries').then(r => r.json()).then(d => {
        if (d && d.countries) setRemoteCountries(d.countries);
      }).catch(e => {
        console.warn('Failed to fetch countries', e);
      }).finally(() => setCountriesLoading(false));
    }
  }, [showEditModal, remoteCountries, countriesLoading]);

  const COUNTRIES_TO_RENDER = remoteCountries || FALLBACK_COUNTRIES;

  // keep form fields in sync when modal opens or props change
  useEffect(() => {
    if (showEditModal) {
      setEditName(name || '');
      setEditEmail(email || '');
      setEditRights(rights || 1);
      // infer iso3 code from incoming country prop (may be iso3 or name)
      const inferIso3 = (() => {
        if (!country) return '';
        const asStr = String(country).trim();
        if (asStr.length === 3) return asStr.toUpperCase();
        const byCode = FALLBACK_COUNTRIES.find(c => c.code.toLowerCase() === asStr.toLowerCase());
        if (byCode) return byCode.code;
        const byName = FALLBACK_COUNTRIES.find(c => c.name.toLowerCase() === asStr.toLowerCase());
        return byName ? byName.code : '';
      })();
      setEditCountry(inferIso3);
      setFormError('');
      setFormSuccess('');
    }
  }, [showEditModal, name, email, country, rights]);

  async function callApi(path: string, body: any = {}, method = 'POST') {
    setLoading(true);
    try {
      const res = await fetch(path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uuid, ...body }) });
      const data = await res.json();
      const payload = (data && data.user) ? data.user : data; // unwrap if server returns { user: ... }
      if (res.ok) {
        if (payload.rights !== undefined) setStatus(prev => ({ ...prev, rights: payload.rights }));
        if (payload.deleted !== undefined) setStatus(prev => ({ ...prev, deleted: payload.deleted }));
        // update edit form if API returned fresh values
        if (payload.name !== undefined) setEditName(payload.name);
        if (payload.email !== undefined) setEditEmail(payload.email);
        if (payload.country !== undefined) {
          // payload.country is iso3 (server aliases iso3 AS country)
          const iso3 = String(payload.country || '').trim();
          setEditCountry(iso3);
        }
      } else {
        console.error('User action failed', data);
        alert(data.error || data.message || 'Action failed');
      }
      return payload;
    } catch (e) {
      console.error('User action error', e);
      alert('Action failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function confirmAndCall(path: string, closeModal: () => void) {
    try {
      await callApi(path);
      closeModal();
    } catch (_) {
      // error already shown in callApi
    }
  }

  async function submitEdit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!editEmail || !editName) {
      setFormError('Name and email are required');
      return;
    }
    try {
      const data = await callApi('/api/admin/users/update', { name: editName, email: editEmail, rights: editRights, country: editCountry });
      // callApi returns unwrapped payload (user object or flat)
      if (data && data.uuid) {
        // update local status
        if (data.rights !== undefined) setStatus(prev => ({ ...prev, rights: data.rights }));
        // ensure local edit fields reflect saved values
        if (data.name !== undefined) setEditName(data.name);
        if (data.email !== undefined) setEditEmail(data.email);
        if (data.country !== undefined) setEditCountry(String(data.country));
        setFormSuccess('Saved successfully');
        // close modal after short delay so user sees success
        setTimeout(() => setShowEditModal(false), 700);
      } else {
        setFormError('Failed to update user');
      }
    } catch (err) {
      console.error(err);
      setFormError('Failed to update user');
    }
  }

  return (
    <div className="flex items-center">
      <DropDown label="Actions">
        <MenuItem as="button" className="w-full bg-white text-start hover:bg-lime-yellow">
          <div className="block border-none bg-inherit p-4 text-base text-inherit focus:outline-none" onClick={() => setShowPromoteModal(true)}>Promote</div>
        </MenuItem>
        <MenuItem as="button" className="w-full bg-white text-start hover:bg-lime-yellow">
          <div className="block border-none bg-inherit p-4 text-base text-inherit focus:outline-none" onClick={() => setShowDemoteModal(true)}>Demote</div>
        </MenuItem>
        {status.deleted ? (
          <MenuItem as="button" className="w-full bg-white text-start hover:bg-lime-yellow">
            <div className="block border-none bg-inherit p-4 text-base text-inherit focus:outline-none" onClick={() => setShowReactivateModal(true)}>Reactivate</div>
          </MenuItem>
        ) : (
          <MenuItem as="button" className="w-full bg-white text-start hover:bg-lime-yellow">
            <div className="block border-none bg-inherit p-4 text-base text-inherit focus:outline-none" onClick={() => setShowDeactivateModal(true)}>Deactivate</div>
          </MenuItem>
        )}
        <MenuItem as="button" className="w-full bg-white text-start hover:bg-lime-yellow">
          <div className="block border-none bg-inherit p-4 text-base text-inherit focus:outline-none" onClick={() => setShowEditModal(true)}>Edit user</div>
        </MenuItem>
      </DropDown>

      {/* Confirm and action modals (same as before) */}
      <Modal isOpen={showPromoteModal} onClose={() => setShowPromoteModal(false)} title="Confirm Promote">
        <p className="text-left text-sm text-gray-500">This will increase the user's rights level by one. Are you sure you want to promote this user ({uuid})?</p>
        <div className="mt-6 flex w-full gap-4">
          <button onClick={() => setShowPromoteModal(false)} className="w-full cursor-pointer border border-black bg-transparent font-space-mono text-sm font-bold hover:bg-gray-200" disabled={loading}>Cancel</button>
          <Button type="button" className="w-full" onClick={() => confirmAndCall('/api/admin/users/promote', () => setShowPromoteModal(false))} disabled={loading}>{loading ? 'Processing...' : 'Confirm Promote'}</Button>
        </div>
      </Modal>

      <Modal isOpen={showDemoteModal} onClose={() => setShowDemoteModal(false)} title="Confirm Demote">
        <p className="text-left text-sm text-gray-500">This will decrease the user's rights level by one. Are you sure you want to demote this user ({uuid})?</p>
        <div className="mt-6 flex w-full gap-4">
          <button onClick={() => setShowDemoteModal(false)} className="w-full cursor-pointer border border-black bg-transparent font-space-mono text-sm font-bold hover:bg-gray-200" disabled={loading}>Cancel</button>
          <Button type="button" className="w-full" onClick={() => confirmAndCall('/api/admin/users/demote', () => setShowDemoteModal(false))} disabled={loading}>{loading ? 'Processing...' : 'Confirm Demote'}</Button>
        </div>
      </Modal>

      <Modal isOpen={showDeactivateModal} onClose={() => setShowDeactivateModal(false)} title="Confirm Deactivate">
        <p className="text-left text-sm text-gray-500">Deactivating a user will prevent them from signing in. This action can be reversed. Are you sure you want to deactivate this user ({uuid})?</p>
        <div className="mt-6 flex w-full gap-4">
          <button onClick={() => setShowDeactivateModal(false)} className="w-full cursor-pointer border border-black bg-transparent font-space-mono text-sm font-bold hover:bg-gray-200" disabled={loading}>Cancel</button>
          <Button type="button" className="w-full" onClick={() => confirmAndCall('/api/admin/users/deactivate', () => setShowDeactivateModal(false))} disabled={loading}>{loading ? 'Processing...' : 'Deactivate'}</Button>
        </div>
      </Modal>

      <Modal isOpen={showReactivateModal} onClose={() => setShowReactivateModal(false)} title="Confirm Reactivate">
        <p className="text-left text-sm text-gray-500">This will reactivate the user's account and allow them to sign in again. Are you sure you want to reactivate this user ({uuid})?</p>
        <div className="mt-6 flex w-full gap-4">
          <button onClick={() => setShowReactivateModal(false)} className="w-full cursor-pointer border border-black bg-transparent font-space-mono text-sm font-bold hover:bg-gray-200" disabled={loading}>Cancel</button>
          <Button type="button" className="w-full" onClick={() => confirmAndCall('/api/admin/users/reactivate', () => setShowReactivateModal(false))} disabled={loading}>{loading ? 'Processing...' : 'Reactivate'}</Button>
        </div>
      </Modal>

      {/* Edit user modal */}
      <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setFormError(''); }} title="Edit user details">
        <form onSubmit={submitEdit} className="space-y-4">
          {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{formError}</div>}
          {formSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{formSuccess}</div>}
          <div>
            <label className="text-sm font-bold">Name</label>
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full border p-2" />
          </div>
          <div>
            <label className="text-sm font-bold">Email</label>
            <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full border p-2" />
          </div>
          <div>
            <label className="text-sm font-bold">Country</label>
            <select value={editCountry} onChange={(e) => setEditCountry(e.target.value)} className="w-full border p-2">
              <option value="">Select country</option>
              {COUNTRIES_TO_RENDER.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-bold">Rights</label>
            <input type="number" value={editRights} min={0} onChange={(e) => setEditRights(Number(e.target.value || 0))} className="w-full border p-2" />
          </div>
          <div className="mt-6 flex w-full gap-4">
            <button type="button" onClick={() => { setShowEditModal(false); setFormError(''); }} className="w-full cursor-pointer border border-black bg-transparent font-space-mono text-sm font-bold hover:bg-gray-200" disabled={loading}>Cancel</button>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Saving...' : 'Save changes'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
