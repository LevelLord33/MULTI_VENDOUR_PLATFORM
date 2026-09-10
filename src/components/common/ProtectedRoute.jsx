import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedType, redirectTo }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={redirectTo || '/login'} replace />;
  }

  if (allowedType && user.type !== allowedType) {
    if (user.type === 'customer') return <Navigate to="/shop" replace />;
    if (user.type === 'vendor') return <Navigate to="/vendor/dashboard" replace />;
    if (user.type === 'admin') return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
