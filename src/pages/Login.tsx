import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Compass, AlertCircle } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, senha)) {
      navigate("/");
    } else {
      setErro("Credenciais inválidas. Tente: samile@norte.com, carlos@norte.com ou ana@norte.com");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <Compass size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Norte</h1>
          <p className="text-muted-foreground mt-2">Sistema de Gestão de Padrões Corporativos</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-card-foreground mb-6">Entrar</h2>

          {erro && (
            <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 mb-4 text-sm">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">E-mail corporativo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.nome@norte.com"
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Entrar com AD Corporativo
            </button>
          </form>

          <div className="mt-6 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground font-medium mb-2">Usuários de teste:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-mono font-medium text-foreground">samile@norte.com</span> — Admin</p>
              <p><span className="font-mono font-medium text-foreground">carlos@norte.com</span> — Gestor</p>
              <p><span className="font-mono font-medium text-foreground">ana@norte.com</span> — Usuário</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">Senha: qualquer valor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
