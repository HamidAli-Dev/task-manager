const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-slate-700/50 text-slate-300",
    pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    "in-progress": "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    completed: "bg-green-500/20 text-green-400 border border-green-500/30",
  };

  return (
    <span
      className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      backdrop-blur-sm transition-colors
      ${variants[variant]}
      ${className}
    `}
    >
      {children}
    </span>
  );
};

export default Badge;
