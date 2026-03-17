import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { LayoutDashboard, Salad, ShoppingBag, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ChefDashboard() {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/chefs/meals'), api.get('/chefs/orders')])
      .then(([m, o]) => { setMeals(m.data); setOrders(o.data); setLoading(false); });
  }, []);

  const approved = meals.filter(m => m.status === 'approved').length;
  const pending = meals.filter(m => m.status === 'pending').length;
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;

  const isApproved = user?.verificationStatus === 'approved';
  const isPending = user?.verificationStatus === 'pending';

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="mb-6">
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            Chef Dashboard <span className="text-teal">👨‍🍳</span>
          </h1>
          <p className="text-secondary">Manage your meals and orders</p>
        </div>

        {/* Verification Status Banner */}
        {isPending && (
          <div className="alert alert-warning mb-6">
            <strong>🕐 Verification Pending</strong> — Your account is under review. You can upload meals but they won't be visible until you're approved and meals are AI-verified.
          </div>
        )}
        {isApproved && (
          <div className="alert alert-success mb-4">
            <strong>✅ Verified Chef</strong> — Your account is active and meals are visible to users.
          </div>
        )}

        {/* Stats */}
        {!loading && (
          <div className="grid-4 mb-8">
            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--success)' }}><CheckCircle size={22} /></div>
              <div><div className="stat-val">{approved}</div><div className="stat-label">Approved Meals</div></div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--warning)' }}><Clock size={22} /></div>
              <div><div className="stat-val">{pending}</div><div className="stat-label">Pending Meals</div></div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--accent-blue)' }}><ShoppingBag size={22} /></div>
              <div><div className="stat-val">{activeOrders}</div><div className="stat-label">Active Orders</div></div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent-teal)' }}><Salad size={22} /></div>
              <div><div className="stat-val">{meals.length}</div><div className="stat-label">Total Meals</div></div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-3 mb-8" style={{ flexWrap: 'wrap' }}>
          <Link to="/chef/upload-meal" className="btn btn-primary"><Salad size={16} />Upload New Meal</Link>
          <Link to="/chef/orders" className="btn btn-secondary"><ShoppingBag size={16} />View Orders</Link>
          <Link to="/chef/profile" className="btn btn-secondary">⚙️ Edit Profile</Link>
        </div>

        {/* Recent Meals */}
        <div className="mb-8">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Your Meals</h2>
          {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : meals.length === 0 ? (
            <div className="alert alert-info">No meals yet. <Link to="/chef/upload-meal" className="text-teal">Upload your first meal →</Link></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Meal</th><th>Category</th><th>Calories</th><th>Protein</th><th>Price</th><th>Status</th></tr></thead>
                <tbody>
                  {meals.map(m => (
                    <tr key={m._id}>
                      <td style={{ fontWeight: 600 }}>{m.name}</td>
                      <td><span className="badge badge-teal">{m.dietCategory}</span></td>
                      <td>{Math.round(m.nutrition?.calories || 0)} kcal</td>
                      <td>{m.nutrition?.protein?.toFixed(1)}g</td>
                      <td>₹{m.price}</td>
                      <td>
                        <span className={`badge badge-${m.status === 'approved' ? 'success' : m.status === 'rejected' ? 'error' : 'warning'}`}>
                          {m.status}
                        </span>
                        {m.status === 'rejected' && m.rejectionReason && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: 2 }}>{m.rejectionReason}</div>
                        )}
                      </td>
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
