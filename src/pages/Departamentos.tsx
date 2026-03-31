import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface Departamento {
  id: number;
  nome: string;
  responsavel: string;
  colaboradores: number;
}

const initialData: Departamento[] = [
  { id: 1, nome: "Qualidade", responsavel: "Samile Ferreira", colaboradores: 12 },
  { id: 2, nome: "Produção", responsavel: "Carlos Silva", colaboradores: 45 },
  { id: 3, nome: "RH", responsavel: "Ana Costa", colaboradores: 8 },
  { id: 4, nome: "TI", responsavel: "Pedro Santos", colaboradores: 15 },
  { id: 5, nome: "Financeiro", responsavel: "Maria Oliveira", colaboradores: 10 },
  { id: 6, nome: "Logística", responsavel: "João Lima", colaboradores: 20 },
];

const Departamentos = () => {
  const [departamentos] = useState<Departamento[]>(initialData);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Departamentos</h1>
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus size={18} />
          Novo Departamento
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Nome</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Responsável</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Colaboradores</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {departamentos.map((dep) => (
              <tr key={dep.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-card-foreground">{dep.nome}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{dep.responsavel}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{dep.colaboradores}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
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

export default Departamentos;
