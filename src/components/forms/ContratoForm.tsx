import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useApp } from '@/contexts/AppContext'
import { useToast } from '@/hooks/use-toast'

interface ContratoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ContratoForm({ open, onOpenChange }: ContratoFormProps) {
  const { 
    addContrato, 
    updateContrato, 
    editingContrato, 
    setEditingContrato,
    clientes,
    equipamentos
  } = useApp()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    cliente: '',
    equipamento: '',
    valor: '',
    vencimento: '',
    recorrencia: 'Mensal' as 'Mensal' | 'Anual',
    status: 'Pendente' as 'Pago' | 'Pendente' | 'Vencido'
  })

  useEffect(() => {
    if (editingContrato) {
      setFormData({
        cliente: editingContrato.cliente,
        equipamento: editingContrato.equipamento,
        valor: editingContrato.valor.toString(),
        vencimento: editingContrato.vencimento,
        recorrencia: editingContrato.recorrencia,
        status: editingContrato.status
      })
    } else {
      setFormData({
        cliente: '',
        equipamento: '',
        valor: '',
        vencimento: '',
        recorrencia: 'Mensal',
        status: 'Pendente'
      })
    }
  }, [editingContrato, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.cliente || !formData.equipamento || !formData.valor || !formData.vencimento) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos"
      })
      return
    }

    const contratoData = {
      cliente: formData.cliente,
      equipamento: formData.equipamento,
      valor: parseFloat(formData.valor),
      vencimento: formData.vencimento,
      recorrencia: formData.recorrencia,
      status: formData.status
    }

    if (editingContrato) {
      updateContrato(editingContrato.id, contratoData)
      toast({
        title: "Contrato atualizado",
        description: "Contrato atualizado com sucesso!"
      })
    } else {
      addContrato(contratoData)
      toast({
        title: "Contrato criado",
        description: "Novo contrato criado com sucesso!"
      })
    }

    onOpenChange(false)
    setEditingContrato(null)
  }

  const handleClose = () => {
    onOpenChange(false)
    setEditingContrato(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingContrato ? 'Editar Contrato' : 'Novo Contrato'}
          </DialogTitle>
          <DialogDescription>
            {editingContrato ? 'Atualize os dados do contrato' : 'Preencha os dados do novo contrato'}
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
                {equipamentos.map((equipamento) => (
                  <SelectItem key={equipamento.id} value={equipamento.nome}>
                    {equipamento.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$) *</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              min="0"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              placeholder="0,00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vencimento">Data de Vencimento *</Label>
            <Input
              id="vencimento"
              type="date"
              value={formData.vencimento}
              onChange={(e) => setFormData({ ...formData, vencimento: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recorrencia">Recorrência</Label>
            <Select value={formData.recorrencia} onValueChange={(value: 'Mensal' | 'Anual') => setFormData({ ...formData, recorrencia: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mensal">Mensal</SelectItem>
                <SelectItem value="Anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'Pago' | 'Pendente' | 'Vencido') => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Pago">Pago</SelectItem>
                <SelectItem value="Vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90">
              {editingContrato ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}