import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Search, Filter, Flame } from 'lucide-react';

const CATEGORIES = ['All', 'Weight Loss', 'Muscle Gain', 'Diabetic Friendly', 'Healthy Living'];

export default function BrowseMealsPage() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const load = async () => {
      const params = category !== 'All' ? { category } : {};
      const { data } = await api.get('/meals', { params });
      setMeals(data);
      setLoading(false);
    };
    load();
  }, [category]);

  const filtered = meals.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.chefId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="section-header">
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>🍱 Browse Meals</h1>
          <p className="text-secondary">Explore verified home-cooked meals from our chef community</p>
        </div>

        {/* Search + Filters */}
        <div className="browse-controls">
          <div className="search-wrap">
            <Search size={16} />
            <input className="form-input" placeholder="Search meals or chefs…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="category-pills">
            {CATEGORIES.map(c => (
              <button key={c} className={`pill-btn ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
        </div>

        {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
          filtered.length === 0 ? (
            <div className="empty-state">
              <Flame size={48} />
              <h3>No meals found</h3>
              <p>Try a different category or search term</p>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map(m => <MealCard key={m._id} meal={m} />)}
            </div>
          )
        )}
      </div>

      <style>{`
        .browse-controls { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
        .search-wrap { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 10px; padding: 0 14px; }
        .search-wrap svg { color: var(--text-muted); flex-shrink: 0; }
        .search-wrap .form-input { border: none; background: transparent; box-shadow: none; padding-left: 0; }
        .search-wrap .form-input:focus { box-shadow: none; }
        .category-pills { display: flex; gap: 8px; flex-wrap: wrap; }
        .pill-btn { padding: 6px 16px; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--text-secondary); font-size: 0.85rem; font-family: inherit; cursor: pointer; transition: all 0.2s; }
        .pill-btn:hover { border-color: var(--border-hover); color: var(--text-primary); }
        .pill-btn.active { background: var(--accent-teal); border-color: var(--accent-teal); color: #000; font-weight: 600; }
      `}</style>
    </div>
  );
}

function MealCard({ meal }) {
  return (
    <Link to={`/meals/${meal._id}`} className="card" style={{ overflow: 'hidden', textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 180, background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(59,130,246,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', overflow: 'hidden' }}>
        {meal.image ? <img src={`http://localhost:5000${meal.image}`} alt={meal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🥘'}
      </div>
      <div className="p-4 flex flex-col" style={{ flex: 1 }}>
        <div className="flex justify-between items-start mb-2">
          <h3 style={{ fontWeight: 700, fontSize: '1rem', flex: 1 }}>{meal.name}</h3>
          <span className={`badge badge-teal`} style={{ marginLeft: 8, flexShrink: 0 }}>{meal.dietCategory}</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
          by {meal.chefId?.name} · {meal.chefId?.location}
        </p>
        <div className="nutrition-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginTop: 0 }}>
          <div className="nutrition-pill"><div className="val text-teal">{Math.round(meal.nutrition?.calories || 0)}</div><div className="lbl">kcal</div></div>
          <div className="nutrition-pill"><div className="val">{Math.round(meal.nutrition?.protein || 0)}g</div><div className="lbl">protein</div></div>
          <div className="nutrition-pill"><div className="val">{Math.round(meal.nutrition?.carbs || 0)}g</div><div className="lbl">carbs</div></div>
          <div className="nutrition-pill"><div className="val">{Math.round(meal.nutrition?.fat || 0)}g</div><div className="lbl">fat</div></div>
        </div>
        <div className="flex justify-between items-center mt-auto" style={{ paddingTop: 12 }}>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-teal)' }}>₹{meal.price}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ⭐ {meal.chefId?.rating || '—'} ({meal.chefId?.totalReviews || 0})
          </span>
        </div>
      </div>
    </Link>
  );
}
