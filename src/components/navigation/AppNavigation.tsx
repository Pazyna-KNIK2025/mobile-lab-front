import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import AuthScreen from '../screens/AuthScreen/AuthScreen';
import MainTabs from './MainTabs';

export type RootStackParamList = {
    Auth: undefined;
    MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
    const { isAuthenticated } = useContext(AuthContext);

    if (isAuthenticated === null) return null;

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                <Stack.Screen name="MainTabs" component={MainTabs} />
            ) : (
                <Stack.Screen name="Auth" component={AuthScreen} />
            )}
        </Stack.Navigator>
    );
}
