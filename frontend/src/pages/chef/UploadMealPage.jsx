import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Plus, Minus, Sparkles, CheckCircle, XCircle } from 'lucide-react';

const CATEGORIES = ['Weight Loss', 'Muscle Gain', 'Diabetic Friendly', 'Healthy Living'];

export default function UploadMealPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', dietCategory: '', price: 150 });
  const [ingredients, setIngredients] = useState([{ name: '', quantity_g: '' }]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { approved, message, nutrition }

  const addIngredient = () => setIngredients(i => [...i, { name: '', quantity_g: '' }]);
  const removeIngredient = (idx) => setIngredients(i => i.filter((_, j) => j !== idx));
  const updateIngredient = (idx, field, val) => setIngredients(i => i.map((ing, j) => j === idx ? { ...ing, [field]: val } : ing));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validIngs = ingredients.filter(i => i.name && i.quantity_g);
    if (validIngs.length === 0) return toast.error('Add at least one ingredient');
    if (!form.dietCategory) return toast.error('Select a diet category');

    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('dietCategory', form.dietCategory);
      fd.append('price', form.price);
      fd.append('ingredients', JSON.stringify(validIngs.map(i => ({ name: i.name, quantity_g: Number(i.quantity_g) }))));
      if (imageFile) fd.append('image', imageFile);

      const { data } = await api.post('/chefs/meals', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult({ approved: data.approved, message: data.message, nutrition: data.nutrition });
      toast[data.approved ? 'success' : 'error'](data.approved ? 'Meal approved and listed! 🎉' : 'Meal rejected by AI');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40, maxWidth: 720 }}>
        <div className="mb-6">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Upload New Meal 🍳</h1>
          <p className="text-secondary">Add ingredients and let AI calculate nutrition & verify diet compliance</p>
        </div>

        {result && (
          <div className={`alert ${result.approved ? 'alert-success' : 'alert-error'} mb-6`}>
            <div className="flex items-center gap-2 mb-2">
              {result.approved ? <CheckCircle size={18} /> : <XCircle size={18} />}
              <strong>{result.approved ? 'AI Approved!' : 'AI Rejected'}</strong>
            </div>
            <p>{result.message}</p>
            {result.nutrition && (
              <div className="nutrition-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginTop: 12 }}>
                <div className="nutrition-pill"><div className="val">{Math.round(result.nutrition.calories)}</div><div className="lbl">kcal</div></div>
                <div className="nutrition-pill"><div className="val">{result.nutrition.protein?.toFixed(1)}g</div><div className="lbl">Protein</div></div>
                <div className="nutrition-pill"><div className="val">{result.nutrition.carbs?.toFixed(1)}g</div><div className="lbl">Carbs</div></div>
                <div className="nutrition-pill"><div className="val">{result.nutrition.fat?.toFixed(1)}g</div><div className="lbl">Fat</div></div>
              </div>
            )}
            {result.approved && (
              <button className="btn btn-success btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/chef/dashboard')}>
                Go to Dashboard
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card p-6">
            <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Meal Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Meal Name *</label>
                <input className="form-input" placeholder="e.g. Chicken Protein Bowl" required
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={2} placeholder="Brief description of the meal"
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Diet Category *</label>
                  <select className="form-input" required value={form.dietCategory}
                    onChange={e => setForm(f => ({ ...f, dietCategory: e.target.value }))}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input className="form-input" type="number" min="50" max="1000"
                    value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Meal Photo</label>
                <input className="form-input" type="file" accept="image/*"
                  onChange={e => setImageFile(e.target.files[0])} />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex justify-between items-center mb-16">
              <h3 style={{ fontWeight: 700 }}>Ingredients *</h3>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addIngredient}>
                <Plus size={14} />Add
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input className="form-input" placeholder="Ingredient name" style={{ flex: 2 }}
                    value={ing.name} onChange={e => updateIngredient(idx, 'name', e.target.value)} />
                  <input className="form-input" type="number" placeholder="Grams" style={{ flex: 1 }}
                    value={ing.quantity_g} onChange={e => updateIngredient(idx, 'quantity_g', e.target.value)} />
                  <button type="button" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}
                    onClick={() => removeIngredient(idx)} disabled={ingredients.length === 1}>
                    <Minus size={14} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-muted" style={{ fontSize: '0.78rem', marginTop: 10 }}>
              Supported: chicken, brown rice, vegetables, oats, paneer, eggs, olive oil, and 50+ more.
            </p>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            <Sparkles size={18} />
            {loading ? 'AI Verifying Nutrition…' : 'Submit & AI Verify'}
          </button>
        </form>
      </div>
    </div>
  );
}
