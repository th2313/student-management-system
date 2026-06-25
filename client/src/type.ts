// 登录相关类型
export interface LoginReq {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
  user: UserInfo;
}

export interface UserInfo {
  id: number;
  username: string;
  name: string;
  role: string;
  avatar: string;
  created_at: string;
}

// 工作台类型
export interface DashboardData {
  stats: {
    totalCourses: number;
    publishedCourses: number;
    totalStudents: number;
    activeStudents: number;
  };
    charts: {
    enrollment: Array<{ name: string; value: number }>;
    activity: Array<{ date: string; label: string; students: number; duration: number }>;
    statusDist: Array<{ name: string; value: number }>;
    categoryDist: Array< { name: string; value: number }>;
  };
}


// 课程类型
export interface Course {
  id: number;
  name: string;
  description: string;
  instructor: string;
  cover: string;
  category: string;
  status: 'published' | 'draft';
  student_count: number;
  lesson_count: number;
  created_at: string;
  updated_at: string;
}

// 学生类型
export interface Student {
  id: number;
  name: string;
  student_no: string;
  class_name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  course_ids: number[];
  created_at: string;
  updated_at: string;
}

// 学习总结类型
export interface SummaryData {
  content: string;
}

// 统一响应类型（匹配接口文档）
export interface ApiRes<T> {
  code: number;
  msg: string;
  data: T;
}