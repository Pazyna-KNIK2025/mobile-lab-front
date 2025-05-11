import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

const tabBarOptions: BottomTabNavigationOptions = {
    tabBarStyle: {
        height: 60,
        justifyContent: 'center',
        paddingBottom: 5,
    },
    tabBarActiveTintColor: '#007AFF',
    tabBarInactiveTintColor: '#888888',
    headerShown: false,
};

export default tabBarOptions;
