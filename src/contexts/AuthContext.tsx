import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "admin" | "gestor" | "usuario";

export interface User {
  id: string;
  nome: string;
  email: string;
  role: Role;
  departamento: string;
  avatar?: string;
}

const mockUsers: User[] = [
  { id: "1", nome: "Samile Ferreira", email: "samile@norte.com", role: "admin", departamento: "Qualidade" },
  { id: "2", nome: "Carlos Silva", email: "carlos@norte.com", role: "gestor", departamento: "Produção" },
  { id: "3", nome: "Ana Costa", email: "ana@norte.com", role: "usuario", departamento: "RH" },
];

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, senha: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (minRole: Role) => boolean;
}

const roleHierarchy: Record<Role, number> = { admin: 3, gestor: 2, usuario: 1 };

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("norte-user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, _senha: string) => {
    const found = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      localStorage.setItem("norte-user", JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("norte-user");
  };

  const hasPermission = (minRole: Role) => {
    if (!user) return false;
    return roleHierarchy[user.role] >= roleHierarchy[minRole];
  };

  return (
    <AuthContext.Provider value={{ user, users: mockUsers, login, logout, isAuthenticated: !!user, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
