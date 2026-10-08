import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedType, redirectTo }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={redirectTo || '/login'} replace />;
  }

  if (allowedType) {
    const types = Array.isArray(allowedType) ? allowedType : [allowedType];
    if (!types.includes(user.type)) {
      if (redirectTo) return <Navigate to={redirectTo} replace />;
      if (user.type === 'customer') return <Navigate to="/shop" replace />;
      if (user.type === 'vendor') return <Navigate to="/vendor/dashboard" replace />;
      if (user.type === 'admin') return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
}
