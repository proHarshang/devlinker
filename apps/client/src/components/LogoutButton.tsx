import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store';
import { logout } from '@/store/slices/auth.slice';

const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Button variant="ghost" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
