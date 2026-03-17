import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-react';
import './Auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') || 'user');
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { ...form, role });
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      if (data.role === 'chef') navigate('/chef/dashboard');
      else if (data.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">
          <UtensilsCrossed size={28} />
          <span>Fork<span className="text-teal">Fit</span></span>
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-sub">Sign in to your account</p>

        <div className="tabs">
          {['user', 'chef', 'admin'].map(r => (
            <button key={r} className={`tab-btn ${role === r ? 'active' : ''}`} onClick={() => setRole(r)}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-eye-wrap">
              <input className="form-input" type={showPw ? 'text' : 'password'} name="password"
                placeholder="••••••••" value={form.password} onChange={handleChange} required />
              <button type="button" className="eye-btn" onClick={() => setShowPw(s => !s)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-alt">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>

        {role === 'admin' && (
          <div className="alert alert-info" style={{ marginTop: 12 }}>
            Admin accounts are created directly in the database.
          </div>
        )}
      </div>
    </div>
  );
}
