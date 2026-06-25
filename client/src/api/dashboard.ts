import request from '../components/request';
import type { DashboardData } from '../type';

export const getDashboard = () => {
  return request.get<DashboardData>('/dashboard');
};