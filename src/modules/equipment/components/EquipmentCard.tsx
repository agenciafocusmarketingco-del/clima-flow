import { Edit, Wrench, Calendar, Package, Zap, Volume2, Droplets } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/stores/appStore"
import { type Equipment } from "@/domain/types"

interface EquipmentCardProps {
  equipment: Equipment
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const { openModal, setEditing } = useAppStore()

  const handleEdit = () => {
    setEditing('equipment', equipment)
    openModal('equipmentForm')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-success"
      case "reserved": return "bg-warning"
      case "maintenance": return "bg-destructive"
      default: return "bg-muted"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available": return "Disponível"
      case "reserved": return "Reservado"
      case "maintenance": return "Manutenção"
      default: return status
    }
  }

  const availabilityPercentage = equipment.quantity.total > 0 
    ? (equipment.quantity.available / equipment.quantity.total) * 100 
    : 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{equipment.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{equipment.code}</Badge>
              <Badge variant="secondary">{equipment.model}</Badge>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className={`${getStatusColor(equipment.status)} text-white`}
          >
            {getStatusText(equipment.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Equipment Image */}
        {equipment.image && (
          <div className="aspect-video rounded-lg bg-muted overflow-hidden">
            <img 
              src={equipment.image} 
              alt={equipment.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}

        {/* Quantity Status */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Disponibilidade</span>
            <span className="text-sm text-muted-foreground">
              {equipment.quantity.available}/{equipment.quantity.total}
            </span>
          </div>
          <Progress value={availabilityPercentage} className="h-2" />
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium text-success">{equipment.quantity.available}</div>
              <div className="text-muted-foreground">Disponível</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-warning">{equipment.quantity.reserved}</div>
              <div className="text-muted-foreground">Reservado</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-destructive">{equipment.quantity.maintenance}</div>
              <div className="text-muted-foreground">Manutenção</div>
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Especificações</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Volume2 className="h-3 w-3 text-muted-foreground" />
              <span>{equipment.airflow_m3h.toLocaleString()} m³/h</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-muted-foreground" />
              <span>{equipment.motor_w}W</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="h-3 w-3 text-muted-foreground" />
              <span>{equipment.tank_l}L</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-3 w-3 text-muted-foreground" />
              <span>{equipment.dimensions_m.w}×{equipment.dimensions_m.d}×{equipment.dimensions_m.h}m</span>
            </div>
          </div>
        </div>

        {/* Last Maintenance */}
        {equipment.lastMaintenance && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Última manutenção: {new Date(equipment.lastMaintenance).toLocaleDateString('pt-BR')}</span>
          </div>
        )}

        {/* Notes */}
        {equipment.notes && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            {equipment.notes}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleEdit} className="flex-1">
            <Edit className="h-3 w-3 mr-1" />
            Editar
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Wrench className="h-3 w-3 mr-1" />
            Manutenção
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}