import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { checkToken, login as loginService, logout as logoutService } from '../../api/services/authService';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: async () => {},
    logout: async () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const valid = await checkToken();
                setIsAuthenticated(valid);
            } catch (err) {
                console.warn('Token check failed:', err);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (token: string) => {
        await loginService(token); // збереження токена
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await logoutService(); // видалення токена
        setIsAuthenticated(false);
    };

    if (loading) return null;

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
