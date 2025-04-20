import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Dashboard from '@/pages/dashboard/Dashboard';
import PrivateRoute from '@/components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
