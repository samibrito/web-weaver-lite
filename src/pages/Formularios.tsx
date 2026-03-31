import { Plus, Pencil, Trash2, GripVertical, X, Eye, ChevronDown, ChevronUp, Copy, Settings2 } from "lucide-react";
import { useState, useCallback } from "react";
import { useData, FormField, FormTemplate } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const fieldTypes = [
  { value: "texto", label: "Texto" },
  { value: "numero", label: "Número" },
  { value: "data", label: "Data" },
  { value: "select", label: "Seleção" },
  { value: "arquivo", label: "Arquivo" },
  { value: "textarea", label: "Texto Longo" },
  { value: "checkbox", label: "Checkbox" },
];

const generateId = () => `f${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const Formularios = () => {
  const { templates, addTemplate, updateTemplate, deleteTemplate, departamentos } = useData();
  const { hasPermission, user } = useAuth();
  const [builderOpen, setBuilderOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState<FormTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<FormTemplate | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Builder state
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
    setBuilderOpen(true);
  };

  const openEdit = (t: FormTemplate) => {
    setEditingTemplate(t);
    setTemplateName(t.nome);
    setTemplateDept(t.departamento);
    setCampos([...t.campos]);
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
    if (!templateName.trim()) {
      toast.error("Informe o nome do formulário.");
      return;
    }
    if (campos.length === 0) {
      toast.error("Adicione pelo menos um campo.");
      return;
    }
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Formulários</h1>
          <p className="text-muted-foreground mt-1">Construtor de formulários sem código</p>
        </div>
        {hasPermission("gestor") && (
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
            <Plus size={18} />
            Novo Formulário
          </button>
        )}
      </div>

      {/* Templates list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div key={t.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Settings2 size={20} className="text-primary" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setPreviewOpen(t)} className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Visualizar">
                  <Eye size={15} />
                </button>
                {hasPermission("gestor") && (
                  <>
                    <button onClick={() => openEdit(t)} className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeleteConfirm(t.id)} className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>
            <h3 className="text-base font-semibold text-card-foreground">{t.nome}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t.departamento}</p>
            <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
              <span>{t.campos.length} campos</span>
              <span>{t.criadoPor}</span>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">Nenhum formulário criado ainda.</div>
        )}
      </div>

      {/* Form Builder Dialog */}
      <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Editar Formulário" : "Construtor de Formulários"}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Template meta */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nome do Formulário *</label>
                <input value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Ex: Registro de NC" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Departamento</label>
                <select value={templateDept} onChange={(e) => setTemplateDept(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {departamentos.map((d) => <option key={d.id} value={d.nome}>{d.nome}</option>)}
                </select>
              </div>
            </div>

            {/* Add field buttons */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Adicionar Campo</p>
              <div className="flex flex-wrap gap-2">
                {fieldTypes.map((ft) => (
                  <button key={ft.value} onClick={() => addField(ft.value as FormField["tipo"])} className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                    + {ft.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields list */}
            <div className="space-y-2">
              {campos.map((field, idx) => (
                <div
                  key={field.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-move ${
                    editingField?.id === field.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/30"
                  }`}
                  onClick={() => setEditingField(field)}
                >
                  <GripVertical size={16} className="text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-card-foreground truncate">{field.label}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">{field.tipo}</span>
                      {field.obrigatorio && <span className="text-destructive text-xs">*</span>}
                      {field.condicao && <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-600">Condicional</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); moveField(idx, -1); }} className="p-1 rounded hover:bg-muted"><ChevronUp size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); moveField(idx, 1); }} className="p-1 rounded hover:bg-muted"><ChevronDown size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); duplicateField(field); }} className="p-1 rounded hover:bg-muted text-muted-foreground"><Copy size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); removeField(field.id); }} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><X size={14} /></button>
                  </div>
                </div>
              ))}
              {campos.length === 0 && (
                <div className="py-8 text-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-xl">
                  Clique nos botões acima para adicionar campos
                </div>
              )}
            </div>

            {/* Field editor */}
            {editingField && (
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Configurar Campo</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Label</label>
                    <input value={editingField.label} onChange={(e) => updateField(editingField.id, { label: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Seção</label>
                    <input value={editingField.secao || ""} onChange={(e) => updateField(editingField.id, { secao: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Ex: Informações Gerais" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input type="checkbox" checked={editingField.obrigatorio} onChange={(e) => updateField(editingField.id, { obrigatorio: e.target.checked })} className="rounded" />
                    Obrigatório
                  </label>
                </div>
                {editingField.tipo === "select" && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Opções (uma por linha)</label>
                    <textarea
                      value={(editingField.opcoes || []).join("\n")}
                      onChange={(e) => updateField(editingField.id, { opcoes: e.target.value.split("\n").filter(Boolean) })}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={3}
                    />
                  </div>
                )}
                {(editingField.tipo === "numero") && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Mínimo</label>
                      <input type="number" value={editingField.validacao?.min ?? ""} onChange={(e) => updateField(editingField.id, { validacao: { ...editingField.validacao, min: Number(e.target.value) } })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Máximo</label>
                      <input type="number" value={editingField.validacao?.max ?? ""} onChange={(e) => updateField(editingField.id, { validacao: { ...editingField.validacao, max: Number(e.target.value) } })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                )}
                {/* Conditional logic */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Exibir somente quando (campo condicional)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={editingField.condicao?.campoId || ""}
                      onChange={(e) => updateField(editingField.id, { condicao: e.target.value ? { campoId: e.target.value, valor: editingField.condicao?.valor || "" } : undefined })}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Sem condição</option>
                      {campos.filter((c) => c.id !== editingField.id).map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                    {editingField.condicao?.campoId && (
                      <input
                        value={editingField.condicao?.valor || ""}
                        onChange={(e) => updateField(editingField.id, { condicao: { campoId: editingField.condicao!.campoId, valor: e.target.value } })}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Valor esperado"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Save */}
            <div className="flex gap-3 pt-2 sticky bottom-0 bg-background pb-2">
              <button onClick={() => setBuilderOpen(false)} className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleSaveTemplate} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">Salvar Formulário</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen !== null} onOpenChange={() => setPreviewOpen(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Visualização — {previewOpen?.nome}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {previewOpen?.campos.map((f) => (
              <div key={f.id}>
                {f.condicao && (
                  <p className="text-[10px] text-amber-600 mb-1">
                    Exibido quando "{campos.find(c => c.id === f.condicao?.campoId)?.label || f.condicao.campoId}" = "{f.condicao.valor}"
                  </p>
                )}
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {f.label} {f.obrigatorio && <span className="text-destructive">*</span>}
                </label>
                {f.tipo === "texto" && <input className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm" placeholder={f.label} disabled />}
                {f.tipo === "numero" && <input type="number" className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm" placeholder="0" disabled />}
                {f.tipo === "data" && <input type="date" className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm" disabled />}
                {f.tipo === "textarea" && <textarea className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm" rows={3} disabled />}
                {f.tipo === "checkbox" && <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" disabled /> {f.label}</label>}
                {f.tipo === "select" && (
                  <select className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm" disabled>
                    {f.opcoes?.map((o) => <option key={o}>{o}</option>)}
                  </select>
                )}
                {f.tipo === "arquivo" && (
                  <div className="px-4 py-6 rounded-lg border-2 border-dashed border-border text-center text-sm text-muted-foreground">
                    Arraste um arquivo ou clique para selecionar
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Remover este formulário?</p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Cancelar</button>
            <button onClick={() => deleteConfirm && handleDeleteTemplate(deleteConfirm)} className="flex-1 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-opacity">Excluir</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Formularios;
