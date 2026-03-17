import { useState, useEffect } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { ShoppingBag } from 'lucide-react';

const STATUS_STEPS = ['placed', 'accepted', 'preparing', 'ready', 'delivered'];
const STATUS_COLOR = { placed: 'warning', accepted: 'blue', preparing: 'orange', ready: 'purple', delivered: 'success', cancelled: 'error' };

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(null);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    api.get('/orders/my').then(r => { setOrders(r.data); setLoading(false); });
  }, []);

  const submitReview = async (order) => {
    try {
      await api.post('/reviews', { chefId: order.chefId._id, orderId: order._id, rating: stars, comment });
      toast.success('Review submitted!');
      setReviewing(null);
      setComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="section-header">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>My Orders</h1>
          <p className="text-secondary">Track your meal deliveries</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={48} />
            <h3>No orders yet</h3>
            <p>Browse our meals and place your first order!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {orders.map(o => (
              <div key={o._id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{o.mealId?.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Chef: {o.chefId?.name} · Qty: {o.quantity} · ₹{o.totalPrice}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`badge badge-${STATUS_COLOR[o.status] || 'blue'}`}>{o.status}</span>
                </div>

                {/* Timeline */}
                <div className="timeline">
                  {STATUS_STEPS.map((step, i) => {
                    const stepIdx = STATUS_STEPS.indexOf(o.status);
                    const done = i <= stepIdx;
                    const isLast = i === STATUS_STEPS.length - 1;
                    return (
                      <div key={step} className="timeline-item">
                        <div className="timeline-dot-wrap">
                          <div className={`timeline-dot ${done ? 'active' : ''}`} />
                          {!isLast && <div className="timeline-line" />}
                        </div>
                        <div className="timeline-content">
                          <div className={`t-status ${done ? 'text-teal' : 'text-muted'}`}>
                            {step.charAt(0).toUpperCase() + step.slice(1)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {o.status === 'delivered' && (
                  reviewing === o._id ? (
                    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div className="stars">
                        {[1,2,3,4,5].map(n => (
                          <span key={n} className={`star ${n <= stars ? 'filled' : ''}`} onClick={() => setStars(n)}>★</span>
                        ))}
                      </div>
                      <textarea className="form-input" rows={2} placeholder="Leave a comment (optional)"
                        value={comment} onChange={e => setComment(e.target.value)} />
                      <div className="flex gap-2">
                        <button className="btn btn-primary btn-sm" onClick={() => submitReview(o)}>Submit Review</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setReviewing(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}
                      onClick={() => setReviewing(o._id)}>⭐ Rate Chef</button>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
