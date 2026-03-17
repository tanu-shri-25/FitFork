import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// User
import UserDashboard from './pages/user/UserDashboard';
import HealthProfilePage from './pages/user/HealthProfilePage';
import BrowseMealsPage from './pages/user/BrowseMealsPage';
import MealDetailPage from './pages/user/MealDetailPage';
import MyOrdersPage from './pages/user/MyOrdersPage';

// Chef
import ChefDashboard from './pages/chef/ChefDashboard';
import UploadMealPage from './pages/chef/UploadMealPage';
import ChefOrdersPage from './pages/chef/ChefOrdersPage';
import ChefProfilePage from './pages/chef/ChefProfilePage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ChefVerificationPage from './pages/admin/ChefVerificationPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

// Landing
import LandingPage from './pages/LandingPage';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User routes */}
        <Route path="/dashboard" element={<ProtectedRoute roles={['user']}><UserDashboard /></ProtectedRoute>} />
        <Route path="/health-profile" element={<ProtectedRoute roles={['user']}><HealthProfilePage /></ProtectedRoute>} />
        <Route path="/meals" element={<BrowseMealsPage />} />
        <Route path="/meals/:id" element={<MealDetailPage />} />
        <Route path="/my-orders" element={<ProtectedRoute roles={['user']}><MyOrdersPage /></ProtectedRoute>} />

        {/* Chef routes */}
        <Route path="/chef/dashboard" element={<ProtectedRoute roles={['chef']}><ChefDashboard /></ProtectedRoute>} />
        <Route path="/chef/upload-meal" element={<ProtectedRoute roles={['chef']}><UploadMealPage /></ProtectedRoute>} />
        <Route path="/chef/orders" element={<ProtectedRoute roles={['chef']}><ChefOrdersPage /></ProtectedRoute>} />
        <Route path="/chef/profile" element={<ProtectedRoute roles={['chef']}><ChefProfilePage /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/chefs" element={<ProtectedRoute roles={['admin']}><ChefVerificationPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminOrdersPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1b2e',
              color: '#f0f6ff',
              border: '1px solid rgba(56,109,201,0.3)',
              borderRadius: '12px',
            },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
