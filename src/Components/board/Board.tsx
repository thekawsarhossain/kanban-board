/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { boardColumns } from "../../constants/board";
import { IColumn, ITask } from "../../Interfaces/board";
import Column from "./Column";
import TaskCard from "./TaskCard";
import { useMutation, useQuery } from "react-query";
import { getTasks, updateTask } from "../../providers/reactQuery";
import toast from "react-hot-toast";
import { queryClient } from "../../config/queryClient";

const Board = () => {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [activeTask, setActiveTask] = useState<ITask | null>(null);
    const [tasksLoading, setTasksLoading] = useState<Set<string | number>>(new Set());

    const { isLoading } = useQuery("tasks", () => getTasks(), {
        onSuccess: (data) => setTasks(data?.tasks ?? []),
        onError: () => toast.error("Failed to fetch tasks!"),
    });

    const { mutate: updateTaskMutation } = useMutation(updateTask, {
        onMutate: async (task) => {
            const previousTasks = queryClient.getQueryData('tasks');
            queryClient.setQueryData('tasks', ({ tasks: prevTasks }) => {
                const updatedTasks = (prevTasks as ITask[]).map((t: ITask) =>
                    Number(t.id) === Number(task.id) ? { ...t, priority: task.priority, completed: task.completed ?? false } : t
                );
                return { tasks: updatedTasks };
            });
            return { previousTasks };
        },
        onError: (_, __, context) => {
            toast.error("Failed to the move task!");
            const previousTasks = context?.previousTasks;
            queryClient.setQueryData('tasks', previousTasks);
        },
        onSettled: (_, __, { id }) => {
            setTasksLoading((prevTasksLoading) => new Set([...prevTasksLoading].filter((i) => i !== id)));
        },
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    function onDragOver(event: { active: any; over: any; }) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";

        if (!isActiveTask) return;

        if (isActiveTask && isOverTask) {
            setTasks((tasks: ITask[]) => {
                const oldTasks = [...tasks];
                const activeIndex = tasks.findIndex((task: ITask) => task.id === activeId);
                const overIndex = tasks.findIndex((task: ITask) => task.id === overId);

                if (tasks[activeIndex].priority !== tasks[overIndex].priority) {
                    const previousPriority = oldTasks[activeIndex].priority;

                    tasks[activeIndex].priority = tasks[overIndex].priority;

                    if (previousPriority !== tasks[activeIndex].priority) {
                        updateTaskPriority(tasks[activeIndex]);
                    }
                    return arrayMove(tasks, activeIndex, overIndex - 1);
                }
                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = over.data.current?.type === "Column";
        if (isActiveTask && isOverAColumn) {
            setTasks((tasks: ITask[]) => {
                const oldTasks = [...tasks];
                const activeIndex = tasks.findIndex((task: ITask) => task.id === activeId);

                const previousPriority = oldTasks[activeIndex].priority;

                tasks[activeIndex].priority = overId;

                if (previousPriority !== tasks[activeIndex].priority) {
                    updateTaskPriority(tasks[activeIndex]);
                }
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    }

    function onDragEnd(event: { active: any; over: any; }) {
        setActiveTask(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;
    }

    const updateTaskPriority = (activeTask: ITask) => {
        const { id, priority, completed } = activeTask;
        setTasksLoading((prevTasksLoading) => new Set([...prevTasksLoading, id]));

        if (priority === "DONE" && !completed) updateTaskMutation({ id, priority, completed: true })
        else updateTaskMutation({ id, priority })
    };

    return (
        <div className="flex items-center px-4 overflow-x-auto overflow-y-hidden">
            <DndContext
                sensors={sensors}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                onDragStart={(e) => setActiveTask(e?.active?.data?.current?.task)}
            >
                <div className="w-full flex justify-between gap-4">
                    {boardColumns.map((col: IColumn) => (
                        <Column
                            key={col.id}
                            column={col}
                            loading={isLoading}
                            tasksLoading={tasksLoading}
                            tasks={tasks?.filter((task: ITask) => task?.priority.toUpperCase() === col.id)}
                        />
                    ))}
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeTask && (
                            <TaskCard
                                task={activeTask}
                                tasksLoading={tasksLoading}
                            />
                        )}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
}

export default Board;
