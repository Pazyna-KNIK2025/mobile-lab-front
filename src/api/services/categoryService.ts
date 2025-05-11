import api from '../axiosInstance';

export interface Category {
    _id: string;
    name: string;
}

export interface NewCategory {
    name: string;
}

export const getCategories = async (): Promise<Category[]> => {
    const res = await api.get('/categories');
    return res.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
    const res = await api.get(`/categories/${id}`);
    return res.data;
};

export const createCategory = async (category: NewCategory): Promise<Category> => {
    const res = await api.post('/categories', category);
    return res.data;
};
export const updateCategory = async (category: Category): Promise<Category> => {
    const res = await api.put(`/categories/${category._id}`, category);
    return res.data;
};


export const deleteCategory = async (_id: string): Promise<void> => {
    await api.delete(`/categories/${_id}`);
};
