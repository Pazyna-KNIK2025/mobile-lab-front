import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Modal,
    Pressable,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { authenticate } from '../../../api/services/authService';
import styles from './AuthScreen.styles';

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    const { login } = useContext(AuthContext);

    const handleAuth = async () => {
        if (!email || !password || (!isLogin && !name)) {
            setErrorMessage('Будь ласка, заповніть усі поля');
            setShowError(true);
            return;
        }

        try {
            const token = await authenticate({ isLogin, email, password, name });
            login(token);
        } catch (err: any) {
            console.log('AUTH ERROR:', err);
            setErrorMessage(err.response?.data?.message || err.message || 'Щось пішло не так');
            setShowError(true);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin ? 'Вхід' : 'Реєстрація'}</Text>

            {!isLogin && (
                <TextInput
                    placeholder="Ім'я"
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />
            )}

            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Пароль"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />

            <Button title={isLogin ? 'Увійти' : 'Зареєструватись'} onPress={handleAuth} />

            <Text style={styles.switch} onPress={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Ще не маєш акаунта? Реєстрація' : 'Вже зареєстрований? Вхід'}
            </Text>

            <Modal
                visible={showError}
                transparent
                animationType="fade"
                onRequestClose={() => setShowError(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Помилка</Text>
                        <Text style={styles.modalMessage}>{errorMessage}</Text>
                        <Pressable style={styles.modalButton} onPress={() => setShowError(false)}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
