import axios from "axios";
import { ITask } from "../Interfaces/board";

axios.defaults.baseURL = "https://tasks.vitasoftsolutions.com";

export const getTasks = async () => {
    const response = await axios.get('/tasks');
    return response.data;
}

export const getTask = async (id: number) => {
    const response = await axios.get(`/tasks/${id}/`);
    return response.data;
}

export const updateTask = async ({ id, priority, completed }: { id: number; priority: string; completed?: boolean }) => {
    const payload: Partial<ITask> = { priority };
    if (completed) {
        payload["completed"] = true;
        payload["completed_at"] = new Date();
    }
    const response = await axios.patch(`/tasks/${id}/`, { ...payload });
    return response.data;
}


export const createTask = async (task: Partial<ITask>) => {
    const response = await axios.post('/tasks/', { ...task });
    return response.data;
}

export const editTask = async ({ id, ...rest }: Partial<ITask>) => {
    const response = await axios.put(`/tasks/${id}/`, { ...rest });
    return response.data;
}

export const deleteTask = async (id: number) => {
    const response = await axios.delete(`/tasks/${id}`);
    return response.data;
}