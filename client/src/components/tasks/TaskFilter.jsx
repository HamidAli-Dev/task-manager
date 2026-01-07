import { Filter, SortAsc } from "lucide-react";
import Button from "../ui/Button";

const TaskFilter = ({
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  taskCounts = { all: 0, pending: 0, "in progress": 0, completed: 0 },
}) => {
  const filterOptions = [
    { value: "all", label: "All Tasks", count: taskCounts.all },
    { value: "pending", label: "Pending", count: taskCounts.pending },
    {
      value: "in progress",
      label: "In Progress",
      count: taskCounts["in progress"],
    },
    { value: "completed", label: "Completed", count: taskCounts.completed },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "title", label: "Title A-Z" },
    { value: "status", label: "By Status" },
  ];

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-200">
            Filter by status:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={statusFilter === option.value ? "primary" : "secondary"}
              size="sm"
              onClick={() => onStatusFilterChange(option.value)}
              className="flex items-center gap-2"
            >
              {option.label}
              <span className="bg-slate-700/50 px-1.5 py-0.5 rounded text-xs">
                {option.count}
              </span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-200">Sort by:</span>
        </div>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskFilter;
