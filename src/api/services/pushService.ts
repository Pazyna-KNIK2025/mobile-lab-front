import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
// @ts-ignore
import PushNotification from 'react-native-push-notification';

export const sendPushFromClient = async () => {
    const token = await messaging().getToken();

    const payload = {
        token,
        title: 'FCM from client',
        body: 'From client to client',
    };

    const url = Platform.OS === 'android'
        ? 'http://10.0.2.2:5000/send'
        : 'http://localhost:5000/send';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.text();
        console.log('Відповідь від сервера:', result);
    } catch (error) {
        console.error('Помилка запиту:', error);
    }
};

export const sendLocalNotification = () => {
    PushNotification.localNotification({
        channelId: 'default-channel-id',
        title: 'Локальне повідомлення',
        message: 'Це повідомлення створене без FCM',
        playSound: true,
        soundName: 'default',
        importance: 'high',
        priority: 'high',
        allowWhileIdle: true,
    });
};

