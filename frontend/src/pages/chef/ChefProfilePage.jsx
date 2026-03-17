import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Settings } from 'lucide-react';

export default function ChefProfilePage() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: '', location: '', experience: '', bio: '' });
  const [idFile, setIdFile] = useState(null);
  const [kitchenFile, setKitchenFile] = useState(null);
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/chefs/me').then(r => {
      setChef(r.data);
      setForm({ name: r.data.name || '', location: r.data.location || '', experience: r.data.experience || '', bio: r.data.bio || '' });
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/chefs/me', form);
      login({ ...user, name: data.name });
      toast.success('Profile updated!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const uploadFile = async (file, fileType) => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('fileType', fileType);
    try {
      await api.post('/chefs/upload-verification', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(`${fileType === 'idProof' ? 'ID Proof' : 'Kitchen photo'} uploaded!`);
    } catch { toast.error('Upload failed'); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40, maxWidth: 680 }}>
        <div className="mb-6">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Chef Profile <Settings size={22} style={{ verticalAlign: 'middle' }} /></h1>
          <div className="flex gap-2 mt-2">
            <span className={`badge badge-${chef?.verificationStatus === 'approved' ? 'success' : chef?.verificationStatus === 'rejected' ? 'error' : 'warning'}`}>
              {chef?.verificationStatus}
            </span>
            {chef?.rating > 0 && <span className="badge badge-warning">⭐ {chef.rating} ({chef.totalReviews} reviews)</span>}
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card p-6">
            <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Basic Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group"><label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Location / City</label>
                <input className="form-input" placeholder="e.g. Mumbai" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Experience</label>
                <input className="form-input" placeholder="e.g. 5 years" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Bio</label>
                <textarea className="form-input" rows={3} placeholder="Tell users about your cooking style…" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} /></div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: 16 }} disabled={saving}>
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </form>

        {/* Verification Uploads */}
        <div className="card p-6 mt-4">
          <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Verification Documents</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="form-label mb-2">ID Proof</label>
              {chef?.idProof && <div className="alert alert-success mb-2" style={{ fontSize: '0.82rem' }}>✓ ID already uploaded</div>}
              <div className="flex gap-2">
                <input className="form-input" type="file" accept="image/*" onChange={e => setIdFile(e.target.files[0])} />
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => uploadFile(idFile, 'idProof')} disabled={!idFile}>Upload</button>
              </div>
            </div>
            <div>
              <label className="form-label mb-2">Kitchen Photo</label>
              {chef?.kitchenPhotos?.length > 0 && <div className="alert alert-success mb-2" style={{ fontSize: '0.82rem' }}>✓ {chef.kitchenPhotos.length} photo(s) uploaded</div>}
              <div className="flex gap-2">
                <input className="form-input" type="file" accept="image/*" onChange={e => setKitchenFile(e.target.files[0])} />
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => uploadFile(kitchenFile, 'kitchenPhoto')} disabled={!kitchenFile}>Upload</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
