import { LayoutDashboard, Building2, Layers, Activity, Blocks, Moon, Sun, LogOut, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/departamentos", label: "Departamentos", icon: Building2 },
  { to: "/padroes", label: "Padrões", icon: Layers },
  { to: "/formularios", label: "Formulários", icon: Blocks },
  { to: "/logs", label: "Auditoria", icon: Activity },
];

const roleLabels = { admin: "Admin", gestor: "Gestor", usuario: "Usuário" };

const AppSidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar flex flex-col border-r border-sidebar-border z-50 transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 glow-primary">
          <span className="text-white font-bold text-lg tracking-tight">N</span>
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-base font-bold text-sidebar-primary-foreground leading-tight tracking-tight">Norte</h1>
            <p className="text-[9px] text-sidebar-foreground/50 uppercase tracking-[0.2em] font-medium">Gestão de Padrões</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-auto mb-2 w-6 h-6 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-primary/20 transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-sidebar-primary/15 text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-sidebar-primary" />
              )}
              <item.icon size={18} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" />
              {!collapsed && <span className="animate-fade-in truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-3 space-y-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={collapsed ? (theme === "light" ? "Modo Escuro" : "Modo Claro") : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          {theme === "light" ? <Moon size={18} strokeWidth={1.8} /> : <Sun size={18} strokeWidth={1.8} />}
          {!collapsed && <span>{theme === "light" ? "Modo Escuro" : "Modo Claro"}</span>}
        </button>

        {/* User */}
        <div className={`rounded-xl bg-sidebar-accent/50 ${collapsed ? "p-2" : "p-3"}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-xs shrink-0">
              {user?.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-xs font-semibold text-sidebar-accent-foreground truncate">{user?.nome}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider text-sidebar-primary">
                    <Shield size={8} />
                    {roleLabels[user?.role || "usuario"]}
                  </span>
                </div>
              </div>
            )}
            {!collapsed && (
              <button onClick={logout} className="p-1.5 rounded-lg text-sidebar-foreground/50 hover:text-accent hover:bg-sidebar-accent transition-colors" title="Sair">
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
