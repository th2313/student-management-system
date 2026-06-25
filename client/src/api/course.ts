import request from '../components/request';
import type { Course } from '../type';

export const getCourses = (params?: any) => {
  return request.get<{ list: Course[]; total: number }>('/courses', { params });
};

export const getCourseCategories = () => {
  return request.get<string[]>('/courses/categories');
};

export const createCourse = (data: Partial<Course>) => {
  return request.post<Course>('/courses', data);
};

export const updateCourse = (id: number, data: Partial<Course>) => {
  return request.put<Course>(`/courses/${id}`, data);
};

export const deleteCourse = (id: number) => {
  return request.delete(`/courses/${id}`);
};

export const toggleCourseStatus = (id: number) => {
  return request.patch<Course>(`/courses/${id}/status`);
};

// 获取所有课程（用于学生选课列表）
export const getAllCourses = () => {
  return request.get<{ list: Course[]; total: number }>('/courses', { params: { pageSize: 100 } });
};