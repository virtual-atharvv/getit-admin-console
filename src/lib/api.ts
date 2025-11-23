const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://anonymousananta-town-blinkit-backend.hf.space';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'customer' | 'seller' | 'admin' | 'delivery';
  created_at?: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  owner_id: string;
  is_active?: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  is_active: boolean;
  created_at?: string;
}

export interface HealthStatus {
  status: string;
  database?: string;
  timestamp?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health endpoints
  async getHealth(): Promise<HealthStatus> {
    return this.request<HealthStatus>('/health');
  }

  async getStatus(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/');
  }

  // User endpoints
  async createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async getUsers(role?: string): Promise<User[]> {
    const endpoint = role ? `/users?role=${role}` : '/users';
    return this.request<User[]>(endpoint);
  }

  // Store endpoints
  async createStore(store: Omit<Store, 'id' | 'created_at'>): Promise<Store> {
    return this.request<Store>('/stores', {
      method: 'POST',
      body: JSON.stringify(store),
    });
  }

  async getStores(onlyActive?: boolean): Promise<Store[]> {
    const endpoint = onlyActive ? '/stores?only_active=true' : '/stores';
    return this.request<Store[]>(endpoint);
  }

  // Product endpoints
  async createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async getProducts(storeId?: string, onlyActive?: boolean): Promise<Product[]> {
    let endpoint = '/products';
    const params = new URLSearchParams();
    
    if (storeId) params.append('store_id', storeId);
    if (onlyActive) params.append('only_active', 'true');
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return this.request<Product[]>(endpoint);
  }
}

export const api = new ApiService();
