import React, {useEffect, useMemo, useState} from 'react';
import { View, Text, TextInput, Button, Pressable, ScrollView, Modal } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { useDispatch, useSelector } from 'react-redux';
import { selectTask, updateTask } from '../../../store/taskSlice';
import { RootState } from '../../../store/store';
import { getCategories, Category } from '../../../api/services/categoryService';
import { updateTask as updateTaskApi } from '../../../api/services/taskService';
import styles from './EditTaskModal.styles';

interface EditTaskModalProps {
    visible: boolean;
    onClose: () => void;
    onRefresh: () => void;
}

export default function EditTaskModal({ visible, onClose, onRefresh }: EditTaskModalProps) {
    const dispatch = useDispatch();
    const task = useSelector((state: RootState) => state.tasks.selectedTask);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [statusIndex, setStatusIndex] = useState(0);
    const [categoryIndex, setCategoryIndex] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [deadlineDate, setDeadlineDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());

    const statusOptions = useMemo(
        () => ['to do', 'in progress', 'done', 'blocked'] as const,
        []
    );

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setContent(task.content);

            const deadline = task.deadline ? new Date(task.deadline) : new Date();
            setDeadlineDate(deadline);
            setDate(deadline);

            setStatusIndex(statusOptions.indexOf(task.status));
        }

        getCategories().then(res => {
            setCategories(res);
            const defaultIndex = res.findIndex(c => c._id === task?.category);
            setCategoryIndex(defaultIndex >= 0 ? defaultIndex : 0);
        });
    }, [task, statusOptions]);

    const onDismiss = () => setOpen(false);

    const onConfirm = ({ date }: any) => {
        if (!date) return;
        setOpen(false);
        setDate(date);
        setDeadlineDate(date);
    };

    const handleArrowPress = (
        direction: 'left' | 'right',
        currentIndex: number,
        setIndex: (i: number) => void,
        length: number
    ) => {
        const newIndex =
            direction === 'left'
                ? (currentIndex - 1 + length) % length
                : (currentIndex + 1) % length;
        setIndex(newIndex);
    };

    const handleSave = async () => {
        if (!task) return;

        const updatedData = {
            ...task,
            title,
            content,
            deadline: deadlineDate.toISOString(),
            status: statusOptions[statusIndex],
            category: categories[categoryIndex]?._id,
        };

        const res = await updateTaskApi(task._id, updatedData);
        dispatch(updateTask(res));
        dispatch(selectTask(null));
        onClose();
        onRefresh();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalBackground}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <Text style={styles.label}>Назва</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Введіть назву"
                    />

                    <Text style={styles.label}>Опис</Text>
                    <TextInput
                        style={styles.input}
                        value={content}
                        onChangeText={setContent}
                        placeholder="Введіть опис"
                        multiline
                    />

                    <Text style={styles.label}>Дедлайн</Text>
                    <Pressable onPress={() => setOpen(true)} style={styles.input}>
                        <Text>{date.toLocaleDateString()}</Text>
                    </Pressable>

                    <DatePickerModal
                        locale="uk"
                        mode="single"
                        visible={open}
                        onDismiss={onDismiss}
                        date={date}
                        onConfirm={onConfirm}
                        validRange={{ startDate: new Date() }}
                    />

                    <Text style={styles.label}>Статус</Text>
                    <View style={styles.switchContainer}>
                        <Pressable onPress={() =>
                            handleArrowPress('right', statusIndex, setStatusIndex, statusOptions.length)
                        }>
                            <Text style={styles.arrow}>◀</Text>
                        </Pressable>
                        <View style={styles.swipeableCenter}>
                            <Text style={styles.switchValue}>{statusOptions[statusIndex]}</Text>
                        </View>
                        <Pressable onPress={() =>
                            handleArrowPress('left', statusIndex, setStatusIndex, statusOptions.length)
                        }>
                            <Text style={styles.arrow}>▶</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.label}>Категорія</Text>
                    <View style={styles.switchContainer}>
                        <Pressable onPress={() =>
                            handleArrowPress('right', categoryIndex, setCategoryIndex, categories.length)
                        }>
                            <Text style={styles.arrow}>◀</Text>
                        </Pressable>
                        <View style={styles.swipeableCenter}>
                            <Text style={styles.switchValue}>{categories[categoryIndex]?.name || ''}</Text>
                        </View>
                        <Pressable onPress={() =>
                            handleArrowPress('left', categoryIndex, setCategoryIndex, categories.length)
                        }>
                            <Text style={styles.arrow}>▶</Text>
                        </Pressable>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Button title="Зберегти" onPress={handleSave} />
                        <Button
                            title="Скасувати"
                            color="gray"
                            onPress={() => {
                                dispatch(selectTask(null));
                                onClose();
                            }}
                        />
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}
