import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedLink({ to, children, className, onClick }) {
  const { user, openAuthDrawer } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    onClick?.(e);
    if (user) {
      navigate(to);
    } else {
      openAuthDrawer('login', to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
