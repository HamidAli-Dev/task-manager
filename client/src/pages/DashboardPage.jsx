import { useState, useMemo, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

import { tasksAPI, communityAPI } from "../services/api";
import socketService from "../services/socket";
import DashboardLayout from "../components/layout/DashboardLayout";
import TabsLayout from "../components/layout/TabsLayout";
import Button from "../components/ui/Button";
import TaskList from "../components/tasks/TaskList";
import TaskFilter from "../components/tasks/TaskFilter";
import TaskModal from "../components/tasks/TaskModal";
import Modal from "../components/ui/Modal";
import Toast from "../components/ui/Toast";
import RealtimeToast from "../components/ui/RealtimeToast";
import Pagination from "../components/ui/Pagination";
import CommunityBoard from "../components/community/CommunityBoard";
import ActiveUsersPanel from "../components/community/ActiveUsersPanel";

const DashboardPage = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [communityCurrentPage, setCommunityCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  // Community state
  const [communityTasks, setCommunityTasks] = useState([]);

  const [activeUsers, setActiveUsers] = useState([]);
  const [editingTasks, setEditingTasks] = useState({});
  const [realtimeToasts, setRealtimeToasts] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTasks();
    initializeSocket();

    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentTab === 1) {
      fetchCommunityTasks();
      socketService.joinCommunity();
      socketService.requestPresence();
    } else {
      socketService.leaveCommunity();
    }
  }, [currentTab]);

  const initializeSocket = () => {
    const token = localStorage.getItem("taskflow_token");
    if (token) {
      socketService.connect(token);
      setupSocketListeners();
    }
  };

  const setupSocketListeners = () => {
    socketService.onUserJoined((data) => {
      addRealtimeToast({
        message: `${data.user.name} joined the board`,
        type: "info",
        user: data.user,
        action: "joined",
      });
    });

    socketService.onUserLeft((data) => {
      addRealtimeToast({
        message: `${data.user.name} left the board`,
        type: "info",
        user: data.user,
        action: "left",
      });
    });

    socketService.onTaskCreate((data) => {
      setCommunityTasks((prev) => [data.task, ...prev]);
      if (data.user.id !== user?.id) {
        addRealtimeToast({
          message: `${data.user.name} added a new task`,
          type: "success",
          user: data.user,
          action: "added",
        });
      }
    });

    socketService.onTaskUpdate((data) => {
      setCommunityTasks((prev) =>
        prev.map((task) => (task._id === data.task._id ? data.task : task))
      );
      if (data.user.id !== user?.id) {
        addRealtimeToast({
          message: `${data.user.name} updated a task`,
          type: "success",
          user: data.user,
          action: "updated",
        });
      }
    });

    socketService.onTaskDelete((data) => {
      setCommunityTasks((prev) =>
        prev.filter((task) => task._id !== data.taskId)
      );
      if (data.user.id !== user?.id) {
        addRealtimeToast({
          message: `${data.user.name} deleted a task`,
          type: "success",
          user: data.user,
          action: "deleted",
        });
      }
    });

    socketService.onPresenceUpdate((data) => {
      setActiveUsers(data.activeUsers);
    });

    socketService.onTaskEditing((data) => {
      setEditingTasks((prev) => ({
        ...prev,
        [data.taskId]: {
          isEditing: data.isEditing,
          user: data.user,
        },
      }));
    });
  };

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.log("tasks getting error", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityTasks = async () => {
    try {
      const response = await communityAPI.getTasks();
      setCommunityTasks(response.data);
    } catch (error) {
      console.log("community tasks getting error", error);
      setToast({ type: "error", message: "Failed to load community tasks" });
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    if (searchQuery.trim()) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return sorted;
  }, [tasks, statusFilter, sortBy, searchQuery]);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedTasks.slice(startIndex, endIndex);
  }, [filteredAndSortedTasks, currentPage, itemsPerPage]);

  const paginatedCommunityTasks = useMemo(() => {
    const startIndex = (communityCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return communityTasks.slice(startIndex, endIndex);
  }, [communityTasks, communityCurrentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTasks.length / itemsPerPage);
  const communityTotalPages = Math.ceil(communityTasks.length / itemsPerPage);

  const taskCounts = useMemo(() => {
    return {
      all: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      "in progress": tasks.filter((t) => t.status === "in progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    };
  }, [tasks]);

  const addRealtimeToast = (toast) => {
    const id = Date.now();
    setRealtimeToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeRealtimeToast = (id) => {
    setRealtimeToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sortBy, searchQuery, currentTab]);

  useEffect(() => {
    setCommunityCurrentPage(1);
  }, [currentTab]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);

    // Notify others about editing
    if (task.creator) {
      socketService.setEditing(task._id, true);
    }
  };

  const handleTaskSubmit = async (taskData) => {
    setFormLoading(true);

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

  const handleCommunityTaskSubmit = async (taskData) => {
    setFormLoading(true);
    console.log("Creating community task:", taskData);

    try {
      if (editingTask) {
        const response = await communityAPI.updateTask(
          editingTask._id,
          taskData
        );
        console.log("Updated community task:", response.data);
        socketService.setEditing(editingTask._id, false);
      } else {
        const response = await communityAPI.createTask(taskData);
        console.log("Created community task:", response.data);
      }

      setIsTaskModalOpen(false);
      setEditingTask(null);
      setToast({
        type: "success",
        message: "Community task saved successfully!",
      });
    } catch (error) {
      console.error("Community task submit error:", error);
      const message = error.response?.data?.message || "Failed to save task";
      setToast({ type: "error", message });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
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

  const handleCommunityTaskDelete = async (taskId) => {
    try {
      await communityAPI.deleteTask(taskId);
      setDeleteTaskId(null);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete task";
      setToast({ type: "error", message });
    }
  };

  const handleToggleComplete = async (taskId) => {
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

  const handleCommunityToggleComplete = async (taskId) => {
    try {
      const task = communityTasks.find((t) => t._id === taskId);
      const newStatus = task.status === "completed" ? "pending" : "completed";

      await communityAPI.updateTask(taskId, { ...task, status: newStatus });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update task status";
      setToast({ type: "error", message });
    }
  };

  const tabs = [
    { id: "my-tasks", label: "My Tasks" },
    { id: "community", label: "Community Tasks" },
  ];

  const renderTabContent = (activeTab) => {
    if (activeTab === 0) {
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-100 mb-2">
                My Tasks
              </h1>
              <p className="text-slate-400">Manage your personal tasks</p>
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
            tasks={paginatedTasks}
            onEdit={handleEditTask}
            onDelete={setDeleteTaskId}
            onToggleComplete={handleToggleComplete}
            loading={loading}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredAndSortedTasks.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <CommunityBoard
              tasks={paginatedCommunityTasks}
              currentUser={user}
              onCreateTask={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onEditTask={handleEditTask}
              onDeleteTask={setDeleteTaskId}
              onToggleComplete={handleCommunityToggleComplete}
              editingTasks={editingTasks}
              loading={false}
            />
            <Pagination
              currentPage={communityCurrentPage}
              totalPages={communityTotalPages}
              onPageChange={setCommunityCurrentPage}
              totalItems={communityTasks.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
          <div className="lg:col-span-1">
            <ActiveUsersPanel users={activeUsers} currentUser={user} />
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <DashboardLayout
        user={user}
        onLogout={onLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <TabsLayout
          tabs={tabs}
          defaultTab={currentTab}
          onTabChange={setCurrentTab}
        >
          {renderTabContent}
        </TabsLayout>
      </DashboardLayout>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          if (editingTask?.creator) {
            socketService.setEditing(editingTask._id, false);
          }
          setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={
          currentTab === 1 ? handleCommunityTaskSubmit : handleTaskSubmit
        }
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
              onClick={() => {
                if (communityTasks.find((t) => t._id === deleteTaskId)) {
                  handleCommunityTaskDelete(deleteTaskId);
                } else {
                  handleDeleteTask(deleteTaskId);
                }
              }}
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

      {realtimeToasts.map((toast) => (
        <RealtimeToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          user={toast.user}
          action={toast.action}
          onClose={() => removeRealtimeToast(toast.id)}
        />
      ))}

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
