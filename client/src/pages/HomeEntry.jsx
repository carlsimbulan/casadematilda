import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Home from './Home.jsx';

export default function HomeEntry() {
  const { user, isAdmin } = useAuth();

  if (user) {
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
  }

  return <Home />;
}
