import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText, 
  Plus, 
  Download, 
  Eye, 
  Edit, 
  Calculator,
  Calendar,
  User,
  Package
} from "lucide-react"
import { useState } from "react"
import { useApp } from '@/contexts/AppContext'

const Orcamentos = () => {
  const { clientes, equipamentos } = useApp()
  const [novoOrcamento, setNovoOrcamento] = useState({
    cliente: '',
    equipamento: '',
    quantidade: 1,
    periodo: 'Mensal',
    dataInicio: '',
    dataFim: '',
    observacoes: ''
  })

  const [orcamentos] = useState([
    {
      id: 1,
      cliente: "João Silva",
      equipamentos: ["CT50 - Climatizador Evaporativo"],
      valor: 1200,
      periodo: "Mensal",
      status: "Aprovado",
      dataVencimento: "20/01/2024",
      criadoEm: "10/01/2024"
    },
    {
      id: 2,
      cliente: "Maria Santos",
      equipamentos: ["CT80 - Climatizador Evaporativo", "CT50 - Climatizador Evaporativo"],
      valor: 2800,
      periodo: "Mensal",
      status: "Pendente",
      dataVencimento: "25/01/2024",
      criadoEm: "15/01/2024"
    },
    {
      id: 3,
      cliente: "Carlos Oliveira",
      equipamentos: ["CT90 - Climatizador Evaporativo"],
      valor: 2200,
      periodo: "Trimestral",
      status: "Em Análise",
      dataVencimento: "30/01/2024",
      criadoEm: "18/01/2024"
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-success hover:bg-success"
      case "Pendente":
        return "bg-warning hover:bg-warning"
      case "Em Análise":
        return "bg-accent hover:bg-accent"
      case "Rejeitado":
        return "bg-destructive hover:bg-destructive"
      default:
        return "bg-muted"
    }
  }

  const calcularValorEquipamento = (nomeEquipamento: string, quantidade: number) => {
    const valores = {
      "CT50": 1200,
      "CT80": 1800,
      "CT90": 2200
    }
    
    const tipo = nomeEquipamento.includes("CT50") ? "CT50" : 
                 nomeEquipamento.includes("CT80") ? "CT80" : "CT90"
    
    return valores[tipo] * quantidade
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orçamentos</h1>
          <p className="text-muted-foreground">Gerencie propostas e contratos de locação</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90 shadow-md transition-smooth">
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Formulário de Novo Orçamento */}
        <Card className="xl:col-span-1 bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-accent" />
              Novo Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Select 
                value={novoOrcamento.cliente} 
                onValueChange={(value) => setNovoOrcamento({...novoOrcamento, cliente: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.nome}>
                      {cliente.nome} - {cliente.empresa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipamento">Equipamento</Label>
              <Select 
                value={novoOrcamento.equipamento} 
                onValueChange={(value) => setNovoOrcamento({...novoOrcamento, equipamento: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o equipamento" />
                </SelectTrigger>
                <SelectContent>
                  {equipamentos.filter(eq => eq.disponiveis > 0).map((equipamento) => (
                    <SelectItem key={equipamento.id} value={equipamento.nome}>
                      {equipamento.nome} ({equipamento.disponiveis} disponíveis)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  type="number"
                  min="1"
                  value={novoOrcamento.quantidade}
                  onChange={(e) => setNovoOrcamento({...novoOrcamento, quantidade: parseInt(e.target.value) || 1})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodo">Período</Label>
                <Select 
                  value={novoOrcamento.periodo} 
                  onValueChange={(value) => setNovoOrcamento({...novoOrcamento, periodo: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mensal">Mensal</SelectItem>
                    <SelectItem value="Trimestral">Trimestral</SelectItem>
                    <SelectItem value="Semestral">Semestral</SelectItem>
                    <SelectItem value="Anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data Início</Label>
                <Input
                  type="date"
                  value={novoOrcamento.dataInicio}
                  onChange={(e) => setNovoOrcamento({...novoOrcamento, dataInicio: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFim">Data Fim</Label>
                <Input
                  type="date"
                  value={novoOrcamento.dataFim}
                  onChange={(e) => setNovoOrcamento({...novoOrcamento, dataFim: e.target.value})}
                />
              </div>
            </div>

            {novoOrcamento.equipamento && (
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground">Valor Estimado</div>
                <div className="text-2xl font-bold text-foreground">
                  R$ {calcularValorEquipamento(novoOrcamento.equipamento, novoOrcamento.quantidade).toLocaleString('pt-BR')}
                </div>
                <div className="text-xs text-muted-foreground">por mês</div>
              </div>
            )}

            <Button className="w-full bg-gradient-primary hover:opacity-90">
              Gerar Orçamento
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Orçamentos */}
        <Card className="xl:col-span-2 bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle>Orçamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orcamentos.map((orcamento) => (
                <div key={orcamento.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-smooth">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                      <FileText className="h-8 w-8 text-accent" />
                      <div className="text-xs text-muted-foreground mt-1">
                        #{String(orcamento.id).padStart(3, '0')}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{orcamento.cliente}</h4>
                        <Badge className={getStatusColor(orcamento.status)}>
                          {orcamento.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Package className="h-4 w-4 mr-1" />
                        {orcamento.equipamentos.join(", ")}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Criado em {orcamento.criadoEm}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Vence em {orcamento.dataVencimento}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">
                        R$ {orcamento.valor.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {orcamento.periodo}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Orçamentos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orçamentos</p>
                <p className="text-2xl font-bold">{orcamentos.length}</p>
              </div>
              <FileText className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aprovados</p>
                <p className="text-2xl font-bold text-success">
                  {orcamentos.filter(o => o.status === "Aprovado").length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-warning">
                  {orcamentos.filter(o => o.status === "Pendente").length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">
                  R$ {orcamentos.reduce((acc, o) => acc + o.valor, 0).toLocaleString('pt-BR')}
                </p>
              </div>
              <Calculator className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Orcamentos