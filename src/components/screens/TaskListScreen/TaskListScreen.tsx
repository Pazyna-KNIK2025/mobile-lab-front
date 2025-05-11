import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setTasks, setCategories, selectTask, deleteTaskById } from '../../../store/taskSlice';
import { RootState } from '../../../store/store';
import styles from './TaskListScreen.styles';
import EditTaskModal from '../EditTaskModal/EditTaskModal';
import { getTasks, updateTask, deleteTask} from '../../../api/services/taskService';
import { getCategories } from '../../../api/services/categoryService.ts';
import { TaskStatus } from '../../../api/services/taskService';


export default function TaskListScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const categories = useSelector((state: RootState) => state.tasks.categories);
    const [modalVisible, setModalVisible] = useState(false);
    const statusOptions: readonly TaskStatus[] = ['to do', 'in progress', 'done', 'blocked'] as const;

    const loadTasks = useCallback(async () => {
        const [tasksData, categoriesData] = await Promise.all([
            getTasks(),
            getCategories()
        ]);
        dispatch(setTasks(tasksData));
        dispatch(setCategories(categoriesData));
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        await deleteTask(id);
        dispatch(deleteTaskById(id));
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadTasks);
        return unsubscribe;
    }, [navigation, loadTasks]);

    const statusColors: Record<string, string> = {
        'to do': '#007bff',
        'in progress': '#ffc107',
        'done': '#28a745',
        'blocked': '#dc3545',
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('Add' as never)}
            >
                <Text style={styles.addButtonText}>Додати завдання</Text>
            </TouchableOpacity>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    const currentStatusIndex = statusOptions.indexOf(item.status);
                    const nextStatus: TaskStatus = statusOptions[(currentStatusIndex + 1) % statusOptions.length];


                    const handleChangeStatus = async () => {
                        await updateTask(item._id, { status: nextStatus });
                        loadTasks();
                    };

                    return (
                        <View style={styles.task}>
                            <View style={styles.taskHeader}>
                                <Text style={styles.title}>{item.title}</Text>
                                <View style={styles.iconRow}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            dispatch(selectTask(item));
                                            setModalVisible(true);
                                        }}
                                    >
                                        <Icon name="create-outline" size={24} color="#007bff" />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => handleDelete(item._id)}>
                                        <Icon name="trash-outline" size={24} color="#dc3545" />
                                    </TouchableOpacity>

                                </View>
                            </View>

                            <Text>{item.content}</Text>
                            <Text>
                                Категорія:{' '}
                                {
                                    categories.find((c) => c._id === item.category)?.name ||
                                    'Без категорії'
                                }
                            </Text>
                            <Text>
                                Створено:{' '}
                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'невідомо'}
                            </Text>
                            <Text>
                                Дедлайн:{' '}
                                {item.deadline ? new Date(item.deadline).toLocaleDateString() : 'не вказано'}
                            </Text>

                            <TouchableOpacity
                                onPress={handleChangeStatus}
                                style={[
                                    styles.statusButton,
                                    { backgroundColor: statusColors[item.status] },
                                ]}
                            >
                                <Text style={styles.statusButtonText}>
                                    {item.status}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
            />

            <EditTaskModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onRefresh={loadTasks}
            />
        </View>
    );
}
