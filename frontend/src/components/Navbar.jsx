import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UtensilsCrossed, Menu, X, User, ChefHat, LayoutDashboard,
  ShoppingBag, LogOut, Salad, Settings, Shield
} from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/meals', label: 'Browse Meals', icon: <Salad size={16} /> },
    { to: '/my-orders', label: 'My Orders', icon: <ShoppingBag size={16} /> },
    { to: '/health-profile', label: 'Health Profile', icon: <User size={16} /> },
  ];

  const chefLinks = [
    { to: '/chef/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/chef/upload-meal', label: 'Upload Meal', icon: <Salad size={16} /> },
    { to: '/chef/orders', label: 'Orders', icon: <ShoppingBag size={16} /> },
    { to: '/chef/profile', label: 'Profile', icon: <Settings size={16} /> },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/admin/chefs', label: 'Chefs', icon: <ChefHat size={16} /> },
    { to: '/admin/users', label: 'Users', icon: <User size={16} /> },
    { to: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={16} /> },
  ];

  const links =
    user?.role === 'chef' ? chefLinks :
    user?.role === 'admin' ? adminLinks :
    user ? userLinks : [];

  const isActive = (to) => location.pathname === to;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            <UtensilsCrossed size={24} />
            <span>Fork<span className="text-teal">Fit</span></span>
          </Link>

          <div className={`nav-links ${open ? 'open' : ''}`}>
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`nav-link ${isActive(l.to) ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {l.icon}{l.label}
              </Link>
            ))}
            {!user && (
              <>
                <Link to="/meals" className={`nav-link ${isActive('/meals') ? 'active' : ''}`} onClick={() => setOpen(false)}>
                  <Salad size={16} />Browse Meals
                </Link>
              </>
            )}
          </div>

          <div className="nav-actions">
            {user ? (
              <div className="nav-user">
                <div className="nav-user-info">
                  <div className="nav-avatar">
                    {user.role === 'chef' ? <ChefHat size={16} /> :
                     user.role === 'admin' ? <Shield size={16} /> :
                     <User size={16} />}
                  </div>
                  <span className="nav-username">{user.name?.split(' ')[0]}</span>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                  <LogOut size={14} />Logout
                </button>
              </div>
            ) : (
              <div className="nav-auth">
                <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Join Free</Link>
              </div>
            )}
            <button className="nav-hamburger" onClick={() => setOpen(o => !o)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
