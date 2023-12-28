import Modal from '../common/Modal';

interface Props {
    isOpen: boolean;
    close: () => void;
    priority: string;
    taskId?: number;
}

const TaskEntryControl = ({ isOpen, close, priority, taskId }: Props) => {
    return (
        <Modal isOpen={isOpen} close={close}>
            <h3 className='text-lg font-medium leading-8 text-gray-900'>{!taskId ? "Create a new Task" : "Edit Task"} -- {priority}</h3>
        </Modal>
    );
};

export default TaskEntryControl;