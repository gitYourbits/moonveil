import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, tokenManager } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ username, password });
      
      const { access, refresh } = response.data;
      
      // Store tokens
      tokenManager.setAccessToken(access);
      tokenManager.setRefreshToken(refresh);
      
      // Decode user info from token (simplified - in real app, fetch user profile)
      const tokenPayload = JSON.parse(atob(access.split('.')[1]));
      setUser({
        id: tokenPayload.user_id || '1',
        username: tokenPayload.username || username,
        email: tokenPayload.email || `${username}@example.com`,
        first_name: tokenPayload.first_name || '',
        last_name: tokenPayload.last_name || '',
      });

      toast({
        title: "Login Successful",
        description: "Welcome back to Finagen!",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    tokenManager.clearAll();
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const checkAuth = async () => {
    const token = tokenManager.getAccessToken();
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // In a real app, you'd fetch the user profile here
      // For now, we'll decode the token
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (tokenPayload.exp < currentTime) {
        // Token expired, try to refresh
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await authAPI.refresh(refreshToken);
          const newToken = response.data.access;
          tokenManager.setAccessToken(newToken);
          // Decode new token and set user
          const newPayload = JSON.parse(atob(newToken.split('.')[1]));
          setUser({
            id: newPayload.user_id || '1',
            username: newPayload.username || 'user',
            email: newPayload.email || 'user@example.com',
            first_name: newPayload.first_name || '',
            last_name: newPayload.last_name || '',
          });
        } else {
          throw new Error('No refresh token');
        }
      } else {
        // Token is valid
        setUser({
          id: tokenPayload.user_id || '1',
          username: tokenPayload.username || 'user',
          email: tokenPayload.email || 'user@example.com',
          first_name: tokenPayload.first_name || '',
          last_name: tokenPayload.last_name || '',
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      tokenManager.clearAll();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};