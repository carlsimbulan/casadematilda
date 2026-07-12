import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function PrivateRoute({ children, adminOnly = false }) {
  const { user, isAdmin, openAuthDrawer } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      openAuthDrawer('login', location.pathname + location.search);
    }
  }, [user, location.pathname, location.search, openAuthDrawer]);

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-stone-50">
        <p className="text-stone-400 text-sm">Sign in using the panel on the right to continue.</p>
      </div>
    );
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
