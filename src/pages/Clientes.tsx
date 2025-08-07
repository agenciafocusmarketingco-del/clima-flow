import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MapPin, Phone, Mail } from "lucide-react"

const Clientes = () => {
  const clientes = [
    {
      id: 1,
      nome: "João Silva",
      empresa: "Silva Eventos",
      email: "joao@silvaeventos.com",
      telefone: "(11) 99999-9999",
      endereco: "São Paulo, SP",
      status: "Ativo",
      ultimaLocacao: "15/01/2024"
    },
    {
      id: 2,
      nome: "Maria Santos",
      empresa: "Santos Construções",
      email: "maria@santosconstrucoes.com",
      telefone: "(11) 88888-8888",
      endereco: "Rio de Janeiro, RJ",
      status: "Ativo",
      ultimaLocacao: "10/01/2024"
    },
    {
      id: 3,
      nome: "Pedro Costa",
      empresa: "Costa Festas",
      email: "pedro@costafestas.com",
      telefone: "(11) 77777-7777",
      endereco: "Belo Horizonte, MG",
      status: "Inativo",
      ultimaLocacao: "05/12/2023"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes e histórico de locações</p>
        </div>
        
        <Button className="bg-gradient-primary hover:opacity-90 shadow-md transition-smooth">
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
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Todos</Button>
              <Button variant="outline">Ativos</Button>
              <Button variant="outline">Inativos</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes.map((cliente) => (
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
                <Button variant="outline" size="sm" className="flex-1">
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
              <div className="text-2xl font-bold text-foreground">142</div>
              <div className="text-sm text-muted-foreground">Total Clientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">128</div>
              <div className="text-sm text-muted-foreground">Clientes Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">14</div>
              <div className="text-sm text-muted-foreground">Inativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">89%</div>
              <div className="text-sm text-muted-foreground">Taxa Retenção</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Clientes