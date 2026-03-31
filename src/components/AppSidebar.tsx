import { LayoutDashboard, Building2, Layers, Activity, Blocks, Moon, Sun, LogOut, Shield } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/departamentos", label: "Departamentos", icon: Building2 },
  { to: "/padroes", label: "Padrões", icon: Layers },
  { to: "/formularios", label: "Formulários", icon: Blocks },
  { to: "/logs", label: "Auditoria", icon: Activity },
];

const roleLabels = { admin: "Administrador", gestor: "Gestor", usuario: "Usuário" };
const roleBadgeStyles = {
  admin: "bg-primary/20 text-primary",
  gestor: "bg-amber-500/20 text-amber-400",
  usuario: "bg-emerald-500/20 text-emerald-400",
};

const AppSidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center">
          <span className="text-sidebar-primary-foreground font-bold text-lg">N</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-primary-foreground leading-tight">Norte</h1>
          <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">Gestão de Padrões</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Theme toggle */}
      <div className="px-3 mb-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          {theme === "light" ? "Modo Escuro" : "Modo Claro"}
        </button>
      </div>

      {/* User */}
      <div className="px-3 pb-4">
        <div className="bg-sidebar-accent/30 rounded-xl p-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold text-sm">
              {user?.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-primary-foreground truncate">{user?.nome}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user?.departamento}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleBadgeStyles[user?.role || "usuario"]}`}>
              <Shield size={10} />
              {roleLabels[user?.role || "usuario"]}
            </span>
            <button onClick={logout} className="p-1.5 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-primary-foreground hover:bg-sidebar-accent transition-colors" title="Sair">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
