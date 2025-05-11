import React, { useContext } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigationState, NavigationState } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import styles from './HeaderBar.styles';

export default function HeaderBar() {
    const { logout } = useContext(AuthContext);

    const routeName = useNavigationState((state: NavigationState) => {
        if (!state || !state.routes || typeof state.index !== 'number') return 'Головна';

        const route = state.routes[state.index] as any;
        const tabName = route?.state?.routeNames?.[route?.state?.index] || route.name;

        switch (tabName) {
            case 'Add':
                return 'Додати завдання';
            case 'Home':
                return 'Головна';
            case 'Categories':
                return 'Категорії';
            default:
                return tabName;
        }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{routeName}</Text>
            <Pressable onPress={logout} style={styles.logoutButton}>
                <Icon name="log-out-outline" size={24} color="#fff" />
            </Pressable>
        </View>
    );
}
