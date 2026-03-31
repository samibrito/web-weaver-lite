import { Building2, Layers, Activity, TrendingUp, Clock, FileCheck, ArrowUpRight, BarChart3 } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { departamentos, padroes, logs } = useData();
  const { user } = useAuth();

  const padroesAtivos = padroes.filter((p) => p.status === "ativo").length;
  const padroesRevisao = padroes.filter((p) => p.status === "revisão").length;
  const recentLogs = logs.slice(0, 5);

  const stats = [
    { icon: Building2, label: "Departamentos", value: departamentos.length, change: "+2", trend: "up" as const, gradient: "from-primary/20 to-primary/5", iconColor: "text-primary" },
    { icon: Layers, label: "Padrões Ativos", value: padroesAtivos, change: "+3", trend: "up" as const, gradient: "from-success/20 to-success/5", iconColor: "text-success" },
    { icon: Clock, label: "Em Revisão", value: padroesRevisao, change: "1", trend: "neutral" as const, gradient: "from-warning/20 to-warning/5", iconColor: "text-warning" },
    { icon: Activity, label: "Atividades", value: logs.length, change: "+12", trend: "up" as const, gradient: "from-accent/20 to-accent/5", iconColor: "text-accent" },
  ];

  const acaoStyles: Record<string, string> = {
    Criação: "bg-success/10 text-success",
    Edição: "bg-primary/10 text-primary",
    Exclusão: "bg-destructive/10 text-destructive",
    Versão: "bg-accent/10 text-accent",
  };

  const statusData = (["ativo", "revisão", "obsoleto"] as const).map((status) => {
    const count = padroes.filter((p) => p.status === status).length;
    const pct = padroes.length > 0 ? (count / padroes.length) * 100 : 0;
    const colors = { ativo: "bg-success", revisão: "bg-warning", obsoleto: "bg-destructive" };
    const labels = { ativo: "Ativo", revisão: "Revisão", obsoleto: "Obsoleto" };
    return { status, count, pct, color: colors[status], label: labels[status] };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-1">Dashboard</p>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Olá, {user?.nome.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Visão geral do sistema Norte</p>
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="group glass rounded-2xl p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center`}>
                <s.icon size={18} className={s.iconColor} />
              </div>
              <span className="text-[10px] font-bold text-success uppercase tracking-wider flex items-center gap-0.5">
                {s.change}
                <ArrowUpRight size={10} />
              </span>
            </div>
            <p className="text-3xl font-bold text-card-foreground tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent activity - takes 3 cols */}
        <div className="lg:col-span-3 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-card-foreground uppercase tracking-wider flex items-center gap-2">
              <Activity size={14} className="text-primary" />
              Atividades Recentes
            </h2>
            <span className="text-[10px] text-muted-foreground font-mono">Últimas {recentLogs.length}</span>
          </div>
          <div className="space-y-2">
            {recentLogs.map((log, i) => (
              <div
                key={log.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group/item"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono">
                    {log.data.split(" ")[1]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{log.entidade}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{log.usuario}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold ${acaoStyles[log.acao] || ""}`}>
                  {log.acao}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Standards distribution - takes 2 cols */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-card-foreground uppercase tracking-wider flex items-center gap-2">
              <BarChart3 size={14} className="text-primary" />
              Distribuição
            </h2>
          </div>

          {/* Visual bar chart */}
          <div className="flex items-end gap-3 h-32 mb-6">
            {statusData.map((d) => (
              <div key={d.status} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-card-foreground">{d.count}</span>
                <div className="w-full rounded-t-lg bg-muted relative overflow-hidden" style={{ height: `${Math.max(d.pct, 8)}%` }}>
                  <div className={`absolute inset-0 ${d.color} opacity-80 rounded-t-lg`} />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">{d.label}</span>
              </div>
            ))}
          </div>

          {/* Departments mini grid */}
          <div className="border-t border-border pt-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Top Departamentos</p>
            <div className="space-y-2">
              {departamentos.slice(0, 4).map((dep) => (
                <div key={dep.id} className="flex items-center justify-between">
                  <span className="text-xs text-card-foreground font-medium truncate">{dep.nome}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/60 rounded-full" style={{ width: `${(dep.colaboradores / 50) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono w-6 text-right">{dep.colaboradores}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
