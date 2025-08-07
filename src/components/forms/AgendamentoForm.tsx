import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from '@/contexts/AppContext'
import { useToast } from '@/hooks/use-toast'

interface AgendamentoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AgendamentoForm({ open, onOpenChange }: AgendamentoFormProps) {
  const { 
    addAgendamento, 
    updateAgendamento, 
    editingAgendamento, 
    setEditingAgendamento,
    clientes,
    equipamentos
  } = useApp()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    cliente: '',
    equipamento: '',
    tipo: 'Entrega' as 'Entrega' | 'Retirada',
    data: '',
    hora: '',
    endereco: '',
    status: 'Pendente' as 'Confirmado' | 'Pendente' | 'Cancelado'
  })

  useEffect(() => {
    if (editingAgendamento) {
      setFormData({
        cliente: editingAgendamento.cliente,
        equipamento: editingAgendamento.equipamento,
        tipo: editingAgendamento.tipo,
        data: editingAgendamento.data,
        hora: editingAgendamento.hora,
        endereco: editingAgendamento.endereco,
        status: editingAgendamento.status
      })
    } else {
      setFormData({
        cliente: '',
        equipamento: '',
        tipo: 'Entrega',
        data: '',
        hora: '',
        endereco: '',
        status: 'Pendente'
      })
    }
  }, [editingAgendamento, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.cliente || !formData.equipamento || !formData.data || !formData.hora) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos"
      })
      return
    }

    if (editingAgendamento) {
      updateAgendamento(editingAgendamento.id, formData)
      toast({
        title: "Agendamento atualizado",
        description: "Agendamento atualizado com sucesso!"
      })
    } else {
      addAgendamento(formData)
      toast({
        title: "Agendamento criado",
        description: "Novo agendamento criado com sucesso!"
      })
    }

    onOpenChange(false)
    setEditingAgendamento(null)
  }

  const handleClose = () => {
    onOpenChange(false)
    setEditingAgendamento(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
          </DialogTitle>
          <DialogDescription>
            {editingAgendamento ? 'Atualize os dados do agendamento' : 'Preencha os dados do novo agendamento'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente *</Label>
            <Select value={formData.cliente} onValueChange={(value) => setFormData({ ...formData, cliente: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.filter(c => c.status === 'Ativo').map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.nome}>
                    {cliente.nome} - {cliente.empresa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipamento">Equipamento *</Label>
            <Select value={formData.equipamento} onValueChange={(value) => setFormData({ ...formData, equipamento: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o equipamento" />
              </SelectTrigger>
              <SelectContent>
                {equipamentos.filter(e => e.disponiveis > 0).map((equipamento) => (
                  <SelectItem key={equipamento.id} value={equipamento.nome}>
                    {equipamento.nome} ({equipamento.disponiveis} disponíveis)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo *</Label>
            <Select value={formData.tipo} onValueChange={(value: 'Entrega' | 'Retirada') => setFormData({ ...formData, tipo: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entrega">Entrega</SelectItem>
                <SelectItem value="Retirada">Retirada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora">Hora *</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Textarea
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              placeholder="Endereço completo para entrega/retirada"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'Confirmado' | 'Pendente' | 'Cancelado') => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Confirmado">Confirmado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90">
              {editingAgendamento ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}