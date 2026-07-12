import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PublicLayout from './PublicLayout.jsx';
import DashboardLayout from './DashboardLayout.jsx';

export default function AppShell() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <DashboardLayout onLogout={() => navigate('/')} />;
  }

  return <PublicLayout />;
}
