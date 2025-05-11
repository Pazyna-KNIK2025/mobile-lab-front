import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../axiosInstance';

interface AuthParams {
    isLogin: boolean;
    email: string;
    password: string;
    name?: string;
}

export const checkToken = async (): Promise<boolean> => {
    try {
        const token = await AsyncStorage.getItem('token');
        return !!token;
    } catch (err) {
        console.warn('Помилка при зчитуванні токена:', err);
        return false;
    }
};

export const login = async (token: string): Promise<void> => {
    await AsyncStorage.setItem('token', token);
};

export const logout = async (): Promise<void> => {
    await AsyncStorage.removeItem('token');
};

export const authenticate = async ({ isLogin, email, password, name }: AuthParams): Promise<string> => {
    const endpoint = isLogin ? 'users/login' : 'users/register';
    const payload = isLogin ? { email, password } : { email, password, name };

    const response = await api.post(endpoint, payload);
    const token = response.data.token;

    if (!token) {
        throw new Error('Токен не отримано від сервера');
    }

    await login(token);
    return token;
};
