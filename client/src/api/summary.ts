import request from '../components/request';
import type { SummaryData } from '../type';

export const getSummary = () => {
  return request.get<SummaryData>('/summary');
};