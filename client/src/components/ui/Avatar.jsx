const Avatar = ({ user, size = "md", showOnline = false, className = "" }) => {
  const sizes = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
        ${sizes[size]} 
        rounded-full 
        bg-linear-to-br from-blue-500 to-cyan-500 
        flex items-center justify-center 
        text-white font-medium
        border-2 border-slate-700/50
      `}
      >
        {getInitials(user?.name)}
      </div>
      {showOnline && (
        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-slate-900 rounded-full"></div>
      )}
    </div>
  );
};

export default Avatar;
