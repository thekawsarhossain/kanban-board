/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { boardColumns } from "../../constants/board";
import { ITask } from "../../Interfaces/board";
import Column from "./Column";
import TaskCard from "./TaskCard";

const task1 = { id: 1, task: "Hello world", priority: "High", assigned_to: "Kawsar", assignee: "Me", completed: false, completed_at: new Date(), created_at: new Date(), due_date: new Date(), status: "BACKLOG" }

const task2 = { id: 2, task: "This is an random task", priority: "Normal", assigned_to: "Kawsar", assignee: "Me", completed: false, completed_at: new Date(), created_at: new Date(), due_date: new Date(), status: "TODO" }

const Board = () => {
    const [tasks, setTasks] = useState<ITask[]>([task1, task2]);

    const [activeTask, setActiveTask] = useState<ITask | null>(null);
    const [tasksLoading, setTasksLoading] = useState<Set<string | number>>(new Set());

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

                if (tasks[activeIndex].status !== tasks[overIndex].status) {
                    const previousStatus = oldTasks[activeIndex].status;

                    tasks[activeIndex].status = tasks[overIndex].status;

                    if (previousStatus !== tasks[activeIndex].status) {
                        updateTaskStatus(tasks[activeIndex]);
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

                const previousStatus = oldTasks[activeIndex].status;

                tasks[activeIndex].status = overId;

                if (previousStatus !== tasks[activeIndex].status) {
                    updateTaskStatus(tasks[activeIndex]);
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

    const updateTaskStatus = (activeTask: ITask) => {
        // TODO
        const { id } = activeTask;
        setTasksLoading((prevTasksLoading) => new Set([...prevTasksLoading, id]));

        console.log("In Update Task Status", activeTask)

        // Once update done remove id from loading state 
        setTasksLoading((prevTasksLoading) => new Set([...prevTasksLoading].filter((e) => e !== id)));
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
                    {boardColumns.map((col) => (
                        <Column
                            key={col.id}
                            column={col}
                            tasksLoading={tasksLoading}
                            tasks={tasks.filter((task: ITask) => task.status === col.id)}
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
