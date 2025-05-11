import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import styles from './CategoriesScreen.styles';
import { getCategories, createCategory, deleteCategory, updateCategory } from '../../../api/services/categoryService';
import { setCategories } from '../../../store/taskSlice';
import ConfirmModal from '../сonfirmModals/ConfirmModal.tsx';
import { Category } from '../../../api/services/categoryService';
import { RootState } from '../../../store/store.ts';

export default function CategoriesScreen() {
    const dispatch = useDispatch();
    const categories = useSelector((state: RootState) => state.tasks.categories) as Category[];
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [pendingDeleteName, setPendingDeleteName] = useState('');
    const [infoVisible, setInfoVisible] = useState(false);
    const [infoMessage, setInfoMessage] = useState('');

    const loadCategories = useCallback(async () => {
        const data = await getCategories();
        const sorted = data.sort((a, b) => {
            if (a.name.toLowerCase() === 'general') return -1;
            if (b.name.toLowerCase() === 'general') return 1;
            return a.name.localeCompare(b.name);
        });
        dispatch(setCategories(sorted));
    }, [dispatch]);

    const showInfoModal = (message: string) => {
        setInfoMessage(message);
        setInfoVisible(true);
    };

    const handleAdd = async () => {
        const trimmedName = name.trim();
        if (!trimmedName) return;
        const duplicate = categories.find(cat => cat.name.toLowerCase() === trimmedName.toLowerCase());
        if (duplicate) {
            showInfoModal(`Категорія "${trimmedName}" вже існує.`);
            return;
        }
        try {
            await createCategory({ name: trimmedName });
            setName('');
            await loadCategories();
        } catch (err) {
            showInfoModal('Помилка при створенні категорії');
            console.error(err);
        }
    };

    const handleUpdate = async (_id: string) => {
        const trimmedName = editingName.trim();
        if (!trimmedName) return;
        const duplicate = categories.find(cat => cat.name.toLowerCase() === trimmedName.toLowerCase() && cat._id !== _id);
        if (duplicate) {
            showInfoModal(`Категорія "${trimmedName}" вже існує.`);
            return;
        }
        try {
            await updateCategory({ _id, name: trimmedName });
            setEditingId(null);
            setEditingName('');
            await loadCategories();
        } catch (err) {
            showInfoModal('Помилка при оновленні категорії');
            console.error(err);
        }
    };

    const confirmDelete = (_id: string, name: string) => {
        setPendingDeleteId(_id);
        setPendingDeleteName(name);
        setConfirmVisible(true);
    };

    const deleteAndReassign = async () => {
        setConfirmVisible(false);
        if (!pendingDeleteId) return;
        try {
            await deleteCategory(pendingDeleteId);
            await loadCategories();
        } catch (err) {
            console.error('Помилка при видаленні категорії:', err);
        } finally {
            setPendingDeleteId(null);
            setPendingDeleteName('');
        }
    };

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={(
                    <View style={styles.categoryRow}>
                        <View style={styles.nameCell}>
                            <TextInput
                                placeholder="Назва нової категорії"
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={handleAdd}>
                                <Icon name="add-circle" size={24} color="#007AFF" style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                data={categories}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.categoryRow}>
                        <View style={styles.nameCell}>
                            {editingId === item._id ? (
                                <TextInput
                                    style={styles.input}
                                    value={editingName}
                                    onChangeText={setEditingName}
                                    onSubmitEditing={() => handleUpdate(item._id)}
                                />
                            ) : (
                                <Text style={styles.itemText}>{item.name}</Text>
                            )}
                        </View>
                        <View style={styles.actions}>
                            {item.name.toLowerCase() !== 'general' && (
                                editingId === item._id ? (
                                    <>
                                        <TouchableOpacity onPress={() => handleUpdate(item._id)}>
                                            <Icon name="checkmark-outline" size={20} color="#34C759" style={styles.icon} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setEditingId(null);
                                            setEditingName('');
                                        }}>
                                            <Icon name="close-outline" size={20} color="#FF3B30" style={styles.icon} />
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <TouchableOpacity onPress={() => {
                                            setEditingId(item._id);
                                            setEditingName(item.name);
                                        }}>
                                            <Icon name="create-outline" size={20} color="#007AFF" style={styles.icon} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => confirmDelete(item._id, item.name)}>
                                            <Icon name="trash-outline" size={20} color="#FF3B30" style={styles.icon} />
                                        </TouchableOpacity>
                                    </>
                                )
                            )}
                        </View>
                    </View>
                )}
            />

            <ConfirmModal
                visible={confirmVisible}
                onCancel={() => setConfirmVisible(false)}
                onConfirm={deleteAndReassign}
                title="Підтвердження"
                message={`Видалити категорію "${pendingDeleteName}" та оновити завдання?`}
            />

            <ConfirmModal
                visible={infoVisible}
                onCancel={() => setInfoVisible(false)}
                onConfirm={() => setInfoVisible(false)}
                title="Інформація"
                message={infoMessage}
            />
        </View>
    );
}
