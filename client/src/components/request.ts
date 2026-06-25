import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';

// 定义后端统一响应结构
export interface ApiRes<T = any> {
  code: number;
  msg: string;
  data: T;
}

interface ErrorResponse {
  msg?: string;
}

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err: AxiosError) => Promise.reject(err)
);

instance.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.data?.code !== 0) {
      message.error(res.data?.msg || '请求失败');
      return Promise.reject(res.data);
    }
    return res.data; // 直接返回 ApiRes<T>
  },
  (err: AxiosError) => {
    const errorData = err.response?.data as ErrorResponse;
    message.error(errorData?.msg || '服务器连接失败');
    return Promise.reject(err);
  }
);

// 覆盖类型声明，让所有请求方法直接返回 Promise<ApiRes<T>>
interface RequestInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiRes<T>>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiRes<T>>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiRes<T>>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiRes<T>>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiRes<T>>;
}

export default instance as RequestInstance;