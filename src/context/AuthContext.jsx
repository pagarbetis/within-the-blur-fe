import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchMe, loginUser, registerUser, logoutUser } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await fetchMe();
        setUser(me);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const u = await loginUser({ email, password });
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (email, password, name) => {
    const u = await registerUser({ email, password, name });
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
