import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { ChefHat, Star, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function MealDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showOrder, setShowOrder] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/meals/${id}`),
      api.get(`/reviews/chef/${id}`).catch(() => ({ data: [] })),
    ]).then(([mRes, rRes]) => {
      setMeal(mRes.data);
      setReviews(rRes.data);
      setLoading(false);
    });
  }, [id]);

  const placeOrder = async () => {
    if (!user) return navigate('/login');
    if (!address.trim()) return toast.error('Please enter delivery address');
    setOrdering(true);
    try {
      await api.post('/orders', { mealId: meal._id, quantity, deliveryAddress: address });
      toast.success('Order placed! 🎉');
      navigate('/my-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!meal) return <div className="container" style={{ padding: 40 }}><div className="alert alert-error">Meal not found</div></div>;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 32 }}>
        <button className="btn btn-secondary btn-sm mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} />Back
        </button>

        <div className="meal-detail-grid">
          {/* Left: Image + Chef */}
          <div>
            <div className="meal-img-hero">
              {meal.image
                ? <img src={`http://localhost:5000${meal.image}`} alt={meal.name} />
                : <span style={{ fontSize: '6rem' }}>🥘</span>}
            </div>
            <div className="card p-4 mt-4">
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,212,170,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChefHat size={20} style={{ color: 'var(--accent-teal)' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{meal.chefId?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{meal.chefId?.location}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="badge badge-warning"><Star size={12} />{meal.chefId?.rating || '—'}</span>
                <span className="badge badge-blue">{meal.chefId?.totalReviews || 0} reviews</span>
              </div>
              {meal.chefId?.bio && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 10 }}>{meal.chefId.bio}</p>}
            </div>
          </div>

          {/* Right: Details + Order */}
          <div>
            <span className="badge badge-teal mb-2">{meal.dietCategory}</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '8px 0' }}>{meal.name}</h1>
            {meal.description && <p className="text-secondary mb-4">{meal.description}</p>}

            {/* Nutrition */}
            <div className="card p-4 mb-4">
              <h3 style={{ marginBottom: 12, fontWeight: 700 }}>Nutrition Facts</h3>
              <div className="nutrition-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginTop: 0 }}>
                <div className="nutrition-pill"><div className="val text-teal" style={{ fontSize: '1.3rem' }}>{Math.round(meal.nutrition?.calories || 0)}</div><div className="lbl">Calories</div></div>
                <div className="nutrition-pill"><div className="val" style={{ fontSize: '1.3rem' }}>{meal.nutrition?.protein?.toFixed(1)}g</div><div className="lbl">Protein</div></div>
                <div className="nutrition-pill"><div className="val" style={{ fontSize: '1.3rem' }}>{meal.nutrition?.carbs?.toFixed(1)}g</div><div className="lbl">Carbs</div></div>
                <div className="nutrition-pill"><div className="val" style={{ fontSize: '1.3rem' }}>{meal.nutrition?.fat?.toFixed(1)}g</div><div className="lbl">Fat</div></div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="card p-4 mb-4">
              <h3 style={{ marginBottom: 12, fontWeight: 700 }}>Ingredients</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {meal.ingredients?.map((ing, i) => (
                  <span key={i} className="badge badge-blue">{ing.name} – {ing.quantity_g}g</span>
                ))}
              </div>
            </div>

            {/* Price + Order */}
            <div className="card p-4">
              <div className="flex justify-between items-center mb-4">
                <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-teal)' }}>₹{meal.price}</span>
                <div className="flex items-center gap-3">
                  <button className="btn btn-secondary btn-sm" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{quantity}</span>
                  <button className="btn btn-secondary btn-sm" onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
              </div>
              <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: 12 }}>
                Total: <strong style={{ color: 'var(--text-primary)' }}>₹{meal.price * quantity}</strong>
              </p>

              {showOrder ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="form-group">
                    <label className="form-label">Delivery Address</label>
                    <input className="form-input" placeholder="Enter full delivery address"
                      value={address} onChange={e => setAddress(e.target.value)} />
                  </div>
                  <button className="btn btn-primary btn-full" onClick={placeOrder} disabled={ordering}>
                    {ordering ? 'Placing Order…' : `Confirm Order – ₹${meal.price * quantity}`}
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setShowOrder(false)}>Cancel</button>
                </div>
              ) : (
                <button className="btn btn-primary btn-full btn-lg"
                  onClick={() => user ? setShowOrder(true) : navigate('/login')}>
                  <ShoppingCart size={18} />
                  {user ? 'Order Now' : 'Login to Order'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-8">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Reviews ({reviews.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map(r => (
                <div key={r._id} className="card p-4">
                  <div className="flex justify-between items-start">
                    <div><div style={{ fontWeight: 600 }}>{r.userId?.name}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</div></div>
                    <div className="flex gap-1">{'★'.repeat(r.rating)}<span style={{ color: 'var(--text-muted)' }}>{'★'.repeat(5 - r.rating)}</span></div>
                  </div>
                  {r.comment && <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: 8 }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .meal-detail-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 32px; margin-bottom: 40px; }
        .meal-img-hero { height: 280px; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(0,212,170,0.08), rgba(59,130,246,0.08)); display: flex; align-items: center; justify-content: center; }
        .meal-img-hero img { width: 100%; height: 100%; object-fit: cover; }
        @media (max-width: 768px) { .meal-detail-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
