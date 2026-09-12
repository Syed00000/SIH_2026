import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Trash2, Edit2, Link as LinkIcon, AlertCircle, Eye } from 'lucide-react';

export const ManageUpdatesDashboard = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/v1/admin/updates');
      const data = await res.json();
      if (data.status === 'success') {
        setUpdates(data.data.updates);
      } else {
        setError('Failed to fetch updates.');
      }
    } catch (err) {
      setError('Unable to load updates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleSync = async () => {
    try {
      setSyncing(true);
      setSyncMessage(null);
      const res = await fetch('http://localhost:3000/api/v1/admin/updates/sync', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        setSyncMessage(data.message);
        await fetchUpdates();
      } else {
        setSyncMessage('Failed to trigger sync.');
      }
    } catch (err) {
      setSyncMessage('Unable to trigger sync.');
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this update?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/v1/admin/updates/${id}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        setUpdates(prev => prev.filter(u => u.id !== id));
      }
    } catch (err) {
      alert('Failed to delete update.');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/admin/updates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        setUpdates(prev => prev.map(u => u.id === id ? { ...u, isActive: !currentStatus } : u));
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Important Updates Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage dynamic content for the landing page "Important Updates" section.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Trigger Auto-Sync'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0f4b3a] text-white rounded-md hover:bg-[#0c3c2e] transition-colors">
            <Plus className="w-4 h-4" />
            Add Manual Update
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-md flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          {syncMessage}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Update Title</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Platform / Source</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Type</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">Loading updates...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-red-500">{error}</td>
              </tr>
            ) : updates.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No updates found.</td>
              </tr>
            ) : (
              updates.map(update => (
                <tr key={update.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 line-clamp-1">{update.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{update.description}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1">
                      <span className="font-medium text-gray-700">{update.platform}</span>
                      {update.isAutoFetched && <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Auto</span>}
                    </span>
                    <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]">{update.source}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                      {update.mediaType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(update.publishedDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => handleToggleActive(update.id, update.isActive)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${update.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                    >
                      {update.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a href={update.sourceUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View Source">
                        <LinkIcon className="w-4 h-4" />
                      </a>
                      <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(update.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
