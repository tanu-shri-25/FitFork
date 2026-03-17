import { useState, useEffect } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { ShoppingBag } from 'lucide-react';

const NEXT_STATUS = { placed: 'accepted', accepted: 'preparing', preparing: 'ready', ready: 'delivered' };
const STATUS_COLOR = { placed: 'warning', accepted: 'blue', preparing: 'orange', ready: 'purple', delivered: 'success', cancelled: 'error' };

export default function ChefOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/chefs/orders').then(r => { setOrders(r.data); setLoading(false); });
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await api.patch(`/chefs/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: data.status } : o));
      toast.success(`Order ${status}!`);
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="section-header">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Incoming Orders</h1>
          <p className="text-secondary">Manage and update order status</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state"><ShoppingBag size={48} /><h3>No orders yet</h3></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(o => (
              <div key={o._id} className="card p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 style={{ fontWeight: 700 }}>{o.mealId?.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Customer: <strong>{o.userId?.name}</strong> ({o.userId?.email})
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Qty: {o.quantity} · Total: ₹{o.totalPrice}
                    </p>
                    {o.deliveryAddress && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        📍 {o.deliveryAddress}
                      </p>
                    )}
                    {o.notes && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>📝 {o.notes}</p>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span className={`badge badge-${STATUS_COLOR[o.status] || 'blue'}`}>{o.status}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(o.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {NEXT_STATUS[o.status] && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => updateStatus(o._id, NEXT_STATUS[o.status])}>
                    Mark as {NEXT_STATUS[o.status]}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
