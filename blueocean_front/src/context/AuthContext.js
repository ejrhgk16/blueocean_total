"use client";
import useLocalStorage from '@/hooks/useLocalStorage';
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 초기 상태는 로그인 상태와 사용자 정보를 포함
  const [authState, setAuthState] = useLocalStorage('authState', {
    isLogin: false,
    userId: null,
    userName: null,
    roleName: null,
    role_type : null,
    store_list : []
  });

  // 로그인 상태와 사용자 정보를 업데이트하는 함수
  const login = (userId, userName, roleName, role_type, store_list) => {
    setAuthState({
      isLogin: true,
      userId,
      userName,
      roleName,
      role_type,
      store_list

    });
  };

  const logout = () => {
    setAuthState({
      isLogin: false,
      userId: null,
      userName: null,
      roleName : null
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);