import axios from 'axios';
import { User, LoginCredentials, AuthResponse, CreateUserRequest } from '../types/auth';
import { PageResponse } from '../types/item';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

// Add 401 interceptor to redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  loginWithGoogle: (): void => {
    window.location.href = '/oauth2/authorization/google';
  },
};

export const adminApi = {
  getUsers: async (params: { page?: number; size?: number; sortBy?: string; sortDir?: string } = {}): Promise<PageResponse<User>> => {
    const response = await api.get<PageResponse<User>>('/admin/users', { params });
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post<User>('/admin/users', data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  updateUserRole: async (id: string, role: string): Promise<User> => {
    const response = await api.patch<User>(`/admin/users/${id}/role`, { role });
    return response.data;
  },
};
