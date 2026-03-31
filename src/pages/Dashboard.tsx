import { Building2, Layers, Activity, TrendingUp, Clock, FileCheck } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { departamentos, padroes, logs } = useData();
  const { user } = useAuth();

  const padroesAtivos = padroes.filter((p) => p.status === "ativo").length;
  const padroesRevisao = padroes.filter((p) => p.status === "revisão").length;
  const recentLogs = logs.slice(0, 5);

  const stats = [
    { icon: Building2, label: "Departamentos", value: departamentos.length, color: "from-blue-500 to-blue-600", bg: "bg-blue-500/10" },
    { icon: Layers, label: "Padrões Ativos", value: padroesAtivos, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-500/10" },
    { icon: Clock, label: "Em Revisão", value: padroesRevisao, color: "from-amber-500 to-amber-600", bg: "bg-amber-500/10" },
    { icon: Activity, label: "Atividades", value: logs.length, color: "from-purple-500 to-purple-600", bg: "bg-purple-500/10" },
  ];

  const acaoStyles: Record<string, string> = {
    Criação: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Edição: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    Exclusão: "bg-red-500/10 text-red-600 dark:text-red-400",
    Versão: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Olá, {user?.nome.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">Aqui está o resumo do sistema Norte.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon size={22} className={`bg-gradient-to-br ${s.color} bg-clip-text`} style={{ color: undefined }} />
              </div>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-card-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Activity size={18} />
            Atividades Recentes
          </h2>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <span className={`shrink-0 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mt-0.5 ${acaoStyles[log.acao] || ""}`}>
                  {log.acao}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-card-foreground truncate">{log.entidade}</p>
                  <p className="text-xs text-muted-foreground">{log.usuario} · {log.data}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Standards overview */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <FileCheck size={18} />
            Padrões por Status
          </h2>
          <div className="space-y-4">
            {(["ativo", "revisão", "obsoleto"] as const).map((status) => {
              const count = padroes.filter((p) => p.status === status).length;
              const pct = padroes.length > 0 ? (count / padroes.length) * 100 : 0;
              const colors = { ativo: "bg-emerald-500", revisão: "bg-amber-500", obsoleto: "bg-red-500" };
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-card-foreground font-medium capitalize">{status}</span>
                    <span className="text-muted-foreground">{count} padrões</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${colors[status]} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {departamentos.slice(0, 3).map((dep) => (
              <div key={dep.id} className="text-center p-3 rounded-xl bg-muted/30">
                <p className="text-lg font-bold text-card-foreground">{dep.colaboradores}</p>
                <p className="text-xs text-muted-foreground truncate">{dep.nome}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
