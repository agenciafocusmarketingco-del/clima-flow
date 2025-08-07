import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Package,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"
import { useApp } from '@/contexts/AppContext'
import ClienteForm from '@/components/forms/ClienteForm'
import EquipamentoForm from '@/components/forms/EquipamentoForm'
import AgendamentoForm from '@/components/forms/AgendamentoForm'
import ContratoForm from '@/components/forms/ContratoForm'

const Dashboard = () => {
  const { 
    clientes, 
    equipamentos, 
    agendamentos, 
    contratos,
    setClienteModalOpen,
    setEquipamentoModalOpen,
    setAgendamentoModalOpen,
    setPagamentoModalOpen,
    isClienteModalOpen,
    isEquipamentoModalOpen,
    isAgendamentoModalOpen,
    isPagamentoModalOpen
  } = useApp()

  // Calculate stats
  const clientesAtivos = clientes.filter(c => c.status === 'Ativo').length
  const equipamentosDisponiveis = equipamentos.reduce((acc, eq) => acc + eq.disponiveis, 0)
  const equipamentosLocados = equipamentos.reduce((acc, eq) => acc + eq.locados, 0)
  const agendamentosHoje = agendamentos.filter(a => a.data === '2024-01-15').length
  const receitaMensal = contratos.filter(c => c.status === 'Pago').reduce((acc, c) => acc + c.valor, 0)
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-xl p-8 text-primary-foreground shadow-glow">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Climatize Gestão</h1>
        <p className="text-lg opacity-90">
          Sistema completo para gerenciar sua empresa de locação de equipamentos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-0 shadow-md transition-smooth hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes Ativos
            </CardTitle>
            <Users className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{clientesAtivos}</div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-success mr-1" />
              <span className="text-success">+12%</span>
              <span className="text-muted-foreground ml-1">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md transition-smooth hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Equipamentos
            </CardTitle>
            <Package className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{equipamentos.length}</div>
            <div className="flex items-center justify-between mt-2">
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                {equipamentosDisponiveis} Disponíveis
              </Badge>
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {equipamentosLocados} Locados
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md transition-smooth hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Agendamentos Hoje
            </CardTitle>
            <Calendar className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{agendamentosHoje}</div>
            <div className="flex items-center mt-2 text-sm">
              <Clock className="h-4 w-4 text-warning mr-1" />
              <span className="text-foreground">3 entregas, 5 retiradas</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md transition-smooth hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Mensal
            </CardTitle>
            <DollarSign className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">R$ {receitaMensal.toLocaleString('pt-BR')}</div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-success mr-1" />
              <span className="text-success">+8%</span>
              <span className="text-muted-foreground ml-1">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Status */}
        <Card className="lg:col-span-2 bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-accent" />
              Status dos Equipamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ar Condicionado Split</span>
                <span>15/20 disponíveis</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ar Condicionado Central</span>
                <span>8/10 disponíveis</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ventiladores Industriais</span>
                <span>25/30 disponíveis</span>
              </div>
              <Progress value={83} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div 
              className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-smooth cursor-pointer"
              onClick={() => setClienteModalOpen(true)}
            >
              <div className="flex items-center">
                <Users className="h-4 w-4 text-accent mr-2" />
                <span className="text-sm font-medium">Novo Cliente</span>
              </div>
            </div>
            <div 
              className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-smooth cursor-pointer"
              onClick={() => setAgendamentoModalOpen(true)}
            >
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-accent mr-2" />
                <span className="text-sm font-medium">Agendar Entrega</span>
              </div>
            </div>
            <div 
              className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-smooth cursor-pointer"
              onClick={() => setEquipamentoModalOpen(true)}
            >
              <div className="flex items-center">
                <Package className="h-4 w-4 text-accent mr-2" />
                <span className="text-sm font-medium">Cadastrar Equipamento</span>
              </div>
            </div>
            <div 
              className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-smooth cursor-pointer"
              onClick={() => setPagamentoModalOpen(true)}
            >
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-accent mr-2" />
                <span className="text-sm font-medium">Registrar Pagamento</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ClienteForm open={isClienteModalOpen} onOpenChange={setClienteModalOpen} />
      <EquipamentoForm open={isEquipamentoModalOpen} onOpenChange={setEquipamentoModalOpen} />
      <AgendamentoForm open={isAgendamentoModalOpen} onOpenChange={setAgendamentoModalOpen} />
      <ContratoForm open={isPagamentoModalOpen} onOpenChange={setPagamentoModalOpen} />
    </div>
  )
}

export default Dashboard