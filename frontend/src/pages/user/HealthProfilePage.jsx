import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { User, Target, Activity } from 'lucide-react';

const GOALS = ['Weight Loss', 'Muscle Gain', 'Diabetic Friendly', 'Healthy Living'];
const GOAL_DESC = {
  'Weight Loss': '300–500 kcal, 20g+ protein meals to support fat loss.',
  'Muscle Gain': '500–800 kcal, 35g+ protein meals for muscle building.',
  'Diabetic Friendly': '250–450 kcal, low-GI, fibre-rich, 15g+ protein.',
  'Healthy Living': '350–600 kcal balanced meals for overall wellness.',
};
const GOAL_EMOJI = { 'Weight Loss': '🥗', 'Muscle Gain': '💪', 'Diabetic Friendly': '🌿', 'Healthy Living': '✨' };

export default function HealthProfilePage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ age: '', heightCm: '', weightKg: '', goal: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.healthProfile) {
      const hp = user.healthProfile;
      setForm({ age: hp.age || '', heightCm: hp.heightCm || '', weightKg: hp.weightKg || '', goal: hp.goal || '' });
    }
  }, [user]);

  const bmi = form.heightCm && form.weightKg
    ? (form.weightKg / ((form.heightCm / 100) ** 2)).toFixed(1)
    : null;

  const bmiLabel = bmi
    ? bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.goal) return toast.error('Please select a diet goal');
    setLoading(true);
    try {
      await api.put('/users/health-profile', form);
      login({ ...user, healthProfile: form });
      toast.success('Health profile updated!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40, maxWidth: 700 }}>
        <div className="mb-6">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Health Profile</h1>
          <p className="text-secondary">Set your measurements and diet goal for AI recommendations</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Measurements */}
          <div className="card p-6">
            <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={18} style={{ color: 'var(--accent-teal)' }} /> Your Measurements
            </h3>
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Age (years)</label>
                <input className="form-input" type="number" min="10" max="100" placeholder="25"
                  value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input className="form-input" type="number" min="100" max="250" placeholder="170"
                  value={form.heightCm} onChange={e => setForm(f => ({ ...f, heightCm: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input className="form-input" type="number" min="30" max="300" placeholder="65"
                  value={form.weightKg} onChange={e => setForm(f => ({ ...f, weightKg: e.target.value }))} required />
              </div>
            </div>
            {bmi && (
              <div className="alert alert-info" style={{ marginTop: 16 }}>
                <strong>Your BMI: {bmi}</strong> — {bmiLabel}
              </div>
            )}
          </div>

          {/* Goal Selection */}
          <div className="card p-6">
            <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Target size={18} style={{ color: 'var(--accent-teal)' }} /> Select Your Diet Goal
            </h3>
            <div className="grid-2">
              {GOALS.map(g => (
                <button key={g} type="button"
                  onClick={() => setForm(f => ({ ...f, goal: g }))}
                  className={`goal-select-btn ${form.goal === g ? 'selected' : ''}`}>
                  <span style={{ fontSize: '2rem' }}>{GOAL_EMOJI[g]}</span>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{g}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{GOAL_DESC[g]}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Saving…' : 'Save Health Profile'}
          </button>
        </form>
      </div>

      <style>{`
        .goal-select-btn {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 18px; border-radius: 12px;
          background: rgba(255,255,255,0.03); border: 1px solid var(--border);
          text-align: left; cursor: pointer; transition: all 0.2s;
          font-family: inherit; color: var(--text-primary); width: 100%;
        }
        .goal-select-btn:hover { border-color: var(--border-hover); background: rgba(255,255,255,0.06); }
        .goal-select-btn.selected { border-color: var(--accent-teal); background: rgba(0,212,170,0.08); box-shadow: 0 0 20px rgba(0,212,170,0.12); }
      `}</style>
    </div>
  );
}
