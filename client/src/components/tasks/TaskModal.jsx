import Modal from "../ui/Modal";
import TaskForm from "./TaskForm";

const TaskModal = ({ isOpen, onClose, task, onSubmit, loading = false }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? "Edit Task" : "Create New Task"}
      size="md"
    >
      <TaskForm
        task={task}
        onSubmit={onSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
};

export default TaskModal;
