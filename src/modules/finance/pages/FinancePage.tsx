import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react"
import { useAppStore } from '@/stores/appStore'

export const FinancePage = () => {
  const { payments, clients, bookings } = useAppStore()

  // Calculate financial metrics
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0)
  const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((acc, p) => acc + p.amount, 0)
  const totalRevenue = totalPaid + totalPending + totalOverdue

  const paidPercentage = totalRevenue > 0 ? (totalPaid / totalRevenue) * 100 : 0
  const pendingPercentage = totalRevenue > 0 ? (totalPending / totalRevenue) * 100 : 0
  const overduePercentage = totalRevenue > 0 ? (totalOverdue / totalRevenue) * 100 : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'overdue': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'overdue': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    return client?.name || 'Cliente não encontrado'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground">Controle de pagamentos e receitas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
          <Button>
            <DollarSign className="h-4 w-4 mr-2" />
            Novo Pagamento
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Recebido
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
            <div className="text-sm text-muted-foreground">
              {payments.filter(p => p.status === 'paid').length} pagamentos
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendente
            </CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</div>
            <div className="text-sm text-muted-foreground">
              {payments.filter(p => p.status === 'pending').length} em aberto
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vencidas
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalOverdue)}</div>
            <div className="text-sm text-muted-foreground">
              {payments.filter(p => p.status === 'overdue').length} vencidas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <div className="text-sm text-muted-foreground">
              Este mês
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Status Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Status dos Pagamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Pagos
                </span>
                <span>{paidPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={paidPercentage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                  Pendentes
                </span>
                <span>{pendingPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={pendingPercentage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  Vencidas
                </span>
                <span>{overduePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={overduePercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pagamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length > 0 ? (
              <div className="space-y-4">
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                      </div>
                      <div>
                        <div className="font-medium">
                          {getClientName(payment.clientId)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(payment.date)} • {payment.method.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(payment.amount)}</div>
                      <Badge variant="outline" className={getStatusColor(payment.status)}>
                        {payment.status === 'paid' ? 'Pago' : 
                         payment.status === 'pending' ? 'Pendente' : 'Vencido'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum pagamento registrado</p>
                <p className="text-sm">Carregue os dados demo para começar</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}