import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ITask } from "../../Interfaces/board";
import TaskEntryControl from "./TaskEntryControl";


interface CardProps {
  task: ITask;
  tasksLoading: Set<string | number>
}

const TaskCard = ({ task, tasksLoading }: CardProps) => {
  const [isOpenEditTaskPopup, setOpenPopup] = useState(false);

  const { id, task: taskContent, completed, assignee, priority } = task;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "Task",
      task,
    },
    disabled: tasksLoading?.has(id)
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };


  // While dragging
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 p-3 min-h-24 items-center flex rounded-lg border-2 border-sky-400 cursor-grab relative"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setOpenPopup(true)}
      className={`bg-white p-3 min-h-24 rounded-lg shadow-sm border-2 duration-100 hover:border-sky-400 ${completed ? "border-green-500" : ""} cursor-grab relative whitespace-pre-wrap break-words ${tasksLoading.has(id) ? "animate-pulse" : ""
        }`}
    >
      {/* Content div */}
      <div
        className="my-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words"
      >
        <p className="text-sm">{taskContent}</p>
        <p className="absolute bottom-2 text-xs text-gray-500">{assignee}</p>
      </div>

      {isOpenEditTaskPopup && (
        <TaskEntryControl
          isOpen={isOpenEditTaskPopup}
          close={() => setOpenPopup(false)}
          priority={priority as string}
          taskId={id}
        />
      )}
    </div>
  );
};

export default TaskCard;
