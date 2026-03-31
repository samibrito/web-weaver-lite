import { createContext, useContext, useState, ReactNode, useCallback } from "react";

// ---- Types ----
export interface Departamento {
  id: number;
  nome: string;
  responsavel: string;
  colaboradores: number;
}

export interface PadraoVersion {
  versao: number;
  dados: Record<string, any>;
  editadoPor: string;
  data: string;
}

export interface Padrao {
  id: number;
  codigo: string;
  titulo: string;
  departamento: string;
  status: "ativo" | "revisão" | "obsoleto";
  ultimaRevisao: string;
  dados: Record<string, any>;
  versaoAtual: number;
  historico: PadraoVersion[];
}

export interface LogEntry {
  id: number;
  data: string;
  usuario: string;
  acao: "Criação" | "Edição" | "Exclusão" | "Versão";
  entidade: string;
  detalhes: string;
}

export interface FormField {
  id: string;
  tipo: "texto" | "numero" | "data" | "select" | "arquivo" | "textarea" | "checkbox";
  label: string;
  obrigatorio: boolean;
  opcoes?: string[];
  condicao?: { campoId: string; valor: string };
  validacao?: { min?: number; max?: number; regex?: string };
  secao?: string;
}

export interface FormTemplate {
  id: number;
  nome: string;
  departamento: string;
  campos: FormField[];
  criadoPor: string;
  criadoEm: string;
}

// ---- Initial data ----
const initDeps: Departamento[] = [
  { id: 1, nome: "Qualidade", responsavel: "Samile Ferreira", colaboradores: 12 },
  { id: 2, nome: "Produção", responsavel: "Carlos Silva", colaboradores: 45 },
  { id: 3, nome: "RH", responsavel: "Ana Costa", colaboradores: 8 },
  { id: 4, nome: "TI", responsavel: "Pedro Santos", colaboradores: 15 },
  { id: 5, nome: "Financeiro", responsavel: "Maria Oliveira", colaboradores: 10 },
  { id: 6, nome: "Logística", responsavel: "João Lima", colaboradores: 20 },
];

const initPadroes: Padrao[] = [
  { id: 1, codigo: "PD-001", titulo: "Controle de Documentos", departamento: "Qualidade", status: "ativo", ultimaRevisao: "2025-12-01", dados: {}, versaoAtual: 1, historico: [] },
  { id: 2, codigo: "PD-002", titulo: "Auditoria Interna", departamento: "Qualidade", status: "ativo", ultimaRevisao: "2025-11-15", dados: {}, versaoAtual: 1, historico: [] },
  { id: 3, codigo: "PD-003", titulo: "Gestão de Riscos", departamento: "Produção", status: "revisão", ultimaRevisao: "2025-10-20", dados: {}, versaoAtual: 1, historico: [] },
  { id: 4, codigo: "PD-004", titulo: "Treinamento e Capacitação", departamento: "RH", status: "ativo", ultimaRevisao: "2025-09-10", dados: {}, versaoAtual: 1, historico: [] },
  { id: 5, codigo: "PD-005", titulo: "Backup de Dados", departamento: "TI", status: "ativo", ultimaRevisao: "2026-01-05", dados: {}, versaoAtual: 1, historico: [] },
  { id: 6, codigo: "PD-006", titulo: "Política de Segurança", departamento: "TI", status: "obsoleto", ultimaRevisao: "2024-06-30", dados: {}, versaoAtual: 1, historico: [] },
];

const initLogs: LogEntry[] = [
  { id: 1, data: "2026-03-31 14:32", usuario: "Samile Ferreira", acao: "Criação", entidade: "Padrão PD-007", detalhes: "Novo padrão de inspeção criado" },
  { id: 2, data: "2026-03-31 13:15", usuario: "Carlos Silva", acao: "Edição", entidade: "Departamento Produção", detalhes: "Atualização do responsável" },
  { id: 3, data: "2026-03-31 11:45", usuario: "Ana Costa", acao: "Exclusão", entidade: "Padrão PD-006", detalhes: "Padrão obsoleto removido" },
  { id: 4, data: "2026-03-30 16:20", usuario: "Pedro Santos", acao: "Edição", entidade: "Padrão PD-005", detalhes: "Revisão do procedimento de backup" },
  { id: 5, data: "2026-03-30 10:00", usuario: "Maria Oliveira", acao: "Criação", entidade: "Departamento Compliance", detalhes: "Novo departamento adicionado" },
  { id: 6, data: "2026-03-29 09:30", usuario: "João Lima", acao: "Edição", entidade: "Padrão PD-003", detalhes: "Status alterado para revisão" },
];

const initTemplates: FormTemplate[] = [
  {
    id: 1,
    nome: "Registro de Não Conformidade",
    departamento: "Qualidade",
    criadoPor: "Samile Ferreira",
    criadoEm: "2026-01-15",
    campos: [
      { id: "f1", tipo: "texto", label: "Descrição da NC", obrigatorio: true },
      { id: "f2", tipo: "select", label: "Severidade", obrigatorio: true, opcoes: ["Baixa", "Média", "Alta", "Crítica"] },
      { id: "f3", tipo: "data", label: "Data da Ocorrência", obrigatorio: true },
      { id: "f4", tipo: "textarea", label: "Ação Corretiva", obrigatorio: false, condicao: { campoId: "f2", valor: "Alta" } },
      { id: "f5", tipo: "arquivo", label: "Evidência Fotográfica", obrigatorio: false },
    ],
  },
];

// ---- Context ----
interface DataContextType {
  departamentos: Departamento[];
  addDepartamento: (d: Omit<Departamento, "id">) => void;
  updateDepartamento: (id: number, d: Partial<Departamento>) => void;
  deleteDepartamento: (id: number) => void;

  padroes: Padrao[];
  addPadrao: (p: Omit<Padrao, "id" | "versaoAtual" | "historico">) => void;
  updatePadrao: (id: number, p: Partial<Padrao>, editor: string) => void;
  deletePadrao: (id: number) => void;

  logs: LogEntry[];
  addLog: (l: Omit<LogEntry, "id">) => void;

  templates: FormTemplate[];
  addTemplate: (t: Omit<FormTemplate, "id">) => void;
  updateTemplate: (id: number, t: Partial<FormTemplate>) => void;
  deleteTemplate: (id: number) => void;
}

const DataContext = createContext<DataContextType>({} as DataContextType);
export const useData = () => useContext(DataContext);

let nextId = 100;

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>(initDeps);
  const [padroes, setPadroes] = useState<Padrao[]>(initPadroes);
  const [logs, setLogs] = useState<LogEntry[]>(initLogs);
  const [templates, setTemplates] = useState<FormTemplate[]>(initTemplates);

  const addLog = useCallback((l: Omit<LogEntry, "id">) => {
    setLogs((prev) => [{ ...l, id: ++nextId }, ...prev]);
  }, []);

  // Departamentos
  const addDepartamento = useCallback((d: Omit<Departamento, "id">) => {
    const newD = { ...d, id: ++nextId };
    setDepartamentos((prev) => [...prev, newD]);
    addLog({ data: new Date().toISOString().slice(0, 16).replace("T", " "), usuario: "Sistema", acao: "Criação", entidade: `Departamento ${d.nome}`, detalhes: "Departamento criado" });
  }, [addLog]);

  const updateDepartamento = useCallback((id: number, d: Partial<Departamento>) => {
    setDepartamentos((prev) => prev.map((dep) => (dep.id === id ? { ...dep, ...d } : dep)));
    addLog({ data: new Date().toISOString().slice(0, 16).replace("T", " "), usuario: "Sistema", acao: "Edição", entidade: `Departamento #${id}`, detalhes: "Departamento atualizado" });
  }, [addLog]);

  const deleteDepartamento = useCallback((id: number) => {
    const dep = departamentos.find((d) => d.id === id);
    setDepartamentos((prev) => prev.filter((d) => d.id !== id));
    addLog({ data: new Date().toISOString().slice(0, 16).replace("T", " "), usuario: "Sistema", acao: "Exclusão", entidade: `Departamento ${dep?.nome}`, detalhes: "Departamento removido" });
  }, [departamentos, addLog]);

  // Padrões with versioning
  const addPadrao = useCallback((p: Omit<Padrao, "id" | "versaoAtual" | "historico">) => {
    const newP: Padrao = { ...p, id: ++nextId, versaoAtual: 1, historico: [] };
    setPadroes((prev) => [...prev, newP]);
    addLog({ data: new Date().toISOString().slice(0, 16).replace("T", " "), usuario: "Sistema", acao: "Criação", entidade: `Padrão ${p.codigo}`, detalhes: `${p.titulo} criado` });
  }, [addLog]);

  const updatePadrao = useCallback((id: number, updates: Partial<Padrao>, editor: string) => {
    setPadroes((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const version: PadraoVersion = {
        versao: p.versaoAtual,
        dados: { titulo: p.titulo, departamento: p.departamento, status: p.status, dados: p.dados },
        editadoPor: editor,
        data: new Date().toISOString().slice(0, 16).replace("T", " "),
      };
      return {
        ...p,
        ...updates,
        versaoAtual: p.versaoAtual + 1,
        historico: [...p.historico, version],
        ultimaRevisao: new Date().toISOString().slice(0, 10),
      };
    }));
    addLog({ data: new Date().toISOString().slice(0, 16).replace("T", " "), usuario: editor, acao: "Versão", entidade: `Padrão #${id}`, detalhes: "Nova versão criada" });
  }, [addLog]);

  const deletePadrao = useCallback((id: number) => {
    const p = padroes.find((x) => x.id === id);
    setPadroes((prev) => prev.filter((x) => x.id !== id));
    addLog({ data: new Date().toISOString().slice(0, 16).replace("T", " "), usuario: "Sistema", acao: "Exclusão", entidade: `Padrão ${p?.codigo}`, detalhes: `${p?.titulo} removido` });
  }, [padroes, addLog]);

  // Templates
  const addTemplate = useCallback((t: Omit<FormTemplate, "id">) => {
    setTemplates((prev) => [...prev, { ...t, id: ++nextId }]);
  }, []);

  const updateTemplate = useCallback((id: number, t: Partial<FormTemplate>) => {
    setTemplates((prev) => prev.map((x) => (x.id === id ? { ...x, ...t } : x)));
  }, []);

  const deleteTemplate = useCallback((id: number) => {
    setTemplates((prev) => prev.filter((x) => x.id !== id));
  }, []);

  return (
    <DataContext.Provider value={{
      departamentos, addDepartamento, updateDepartamento, deleteDepartamento,
      padroes, addPadrao, updatePadrao, deletePadrao,
      logs, addLog,
      templates, addTemplate, updateTemplate, deleteTemplate,
    }}>
      {children}
    </DataContext.Provider>
  );
};
