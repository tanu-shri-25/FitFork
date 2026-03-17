import { useState, useEffect } from 'react';
import api from '../../api/client';
import { ShoppingBag } from 'lucide-react';

const STATUS_COLOR = { placed: 'warning', accepted: 'blue', preparing: 'orange', ready: 'purple', delivered: 'success', cancelled: 'error' };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/orders').then(r => { setOrders(r.data); setLoading(false); });
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="section-header">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>All Orders <span className="badge badge-teal" style={{ fontSize: '1rem' }}>{orders.length}</span></h1>
          <p className="text-secondary">Monitor all platform orders</p>
        </div>
        {orders.length === 0 ? (
          <div className="empty-state"><ShoppingBag size={48} /><h3>No orders yet</h3></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Customer</th><th>Meal</th><th>Chef</th><th>Qty</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 600 }}>{o.userId?.name}</td>
                    <td>{o.mealId?.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{o.chefId?.name}</td>
                    <td>{o.quantity}</td>
                    <td style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>₹{o.totalPrice}</td>
                    <td><span className={`badge badge-${STATUS_COLOR[o.status] || 'blue'}`}>{o.status}</span></td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
