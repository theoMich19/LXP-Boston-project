'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/user';

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'INIT_AUTH'; payload: { user: User | null; token: string | null } };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case 'INIT_AUTH':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: !!action.payload.token,
        isLoading: false,
      };

    default:
      return state;
  }
};

interface UserContextType extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);


interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userJson = localStorage.getItem('user');

        if (token && userJson) {
          const user = JSON.parse(userJson);
          dispatch({
            type: 'INIT_AUTH',
            payload: { user, token }
          });
        } else {
          dispatch({
            type: 'INIT_AUTH',
            payload: { user: null, token: null }
          });
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        dispatch({
          type: 'INIT_AUTH',
          payload: { user: null, token: null }
        });
      }
    };

    initializeAuth();
  }, []);

  const login = (user: User, token: string) => {
    try {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données utilisateur:', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('remember_me');

      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    try {
      if (state.user) {
        const updatedUser = { ...state.user, ...userData };

        localStorage.setItem('user', JSON.stringify(updatedUser));

        dispatch({
          type: 'UPDATE_USER',
          payload: userData
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    }
  };

  const value: UserContextType = {
    ...state,
    login,
    logout,
    updateUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// ==================== HOOK CUSTOM ====================

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser doit être utilisé dans un UserProvider');
  }

  return context;
};


