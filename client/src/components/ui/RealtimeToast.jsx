import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Users,
  Plus,
  Edit,
  Trash,
} from "lucide-react";
import Avatar from "./Avatar";

const RealtimeToast = ({
  message,
  type = "info",
  user = null,
  action = null,
  duration = 4000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    if (action) {
      switch (action) {
        case "joined":
          return Users;
        case "added":
          return Plus;
        case "updated":
          return Edit;
        case "deleted":
          return Trash;
        default:
          return CheckCircle;
      }
    }

    switch (type) {
      case "success":
        return CheckCircle;
      case "error":
        return XCircle;
      case "warning":
        return AlertCircle;
      default:
        return CheckCircle;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-green-500/20 border-green-500/30 text-green-400";
      case "error":
        return "bg-red-500/20 border-red-500/30 text-red-400";
      case "warning":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-400";
      default:
        return "bg-blue-500/20 border-blue-500/30 text-blue-400";
    }
  };

  const Icon = getIcon();

  return (
    <div
      className={`
      fixed top-4 right-4 z-50
      flex items-center gap-3 p-4 rounded-lg max-w-sm
      backdrop-blur-sm border
      transform transition-all duration-200
      ${getColors()}
      ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
    `}
    >
      {user && <Avatar user={user} size="sm" />}

      <Icon className="h-5 w-5 shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{message}</p>
      </div>

      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 200);
        }}
        className="ml-2 hover:opacity-70 transition-opacity shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default RealtimeToast;
