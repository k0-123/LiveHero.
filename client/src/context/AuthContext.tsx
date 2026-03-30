import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getMe, saveToken, removeToken, isLoggedIn as checkLoggedIn } from '../lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'creator' | 'admin';
  isPremium: boolean;
  plan: string;
  earnings: number;
  referralCode: string;
  referralsCount: number;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  isCreator: boolean;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  toast: { message: string, type: 'success' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isPremium: false,
  isAdmin: false,
  isCreator: false,
  loading: true,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
  toast: null,
  showToast: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const refreshUser = async () => {
    try {
      if (checkLoggedIn()) {
        const data = await getMe();
        setUser(data.user);
      }
    } catch {
      // Token expired or invalid
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (token: string, userData: User) => {
    saveToken(token);
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isPremium: user?.isPremium || user?.role === 'admin' || false,
        isAdmin: user?.role === 'admin',
        isCreator: user?.role === 'creator' || user?.role === 'admin',
        loading,
        login,
        logout,
        refreshUser,
        toast,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
