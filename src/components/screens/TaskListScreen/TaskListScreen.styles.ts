import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    task: {
        backgroundColor: '#f7f7f7',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        position: 'relative',
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconRow: {
        flexDirection: 'row',
        gap: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    statusButton: {
        marginTop: 10,
        paddingVertical: 10,
        borderRadius: 5,
        width: '100%',
    },
    statusButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'capitalize',
        textAlign: 'center',
    },
});
