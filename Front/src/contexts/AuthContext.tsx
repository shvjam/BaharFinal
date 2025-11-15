import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { api } from '../lib/api'; // Import the centralized api service

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>; // Make it async
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to get user from local storage
const getUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }
  return null;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(getUserFromStorage());
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on initial load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
      // If a token exists, we should verify it with the backend
      // and get the latest user profile.
      try {
        // NOTE: We assume an endpoint `/api/Users/me` exists to get the current user profile.
        // This endpoint is implemented in the backend's UsersController.
        const response = await api.get('/Users/me');
        if (response.data.success) {
          const fetchedUser = response.data.data;
          setUser(fetchedUser);
          localStorage.setItem('user', JSON.stringify(fetchedUser));
        } else {
          // Token is invalid or expired
          logout();
        }
      } catch (error) {
        console.error('Failed to verify token:', error);
        logout();
      }
    } else {
      // No token, ensure user is logged out
      setUser(null);
      localStorage.removeItem('user');
    }
    setIsLoading(false);
  };

  const login = async (phoneNumber: string, otp: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.post('/Auth/login', { phoneNumber, otp });

      if (response.data.success) {
        const { token, ...userData } = response.data.data;

        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Set user in state
        setUser(userData);
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optionally, redirect to login page or home page
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!localStorage.getItem('token'),
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to check user role
export const useRole = () => {
  const { user } = useAuth();
  
  return {
    isGuest: !user || user.role === UserRole.GUEST,
    isCustomer: user?.role === UserRole.CUSTOMER,
    isDriver: user?.role === UserRole.DRIVER,
    isAdmin: user?.role === UserRole.ADMIN,
    role: user?.role || UserRole.GUEST,
  };
};
