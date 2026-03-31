import { Plus, Pencil, Trash2, GripVertical, X, Eye, ChevronDown, ChevronUp, Copy, Settings2, Blocks } from "lucide-react";
import { useState } from "react";
import { useData, FormField, FormTemplate } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const fieldTypes = [
  { value: "texto", label: "Texto", icon: "Aa" },
  { value: "numero", label: "Número", icon: "#" },
  { value: "data", label: "Data", icon: "📅" },
  { value: "select", label: "Seleção", icon: "▾" },
  { value: "arquivo", label: "Arquivo", icon: "📎" },
  { value: "textarea", label: "Texto Longo", icon: "¶" },
  { value: "checkbox", label: "Checkbox", icon: "☑" },
];

const generateId = () => `f${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const Formularios = () => {
  const { templates, addTemplate, updateTemplate, deleteTemplate, departamentos } = useData();
  const { hasPermission, user } = useAuth();
  const [builderOpen, setBuilderOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState<FormTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<FormTemplate | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const [templateName, setTemplateName] = useState("");
  const [templateDept, setTemplateDept] = useState("");
  const [campos, setCampos] = useState<FormField[]>([]);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const openNew = () => {
    setEditingTemplate(null);
    setTemplateName("");
    setTemplateDept(departamentos[0]?.nome || "");
    setCampos([]);
    setEditingField(null);
    setBuilderOpen(true);
  };

  const openEdit = (t: FormTemplate) => {
    setEditingTemplate(t);
    setTemplateName(t.nome);
    setTemplateDept(t.departamento);
    setCampos([...t.campos]);
    setEditingField(null);
    setBuilderOpen(true);
  };

  const addField = (tipo: FormField["tipo"]) => {
    const newField: FormField = {
      id: generateId(),
      tipo,
      label: `Novo campo ${tipo}`,
      obrigatorio: false,
      opcoes: tipo === "select" ? ["Opção 1", "Opção 2"] : undefined,
    };
    setCampos((prev) => [...prev, newField]);
    setEditingField(newField);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setCampos((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    if (editingField?.id === id) setEditingField((prev) => prev ? { ...prev, ...updates } : null);
  };

  const removeField = (id: string) => {
    setCampos((prev) => prev.filter((f) => f.id !== id));
    if (editingField?.id === id) setEditingField(null);
  };

  const duplicateField = (field: FormField) => {
    const dup = { ...field, id: generateId(), label: `${field.label} (cópia)` };
    setCampos((prev) => [...prev, dup]);
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    setCampos((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
    setDragIndex(null);
  };

  const moveField = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= campos.length) return;
    setCampos((prev) => {
      const updated = [...prev];
      [updated[index], updated[target]] = [updated[target], updated[index]];
      return updated;
    });
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) { toast.error("Informe o nome."); return; }
    if (campos.length === 0) { toast.error("Adicione pelo menos um campo."); return; }
    if (editingTemplate) {
      updateTemplate(editingTemplate.id, { nome: templateName, departamento: templateDept, campos });
      toast.success("Formulário atualizado!");
    } else {
      addTemplate({ nome: templateName, departamento: templateDept, campos, criadoPor: user?.nome || "", criadoEm: new Date().toISOString().slice(0, 10) });
      toast.success("Formulário criado!");
    }
    setBuilderOpen(false);
  };

  const handleDeleteTemplate = (id: number) => {
    deleteTemplate(id);
    setDeleteConfirm(null);
    toast.success("Formulário removido!");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-1">Builder</p>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Formulários</h1>
          <p className="text-muted-foreground mt-1 text-sm">Construtor sem código</p>
        </div>
        {hasPermission("gestor") && (
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-200">
            <Plus size={16} />
            Novo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {templates.map((t, i) => (
          <div key={t.id} className="glass rounded-2xl p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                <Blocks size={18} className="text-accent" />
              </div>
              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setPreviewOpen(t)} className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Visualizar">
                  <Eye size={13} />
                </button>
                {hasPermission("gestor") && (
                  <>
                    <button onClick={() => openEdit(t)} className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => setDeleteConfirm(t.id)} className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>
            <h3 className="text-base font-bold text-card-foreground tracking-tight">{t.nome}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{t.departamento}</p>
            <div className="mt-4 pt-3 border-t border-border/50 flex justify-between text-[11px] text-muted-foreground">
              <span className="font-mono">{t.campos.length} campos</span>
              <span>{t.criadoPor}</span>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground text-sm">Nenhum formulário criado.</div>
        )}
      </div>

      {/* Builder Dialog */}
      <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight">{editingTemplate ? "Editar Formulário" : "Construtor de Formulários"}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Nome *</label>
                <input value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-input bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Ex: Registro de NC" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Departamento</label>
                <select value={templateDept} onChange={(e) => setTemplateDept(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-input bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                  {departamentos.map((d) => <option key={d.id} value={d.nome}>{d.nome}</option>)}
                </select>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Adicionar Campo</p>
              <div className="flex flex-wrap gap-1.5">
                {fieldTypes.map((ft) => (
                  <button key={ft.value} onClick={() => addField(ft.value as FormField["tipo"])} className="px-3 py-1.5 rounded-lg bg-muted/50 text-muted-foreground text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-1.5">
                    <span className="text-[10px]">{ft.icon}</span>
                    {ft.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              {campos.map((field, idx) => (
                <div
                  key={field.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-move ${
                    editingField?.id === field.id ? "border-primary bg-primary/5" : "border-border/50 glass hover:bg-muted/30"
                  }`}
                  onClick={() => setEditingField(field)}
                >
                  <GripVertical size={14} className="text-muted-foreground/50 shrink-0" />
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="text-sm font-medium text-card-foreground truncate">{field.label}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-muted text-muted-foreground uppercase">{field.tipo}</span>
                    {field.obrigatorio && <span className="text-destructive text-xs font-bold">*</span>}
                    {field.condicao && <span className="px-1.5 py-0.5 rounded text-[9px] bg-warning/10 text-warning font-bold">IF</span>}
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); moveField(idx, -1); }} className="p-1 rounded hover:bg-muted"><ChevronUp size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); moveField(idx, 1); }} className="p-1 rounded hover:bg-muted"><ChevronDown size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); duplicateField(field); }} className="p-1 rounded hover:bg-muted text-muted-foreground"><Copy size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); removeField(field.id); }} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><X size={12} /></button>
                  </div>
                </div>
              ))}
              {campos.length === 0 && (
                <div className="py-10 text-center text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                  Clique acima para adicionar campos
                </div>
              )}
            </div>

            {editingField && (
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Configurar Campo</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Label</label>
                    <input value={editingField.label} onChange={(e) => updateField(editingField.id, { label: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Seção</label>
                    <input value={editingField.secao || ""} onChange={(e) => updateField(editingField.id, { secao: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Ex: Informações Gerais" />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input type="checkbox" checked={editingField.obrigatorio} onChange={(e) => updateField(editingField.id, { obrigatorio: e.target.checked })} className="rounded" />
                  Obrigatório
                </label>
                {editingField.tipo === "select" && (
                  <div>
                    <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Opções (uma por linha)</label>
                    <textarea
                      value={(editingField.opcoes || []).join("\n")}
                      onChange={(e) => updateField(editingField.id, { opcoes: e.target.value.split("\n").filter(Boolean) })}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      rows={3}
                    />
                  </div>
                )}
                {editingField.tipo === "numero" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Mínimo</label>
                      <input type="number" value={editingField.validacao?.min ?? ""} onChange={(e) => updateField(editingField.id, { validacao: { ...editingField.validacao, min: Number(e.target.value) } })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Máximo</label>
                      <input type="number" value={editingField.validacao?.max ?? ""} onChange={(e) => updateField(editingField.id, { validacao: { ...editingField.validacao, max: Number(e.target.value) } })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Condição de exibição</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={editingField.condicao?.campoId || ""}
                      onChange={(e) => updateField(editingField.id, { condicao: e.target.value ? { campoId: e.target.value, valor: editingField.condicao?.valor || "" } : undefined })}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Sem condição</option>
                      {campos.filter((c) => c.id !== editingField.id).map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                    {editingField.condicao?.campoId && (
                      <input
                        value={editingField.condicao?.valor || ""}
                        onChange={(e) => updateField(editingField.id, { condicao: { campoId: editingField.condicao!.campoId, valor: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Valor esperado"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2 sticky bottom-0 bg-background pb-2">
              <button onClick={() => setBuilderOpen(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleSaveTemplate} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all">Salvar</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen !== null} onOpenChange={() => setPreviewOpen(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight">{previewOpen?.nome}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {previewOpen?.campos.map((f) => (
              <div key={f.id}>
                {f.condicao && (
                  <p className="text-[9px] text-warning mb-1 font-bold uppercase tracking-wider">
                    Condicional: quando "{f.condicao.campoId}" = "{f.condicao.valor}"
                  </p>
                )}
                <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">
                  {f.label} {f.obrigatorio && <span className="text-destructive">*</span>}
                </label>
                {f.tipo === "textarea" ? (
                  <textarea className="w-full px-3 py-2 rounded-lg border border-input bg-secondary/50 text-foreground text-sm" rows={3} disabled />
                ) : f.tipo === "select" ? (
                  <select className="w-full px-3 py-2 rounded-lg border border-input bg-secondary/50 text-foreground text-sm" disabled>
                    {f.opcoes?.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : f.tipo === "checkbox" ? (
                  <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" disabled /> {f.label}</label>
                ) : (
                  <input type={f.tipo === "numero" ? "number" : f.tipo === "data" ? "date" : f.tipo === "arquivo" ? "file" : "text"} className="w-full px-3 py-2 rounded-lg border border-input bg-secondary/50 text-foreground text-sm" disabled />
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight">Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Remover este formulário?</p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancelar</button>
            <button onClick={() => deleteConfirm && handleDeleteTemplate(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-opacity">Excluir</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Formularios;
