import { Search, Filter } from "lucide-react";
import { useState } from "react";
import { useData } from "@/contexts/DataContext";

const acaoStyles: Record<string, string> = {
  Criação: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Edição: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Exclusão: "bg-red-500/10 text-red-600 dark:text-red-400",
  Versão: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Auditoria</h1>
        <p className="text-muted-foreground mt-1">Histórico completo de atividades do sistema</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por usuário, entidade ou detalhes..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-card text-card-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2">
          {["todas", "Criação", "Edição", "Exclusão", "Versão"].map((a) => (
            <button
              key={a}
              onClick={() => setFiltroAcao(a)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                filtroAcao === a ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {a === "todas" ? "Todas" : a}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Data</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Usuário</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ação</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Entidade</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap font-mono">{log.data}</td>
                <td className="px-6 py-4 text-sm font-medium text-card-foreground">{log.usuario}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${acaoStyles[log.acao] || "bg-muted text-muted-foreground"}`}>
                    {log.acao}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">{log.entidade}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{log.detalhes}</td>
              </tr>
            ))}
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
