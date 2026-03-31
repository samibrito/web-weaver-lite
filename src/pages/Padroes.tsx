import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { useState } from "react";

interface Padrao {
  id: number;
  codigo: string;
  titulo: string;
  departamento: string;
  status: "ativo" | "revisão" | "obsoleto";
  ultimaRevisao: string;
}

const initialData: Padrao[] = [
  { id: 1, codigo: "PD-001", titulo: "Controle de Documentos", departamento: "Qualidade", status: "ativo", ultimaRevisao: "2025-12-01" },
  { id: 2, codigo: "PD-002", titulo: "Auditoria Interna", departamento: "Qualidade", status: "ativo", ultimaRevisao: "2025-11-15" },
  { id: 3, codigo: "PD-003", titulo: "Gestão de Riscos", departamento: "Produção", status: "revisão", ultimaRevisao: "2025-10-20" },
  { id: 4, codigo: "PD-004", titulo: "Treinamento e Capacitação", departamento: "RH", status: "ativo", ultimaRevisao: "2025-09-10" },
  { id: 5, codigo: "PD-005", titulo: "Backup de Dados", departamento: "TI", status: "ativo", ultimaRevisao: "2026-01-05" },
  { id: 6, codigo: "PD-006", titulo: "Política de Segurança", departamento: "TI", status: "obsoleto", ultimaRevisao: "2024-06-30" },
];

const statusStyles: Record<string, string> = {
  ativo: "bg-emerald-100 text-emerald-700",
  revisão: "bg-amber-100 text-amber-700",
  obsoleto: "bg-red-100 text-red-700",
};

const Padroes = () => {
  const [padroes] = useState<Padrao[]>(initialData);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Padrões</h1>
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus size={18} />
          Novo Padrão
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Código</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Título</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Departamento</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Última Revisão</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {padroes.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono font-medium text-card-foreground">{p.codigo}</td>
                <td className="px-6 py-4 text-sm text-card-foreground">{p.titulo}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{p.departamento}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[p.status]}`}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{p.ultimaRevisao}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <FileText size={16} />
                    </button>
                    <button className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <Pencil size={16} />
                    </button>
                    <button className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Padroes;
