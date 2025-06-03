export interface User {
  id: string | number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at?: string;
  company_id?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
