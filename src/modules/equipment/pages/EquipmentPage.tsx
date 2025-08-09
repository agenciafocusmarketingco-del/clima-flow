import { useState } from "react"
import { Plus, Search, Package, Wrench, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/stores/appStore"
import { EquipmentForm } from "../components/EquipmentForm"
import { EquipmentCard } from "../components/EquipmentCard"
import { EquipmentStats } from "../components/EquipmentStats"

export function EquipmentPage() {
  const { equipment, openModal, modals } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "reserved" | "maintenance">("all")
  const [modelFilter, setModelFilter] = useState<"all" | "CT50" | "CT80" | "CT90">("all")

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.model.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || eq.status === statusFilter
    const matchesModel = modelFilter === "all" || eq.model === modelFilter
    
    return matchesSearch && matchesStatus && matchesModel
  })

  const totalEquipment = equipment.reduce((acc, eq) => acc + eq.quantity.total, 0)
  const availableEquipment = equipment.reduce((acc, eq) => acc + eq.quantity.available, 0)
  const reservedEquipment = equipment.reduce((acc, eq) => acc + eq.quantity.reserved, 0)
  const maintenanceEquipment = equipment.reduce((acc, eq) => acc + eq.quantity.maintenance, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Equipamentos</h1>
          <p className="text-muted-foreground">
            Gerencie o estoque de climatizadores e acompanhe a disponibilidade
          </p>
        </div>
        <Button onClick={() => openModal('equipmentForm')} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Equipamento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipamentos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEquipment}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{availableEquipment}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservados</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{reservedEquipment}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
            <Wrench className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{maintenanceEquipment}</div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Stats by Model */}
      <EquipmentStats equipment={equipment} />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome, código ou modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            Todos
          </Button>
          <Button
            variant={statusFilter === "available" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("available")}
          >
            Disponíveis
          </Button>
          <Button
            variant={statusFilter === "reserved" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("reserved")}
          >
            Reservados
          </Button>
          <Button
            variant={statusFilter === "maintenance" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("maintenance")}
          >
            Manutenção
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={modelFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setModelFilter("all")}
          >
            Todos Modelos
          </Button>
          <Button
            variant={modelFilter === "CT50" ? "default" : "outline"}
            size="sm"
            onClick={() => setModelFilter("CT50")}
          >
            CT50
          </Button>
          <Button
            variant={modelFilter === "CT80" ? "default" : "outline"}
            size="sm"
            onClick={() => setModelFilter("CT80")}
          >
            CT80
          </Button>
          <Button
            variant={modelFilter === "CT90" ? "default" : "outline"}
            size="sm"
            onClick={() => setModelFilter("CT90")}
          >
            CT90
          </Button>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((equipment) => (
          <EquipmentCard key={equipment.id} equipment={equipment} />
        ))}
      </div>

      {/* Empty State */}
      {filteredEquipment.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum equipamento encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || statusFilter !== "all" || modelFilter !== "all"
                ? "Tente ajustar os filtros de busca" 
                : "Comece adicionando seu primeiro equipamento"}
            </p>
            {!searchTerm && statusFilter === "all" && modelFilter === "all" && (
              <Button onClick={() => openModal('equipmentForm')}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Equipamento
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Equipment Form Modal */}
      <EquipmentForm open={modals.equipmentForm} />
    </div>
  )
}