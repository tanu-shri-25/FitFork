import { useState, useEffect } from 'react';
import api from '../../api/client';
import { Users, ChefHat, ShoppingBag, Utensils, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics').then(r => { setStats(r.data); setLoading(false); });
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  const statCards = [
    { label: 'Total Users', val: stats.totalUsers, icon: <Users size={22} />, color: 'teal' },
    { label: 'Total Chefs', val: stats.totalChefs, icon: <ChefHat size={22} />, color: 'blue' },
    { label: 'Total Meals', val: stats.totalMeals, icon: <Utensils size={22} />, color: 'purple' },
    { label: 'Total Orders', val: stats.totalOrders, icon: <ShoppingBag size={22} />, color: 'lime' },
    { label: 'Pending Chefs', val: stats.pendingChefs, icon: <ChefHat size={22} />, color: 'orange' },
    { label: 'Approved Meals', val: stats.approvedMeals, icon: <Utensils size={22} />, color: 'teal' },
    { label: 'Total Revenue', val: `₹${stats.totalRevenue}`, icon: <TrendingUp size={22} />, color: 'lime' },
  ];

  const colorMap = { teal: '#00d4aa', blue: '#3b82f6', purple: '#8b5cf6', lime: '#a8e063', orange: '#f97316' };

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="mb-8">
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Dashboard <span className="text-teal">🛡️</span></h1>
          <p className="text-secondary">Platform overview and management</p>
        </div>

        <div className="grid-4 mb-8">
          {statCards.map(s => (
            <div key={s.label} className="card stat-card">
              <div className="stat-icon" style={{ background: `rgba(${s.color === 'teal' ? '0,212,170' : s.color === 'blue' ? '59,130,246' : s.color === 'purple' ? '139,92,246' : s.color === 'lime' ? '168,224,99' : '249,115,22'},0.12)`, color: colorMap[s.color] }}>
                {s.icon}
              </div>
              <div><div className="stat-val">{s.val}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Recent Orders</h2>
          {stats.recentOrders?.length === 0 ? (
            <div className="alert alert-info">No orders yet</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Customer</th><th>Meal</th><th>Price</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {stats.recentOrders?.map(o => (
                    <tr key={o._id}>
                      <td>{o.userId?.name}</td>
                      <td>{o.mealId?.name}</td>
                      <td>₹{o.totalPrice || o.mealId?.price}</td>
                      <td><span className="badge badge-warning">{o.status}</span></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
