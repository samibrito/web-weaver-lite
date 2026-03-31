import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, senha)) {
      navigate("/");
    } else {
      setErro("Credenciais inválidas. Tente: samile@norte.com, carlos@norte.com ou ana@norte.com");
    }
  };

  return (
    <div className="min-h-screen bg-background flex noise">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-sidebar via-sidebar to-primary/20 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-primary blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-accent blur-[100px]" />
        </div>

        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary mb-8">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">
            Norte<span className="text-primary">.</span>
          </h1>
          <p className="text-sidebar-foreground mt-4 text-lg leading-relaxed max-w-sm">
            Plataforma de gestão de padrões corporativos com controle total de versões e auditoria.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {[
            { label: "Versionamento", desc: "Histórico completo de alterações" },
            { label: "Formulários", desc: "Construtor sem código" },
            { label: "Auditoria", desc: "Rastreabilidade total" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <div>
                <p className="text-white/90 text-sm font-medium">{item.label}</p>
                <p className="text-sidebar-foreground text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent items-center justify-center glow-primary mb-4">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Norte<span className="text-primary">.</span></h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Bem-vindo de volta</h2>
            <p className="text-muted-foreground mt-1 text-sm">Entre com suas credenciais corporativas</p>
          </div>

          {erro && (
            <div className="flex items-start gap-2.5 bg-destructive/8 border border-destructive/15 text-destructive rounded-xl p-3 mb-5 text-xs animate-scale-in">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="seu.nome@norte.com"
                className={`w-full px-4 py-3 rounded-xl border bg-secondary/50 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 ${
                  focusedField === "email" ? "border-primary ring-2 ring-primary/20 bg-background" : "border-border"
                }`}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onFocus={() => setFocusedField("senha")}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border bg-secondary/50 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 ${
                  focusedField === "senha" ? "border-primary ring-2 ring-primary/20 bg-background" : "border-border"
                }`}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              Entrar com AD Corporativo
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <div className="mt-8 p-4 rounded-xl bg-secondary/50 border border-border/50">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-3">Acesso de teste</p>
            <div className="space-y-2">
              {[
                { email: "samile@norte.com", role: "Admin", color: "text-primary" },
                { email: "carlos@norte.com", role: "Gestor", color: "text-warning" },
                { email: "ana@norte.com", role: "Usuário", color: "text-success" },
              ].map((u) => (
                <button
                  key={u.email}
                  onClick={() => { setEmail(u.email); setSenha("123"); }}
                  className="w-full flex items-center justify-between py-1.5 text-xs hover:bg-muted/50 rounded-lg px-2 transition-colors group"
                >
                  <span className="font-mono text-foreground/80">{u.email}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${u.color}`}>{u.role}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 italic">Qualquer senha funciona</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
