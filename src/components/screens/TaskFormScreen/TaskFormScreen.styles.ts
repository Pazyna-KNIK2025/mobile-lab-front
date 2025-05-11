import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 12,
        color: '#333',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
    },
    arrow: {
        fontSize: 18,
        color: '#666',
        paddingHorizontal: 8,
    },
    switchValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    swipeableCenter: {
        flex: 1,
        alignItems: 'center',
    },
});
