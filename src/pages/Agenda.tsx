import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Package, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { useApp } from '@/contexts/AppContext'
import AgendamentoForm from '@/components/forms/AgendamentoForm'

const Agenda = () => {
  const { 
    agendamentos, 
    setAgendamentoModalOpen, 
    isAgendamentoModalOpen,
    setEditingAgendamento,
    updateAgendamento
  } = useApp()

  const handleEditAgendamento = (agendamento: any) => {
    setEditingAgendamento(agendamento)
    setAgendamentoModalOpen(true)
  }

  const handleCancelarAgendamento = (id: number) => {
    updateAgendamento(id, { status: 'Cancelado' })
  }
    {
      id: 1,
      cliente: "João Silva",
      equipamento: "Ar Condicionado Split 12.000 BTUs",
      tipo: "Entrega",
      data: "2024-01-15",
      hora: "09:00",
      endereco: "Rua das Flores, 123 - São Paulo/SP",
      status: "Confirmado"
    },
    {
      id: 2,
      cliente: "Maria Santos",
      equipamento: "Ventilador Industrial",
      tipo: "Retirada",
      data: "2024-01-15",
      hora: "14:00",
      endereco: "Av. Paulista, 1000 - São Paulo/SP",
      status: "Pendente"
    },
    {
      id: 3,
      cliente: "Pedro Costa",
      equipamento: "Ar Condicionado Central",
      tipo: "Entrega",
      data: "2024-01-16",
      hora: "08:00",
      endereco: "Rua Augusta, 500 - São Paulo/SP",
      status: "Confirmado"
    }
  ]

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const mesAtual = "Janeiro 2024"

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "bg-success hover:bg-success"
      case "Pendente":
        return "bg-warning hover:bg-warning"
      case "Cancelado":
        return "bg-destructive hover:bg-destructive"
      default:
        return "bg-muted"
    }
  }

  const getTipoColor = (tipo: string) => {
    return tipo === "Entrega" ? "bg-accent" : "bg-secondary"
  }

  // Gerar dias do mês (simplificado para demo)
  const diasMes = Array.from({ length: 31 }, (_, i) => i + 1)
  const hoje = 15

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
          <p className="text-muted-foreground">Gerencie entregas e retiradas de equipamentos</p>
        </div>
        
        <Button 
          className="bg-gradient-primary hover:opacity-90 shadow-md transition-smooth"
          onClick={() => setAgendamentoModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="xl:col-span-2 bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-accent" />
                {mesAtual}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Days Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {diasSemana.map((dia) => (
                <div key={dia} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {dia}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {diasMes.map((dia) => {
                const hasEvent = agendamentos.some(ag => new Date(ag.data).getDate() === dia)
                const isToday = dia === hoje
                
                return (
                  <div 
                    key={dia} 
                    className={`
                      p-3 text-center cursor-pointer rounded-lg transition-smooth
                      ${isToday ? 'bg-gradient-accent text-accent-foreground font-bold' : 'hover:bg-muted/50'}
                      ${hasEvent ? 'border-2 border-accent' : 'border border-transparent'}
                    `}
                  >
                    <div className="text-sm">{dia}</div>
                    {hasEvent && (
                      <div className="w-2 h-2 bg-accent rounded-full mx-auto mt-1"></div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-accent" />
              Hoje (15/01)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agendamentos
              .filter(ag => ag.data === "2024-01-15")
              .map((agendamento) => (
                <div key={agendamento.id} className="p-3 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="text-sm font-medium">{agendamento.hora}</div>
                    <Badge className={getTipoColor(agendamento.tipo)} variant="secondary">
                      {agendamento.tipo}
                    </Badge>
                  </div>
                  <div className="text-sm text-foreground font-medium">
                    {agendamento.cliente}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {agendamento.equipamento}
                  </div>
                <Badge className={getStatusColor(agendamento.status)}>
                  {agendamento.status}
                </Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle>Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agendamentos.map((agendamento) => (
              <div key={agendamento.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-bold">{new Date(agendamento.data).getDate()}</div>
                    <div className="text-xs text-muted-foreground">Jan</div>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{agendamento.cliente}</h4>
                      <Badge className={getTipoColor(agendamento.tipo)} variant="secondary">
                        {agendamento.tipo}
                      </Badge>
                      <Badge className={getStatusColor(agendamento.status)}>
                        {agendamento.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Package className="h-4 w-4 mr-1" />
                      {agendamento.equipamento}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {agendamento.hora}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {agendamento.endereco}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditAgendamento(agendamento)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCancelarAgendamento(agendamento.id)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AgendamentoForm open={isAgendamentoModalOpen} onOpenChange={setAgendamentoModalOpen} />
    </div>
  )
}

export default Agenda