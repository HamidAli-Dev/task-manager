const PageContainer = ({ children, className = "" }) => {
  return (
    <div
      className={`min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
