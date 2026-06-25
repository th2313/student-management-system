import request from '../components/request';
import type { LoginReq, LoginRes, UserInfo } from '../type';

// 登录
export const login = (data: LoginReq) => {
  return request.post<LoginRes>('/auth/login', data);
};

// 获取当前用户信息
export const getMe = () => {
  return request.get<UserInfo>('/auth/me');
};