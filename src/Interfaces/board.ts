export interface IColumn {
    id: string;
    title: string;
}

export interface ITask {
    id: number;
    task: string;
    assigned_to: string;
    assignee: string;
    priority: string;
    due_date: Date;
    completed: boolean;
    completed_at: Date;
    created_at: Date;
}