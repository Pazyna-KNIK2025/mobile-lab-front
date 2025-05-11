import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../api/services/categoryService';

interface Task {
    _id: string;
    title: string;
    content: string;
    category: string;
    status: 'to do' | 'in progress' | 'done' | 'blocked';
    createdAt?: string;
    deadline?: string;
}

interface TasksState {
    tasks: Task[];
    categories: Category[];
    selectedTask: Task | null;
}

const initialState: TasksState = {
    tasks: [],
    categories: [],
    selectedTask: null,
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks(state, action: PayloadAction<Task[]>) {
            state.tasks = action.payload;
        },
        setCategories(state, action: PayloadAction<Category[]>) {
            state.categories = action.payload;
        },
        selectTask(state, action: PayloadAction<Task | null>) {
            state.selectedTask = action.payload;
        },
        updateTask(state, action: PayloadAction<Task>) {
            const index = state.tasks.findIndex(task => task._id === action.payload._id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },
        addTask(state, action: PayloadAction<Task>) {
            state.tasks.push(action.payload);
        },
        deleteTaskById(state, action: PayloadAction<string>) {
            state.tasks = state.tasks.filter(task => task._id !== action.payload);
        },
    },
});

export const {
    setTasks,
    setCategories,
    selectTask,
    updateTask,
    addTask,
    deleteTaskById
} = taskSlice.actions;

export default taskSlice.reducer;
