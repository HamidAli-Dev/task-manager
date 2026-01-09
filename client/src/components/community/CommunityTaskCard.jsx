import { Edit, Trash2, Calendar, CheckCircle, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";

const CommunityTaskCard = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  currentUser,
  isBeingEdited = false,
  editingUser = null,
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "completed";
      case "in progress":
        return "in-progress";
      default:
        return "pending";
    }
  };

  const isOwner = currentUser?.id === task.creator?._id;

  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const hasRecentActivity =
      task.updatedAt && new Date() - new Date(task.updatedAt) < 5000;
    if (hasRecentActivity) {
      setIsBlinking(true);
      const timer = setTimeout(() => setIsBlinking(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [task.updatedAt]);

  return (
    <div
      className={`
      bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 
      hover:bg-slate-800/40 transition-all duration-200 group relative
      ${isBlinking ? "ring-2 ring-blue-500/30 animate-pulse" : ""}
      ${isBeingEdited ? "ring-2 ring-yellow-500/50" : ""}
    `}
    >
      {isBlinking && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-400 rounded-full animate-ping"></div>
      )}

      {isBeingEdited && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-yellow-400 text-xs">
          <Lock className="h-3 w-3" />
          <span>{editingUser?.name} editing...</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Avatar user={task.creator} size="sm" />
            <span className="text-xs text-slate-400">
              {`${task.creator?.name} ${isOwner ? "(You)" : ""}` ||
                "Unknown User"}
            </span>
          </div>

          <h3
            className={`text-lg font-semibold mb-2 ${
              task.status === "completed"
                ? "text-slate-400 line-through"
                : "text-slate-100"
            }`}
          >
            {task.title}
          </h3>

          <p className="text-slate-300 text-sm mb-3 line-clamp-2">
            {task.description}
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => onToggleComplete(task._id || task.id)}
            disabled={isBeingEdited}
            className={`ml-4 p-1 rounded-full transition-colors ${
              task.status === "completed"
                ? "text-green-400 hover:text-green-300"
                : "text-slate-500 hover:text-green-400"
            } ${isBeingEdited ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <CheckCircle className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(task.createdAt)}</span>
          </div>
        </div>

        {isOwner && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              disabled={isBeingEdited}
              className="p-2"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task._id || task.id)}
              disabled={isBeingEdited}
              className="p-2 text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityTaskCard;
