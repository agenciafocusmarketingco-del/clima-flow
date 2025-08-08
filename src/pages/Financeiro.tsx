import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  FileText,
  Plus,
  Download,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react"
import { useApp } from '@/contexts/AppContext'
import ContratoForm from '@/components/forms/ContratoForm'

const Financeiro = () => {
  const { 
    contratos, 
    setContratoModalOpen, 
    isContratoModalOpen,
    setEditingContrato,
    updateContrato
  } = useApp()

  const handleEditContrato = (contrato: any) => {
    setEditingContrato(contrato)
    setContratoModalOpen(true)
  }

  const handleConfirmarPagamento = (id: number) => {
    updateContrato(id, { status: 'Pago' })
  }

  const resumoMensal = {
    receita: 28450,
    despesas: 12300,
    lucro: 16150,
    contratos: 142,
    pagosEmDia: 128,
    pendentes: 10,
    vencidos: 4
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-success hover:bg-success"
      case "Pendente":
        return "bg-warning hover:bg-warning"
      case "Vencido":
        return "bg-destructive hover:bg-destructive"
      default:
        return "bg-muted"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pago":
        return <CheckCircle className="h-4 w-4" />
      case "Pendente":
        return <Clock className="h-4 w-4" />
      case "Vencido":
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground">Controle de contratos e pagamentos recorrentes</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button 
            className="bg-gradient-primary hover:opacity-90 shadow-md transition-smooth"
            onClick={() => setContratoModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Contrato
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Mensal
            </CardTitle>
            <DollarSign className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {resumoMensal.receita.toLocaleString('pt-BR')}
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-success mr-1" />
              <span className="text-success">+12%</span>
              <span className="text-muted-foreground ml-1">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas
            </CardTitle>
            <CreditCard className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {resumoMensal.despesas.toLocaleString('pt-BR')}
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingDown className="h-4 w-4 text-destructive mr-1" />
              <span className="text-destructive">-5%</span>
              <span className="text-muted-foreground ml-1">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lucro Líquido
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {resumoMensal.lucro.toLocaleString('pt-BR')}
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-accent font-medium">56.8%</span>
              <span className="text-muted-foreground ml-1">margem</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contratos Ativos
            </CardTitle>
            <FileText className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{resumoMensal.contratos}</div>
            <div className="flex items-center mt-2 text-sm">
              <CheckCircle className="h-4 w-4 text-success mr-1" />
              <span className="text-success">{resumoMensal.pagosEmDia}</span>
              <span className="text-muted-foreground ml-1">em dia</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Status Overview */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle>Status dos Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pagos em Dia</span>
                <span className="font-medium">{resumoMensal.pagosEmDia}/{resumoMensal.contratos}</span>
              </div>
              <Progress value={(resumoMensal.pagosEmDia / resumoMensal.contratos) * 100} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {Math.round((resumoMensal.pagosEmDia / resumoMensal.contratos) * 100)}% dos contratos
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pendentes</span>
                <span className="font-medium text-warning">{resumoMensal.pendentes}</span>
              </div>
              <Progress value={(resumoMensal.pendentes / resumoMensal.contratos) * 100} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Aguardando pagamento
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Vencidos</span>
                <span className="font-medium text-destructive">{resumoMensal.vencidos}</span>
              </div>
              <Progress value={(resumoMensal.vencidos / resumoMensal.contratos) * 100} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Necessitam atenção
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contracts List */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Contratos Recorrentes</CardTitle>
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contratos.map((contrato) => (
              <div key={contrato.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-smooth">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getStatusColor(contrato.status)} text-primary-foreground`}>
                    {getStatusIcon(contrato.status)}
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">{contrato.cliente}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{contrato.equipamento}</span>
                      <span>•</span>
                      <span>{contrato.recorrencia}</span>
                      <span>•</span>
                      <span>Vence em {contrato.vencimento}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">
                      R$ {contrato.valor.toLocaleString('pt-BR')}
                    </div>
                    <Badge className={getStatusColor(contrato.status)}>
                      {contrato.status}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditContrato(contrato)}
                    >
                      Editar
                    </Button>
                    {contrato.status === "Pendente" && (
                      <Button 
                        size="sm" 
                        className="bg-success hover:bg-success/90"
                        onClick={() => handleConfirmarPagamento(contrato.id)}
                      >
                        Confirmar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ContratoForm open={isContratoModalOpen} onOpenChange={setContratoModalOpen} />
    </div>
  )
}

export default Financeiro