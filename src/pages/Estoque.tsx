import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Search, Package, Zap, Settings } from "lucide-react"
import { useApp } from '@/contexts/AppContext'
import EquipamentoForm from '@/components/forms/EquipamentoForm'
import { useState } from 'react'

const Estoque = () => {
  const { 
    equipamentos, 
    setEquipamentoModalOpen, 
    isEquipamentoModalOpen,
    setEditingEquipamento
  } = useApp()

  const [filtroStatus, setFiltroStatus] = useState<string>('Todos')
  const [busca, setBusca] = useState('')

  const equipamentosFiltrados = equipamentos.filter(equipamento => {
    const matchStatus = filtroStatus === 'Todos' || equipamento.status === filtroStatus
    const matchBusca = busca === '' || 
      equipamento.nome.toLowerCase().includes(busca.toLowerCase()) ||
      equipamento.categoria.toLowerCase().includes(busca.toLowerCase())
    return matchStatus && matchBusca
  })

  const handleEditEquipamento = (equipamento: any) => {
    setEditingEquipamento(equipamento)
    setEquipamentoModalOpen(true)
  }
  // Calculate categories
  const categorias = equipamentos.reduce((acc, eq) => {
    const existing = acc.find(cat => cat.nome === eq.categoria)
    if (existing) {
      existing.total += eq.total
      existing.disponivel += eq.disponiveis
    } else {
      acc.push({
        nome: eq.categoria,
        total: eq.total,
        disponivel: eq.disponiveis
      })
    }
    return acc
  }, [] as Array<{ nome: string; total: number; disponivel: number }>)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponível":
        return "bg-success hover:bg-success"
      case "Locado":
        return "bg-warning hover:bg-warning"
      case "Manutenção":
        return "bg-destructive hover:bg-destructive"
      default:
        return "bg-muted"
    }
  }

  const getProgressColor = (disponivel: number, total: number) => {
    const percentage = (disponivel / total) * 100
    if (percentage > 70) return "bg-success"
    if (percentage > 40) return "bg-warning"
    return "bg-destructive"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Estoque</h1>
          <p className="text-muted-foreground">Controle seus equipamentos e disponibilidade</p>
        </div>
        
        <Button 
          className="bg-gradient-primary hover:opacity-90 shadow-md transition-smooth"
          onClick={() => setEquipamentoModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Equipamento
        </Button>
      </div>

      {/* Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categorias.map((categoria, index) => (
          <Card key={index} className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-foreground">{categoria.nome}</h3>
                <Package className="h-5 w-5 text-accent" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Disponíveis: {categoria.disponivel}</span>
                  <span>Total: {categoria.total}</span>
                </div>
                <Progress 
                  value={(categoria.disponivel / categoria.total) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar equipamentos..."
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
                variant={filtroStatus === 'Disponível' ? 'default' : 'outline'}
                onClick={() => setFiltroStatus('Disponível')}
              >
                Disponíveis
              </Button>
              <Button 
                variant={filtroStatus === 'Locado' ? 'default' : 'outline'}
                onClick={() => setFiltroStatus('Locado')}
              >
                Locados
              </Button>
              <Button 
                variant={filtroStatus === 'Manutenção' ? 'default' : 'outline'}
                onClick={() => setFiltroStatus('Manutenção')}
              >
                Manutenção
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment List */}
      <div className="space-y-4">
        {equipamentosFiltrados.map((equipamento) => (
          <Card key={equipamento.id} className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-smooth">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{equipamento.nome}</h3>
                    <Badge variant="outline">{equipamento.categoria}</Badge>
                    <Badge className={getStatusColor(equipamento.status)}>
                      {equipamento.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-semibold text-foreground">{equipamento.total}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Disponíveis</p>
                      <p className="text-lg font-semibold text-success">{equipamento.disponiveis}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Locados</p>
                      <p className="text-lg font-semibold text-warning">{equipamento.locados}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Manutenção</p>
                      <p className="text-lg font-semibold text-destructive">{equipamento.manutencao}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-1" />
                      {equipamento.potencia}
                    </div>
                    <div className="flex items-center">
                      <Settings className="h-4 w-4 mr-1" />
                      Última manutenção: {equipamento.ultimaManutencao}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditEquipamento(equipamento)}
                  >
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    Histórico
                  </Button>
                  <Button variant="outline" size="sm">
                    Agendar
                  </Button>
                </div>
              </div>
              
              {/* Availability Bar */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between text-sm mb-2">
                  <span>Disponibilidade</span>
                  <span>{Math.round((equipamento.disponiveis / equipamento.total) * 100)}%</span>
                </div>
                <Progress 
                  value={(equipamento.disponiveis / equipamento.total) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EquipamentoForm open={isEquipamentoModalOpen} onOpenChange={setEquipamentoModalOpen} />
    </div>
  )
}

export default Estoque