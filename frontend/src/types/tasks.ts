export interface Task{
    id: number;
    tag: string;
    title: string;
    status: "Pending" | "In Progress" | "Done";
    priority: "Low" | "Medium" | "High";
    dueDate: string;
    description: string;
    completed: boolean;
}