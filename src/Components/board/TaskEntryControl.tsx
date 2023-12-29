import { UseFormReturn } from 'react-hook-form';
import { boardColumns } from '../../constants/board';
import Button from '../common/Button';
import { Form, FormField, FormInputFuncProps } from '../common/Form';
import Modal from '../common/Modal';
import { RxCross2 } from "react-icons/rx";
import { useMutation, useQuery } from 'react-query';
import { createTask, editTask, getTask } from '../../providers/reactQuery';
import { queryClient } from '../../config/queryClient';
import toast from 'react-hot-toast';
import Loading from '../common/Loading';
import { useEffect, useState } from 'react';
import { ITask } from '../../Interfaces/board';

interface Props {
    isOpen: boolean;
    close: () => void;
    priority: string;
    taskId?: number;
}

const currentDate = new Date();

const TaskEntryControl = ({ isOpen, close, priority, taskId }: Props) => {

    const [disableEditBtn, setDisable] = useState(false);
    const [formData, setFormData] = useState({ task: '', assignee: '', assigned_to: '', due_date: '', priority: '' });

    const { data, isLoading } = useQuery(["task", taskId], () => getTask(taskId as number), {
        enabled: !!taskId,
        onError: () => toast.error("Failed to fetch task data!"),
        onSuccess: (data) => {
            const { task, assignee, assigned_to, due_date, priority } = data as ITask || {};
            setFormData({ task, assignee, assigned_to, due_date: due_date as unknown as string, priority })
        }
    });

    const { mutate, isLoading: createLoading } = useMutation(taskId ? editTask : createTask, {
        onSuccess: (data) => {
            queryClient.setQueryData('tasks', ({ tasks: existingTasks }) => {

                if (!taskId) {
                    if (existingTasks?.length) {
                        return { tasks: [...existingTasks, data] };
                    }
                    return { tasks: [data] };
                } else {
                    const indexToUpdate = existingTasks.findIndex((task: ITask) => task.id === data?.id);
                    const updatedTasks = indexToUpdate !== -1
                        ? [...existingTasks.slice(0, indexToUpdate), data, ...existingTasks.slice(indexToUpdate + 1)]
                        : existingTasks;
                    return { tasks: updatedTasks };
                }
            });

            queryClient.setQueryData('task', { ...data })

            close();
            toast.success(`Task ${taskId ? "updated" : "created"} successfully`);
        },

        onError: () => {
            toast.error(`Failed to ${taskId ? "update" : "create"} task!`);
        }
    });

    useEffect(() => {
        const { task, assignee, assigned_to, priority, due_date } = data as ITask || {}
        if (formData.task === task && formData.assignee === assignee &&
            formData.assigned_to === assigned_to && new Date(formData.due_date)?.getDate() === new Date(due_date)?.getDate() &&
            formData.priority === priority
        ) setDisable(true);
        else setDisable(false)
    }, [formData, data])



    const handleSubmit = async (values: Record<string, string>, form: UseFormReturn) => {
        const { task, assigned_to, assignee, priority: selectedPriority, due_date } = values || {};

        const dueDate = new Date(due_date);

        if (dueDate.getDate() === currentDate.getDate()) {
            return form.setError("due_date", { message: "Due date can't be today!" })
        }

        const payload = { task, assigned_to, assignee, priority: selectedPriority, due_date: dueDate };
        if (taskId) {
            (payload as unknown as { id: number })["id"] = taskId;
            (payload as unknown as { created_at: Date })["created_at"] = new Date(data?.created_at);
        }
        else {
            (payload as unknown as { created_at: Date })["created_at"] = currentDate;
            (payload as unknown as { completed: boolean })["completed"] = selectedPriority === "DONE" ? true : false;
            (payload as unknown as { completed_at: Date | null })["completed_at"] = selectedPriority === "DONE" ? currentDate : null;
        }

        mutate(payload);
    }

    const handleChange = (e: { target: { name: string; value: string | number; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    return (
        <Modal isOpen={isOpen} close={close}>
            <div className='flex justify-between items-center'>
                <h3 className='text-lg font-medium leading-8 text-gray-900'>{!taskId ? "Create task" : "Edit task"}</h3>
                <button onClick={close} className=' duration-100 hover:bg-gray-200 p-2 rounded-full'>
                    <RxCross2 />
                </button>
            </div>

            {
                isLoading ? <div className='h-80 flex items-center justify-center'><Loading className='w-10 h-10' /></div> : <Form onSubmit={handleSubmit} className="flex flex-col items-center justify-center space-y-2 md:space-y-4 px-2 md:px-0 mt-6">
                    <div className="w-full">
                        <label className='text-sm'>Task</label>
                        <FormField
                            required
                            name="task"
                            type="text"
                            maxLength={200}
                        >
                            {({ errors, ...props }: FormInputFuncProps) => (
                                <div className="flex flex-col gap-2 w-full mt-2">
                                    <textarea
                                        {...props}
                                        maxLength={200}
                                        rows={2}
                                        onChange={handleChange}
                                        defaultValue={data?.task}
                                        className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-sky-600 ${errors ? "border-red-600" : ""}`}
                                    />
                                    {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                </div>
                            )}
                        </FormField>
                    </div>

                    <div className='flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0 space-x-0 md:space-x-4 w-full'>
                        <div className="w-full">
                            <label className='text-sm'>Assignee</label>
                            <FormField
                                required
                                name="assignee"
                                type="text"
                                maxLength={200}
                            >
                                {({ errors, ...props }: FormInputFuncProps) => (
                                    <div className="flex flex-col gap-2 w-full mt-2">
                                        <input
                                            {...props}
                                            maxLength={200}
                                            onChange={handleChange}
                                            defaultValue={data?.assignee}
                                            className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-sky-600 ${errors ? "border-red-600" : ""}`}
                                        />
                                        {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                    </div>
                                )}
                            </FormField>
                        </div>

                        <div className="w-full">
                            <label className='text-sm'>Assigned to</label>
                            <FormField
                                required
                                name="assigned_to"
                                type="text"
                                maxLength={200}
                            >
                                {({ errors, ...props }: FormInputFuncProps) => (
                                    <div className="flex flex-col gap-2 w-full mt-2">
                                        <input
                                            {...props}
                                            maxLength={200}
                                            onChange={handleChange}
                                            defaultValue={data?.assigned_to}
                                            className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-sky-600 ${errors ? "border-red-600" : ""}`}
                                        />
                                        {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                    </div>
                                )}
                            </FormField>
                        </div>
                    </div>

                    <div className='flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0 space-x-0 md:space-x-4 w-full'>
                        <div className="w-full">
                            <label className='text-sm'>Due Date</label>
                            <FormField
                                required
                                name="due_date"
                                type='date'
                                maxLength={200}
                            >
                                {({ errors, ...props }: FormInputFuncProps) => (
                                    <div className="flex flex-col gap-2 w-full mt-2">
                                        <input
                                            {...props}
                                            maxLength={200}
                                            onChange={handleChange}
                                            min={new Date().toISOString().split("T")[0]}
                                            defaultValue={data?.due_date ? new Date(data?.due_date)?.toISOString()?.split('T')?.[0] : ''}
                                            className={`shadow-sm block px-3 py-2 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-sky-600 cursor-pointer ${errors ? "border-red-600" : ""}`}
                                        />
                                        {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                    </div>
                                )}
                            </FormField>
                        </div>

                        <div className="w-full">
                            <label className='text-sm'>Priority</label>
                            <FormField
                                required
                                name="priority"
                                type="select"
                            >
                                {({ errors, ...props }: FormInputFuncProps) => (
                                    <div className="flex flex-col gap-2 w-full mt-2">
                                        <select
                                            {...props}
                                            onChange={handleChange}
                                            defaultValue={data?.priority || priority}
                                            className={`shadow-sm block px-3 py-2.5 border rounded-md placeholder-gray-400 sm:text-sm focus:outline-none focus:border-sky-600 ${errors ? "border-red-600" : ""}`}
                                        >
                                            {
                                                boardColumns.map((boardColumn) => (
                                                    <option key={`taskEntryControl__${boardColumn.id}`} value={boardColumn.id}>{boardColumn.title}</option>
                                                ))
                                            }
                                        </select>
                                        {errors && (<p className="text-xs text-error-red">{errors.message}</p>)}
                                    </div>
                                )}
                            </FormField>
                        </div>
                    </div>

                    <div className='pt-6 flex justify-end w-full space-x-4'>
                        <Button onClick={close} kind='danger' disabled={createLoading} type='button'>Cancel</Button>
                        <Button disabled={createLoading || disableEditBtn} loading={createLoading} type='submit'>{taskId ? "Edit" : "Create"}</Button>
                    </div>
                </Form>
            }
        </Modal>
    );
};

export default TaskEntryControl;