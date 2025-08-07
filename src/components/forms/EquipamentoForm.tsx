import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useApp } from '@/contexts/AppContext'
import { useToast } from '@/hooks/use-toast'

interface EquipamentoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EquipamentoForm({ open, onOpenChange }: EquipamentoFormProps) {
  const { addEquipamento, updateEquipamento, editingEquipamento, setEditingEquipamento } = useApp()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    status: 'Disponível' as 'Disponível' | 'Locado' | 'Manutenção',
    total: 1,
    disponiveis: 1,
    locados: 0,
    manutencao: 0,
    potencia: ''
  })

  useEffect(() => {
    if (editingEquipamento) {
      setFormData({
        nome: editingEquipamento.nome,
        categoria: editingEquipamento.categoria,
        status: editingEquipamento.status,
        total: editingEquipamento.total,
        disponiveis: editingEquipamento.disponiveis,
        locados: editingEquipamento.locados,
        manutencao: editingEquipamento.manutencao,
        potencia: editingEquipamento.potencia
      })
    } else {
      setFormData({
        nome: '',
        categoria: '',
        status: 'Disponível',
        total: 1,
        disponiveis: 1,
        locados: 0,
        manutencao: 0,
        potencia: ''
      })
    }
  }, [editingEquipamento, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.categoria) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nome e categoria são obrigatórios"
      })
      return
    }

    const equipamentoData = {
      ...formData,
      ultimaManutencao: new Date().toLocaleDateString('pt-BR')
    }

    if (editingEquipamento) {
      updateEquipamento(editingEquipamento.id, equipamentoData)
      toast({
        title: "Equipamento atualizado",
        description: "Equipamento atualizado com sucesso!"
      })
    } else {
      addEquipamento(equipamentoData)
      toast({
        title: "Equipamento criado",
        description: "Novo equipamento criado com sucesso!"
      })
    }

    onOpenChange(false)
    setEditingEquipamento(null)
  }

  const handleClose = () => {
    onOpenChange(false)
    setEditingEquipamento(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingEquipamento ? 'Editar Equipamento' : 'Novo Equipamento'}
          </DialogTitle>
          <DialogDescription>
            {editingEquipamento ? 'Atualize os dados do equipamento' : 'Preencha os dados do novo equipamento'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Ar Condicionado Split 12.000 BTUs"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria *</Label>
            <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ar Condicionado">Ar Condicionado</SelectItem>
                <SelectItem value="Ventilação">Ventilação</SelectItem>
                <SelectItem value="Aquecimento">Aquecimento</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="potencia">Potência</Label>
            <Input
              id="potencia"
              value={formData.potencia}
              onChange={(e) => setFormData({ ...formData, potencia: e.target.value })}
              placeholder="Ex: 12.000 BTUs ou 500W"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total">Total</Label>
              <Input
                id="total"
                type="number"
                min="1"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disponiveis">Disponíveis</Label>
              <Input
                id="disponiveis"
                type="number"
                min="0"
                value={formData.disponiveis}
                onChange={(e) => setFormData({ ...formData, disponiveis: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="locados">Locados</Label>
              <Input
                id="locados"
                type="number"
                min="0"
                value={formData.locados}
                onChange={(e) => setFormData({ ...formData, locados: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manutencao">Manutenção</Label>
              <Input
                id="manutencao"
                type="number"
                min="0"
                value={formData.manutencao}
                onChange={(e) => setFormData({ ...formData, manutencao: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'Disponível' | 'Locado' | 'Manutenção') => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Disponível">Disponível</SelectItem>
                <SelectItem value="Locado">Locado</SelectItem>
                <SelectItem value="Manutenção">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90">
              {editingEquipamento ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}