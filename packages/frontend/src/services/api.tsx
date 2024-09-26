import axios from 'axios';
import { Vehicle, Refueling, NewVehicle, NewRefueling, LoginResponse, ApiResponse } from '../types';

const API_URL = 'http://localhost:3000';

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
    const response = await api.post<LoginResponse>('/users/login', { username, password });
    return response.data;
  };
  
  export const getVehicles = async (): Promise<Vehicle[]> => {
    const response = await api.get<Vehicle[]>('/vehicles');
    return response.data;
  };
  
  export const createVehicle = async (vehicleData: NewVehicle): Promise<Vehicle> => {
    const response = await api.post<Vehicle>('/vehicles', vehicleData);
    return response.data;
  };
  
  export const updateVehicle = async (id: number, vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await api.patch<Vehicle>(`/vehicles/${id}`, vehicleData);
    return response.data;
  };
  
  export const deleteVehicle = async (id: number): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  };
  
  export const getRefuelings = async (params: URLSearchParams): Promise<Refueling[]> => {
    const response = await api.get<Refueling[]>('/refuelings', { params });
    return response.data;
  };
  
  export const createRefueling = async (refuelingData: NewRefueling): Promise<Refueling> => {
    const response = await api.post<Refueling>('/refuelings', refuelingData);
    return response.data;
  };
  
  export const updateRefueling = async (id: number, refuelingData: Partial<Refueling>): Promise<Refueling> => {
    refuelingData.vehicleId = refuelingData.vehicle?.id || 0;
    Reflect.deleteProperty(refuelingData, 'vehicle');
    const response = await api.patch<Refueling>(`/refuelings/${id}`, refuelingData);
    return response.data;
  };
  
  export const deleteRefueling = async (id: number): Promise<void> => {
    await api.delete(`/refuelings/${id}`);
  };

export default api;
