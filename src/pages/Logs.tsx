import { Search } from "lucide-react";
import { useState } from "react";
import { useData } from "@/contexts/DataContext";

const acaoConfig: Record<string, { bg: string; dot: string }> = {
  Criação: { bg: "bg-success/10 text-success", dot: "bg-success" },
  Edição: { bg: "bg-primary/10 text-primary", dot: "bg-primary" },
  Exclusão: { bg: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
  Versão: { bg: "bg-accent/10 text-accent", dot: "bg-accent" },
};

const Logs = () => {
  const { logs } = useData();
  const [busca, setBusca] = useState("");
  const [filtroAcao, setFiltroAcao] = useState("todas");

  const filtered = logs.filter((l) => {
    const matchBusca = l.usuario.toLowerCase().includes(busca.toLowerCase()) ||
      l.entidade.toLowerCase().includes(busca.toLowerCase()) ||
      l.detalhes.toLowerCase().includes(busca.toLowerCase());
    const matchAcao = filtroAcao === "todas" || l.acao === filtroAcao;
    return matchBusca && matchAcao;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-1">Rastreabilidade</p>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Auditoria</h1>
        <p className="text-muted-foreground mt-1 text-sm">Histórico completo de atividades</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-secondary/50 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="flex gap-1.5 p-1 bg-muted/50 rounded-xl w-fit">
          {["todas", "Criação", "Edição", "Exclusão", "Versão"].map((a) => (
            <button
              key={a}
              onClick={() => setFiltroAcao(a)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filtroAcao === a
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {a === "todas" ? "Todas" : a}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quando</th>
              <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quem</th>
              <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ação</th>
              <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Entidade</th>
              <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => {
              const ac = acaoConfig[log.acao];
              return (
                <tr key={log.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap font-mono">{log.data}</td>
                  <td className="px-5 py-3 text-sm font-medium text-card-foreground">{log.usuario}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${ac?.bg || "bg-muted text-muted-foreground"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${ac?.dot || "bg-muted-foreground"}`} />
                      {log.acao}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-card-foreground">{log.entidade}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{log.detalhes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">Nenhum log encontrado.</div>
        )}
      </div>
    </div>
  );
};

export default Logs;
