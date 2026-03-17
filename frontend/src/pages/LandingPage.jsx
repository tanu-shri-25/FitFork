import { Link } from 'react-router-dom';
import { UtensilsCrossed, Sparkles, Shield, Heart, Zap, ChefHat, ArrowRight } from 'lucide-react';

const goals = [
  { label: 'Weight Loss', icon: '🥗', color: 'teal', desc: '300–500 kcal, high protein meals' },
  { label: 'Muscle Gain', icon: '💪', color: 'blue', desc: '500–800 kcal, 35g+ protein meals' },
  { label: 'Diabetic Friendly', icon: '🌿', color: 'lime', desc: 'Low-GI, fibre-rich balanced meals' },
  { label: 'Healthy Living', icon: '✨', color: 'purple', desc: '350–600 kcal, whole food meals' },
];

const steps = [
  { n: '01', title: 'Set Your Goal', desc: 'Tell us your health target and let AI personalize your meal plan.' },
  { n: '02', title: 'Browse Meals', desc: 'Explore verified home-cooked meals that match your diet category.' },
  { n: '03', title: 'Order & Enjoy', desc: 'Place an order and your local home chef will prepare it fresh.' },
];

export default function LandingPage() {
  return (
    <div className="page landing">
      {/* Hero */}
      <section className="landing-hero">
        <div className="container">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>AI-Powered Diet Meal Delivery</span>
          </div>
          <h1>
            Eat <span className="hero-gradient">Healthy.</span><br />
            Live <span className="hero-gradient">Better.</span>
          </h1>
          <p>
            ForkFit connects you with verified home chefs who prepare goal-aligned meals. AI recommends what's right for <em>you</em>.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/meals" className="btn btn-secondary btn-lg">
              Browse Meals
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><span className="hero-stat-val">500+</span><span>Verified Chefs</span></div>
            <div className="hero-stat-div" />
            <div className="hero-stat"><span className="hero-stat-val">2k+</span><span>Meals Available</span></div>
            <div className="hero-stat-div" />
            <div className="hero-stat"><span className="hero-stat-val">10k+</span><span>Happy Users</span></div>
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="landing-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Choose Your <span className="hero-gradient">Diet Goal</span></h2>
            <p>Meals crafted and AI-verified for each health objective</p>
          </div>
          <div className="grid-4">
            {goals.map((g) => (
              <div key={g.label} className={`card goal-card goal-${g.color}`}>
                <div className="goal-icon">{g.icon}</div>
                <h3>{g.label}</h3>
                <p>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>How It <span className="hero-gradient">Works</span></h2>
          </div>
          <div className="grid-3">
            {steps.map((s) => (
              <div key={s.n} className="card step-card p-6">
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-section">
        <div className="container">
          <div className="landing-features">
            <div className="feature-item">
              <div className="feature-icon" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent-teal)' }}>
                <Sparkles size={24} />
              </div>
              <div>
                <h3>AI Meal Recommendations</h3>
                <p>Our AI analyses your health profile and recommends the best meals for your specific goal.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--accent-blue)' }}>
                <Shield size={24} />
              </div>
              <div>
                <h3>Nutrition Verified</h3>
                <p>Every meal is automatically checked against diet rules before it's listed on the platform.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--accent-purple)' }}>
                <ChefHat size={24} />
              </div>
              <div>
                <h3>Verified Home Chefs</h3>
                <p>All chefs submit ID and kitchen proof, reviewed and approved by our admin team.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{ background: 'rgba(168,224,99,0.12)', color: 'var(--accent-lime)' }}>
                <Heart size={24} />
              </div>
              <div>
                <h3>Homemade with Love</h3>
                <p>Fresh, homemade food prepared in hygienic kitchens — not factory-processed meals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="landing-cta-banner">
        <div className="container text-center">
          <Zap size={40} style={{ color: 'var(--accent-teal)', marginBottom: 16 }} />
          <h2>Ready to eat healthy?</h2>
          <p>Join thousands who eat smarter with ForkFit every day.</p>
          <div className="hero-cta" style={{ justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Start Your Journey <ArrowRight size={18} /></Link>
            <Link to="/register?role=chef" className="btn btn-secondary btn-lg"><ChefHat size={18} />Join as Chef</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
