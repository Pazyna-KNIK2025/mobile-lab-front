import React, { useEffect, useState, useMemo } from 'react';
import { View, TextInput, Button, Text, Pressable, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { createTask, updateTask } from '../../../api/services/taskService';
import { DatePickerModal } from 'react-native-paper-dates';
import styles from './TaskFormScreen.styles';
import { RootState } from '../../../store/store';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function TaskFormScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    // @ts-ignore – якщо TypeScript свариться на відсутність типів
    const task = route.params?.task;

    const categories = useSelector((state: RootState) => state.tasks.categories);
    const [title, setTitle] = useState(task?.title || '');
    const [content, setContent] = useState(task?.content || '');
    const [statusIndex, setStatusIndex] = useState(0);
    const [categoryIndex, setCategoryIndex] = useState(0);
    const [deadlineDate, setDeadlineDate] = useState<Date>(
        task?.deadline ? new Date(task.deadline) : new Date()
    );
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(deadlineDate);

    const statusOptions = useMemo(
        () => ['to do', 'in progress', 'done', 'blocked'] as const,
        []
    );

    useEffect(() => {
        if (categories.length > 0 && task?.category) {
            const defaultIndex = categories.findIndex(c => c._id === task.category);
            setCategoryIndex(defaultIndex >= 0 ? defaultIndex : 0);
        }

        if (task) {
            const statusIdx = statusOptions.indexOf(task.status);
            setStatusIndex(statusIdx >= 0 ? statusIdx : 0);
        }
    }, [categories, task, statusOptions]);

    const onDismiss = () => setOpen(false);
    const onConfirm = ({ date }: { date?: Date }) => {
        if (!date) return;
        setOpen(false);
        setDate(date);
        setDeadlineDate(date);
    };

    const handleSave = async () => {
        const data = {
            title,
            content,
            deadline: deadlineDate.toISOString(),
            status: statusOptions[statusIndex],
            category: categories[categoryIndex]?._id,
        };

        if (task) {
            await updateTask(task._id, data);
        } else {
            await createTask(data);
            setTitle('');
            setContent('');
            setStatusIndex(0);
            setCategoryIndex(0);
            const now = new Date();
            setDeadlineDate(now);
            setDate(now);
        }

        navigation.navigate('Home' as never);
    };

    const handleArrowPress = (
        direction: 'left' | 'right',
        currentIndex: number,
        setIndex: (i: number) => void,
        length: number
    ) => {
        const newIndex =
            direction === 'left'
                ? (currentIndex + 1) % length
                : (currentIndex - 1 + length) % length;
        setIndex(newIndex);
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
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
                <Pressable
                    onPress={() =>
                        handleArrowPress('right', statusIndex, setStatusIndex, statusOptions.length)
                    }
                >
                    <Text style={styles.arrow}>◀</Text>
                </Pressable>
                <View style={styles.swipeableCenter}>
                    <Text style={styles.switchValue}>{statusOptions[statusIndex]}</Text>
                </View>
                <Pressable
                    onPress={() =>
                        handleArrowPress('left', statusIndex, setStatusIndex, statusOptions.length)
                    }
                >
                    <Text style={styles.arrow}>▶</Text>
                </Pressable>
            </View>

            <Text style={styles.label}>Категорія</Text>
            <View style={styles.switchContainer}>
                <Pressable
                    onPress={() =>
                        handleArrowPress('right', categoryIndex, setCategoryIndex, categories.length)
                    }
                >
                    <Text style={styles.arrow}>◀</Text>
                </Pressable>
                <View style={styles.swipeableCenter}>
                    <Text style={styles.switchValue}>
                        {categories[categoryIndex]?.name || ''}
                    </Text>
                </View>
                <Pressable
                    onPress={() =>
                        handleArrowPress('left', categoryIndex, setCategoryIndex, categories.length)
                    }
                >
                    <Text style={styles.arrow}>▶</Text>
                </Pressable>
            </View>

            <Button title={task ? 'Зберегти' : 'Створити'} onPress={handleSave} />
        </ScrollView>
    );
}
