import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { mockAdmin, mockCustomers, mockDrivers } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // بررسی وضعیت لاگین از localStorage
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    setIsLoading(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  };

  const login = async (phoneNumber: string, otp: string): Promise<void> => {
    setIsLoading(true);
    
    // شبیه‌سازی تاخیر API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // بررسی OTP (در حالت Mock همه OTPها 1234 هستند)
    if (otp !== '1234') {
      setIsLoading(false);
      throw new Error('کد تایید اشتباه است');
    }

    // پیدا کردن کاربر بر اساس شماره تلفن
    let foundUser: User | null = null;

    // چک کردن ادمین
    if (phoneNumber === mockAdmin.phoneNumber) {
      foundUser = mockAdmin;
    }

    // چک کردن مشتری‌ها
    if (!foundUser) {
      const customer = mockCustomers.find(c => c.phoneNumber === phoneNumber);
      if (customer) {
        foundUser = customer;
      }
    }

    // چک کردن رانندگان
    if (!foundUser) {
      const driver = mockDrivers.find(d => d.phoneNumber === phoneNumber);
      if (driver) {
        foundUser = driver;
      }
    }

    // اگر کاربر پیدا نشد، یک مشتری جدید ایجاد کن
    if (!foundUser) {
      foundUser = {
        id: `customer-${Date.now()}`,
        phoneNumber,
        role: UserRole.CUSTOMER,
        createdAt: new Date(),
      };
      mockCustomers.push(foundUser as any);
    }

    // ذخیره کاربر در state و localStorage
    setUser(foundUser);
    localStorage.setItem('user', JSON.stringify(foundUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook برای چک کردن نقش کاربر
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
