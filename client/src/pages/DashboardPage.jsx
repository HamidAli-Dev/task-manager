import { useState, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import TaskList from "../components/tasks/TaskList";
import TaskFilter from "../components/tasks/TaskFilter";
import TaskModal from "../components/tasks/TaskModal";
import Modal from "../components/ui/Modal";
import Toast from "../components/ui/Toast";

const DashboardPage = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Complete project proposal",
      description:
        "Write and submit the Q1 project proposal for the new client",
      status: "in progress",
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      title: "Review code changes",
      description: "Review pull requests from the development team",
      status: "pending",
      createdAt: "2024-01-14T14:30:00Z",
    },
    {
      id: "3",
      title: "Update documentation",
      description: "Update API documentation with latest changes",
      status: "completed",
      createdAt: "2024-01-13T09:15:00Z",
    },
  ]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = tasks.filter((task) => task.status === statusFilter);
    }

    // Sort tasks
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          return a.status.localeCompare(b.status);
        default: // newest
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
    setLoading(true);
    console.log("Task submission:", taskData);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingTask) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === editingTask.id ? { ...task, ...taskData } : task
          )
        );
        setToast({ type: "success", message: "Task updated successfully!" });
      } else {
        const newTask = {
          id: Date.now().toString(),
          ...taskData,
          createdAt: new Date().toISOString(),
        };
        setTasks((prev) => [newTask, ...prev]);
        setToast({ type: "success", message: "Task created successfully!" });
      }

      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      setToast({
        type: "error",
        message: "Failed to save task. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    console.log("Deleting task:", taskId);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setToast({ type: "success", message: "Task deleted successfully!" });
      setDeleteTaskId(null);
    } catch (error) {
      setToast({
        type: "error",
        message: "Failed to delete task. Please try again.",
      });
    }
  };

  const handleToggleComplete = async (taskId) => {
    console.log("Toggling task completion:", taskId);

    try {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: task.status === "completed" ? "pending" : "completed",
              }
            : task
        )
      );

      const task = tasks.find((t) => t.id === taskId);
      const newStatus = task.status === "completed" ? "pending" : "completed";
      setToast({
        type: "success",
        message: `Task marked as ${newStatus}!`,
      });
    } catch (error) {
      setToast({ type: "error", message: "Failed to update task status." });
    }
  };

  return (
    <>
      <DashboardLayout user={user} onLogout={onLogout}>
        <div className="space-y-6">
          {/* Header */}
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

          {/* Filters */}
          <TaskFilter
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            taskCounts={taskCounts}
          />

          {/* Task List */}
          <TaskList
            tasks={filteredAndSortedTasks}
            onEdit={handleEditTask}
            onDelete={setDeleteTaskId}
            onToggleComplete={handleToggleComplete}
            loading={false}
          />
        </div>
      </DashboardLayout>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={handleTaskSubmit}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
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

      {/* Toast Notifications */}
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
