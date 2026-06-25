import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Courses from '../pages/Courses';
import Students from '../pages/Students';
import Summary from '../pages/Summary';

// 路由守卫：未登录跳转到登录页
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <AuthGuard><Layout /></AuthGuard>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'courses', element: <Courses /> },
      { path: 'students', element: <Students /> },
      { path: 'summary', element: <Summary /> }
    ]
  }
]);

export default router;