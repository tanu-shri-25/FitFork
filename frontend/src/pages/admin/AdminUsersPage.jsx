import { useState, useEffect } from 'react';
import api from '../../api/client';
import { Users } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/all').then(r => { setUsers(r.data); setLoading(false); });
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="section-header">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Users <span className="badge badge-teal" style={{ fontSize: '1rem' }}>{users.length}</span></h1>
          <p className="text-secondary">All registered platform users</p>
        </div>
        {users.length === 0 ? (
          <div className="empty-state"><Users size={48} /><h3>No users yet</h3></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Diet Goal</th><th>BMI</th><th>Joined</th></tr></thead>
              <tbody>
                {users.map(u => {
                  const hp = u.healthProfile;
                  const bmi = hp?.heightCm && hp?.weightKg
                    ? (hp.weightKg / ((hp.heightCm / 100) ** 2)).toFixed(1)
                    : '—';
                  return (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td>{hp?.goal ? <span className="badge badge-teal">{hp.goal}</span> : <span className="text-muted">—</span>}</td>
                      <td>{bmi}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
