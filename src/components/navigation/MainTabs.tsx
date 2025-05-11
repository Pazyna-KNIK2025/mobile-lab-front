import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Alert, Pressable } from 'react-native';
import tabStyles from './tabBarOptions';
import TaskListScreen from '../screens/TaskListScreen/TaskListScreen';
import TaskFormScreen from '../screens/TaskFormScreen/TaskFormScreen';
import CategoriesScreen from '../screens/CategoriesScreen/CategoriesScreen';
import { AuthContext } from '../context/AuthContext';

export type MainTabParamList = {
    Home: undefined;
    Add: undefined;
    Categories: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        Alert.alert(
            'Підтвердження',
            'Ви дійсно хочете вийти з акаунта?',
            [
                { text: 'Скасувати', style: 'cancel' },
                { text: 'Вийти', style: 'destructive', onPress: logout }
            ]
        );
    };

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                ...tabStyles,
                headerRight: () => (
                    <Pressable onPress={handleLogout} style={{ paddingHorizontal: 16 }}>
                        <Icon name="log-out-outline" size={24} color="red" />
                    </Pressable>
                ),
                tabBarIcon: ({ color, size }) => {
                    let iconName: string;

                    if (route.name === 'Add') {iconName = 'add-circle-outline';}
                    else if (route.name === 'Home') {iconName = 'home-outline';}
                    else {iconName = 'list-outline';}

                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={TaskListScreen} options={{ tabBarLabel: 'Головна' }} />
            <Tab.Screen name="Add" component={TaskFormScreen} options={{ tabBarLabel: 'Додати' }} />
            <Tab.Screen name="Categories" component={CategoriesScreen} options={{ tabBarLabel: 'Категорії' }} />
        </Tab.Navigator>
    );
}
