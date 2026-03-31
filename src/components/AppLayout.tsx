import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-60 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
