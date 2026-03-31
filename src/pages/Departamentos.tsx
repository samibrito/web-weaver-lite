import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useData, Departamento } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const Departamentos = () => {
  const { departamentos, addDepartamento, updateDepartamento, deleteDepartamento } = useData();
  const { hasPermission, user } = useAuth();
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Departamentos</h1>
          <p className="text-muted-foreground mt-1">{departamentos.length} departamentos cadastrados</p>
        </div>
        {hasPermission("gestor") && (
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
            <Plus size={18} />
            Novo Departamento
          </button>
        )}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departamentos.map((dep) => (
          <div key={dep.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users size={20} className="text-primary" />
              </div>
              {hasPermission("gestor") && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(dep)} className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeleteConfirm(dep.id)} className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>
            <h3 className="text-base font-semibold text-card-foreground">{dep.nome}</h3>
            <p className="text-sm text-muted-foreground mt-1">{dep.responsavel}</p>
            <div className="mt-3 pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">{dep.colaboradores} colaboradores</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Departamento" : "Novo Departamento"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nome *</label>
              <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Nome do departamento" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Responsável *</label>
              <input value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Nome do responsável" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Colaboradores</label>
              <input type="number" value={form.colaboradores} onChange={(e) => setForm({ ...form, colaboradores: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDialogOpen(false)} className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">Salvar</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Tem certeza que deseja remover este departamento? Esta ação não pode ser desfeita.</p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Cancelar</button>
            <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-opacity">Excluir</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Departamentos;
