import { Search } from "lucide-react";
import { useState } from "react";

interface LogEntry {
  id: number;
  data: string;
  usuario: string;
  acao: string;
  entidade: string;
  detalhes: string;
}

const initialLogs: LogEntry[] = [
  { id: 1, data: "2026-03-31 14:32", usuario: "Samile Ferreira", acao: "Criação", entidade: "Padrão PD-007", detalhes: "Novo padrão de inspeção criado" },
  { id: 2, data: "2026-03-31 13:15", usuario: "Carlos Silva", acao: "Edição", entidade: "Departamento Produção", detalhes: "Atualização do responsável" },
  { id: 3, data: "2026-03-31 11:45", usuario: "Ana Costa", acao: "Exclusão", entidade: "Padrão PD-006", detalhes: "Padrão obsoleto removido" },
  { id: 4, data: "2026-03-30 16:20", usuario: "Pedro Santos", acao: "Edição", entidade: "Padrão PD-005", detalhes: "Revisão do procedimento de backup" },
  { id: 5, data: "2026-03-30 10:00", usuario: "Maria Oliveira", acao: "Criação", entidade: "Departamento Compliance", detalhes: "Novo departamento adicionado" },
  { id: 6, data: "2026-03-29 09:30", usuario: "João Lima", acao: "Edição", entidade: "Padrão PD-003", detalhes: "Status alterado para revisão" },
];

const acaoStyles: Record<string, string> = {
  Criação: "bg-emerald-100 text-emerald-700",
  Edição: "bg-blue-100 text-blue-700",
  Exclusão: "bg-red-100 text-red-700",
};

const Logs = () => {
  const [logs] = useState<LogEntry[]>(initialLogs);
  const [busca, setBusca] = useState("");

  const filtered = logs.filter(
    (l) =>
      l.usuario.toLowerCase().includes(busca.toLowerCase()) ||
      l.entidade.toLowerCase().includes(busca.toLowerCase()) ||
      l.detalhes.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Logs</h1>

      <div className="relative mb-6 max-w-sm">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar logs..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-card text-card-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Data</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Usuário</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Ação</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Entidade</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">{log.data}</td>
                <td className="px-6 py-4 text-sm font-medium text-card-foreground">{log.usuario}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${acaoStyles[log.acao] || "bg-muted text-muted-foreground"}`}>
                    {log.acao}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">{log.entidade}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{log.detalhes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs;
