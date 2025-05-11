import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import messaging from '@react-native-firebase/messaging';
// @ts-ignore
import PushNotification from 'react-native-push-notification';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './src/components/navigation/AppNavigation';
import HeaderBar from './src/components/headerBar/HeaderBar';
import { registerTranslation } from 'react-native-paper-dates';
import uk from './src/locales/ukLocale';
import { store } from './src/store/store';
import { AuthProvider } from './src/components/context/AuthContext';

import './firebase-messaging';

registerTranslation('uk', uk);

export default function App() {
    useEffect(() => {
        const initFCM = async () => {
            await messaging().requestPermission();
            const fcmToken = await messaging().getToken();
            console.log('FCM Token:', fcmToken);

            PushNotification.createChannel(
                {
                    channelId: 'default-channel-id',
                    channelName: 'Default Channel',
                    importance: 4,
                    vibrate: true,
                },
                (created: boolean) =>
                    console.log(`Notification channel ${created ? 'created' : 'already exists'}`)
            );
        };

        initFCM();

        const unsubscribe = messaging().onMessage(async remoteMessage => {
            const { title, body } = remoteMessage.notification ?? {};
            PushNotification.localNotification({
                channelId: 'default-channel-id',
                title: title || 'Повідомлення',
                message: body || 'Нове повідомлення',
                playSound: true,
                soundName: 'default',
                importance: 'high',
                priority: 'high',
                allowWhileIdle: true,
            });
        });

        return unsubscribe;
    }, []);

    return (
        <Provider store={store}>
            <AuthProvider>
                <NavigationContainer>
                    <View style={styles.container}>
                        <HeaderBar />
                        <AppNavigation />
                    </View>
                </NavigationContainer>
            </AuthProvider>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
