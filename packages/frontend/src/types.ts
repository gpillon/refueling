export enum FuelType {
    GASOLINE = 'GASOLINE',
    DIESEL = 'DIESEL',
    ELECTRIC = 'ELECTRIC',
  }


export interface Vehicle {
    id: number;
    make: string;
    model: string;
    plate: string;
    type: string;
    year: number;
  }
  
  export interface Refueling {
    id: number;
    date: string;
    liters: number;
    cost: number;
    kilometers: number;
    fuelType: FuelType;
    vehicleId: number;
    vehicle?: Vehicle;
  }
  
  export interface NewVehicle {
    make: string;
    model: string;
    plate: string;
    type: string;
    year: number;
  }
  
  export interface NewRefueling {
    date: string;
    liters: number;
    cost: number;
    fuelType: FuelType;
    kilometers: number;
    vehicleId: number;
  }
  
  export interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    handleUnauthorized: () => void;
  }
  
  export interface LoginResponse {
    access_token: string;
  }
  
  export interface ApiResponse<T> {
    data: T;
  }
  
  export interface User {
    id: number;
    password?: string;
    username: string;
    role: string;
  }

  export interface DecodedToken {
    role: string;
    sub: string;
    iat: number;
    exp: number;
    username: string;
  }
  