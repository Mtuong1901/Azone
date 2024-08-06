"use client";
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from './checkauth'; // Đường dẫn tới file authChecker

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    checkAuth(dispatch); 
  }, [dispatch]);

  return <>{children}</>;
}
