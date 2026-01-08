import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "../ui/Input";
import Button from "../ui/Button";

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  status: z.enum(["pending", "in progress", "completed"]),
});

const TaskForm = ({ task, onSubmit, onCancel, loading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "pending",
    },
  });

  const onFormSubmit = (data) => {
    console.log("Task form data:", data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Input
        label="Task Title"
        placeholder="Enter task title..."
        error={errors.title?.message}
        {...register("title")}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">
          Description
        </label>
        <textarea
          placeholder="Enter task description..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-400">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">
          Status
        </label>
        <div className="relative">
          <select
            className="w-full px-4 py-3 pr-10 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer [&>option]:bg-slate-800 [&>option]:text-slate-100 [&>option]:py-2 [&>option]:rounded-lg"
            {...register("status")}
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={loading} className="flex-1">
          {task ? "Update Task" : "Create Task"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
