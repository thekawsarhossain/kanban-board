import { Fragment, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ITask } from "../../Interfaces/board";
import TaskEntryControl from "./TaskEntryControl";
import { Menu, Transition } from "@headlessui/react";
import { ImBin } from "react-icons/im";
import { HiDotsHorizontal } from "react-icons/hi";
import { useMutation } from "react-query";
import { deleteTask } from "../../providers/reactQuery";
import { queryClient } from "../../config/queryClient";
import toast from "react-hot-toast";


interface CardProps {
  task: ITask;
  tasksLoading: Set<string | number>
}

const TaskCard = ({ task, tasksLoading }: CardProps) => {
  const [isOpenEditTaskPopup, setOpenPopup] = useState(false);
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const { id, task: taskContent, completed, assignee, priority, assigned_to } = task;

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(deleteTask, {
    onMutate: async (taskId) => {
      const previousTasks = queryClient.getQueryData('tasks');
      queryClient.setQueryData('tasks', ({ tasks: existingTasks }) => {
        if (existingTasks?.length) {
          return { tasks: existingTasks.filter((task: ITask) => task.id !== taskId) };
        }
        return { tasks: [] };
      });
      return { previousTasks };
    },

    onSuccess: () => {
      toast.success(`Task deleted successfully`);
    },
    onError: (_, _variables, context) => {
      const previousTasks = context?.previousTasks;
      queryClient.setQueryData('tasks', previousTasks);

      toast.error("Failed to delete task");
    }
  })


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
    disabled: tasksLoading?.has(id) || deleteLoading
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
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      className={`bg-white p-3 rounded-lg shadow-sm border-2 duration-100 hover:border-sky-400 ${completed ? "border-green-500" : ""} cursor-grab relative whitespace-pre-wrap break-words ${tasksLoading.has(id) || deleteLoading ? "animate-pulse" : ""
        }`}
    >
      {/* Content div */}
      <div
        onClick={() => setOpenPopup(true)}
        className="my-auto w-full min-h-[100%] overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words"
      >
        <p className="text-sm">{taskContent}</p>
        <p className="text-xs text-gray-500 mt-4">{assignee}</p>
      </div>

      {/* avatar */}
      <div title={`assigned to: ${assigned_to}`}
        className={`w-6 h-6 bg-sky-900 rounded-full flex items-center justify-center text-white text-base font-bold absolute bottom-1 right-1`}
      >
        {assigned_to ? assigned_to.charAt(0).toUpperCase() : 'A'}
      </div>

      {mouseIsOver && (
        <Menu
          as="div"
          className={`absolute right-2 top-6 -translate-y-1/2 z-20 ${deleteLoading ? "animate-pulse" : ""
            }`}
        >
          <Menu.Button className="inline-flex w-full justify-center rounded bg-gray-100 opacity-90 hover:opacity-100 px-1 font-medium focus:outline-none focus:ring-1 focus:ring-offset-1 ring-sky-400">
            <HiDotsHorizontal
              className="h-5 w-5 text-heading-1"
              aria-hidden="true"
            />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 w-32 origin-top-right divide-y divide-border-gray-200 rounded-md shadow-lg focus:outline-none border border-gray-200 bg-white">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      disabled={deleteLoading}
                      onClick={() => deleteMutate(id)}
                      className={`${active ? "bg-gray-100 text-gray-900" : "text-black"
                        } group flex gap-1 w-full items-center rounded-md px-2 py-2 text-xs`}
                    >
                      <ImBin />
                      <span>Delete</span>
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )}

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
