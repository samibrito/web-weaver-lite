import { Plus, Pencil, Trash2, History, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useData, Padrao } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const statusConfig: Record<string, { bg: string; dot: string }> = {
  ativo: { bg: "bg-success/10 text-success", dot: "bg-success" },
  revisão: { bg: "bg-warning/10 text-warning", dot: "bg-warning" },
  obsoleto: { bg: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
};

const Padroes = () => {
  const { padroes, addPadrao, updatePadrao, deletePadrao, departamentos } = useData();
  const { hasPermission, user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState<Padrao | null>(null);
  const [editing, setEditing] = useState<Padrao | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [form, setForm] = useState({ codigo: "", titulo: "", departamento: "", status: "ativo" as Padrao["status"], dados: {} as Record<string, any> });
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");

  const filtered = filtroStatus === "todos" ? padroes : padroes.filter((p) => p.status === filtroStatus);

  const openNew = () => {
    setEditing(null);
    setForm({ codigo: `PD-${String(padroes.length + 1).padStart(3, "0")}`, titulo: "", departamento: departamentos[0]?.nome || "", status: "ativo", dados: {} });
    setDialogOpen(true);
  };

  const openEdit = (p: Padrao) => {
    setEditing(p);
    setForm({ codigo: p.codigo, titulo: p.titulo, departamento: p.departamento, status: p.status, dados: p.dados });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.titulo.trim() || !form.codigo.trim()) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (editing) {
      updatePadrao(editing.id, { titulo: form.titulo, departamento: form.departamento, status: form.status, dados: form.dados }, user?.nome || "Sistema");
      toast.success("Padrão atualizado! Nova versão criada.");
    } else {
      addPadrao({ codigo: form.codigo, titulo: form.titulo, departamento: form.departamento, status: form.status, dados: form.dados, ultimaRevisao: new Date().toISOString().slice(0, 10) });
      toast.success("Padrão criado!");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    deletePadrao(id);
    setDeleteConfirm(null);
    toast.success("Padrão removido!");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-1">Repositório</p>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Padrões</h1>
          <p className="text-muted-foreground mt-1 text-sm">{padroes.length} documentos registrados</p>
        </div>
        {hasPermission("gestor") && (
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-200">
            <Plus size={16} />
            Novo
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 p-1 bg-muted/50 rounded-xl w-fit">
        {["todos", "ativo", "revisão", "obsoleto"].map((s) => (
          <button
            key={s}
            onClick={() => setFiltroStatus(s)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              filtroStatus === s
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "todos" ? "Todos" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Código</th>
              <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Título</th>
              <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Depto</th>
              <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ver.</th>
              <th className="text-right px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const sc = statusConfig[p.status];
              return (
                <tr key={p.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-mono font-bold text-foreground">{p.codigo}</td>
                  <td className="px-5 py-3.5 text-sm text-card-foreground font-medium">{p.titulo}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.departamento}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${sc.bg}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground font-mono">v{p.versaoAtual}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      {p.historico.length > 0 && (
                        <button onClick={() => setHistoryOpen(p)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Histórico">
                          <History size={13} />
                        </button>
                      )}
                      {hasPermission("gestor") && (
                        <>
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">Nenhum padrão encontrado.</div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight">{editing ? `Editar ${editing.codigo}` : "Novo Padrão"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <p className="text-xs text-warning bg-warning/10 px-3 py-2 rounded-lg font-medium">
              Ao salvar, a versão v{editing.versaoAtual} será arquivada e uma nova versão será criada.
            </p>
          )}
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Código *</label>
                <input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-input bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" disabled={!!editing} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Padrao["status"] })} className="w-full px-4 py-3 rounded-xl border border-input bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                  <option value="ativo">Ativo</option>
                  <option value="revisão">Revisão</option>
                  <option value="obsoleto">Obsoleto</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Título *</label>
              <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-input bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Título do padrão" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Departamento</label>
              <select value={form.departamento} onChange={(e) => setForm({ ...form, departamento: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-input bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                {departamentos.map((d) => <option key={d.id} value={d.nome}>{d.nome}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDialogOpen(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all">Salvar</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyOpen !== null} onOpenChange={() => setHistoryOpen(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight">Histórico — {historyOpen?.codigo}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {historyOpen?.historico.map((v, i) => (
              <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-card-foreground font-mono">v{v.versao}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{v.data}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{v.editadoPor} · {v.dados.titulo} · {v.dados.status}</p>
              </div>
            ))}
            {historyOpen?.historico.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum histórico.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight">Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Tem certeza que deseja remover este padrão?</p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancelar</button>
            <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-opacity">Excluir</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Padroes;
