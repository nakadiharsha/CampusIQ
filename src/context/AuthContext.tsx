import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole, Permission } from '../types';
import { mockAuthService } from '../services/mockAuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(null);
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      setUser(data.user);
      return true;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    }
  };

  const logout = () => {
    mockAuthService.logout();
    setUser(null);
  };

  const switchDemoRole = (role: UserRole) => {
    const newUser = mockAuthService.switchDemoRole(role);
    setUser(newUser);
  };

  const hasRole = (role: UserRole): boolean => {
    return mockAuthService.hasRole(user, role);
  };

  const hasPermission = (permission: Permission): boolean => {
    return mockAuthService.hasPermission(user, permission);
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return mockAuthService.hasAnyRole(user, roles);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchDemoRole,
        hasRole,
        hasPermission,
        hasAnyRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
