import Modal from '../common/Modal';

interface Props {
    isOpen: boolean;
    close: () => void;
    columnId: string | number;
    taskId?: string | number;
}

const TaskEntryControl = ({ isOpen, close, columnId, taskId }: Props) => {
    return (
        <Modal isOpen={isOpen} close={close}>
            <h3 className='text-lg font-medium leading-8 text-gray-900'>{!taskId ? "Create a new Task" : "Edit Task"} -- {columnId}</h3>
        </Modal>
    );
};

export default TaskEntryControl;