import request from '../components/request';
import type { Student } from '../type';

export const getStudents = (params?: any) => {
  return request.get<{ list: Student[]; total: number }>('/students', { params });
};

export const getClasses = () => {
  return request.get<string[]>('/students/classes');
};

export const createStudent = (data: Partial<Student>) => {
  return request.post<Student>('/students', data);
};

export const updateStudent = (id: number, data: Partial<Student>) => {
  return request.put<Student>(`/students/${id}`, data);
};

export const deleteStudent = (id: number) => {
  return request.delete(`/students/${id}`);
};