import axios from "axios";
import { ITask } from "../Interfaces/board";

axios.defaults.baseURL = "https://tasks.vitasoftsolutions.com";

export const getTasks = async () => {
    const response = await axios.get('/tasks');
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
