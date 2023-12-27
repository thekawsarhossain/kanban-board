/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { SortableContext } from "@dnd-kit/sortable";
import { HiOutlinePlus } from "react-icons/hi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IColumn, ITask } from "../../Interfaces/board";
import TaskCard from "./TaskCard";
import TaskEntryControl from "./TaskEntryControl";

interface ColumnProps {
    column: IColumn;
    tasks: ITask[];
    tasksLoading: Set<string | number>;
}

const Column = ({ column, tasks, tasksLoading }: ColumnProps) => {
    const [isOpenNewTaskPopup, setOpenPopup] = useState(false);

    const taskIds = useMemo(() => {
        return tasks.map((_task: ITask, index) => index);
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
                    {column.title}
                </h2>
                <button className="text-gray-200 duration-100 hover:bg-gray-600 p-2 rounded-full">
                    <HiOutlinePlus />
                </button>
            </div>
            <div className="flex flex-grow flex-col gap-4 overflow-x-hidden overflow-y-auto w-full">
                <SortableContext items={taskIds}>
                    {tasks.map((task: ITask) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            tasksLoading={tasksLoading}
                        />
                    ))}
                </SortableContext>
                <button
                    onClick={() => setOpenPopup(true)}
                    className="bg-white p-3 text-sm flex justify-between items-center rounded-lg"
                >
                    <span>Create a new task</span>
                    <HiOutlinePlus className="w-4 h-4" />
                </button>
            </div>
            {isOpenNewTaskPopup && <TaskEntryControl
                isOpen={isOpenNewTaskPopup}
                columnId={column?.id}
                close={() => setOpenPopup(false)}
            />}
        </div>
    );
};

export default Column;