import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-react';
import './Auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') || 'user');
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '', experience: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { ...form, role });
      login(data);
      toast.success(`Welcome to ForkFit, ${data.name}!`);
      if (data.role === 'chef') navigate('/chef/dashboard');
      else navigate('/health-profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
        <h2 className="auth-title">Create account</h2>
        <p className="auth-sub">Start your healthy journey today</p>

        <div className="tabs">
          {['user', 'chef'].map(r => (
            <button key={r} className={`tab-btn ${role === r ? 'active' : ''}`} onClick={() => setRole(r)}>
              {r === 'user' ? '🍱 I want to Order' : '👨‍🍳 I\'m a Chef'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" name="name" placeholder="John Doe"
              value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-eye-wrap">
              <input className="form-input" type={showPw ? 'text' : 'password'} name="password"
                placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
              <button type="button" className="eye-btn" onClick={() => setShowPw(s => !s)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {role === 'chef' && (
            <>
              <div className="form-group">
                <label className="form-label">Location / City</label>
                <input className="form-input" type="text" name="location" placeholder="e.g. Mumbai, Maharashtra"
                  value={form.location} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Cooking Experience</label>
                <input className="form-input" type="text" name="experience" placeholder="e.g. 5 years home cooking"
                  value={form.experience} onChange={handleChange} />
              </div>
            </>
          )}
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        {role === 'chef' && (
          <div className="alert alert-info" style={{ marginTop: 12 }}>
            Your account will be reviewed and approved by our admin team before you can list meals.
          </div>
        )}

        <p className="auth-alt">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
