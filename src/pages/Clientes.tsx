import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MapPin, Phone, Mail } from "lucide-react"
import { useApp } from '@/contexts/AppContext'
import ClienteForm from '@/components/forms/ClienteForm'
import { useState } from 'react'

const Clientes = () => {
  const { 
    clientes, 
    setClienteModalOpen, 
    isClienteModalOpen,
    setEditingCliente
  } = useApp()

  const [filtroStatus, setFiltroStatus] = useState<string>('Todos')
  const [busca, setBusca] = useState('')

  const clientesFiltrados = clientes.filter(cliente => {
    const matchStatus = filtroStatus === 'Todos' || cliente.status === filtroStatus
    const matchBusca = busca === '' || 
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.empresa.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.email.toLowerCase().includes(busca.toLowerCase())
    return matchStatus && matchBusca
  })

  const handleEditCliente = (cliente: any) => {
    setEditingCliente(cliente)
    setClienteModalOpen(true)
  }

  const totalClientes = clientes.length
  const clientesAtivos = clientes.filter(c => c.status === 'Ativo').length
  const clientesInativos = clientes.filter(c => c.status === 'Inativo').length
  const taxaRetencao = Math.round((clientesAtivos / totalClientes) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes e histórico de locações</p>
        </div>
        
        <Button 
          className="bg-gradient-primary hover:opacity-90 shadow-md transition-smooth"
          onClick={() => setClienteModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, empresa ou email..."
                className="pl-10 bg-background"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={filtroStatus === 'Todos' ? 'default' : 'outline'}
                onClick={() => setFiltroStatus('Todos')}
              >
                Todos
              </Button>
              <Button 
                variant={filtroStatus === 'Ativo' ? 'default' : 'outline'}
                onClick={() => setFiltroStatus('Ativo')}
              >
                Ativos
              </Button>
              <Button 
                variant={filtroStatus === 'Inativo' ? 'default' : 'outline'}
                onClick={() => setFiltroStatus('Inativo')}
              >
                Inativos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientesFiltrados.map((cliente) => (
          <Card key={cliente.id} className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-smooth">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{cliente.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground font-medium">{cliente.empresa}</p>
                </div>
                <Badge 
                  variant={cliente.status === "Ativo" ? "default" : "secondary"}
                  className={cliente.status === "Ativo" ? "bg-success hover:bg-success" : ""}
                >
                  {cliente.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  {cliente.email}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  {cliente.telefone}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {cliente.endereco}
                </div>
              </div>
              
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Última locação: {cliente.ultimaLocacao}
                </p>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Histórico
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditCliente(cliente)}
                >
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{totalClientes}</div>
              <div className="text-sm text-muted-foreground">Total Clientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{clientesAtivos}</div>
              <div className="text-sm text-muted-foreground">Clientes Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{clientesInativos}</div>
              <div className="text-sm text-muted-foreground">Inativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{taxaRetencao}%</div>
              <div className="text-sm text-muted-foreground">Taxa Retenção</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ClienteForm open={isClienteModalOpen} onOpenChange={setClienteModalOpen} />
    </div>
  )
}

export default Clientes