import { useState, useMemo, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { tasksAPI } from "../services/api";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import TaskList from "../components/tasks/TaskList";
import TaskFilter from "../components/tasks/TaskFilter";
import TaskModal from "../components/tasks/TaskModal";
import Modal from "../components/ui/Modal";
import Toast from "../components/ui/Toast";

const DashboardPage = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getTasks();
      setTasks(response.data);
    } catch (error) {
      // setToast({ type: 'error', message: 'Failed to load tasks' });
      console.log("tasks getting error", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    if (statusFilter !== "all") {
      filtered = tasks.filter((task) => task.status === statusFilter);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return sorted;
  }, [tasks, statusFilter, sortBy]);

  const taskCounts = useMemo(() => {
    return {
      all: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      "in progress": tasks.filter((t) => t.status === "in progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    };
  }, [tasks]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (taskData) => {
    setFormLoading(true);
    console.log("Task submission:", taskData);

    try {
      if (editingTask) {
        const response = await tasksAPI.updateTask(editingTask._id, taskData);
        setTasks((prev) =>
          prev.map((task) =>
            task._id === editingTask._id ? response.data : task
          )
        );
        setToast({ type: "success", message: "Task updated successfully!" });
      } else {
        const response = await tasksAPI.createTask(taskData);
        setTasks((prev) => [response.data, ...prev]);
        setToast({ type: "success", message: "Task created successfully!" });
      }

      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to save task";
      setToast({ type: "error", message });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    console.log("Deleting task:", taskId);

    try {
      await tasksAPI.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      setToast({ type: "success", message: "Task deleted successfully!" });
      setDeleteTaskId(null);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete task";
      setToast({ type: "error", message });
    }
  };

  const handleToggleComplete = async (taskId) => {
    console.log("Toggling task completion:", taskId);

    try {
      const task = tasks.find((t) => t._id === taskId);
      const newStatus = task.status === "completed" ? "pending" : "completed";

      const response = await tasksAPI.updateTask(taskId, {
        ...task,
        status: newStatus,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? response.data : t))
      );

      setToast({
        type: "success",
        message: `Task marked as ${newStatus}!`,
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update task status";
      setToast({ type: "error", message });
    }
  };

  return (
    <>
      <DashboardLayout user={user} onLogout={onLogout}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-100 mb-2">
                Task Dashboard
              </h1>
              <p className="text-slate-400">
                Manage your tasks and stay organized
              </p>
            </div>
            <Button
              onClick={handleCreateTask}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>

          <TaskFilter
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            taskCounts={taskCounts}
          />

          <TaskList
            tasks={filteredAndSortedTasks}
            onEdit={handleEditTask}
            onDelete={setDeleteTaskId}
            onToggleComplete={handleToggleComplete}
            loading={loading}
          />
        </div>
      </DashboardLayout>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={handleTaskSubmit}
        loading={formLoading}
      />

      <Modal
        isOpen={!!deleteTaskId}
        onClose={() => setDeleteTaskId(null)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={() => handleDeleteTask(deleteTaskId)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDeleteTaskId(null)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default DashboardPage;
