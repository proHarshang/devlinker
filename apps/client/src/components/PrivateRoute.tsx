import { Navigate } from 'react-router-dom';

import { useAppSelector } from '@/store';
import { RootState } from '@/store';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
