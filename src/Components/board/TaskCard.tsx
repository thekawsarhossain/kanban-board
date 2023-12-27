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

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: false // TODO: Make it dynamic 
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
      className={`bg-white p-3 min-h-24 rounded-lg shadow-sm border-2 duration-100 hover:border-sky-400 cursor-grab relative whitespace-pre-wrap break-words ${tasksLoading.has(task?.id) ? "animate-pulse" : ""
        }`}
    >
      {/* Content div */}
      <div
        className="my-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words relative"
      >
        <p className="text-sm">{task?.task}</p>
      </div>

      {isOpenEditTaskPopup && (
        <TaskEntryControl
          isOpen={isOpenEditTaskPopup}
          close={() => setOpenPopup(false)}
          columnId={task?.status as string}
          taskId={task.id}
        />
      )}
    </div>
  );
};

export default TaskCard;
