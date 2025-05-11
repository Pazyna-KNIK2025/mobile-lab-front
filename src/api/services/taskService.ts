import api from '../axiosInstance';

export interface Task {
    _id: string;
    title: string;
    content: string;
    deadline: string;
    status: 'to do' | 'in progress' | 'done' | 'blocked';
    category: string;
    createdAt?: string;
}

export type NewTask = Omit<Task, '_id' | 'createdAt'>;
export type UpdateTaskPayload = Partial<Omit<Task, '_id' | 'createdAt'>>;

export type TaskStatus = 'to do' | 'in progress' | 'done' | 'blocked';



export const getTasks = async (): Promise<Task[]> => {
    const res = await api.get('/tasks');
    return res.data;
};

export const getTaskById = async (id: string): Promise<Task> => {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
};

export const createTask = async (task: NewTask): Promise<Task> => {
    const res = await api.post('/tasks', task);
    return res.data;
};

export const updateTask = async (_id: string, data: UpdateTaskPayload): Promise<Task> => {
    const res = await api.put(`/tasks/${_id}`, data);
    return res.data;
};

export const deleteTask = async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
};
