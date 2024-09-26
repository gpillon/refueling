import axios from 'axios';
import { Vehicle, Refueling, NewVehicle, NewRefueling, LoginResponse, ApiResponse, User } from '../types';
const SOCKET_SERVER_HOST: string = process.env.REACT_APP_SOCKET_HOST || 'localhost:3000';

interface BackendUrls {
    socket_url: string;
    api_url: string;
}

export const getBackendHost = (): BackendUrls => {
    const socket_protocol: string = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket_url: string = process.env.PROD_BUILD === "true" 
        ? `${socket_protocol}//${SOCKET_SERVER_HOST}` 
        : `${socket_protocol}//localhost:3000`;

    const api_url: string = process.env.PROD_BUILD === "true" 
        ? `${window.location.protocol}//${window.location.host}` 
        : `${window.location.protocol}//localhost:3000`;

    return {
        socket_url, 
        api_url
    };
};

const API_URL = getBackendHost().api_url;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/users/login', { username, password });
  return response.data;
};

// Vehicle operations
export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await api.get<Vehicle[]>('/api/vehicles');
  return response.data;
};

export const createVehicle = async (vehicleData: NewVehicle): Promise<Vehicle> => {
  const response = await api.post<Vehicle>('/api/vehicles', vehicleData);
  return response.data;
};

export const updateVehicle = async (id: number, vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
  const response = await api.patch<Vehicle>(`/api/vehicles/${id}`, vehicleData);
  return response.data;
};

export const deleteVehicle = async (id: number): Promise<void> => {
  await api.delete(`/api/vehicles/${id}`);
};

// Refueling operations
export const getRefuelings = async (params: URLSearchParams): Promise<Refueling[]> => {
  const response = await api.get<Refueling[]>('/api/refuelings', { params });
  return response.data;
};

export const createRefueling = async (refuelingData: NewRefueling): Promise<Refueling> => {
  const response = await api.post<Refueling>('/api/refuelings', refuelingData);
  return response.data;
};

export const updateRefueling = async (id: number, refuelingData: Partial<Refueling>): Promise<Refueling> => {
  refuelingData.vehicleId = refuelingData.vehicle?.id || 0;
  Reflect.deleteProperty(refuelingData, 'vehicle');
  const response = await api.patch<Refueling>(`/api/refuelings/${id}`, refuelingData);
  return response.data;
};

export const deleteRefueling = async (id: number): Promise<void> => {
  await api.delete(`/api/refuelings/${id}`);
};

// User operations
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/api/users');
  return response.data;
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const response = await api.post<User>('/api/users', userData);
  return response.data;
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  const response = await api.patch<User>(`/api/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/api/users/${id}`);
};

export default api;