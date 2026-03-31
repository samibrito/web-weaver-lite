import { LayoutDashboard, Building2, Layers, Activity } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/departamentos", label: "Departamentos", icon: Building2 },
  { to: "/padroes", label: "Padrões", icon: Layers },
  { to: "/logs", label: "Logs", icon: Activity },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-sidebar flex flex-col">
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold text-sidebar-primary-foreground">Norte</h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground">
          Usuário: <span className="font-semibold text-sidebar-primary-foreground">Samile Ferreira</span>
        </p>
        <p className="text-xs text-sidebar-foreground">
          Depto: <span className="font-semibold text-sidebar-primary-foreground">Qualidade</span>
        </p>
      </div>
    </aside>
  );
};

export default AppSidebar;
