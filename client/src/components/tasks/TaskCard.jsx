import { Edit, Trash2, Calendar, CheckCircle } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
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

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/40 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
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
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`ml-4 p-1 rounded-full transition-colors ${
            task.status === "completed"
              ? "text-green-400 hover:text-green-300"
              : "text-slate-500 hover:text-green-400"
          }`}
        >
          <CheckCircle className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(task.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="p-2"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-400 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
