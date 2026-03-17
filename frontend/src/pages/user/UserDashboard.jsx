import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { Sparkles, Salad, ShoppingBag, User, ArrowRight, Star } from 'lucide-react';
import '../../pages/LandingPage.css';

const GOAL_COLOR = {
  'Weight Loss': 'teal', 'Muscle Gain': 'blue',
  'Diabetic Friendly': 'lime', 'Healthy Living': 'purple',
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [recommended, setRecommended] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [recRes, ordRes] = await Promise.all([
          api.get('/meals/recommended').catch(() => ({ data: { meals: [], tip: '' } })),
          api.get('/orders/my').catch(() => ({ data: [] })),
        ]);
        setRecommended(recRes.data.meals || []);
        setTip(recRes.data.tip || '');
        setOrders(ordRes.data.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const goal = user?.healthProfile?.goal;
  const hasProfile = !!goal;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40 }}>
        {/* Greeting */}
        <div className="mb-8">
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            Hello, <span className="text-teal">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-secondary">Here's your personalized dashboard</p>
        </div>

        {/* Health Alert */}
        {!hasProfile && (
          <div className="alert alert-warning mb-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span>🎯 Complete your health profile to get AI meal recommendations!</span>
            <Link to="/health-profile" className="btn btn-primary btn-sm">Set Goal <ArrowRight size={14} /></Link>
          </div>
        )}

        {/* Goal + Tip */}
        {hasProfile && (
          <div className="card p-6 mb-6" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Your Diet Goal</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }} className="text-teal">{goal}</div>
              {tip && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 8 }}>{tip}</p>}
            </div>
            <Link to="/health-profile" className="btn btn-secondary btn-sm"><User size={14} />Edit Profile</Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid-3 mb-8">
          <Link to="/meals" className="card stat-card" style={{ textDecoration: 'none' }}>
            <div className="stat-icon" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent-teal)' }}><Salad size={22} /></div>
            <div><div className="stat-val">Browse</div><div className="stat-label">All Meals</div></div>
          </Link>
          <Link to="/my-orders" className="card stat-card" style={{ textDecoration: 'none' }}>
            <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--accent-blue)' }}><ShoppingBag size={22} /></div>
            <div><div className="stat-val">{orders.length}</div><div className="stat-label">Recent Orders</div></div>
          </Link>
          <Link to="/health-profile" className="card stat-card" style={{ textDecoration: 'none' }}>
            <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--accent-purple)' }}><User size={22} /></div>
            <div><div className="stat-val">Profile</div><div className="stat-label">Health Data</div></div>
          </Link>
        </div>

        {/* Recommended Meals */}
        {hasProfile && (
          <div className="mb-8">
            <div className="section-header flex justify-between items-center">
              <div>
                <h2 style={{ fontSize: '1.4rem' }}><Sparkles size={18} style={{ color: 'var(--accent-teal)', marginRight: 8 }} />AI Recommendations</h2>
                <p>Meals matched to your <strong>{goal}</strong> goal</p>
              </div>
              <Link to="/meals" className="btn btn-secondary btn-sm">See all <ArrowRight size={14} /></Link>
            </div>
            {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
              recommended.length === 0 ? (
                <div className="alert alert-info">No approved meals for your goal yet. Check back soon!</div>
              ) : (
                <div className="grid-3">
                  {recommended.map(m => <MealCard key={m._id} meal={m} />)}
                </div>
              )
            )}
          </div>
        )}

        {/* Recent Orders */}
        {orders.length > 0 && (
          <div>
            <div className="section-header flex justify-between items-center">
              <h2 style={{ fontSize: '1.4rem' }}>Recent Orders</h2>
              <Link to="/my-orders" className="btn btn-secondary btn-sm">All orders <ArrowRight size={14} /></Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.map(o => (
                <div key={o._id} className="card p-4 flex justify-between items-center gap-3">
                  <div>
                    <div style={{ fontWeight: 600 }}>{o.mealId?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Chef: {o.chefId?.name} · ₹{o.totalPrice}
                    </div>
                  </div>
                  <span className={`badge badge-${o.status === 'delivered' ? 'success' : o.status === 'cancelled' ? 'error' : 'warning'}`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MealCard({ meal }) {
  return (
    <Link to={`/meals/${meal._id}`} className="card" style={{ overflow: 'hidden', textDecoration: 'none' }}>
      <div style={{ height: 160, background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(59,130,246,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
        {meal.image ? <img src={`http://localhost:5000${meal.image}`} alt={meal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🍱'}
      </div>
      <div className="p-4">
        <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{meal.name}</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 10 }}>{meal.chefId?.name}</p>
        <div className="nutrition-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
          <div className="nutrition-pill"><div className="val text-teal">{Math.round(meal.nutrition?.calories || 0)}</div><div className="lbl">kcal</div></div>
          <div className="nutrition-pill"><div className="val">{Math.round(meal.nutrition?.protein || 0)}g</div><div className="lbl">protein</div></div>
          <div className="nutrition-pill"><div className="val">{Math.round(meal.nutrition?.carbs || 0)}g</div><div className="lbl">carbs</div></div>
          <div className="nutrition-pill"><div className="val">{Math.round(meal.nutrition?.fat || 0)}g</div><div className="lbl">fat</div></div>
        </div>
        <div className="flex justify-between items-center" style={{ marginTop: 12 }}>
          <span style={{ fontWeight: 700, color: 'var(--accent-teal)' }}>₹{meal.price}</span>
          <span className="btn btn-primary btn-sm">Order</span>
        </div>
      </div>
    </Link>
  );
}
