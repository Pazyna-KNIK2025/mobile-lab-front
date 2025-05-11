import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from './ConfirmModal.styles';

interface ConfirmModalProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export default function ConfirmModal({
                                         visible,
                                         onCancel,
                                         onConfirm,
                                         title,
                                         message,
                                     }: ConfirmModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalText}>{message}</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity onPress={onCancel}>
                            <Text style={styles.cancelButton}>Скасувати</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onConfirm}>
                            <Text style={styles.confirmButton}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
