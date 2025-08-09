import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Users,
  Package,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus
} from "lucide-react"
import { useAppStore } from '@/stores/appStore'

const Index = () => {
  const { clients, equipment, bookings, payments, loadSeedData } = useAppStore()

  const handleLoadSeedData = () => {
    loadSeedData()
  }

  // Calculate stats
  const activeClients = clients.filter(c => c.tags?.includes('active') || !c.tags).length
  const availableEquipment = equipment.filter(e => e.status === 'available').length
  const reservedEquipment = equipment.filter(e => e.status === 'reserved').length
  const todayBookings = bookings.filter(b => {
    const today = new Date().toISOString().split('T')[0]
    return b.start.split('T')[0] === today
  }).length
  const monthlyRevenue = payments
    .filter(p => p.status === 'paid')
    .reduce((acc, p) => acc + p.amount, 0)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 text-primary-foreground shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Climatize Gestão</h1>
        <p className="text-lg opacity-90">
          Sistema completo para gerenciar sua empresa de locação de equipamentos
        </p>
        <Button 
          onClick={handleLoadSeedData}
          variant="secondary" 
          className="mt-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Carregar Dados Demo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes Ativos
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-muted-foreground ml-1">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Equipamentos
            </CardTitle>
            <Package className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipment.length}</div>
            <div className="flex items-center justify-between mt-2">
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                {availableEquipment} Disponíveis
              </Badge>
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {reservedEquipment} Reservados
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Agendamentos Hoje
            </CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayBookings}</div>
            <div className="flex items-center mt-2 text-sm">
              <Clock className="h-4 w-4 text-orange-500 mr-1" />
              <span>Próximas entregas e retiradas</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Mensal
            </CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthlyRevenue.toLocaleString('pt-BR')}</div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+8%</span>
              <span className="text-muted-foreground ml-1">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Status */}
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-primary" />
              Status dos Equipamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {equipment.length > 0 ? (
              equipment.slice(0, 3).map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>{item.status === 'available' ? 'Disponível' : item.status === 'reserved' ? 'Reservado' : 'Manutenção'}</span>
                  </div>
                  <Progress 
                    value={item.status === 'available' ? 100 : item.status === 'reserved' ? 50 : 0} 
                    className="h-2" 
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Nenhum equipamento cadastrado. Carregue os dados demo para começar.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/clients">
                <Users className="h-4 w-4 mr-2" />
                Gerenciar Clientes
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/bookings">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Locação
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/equipment">
                <Package className="h-4 w-4 mr-2" />
                Gerenciar Estoque
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/finance">
                <DollarSign className="h-4 w-4 mr-2" />
                Financeiro
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Index