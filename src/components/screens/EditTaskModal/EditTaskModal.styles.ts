import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
    container: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        borderRadius: 10,
        padding: 20,
        paddingBottom: 40,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    swipeableCenter: {
        minWidth: 120,
        alignItems: 'center',
    },
    switchValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    arrow: {
        fontSize: 24,
        paddingHorizontal: 10,
    },
});

export default styles;
