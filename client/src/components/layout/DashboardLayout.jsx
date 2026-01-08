import Navbar from "./Navbar";
import PageContainer from "./PageContainer";

const DashboardLayout = ({
  children,
  user,
  onLogout,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar
        user={user}
        onLogout={onLogout}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      <PageContainer>{children}</PageContainer>
    </div>
  );
};

export default DashboardLayout;
