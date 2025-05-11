import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
// @ts-ignore
import { API_URL_ANDROID, API_URL_WEB } from '@env';

const baseURL = Platform.OS === 'android' ? API_URL_ANDROID : API_URL_WEB;

if (!baseURL) {
    console.warn('.env змінні не знайдено або не визначено baseURL');
}

const api = axios.create({
    baseURL,
    timeout: 20000,
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            // @ts-ignore
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('Відповідь з помилкою:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('Немає відповіді від сервера:', error.request);
        } else {
            console.error('Помилка конфігурації запиту:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
