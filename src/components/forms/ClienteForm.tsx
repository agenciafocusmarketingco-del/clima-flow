import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useApp, Cliente } from '@/contexts/AppContext'
import { useToast } from '@/hooks/use-toast'

interface ClienteFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ClienteForm({ open, onOpenChange }: ClienteFormProps) {
  const { addCliente, updateCliente, editingCliente, setEditingCliente } = useApp()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    endereco: '',
    status: 'Ativo' as 'Ativo' | 'Inativo'
  })

  useEffect(() => {
    if (editingCliente) {
      setFormData({
        nome: editingCliente.nome,
        empresa: editingCliente.empresa,
        email: editingCliente.email,
        telefone: editingCliente.telefone,
        endereco: editingCliente.endereco,
        status: editingCliente.status
      })
    } else {
      setFormData({
        nome: '',
        empresa: '',
        email: '',
        telefone: '',
        endereco: '',
        status: 'Ativo'
      })
    }
  }, [editingCliente, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.email) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nome e email são obrigatórios"
      })
      return
    }

    const clienteData = {
      ...formData,
      ultimaLocacao: new Date().toLocaleDateString('pt-BR')
    }

    if (editingCliente) {
      updateCliente(editingCliente.id, clienteData)
      toast({
        title: "Cliente atualizado",
        description: "Cliente atualizado com sucesso!"
      })
    } else {
      addCliente(clienteData)
      toast({
        title: "Cliente criado",
        description: "Novo cliente criado com sucesso!"
      })
    }

    onOpenChange(false)
    setEditingCliente(null)
  }

  const handleClose = () => {
    onOpenChange(false)
    setEditingCliente(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
          <DialogDescription>
            {editingCliente ? 'Atualize os dados do cliente' : 'Preencha os dados do novo cliente'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa</Label>
            <Input
              id="empresa"
              value={formData.empresa}
              onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
              placeholder="Nome da empresa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@exemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              placeholder="Cidade, Estado"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'Ativo' | 'Inativo') => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90">
              {editingCliente ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}