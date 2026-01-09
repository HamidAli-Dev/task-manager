import { Plus } from "lucide-react";
import CommunityTaskCard from "./CommunityTaskCard";
import Button from "../ui/Button";

const CommunityBoard = ({
  tasks = [],
  currentUser,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onToggleComplete,
  editingTasks = {},
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 animate-pulse"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 bg-slate-700 rounded-full"></div>
              <div className="h-3 bg-slate-700 rounded w-20"></div>
            </div>
            <div className="h-4 bg-slate-700 rounded mb-3"></div>
            <div className="h-3 bg-slate-700 rounded mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">
            Community Tasks
          </h2>
          <p className="text-sm text-slate-400">
            Collaborate with your team in real-time
          </p>
        </div>
        <Button onClick={onCreateTask} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Task Grid */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 max-w-md mx-auto">
            <div className="text-slate-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">
              No community tasks yet
            </h3>
            <p className="text-slate-400 text-sm">
              Be the first to add a task for the team!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <CommunityTaskCard
              key={task._id || task.id}
              task={task}
              currentUser={currentUser}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleComplete={onToggleComplete}
              isBeingEdited={editingTasks[task._id || task.id]?.isEditing}
              editingUser={editingTasks[task._id || task.id]?.user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityBoard;
