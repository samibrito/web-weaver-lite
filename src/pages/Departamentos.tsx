import { Plus, Pencil, Trash2, Users, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useData, Departamento } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const Departamentos = () => {
  const { departamentos, addDepartamento, updateDepartamento, deleteDepartamento } = useData();
  const { hasPermission } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Departamento | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [form, setForm] = useState({ nome: "", responsavel: "", colaboradores: 0 });

  const openNew = () => {
    setEditing(null);
    setForm({ nome: "", responsavel: "", colaboradores: 0 });
    setDialogOpen(true);
  };

  const openEdit = (dep: Departamento) => {
    setEditing(dep);
    setForm({ nome: dep.nome, responsavel: dep.responsavel, colaboradores: dep.colaboradores });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nome.trim() || !form.responsavel.trim()) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (editing) {
      updateDepartamento(editing.id, form);
      toast.success("Departamento atualizado!");
    } else {
      addDepartamento(form);
      toast.success("Departamento criado!");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    deleteDepartamento(id);
    setDeleteConfirm(null);
    toast.success("Departamento removido!");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-1">Organização</p>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Departamentos</h1>
          <p className="text-muted-foreground mt-1 text-sm">{departamentos.length} áreas cadastradas</p>
        </div>
        {hasPermission("gestor") && (
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-200">
            <Plus size={16} />
            Novo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {departamentos.map((dep, i) => (
          <div
            key={dep.id}
            className="glass rounded-2xl p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Users size={18} className="text-primary" />
              </div>
              {hasPermission("gestor") && (
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(dep)} className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => setDeleteConfirm(dep.id)} className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
            <h3 className="text-base font-bold text-card-foreground tracking-tight">{dep.nome}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{dep.responsavel}</p>
            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1.5">
                  {[...Array(Math.min(dep.colaboradores, 3))].map((_, j) => (
                    <div key={j} className="w-5 h-5 rounded-full bg-muted border-2 border-card" />
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">{dep.colaboradores} pessoas</span>
              </div>
              <ArrowUpRight size={14} className="text-muted-foreground/50 group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md glass-strong">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight">{editing ? "Editar Departamento" : "Novo Departamento"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Nome *</label>
              <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-input bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Nome do departamento" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Responsável *</label>
              <input value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-input bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Nome do responsável" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Colaboradores</label>
              <input type="number" value={form.colaboradores} onChange={(e) => setForm({ ...form, colaboradores: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-input bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDialogOpen(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all">Salvar</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight">Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Tem certeza que deseja remover este departamento?</p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancelar</button>
            <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-opacity">Excluir</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Departamentos;
