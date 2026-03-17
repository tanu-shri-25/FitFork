import { useState, useEffect } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, ChefHat, MapPin, Clock } from 'lucide-react';

export default function ChefVerificationPage() {
  const [chefs, setChefs] = useState([]);
  const [allChefs, setAllChefs] = useState([]);
  const [tab, setTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [pRes, aRes] = await Promise.all([api.get('/admin/chefs/pending'), api.get('/admin/chefs')]);
    setChefs(pRes.data);
    setAllChefs(aRes.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/chefs/${id}/status`, { status });
      toast.success(`Chef ${status}!`);
      load();
    } catch { toast.error('Failed to update'); }
  };

  const displayed = tab === 'pending' ? chefs : allChefs.filter(c => c.verificationStatus === tab);
  const STATUS_COLOR = { approved: 'success', rejected: 'error', pending: 'warning' };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="section-header">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Chef Verification</h1>
          <p className="text-secondary">Review and approve home chef registrations</p>
        </div>

        <div className="tabs mb-6" style={{ maxWidth: 400 }}>
          {['pending', 'approved', 'rejected'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div className="alert alert-info">No {tab} chefs</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {displayed.map(chef => (
              <div key={chef._id} className="card p-6">
                <div className="flex justify-between items-start">
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,212,170,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChefHat size={20} style={{ color: 'var(--accent-teal)' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{chef.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{chef.email}</div>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-wrap" style={{ marginBottom: 8 }}>
                      {chef.location && <span className="badge badge-blue"><MapPin size={11} />{chef.location}</span>}
                      {chef.experience && <span className="badge badge-purple"><Clock size={11} />{chef.experience}</span>}
                      <span className={`badge badge-${STATUS_COLOR[chef.verificationStatus]}`}>{chef.verificationStatus}</span>
                    </div>
                    {chef.idProof && (
                      <a href={`http://localhost:5000${chef.idProof}`} target="_blank" rel="noreferrer"
                        className="btn btn-secondary btn-sm" style={{ marginTop: 4, display: 'inline-flex' }}>
                        View ID Proof
                      </a>
                    )}
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
                      Registered: {new Date(chef.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {chef.verificationStatus === 'pending' && (
                    <div className="flex gap-2" style={{ flexShrink: 0 }}>
                      <button className="btn btn-success btn-sm" onClick={() => updateStatus(chef._id, 'approved')}>
                        <CheckCircle size={14} />Approve
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => updateStatus(chef._id, 'rejected')}>
                        <XCircle size={14} />Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
