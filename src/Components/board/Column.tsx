/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { SortableContext } from "@dnd-kit/sortable";
import { HiOutlinePlus } from "react-icons/hi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IColumn, ITask } from "../../Interfaces/board";
import TaskCard from "./TaskCard";
import TaskEntryControl from "./TaskEntryControl";
import Skeleton from "./Skeleton";

interface ColumnProps {
    column: IColumn;
    tasks: ITask[];
    loading: boolean;
    tasksLoading: Set<string | number>;
}

const Column = ({ column, tasks, loading, tasksLoading }: ColumnProps) => {
    const [isOpenNewTaskPopup, setOpenPopup] = useState(false);

    const taskIds = useMemo(() => {
        if (!tasks?.length) return [];
        return tasks?.map((task: ITask) => task.id);
    }, [tasks]);

    const { setNodeRef, transform, transition } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-sky-950 min-w-[80%] md:min-w-[40%] lg:min-w-0 lg:w-full h-[calc(100vh-110px)] flex flex-col rounded-lg border px-4"
        >
            <div className="flex justify-between items-center py-4">
                <h2 className="text-base leading-normal font-bold text-gray-200">
                    {column.title} <span className="font-normal">{tasks?.length}</span>
                </h2>
                <button disabled={loading} onClick={() => setOpenPopup(true)} className="text-gray-200 duration-100 hover:bg-gray-600 p-2 rounded-full">
                    <HiOutlinePlus />
                </button>
            </div>
            <div className="flex flex-grow flex-col gap-4 overflow-x-hidden overflow-y-auto w-full">
                <SortableContext items={taskIds}>
                    {loading ? <Skeleton /> : tasks?.map((task: ITask) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            tasksLoading={tasksLoading}
                        />
                    ))}
                </SortableContext>
                <button
                    disabled={loading}
                    onClick={() => setOpenPopup(true)}
                    className="bg-white p-3 text-sm flex justify-between items-center rounded-lg"
                >
                    <span>Create a new task</span>
                    <HiOutlinePlus className="w-4 h-4" />
                </button>
            </div>
            {isOpenNewTaskPopup && <TaskEntryControl
                isOpen={isOpenNewTaskPopup}
                priority={column?.id}
                close={() => setOpenPopup(false)}
            />}
        </div>
    );
};

export default Column;