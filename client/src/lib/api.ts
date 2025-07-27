import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getTodos = async () => {
    const res = await axios.get(`${API_URL}/todos`);
    return res.data;
};

export const addTodo = async (content: string) => {
    const res = await axios.post(`${API_URL}/todos`, { content });
    return res.data;
};
