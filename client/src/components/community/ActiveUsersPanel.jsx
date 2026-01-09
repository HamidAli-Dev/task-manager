import { Users, Eye } from "lucide-react";
import Avatar from "../ui/Avatar";

const ActiveUsersPanel = ({ users = [], currentUser }) => {
  const otherUsers = users.filter((user) => user.id !== currentUser?.id);

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 h-fit">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-4 w-4 text-slate-400" />
        <h3 className="font-semibold text-slate-200">Active Users</h3>
        <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
          {users.length}
        </span>
      </div>

      <div className="space-y-3">
        {/* Current User */}
        <div className="flex items-center gap-3 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <Avatar user={currentUser} size="sm" showOnline />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">
              {currentUser?.name} (You)
            </p>
            <div className="flex items-center gap-1 text-xs text-blue-400">
              <Eye className="h-3 w-3" />
              <span>Viewing board</span>
            </div>
          </div>
        </div>

        {/* Other Users */}
        {otherUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-2 hover:bg-slate-700/30 rounded-lg transition-colors"
          >
            <Avatar user={user} size="sm" showOnline />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">
                {user.name}
              </p>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Eye className="h-3 w-3" />
                <span>Viewing board</span>
              </div>
            </div>
          </div>
        ))}

        {otherUsers.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-slate-400">No other users online</p>
          </div>
        )}
      </div>

      {/* Activity Status */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live updates active</span>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersPanel;
