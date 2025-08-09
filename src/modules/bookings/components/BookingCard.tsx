import { Edit, Calendar, MapPin, Users, Clock, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/stores/appStore"
import { type Booking } from "@/domain/types"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface BookingCardProps {
  booking: Booking
}

export function BookingCard({ booking }: BookingCardProps) {
  const { clients, equipment, openModal, setEditing } = useAppStore()

  const handleEdit = () => {
    setEditing('booking', booking)
    openModal('bookingForm')
  }

  const client = clients.find(c => c.id === booking.clientId)
  const bookingEquipment = equipment.filter(eq => booking.equipmentIds.includes(eq.id))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-primary"
      case "installed": return "bg-success"
      case "returned": return "bg-muted"
      case "canceled": return "bg-destructive"
      default: return "bg-muted"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled": return "Agendado"
      case "installed": return "Instalado"
      case "returned": return "Retornado"
      case "canceled": return "Cancelado"
      default: return status
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{booking.site}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{client?.name || 'Cliente não encontrado'}</span>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className={`${getStatusColor(booking.status)} text-white`}
          >
            {getStatusText(booking.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">
                {format(new Date(booking.start), "dd/MM/yyyy", { locale: ptBR })}
              </div>
              <div className="text-muted-foreground">
                {format(new Date(booking.start), "HH:mm", { locale: ptBR })} - {format(new Date(booking.end), "HH:mm", { locale: ptBR })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{booking.days} dia(s)</div>
              <div className="text-muted-foreground">
                Margem: {booking.marginHours}h
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        {booking.address && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="text-muted-foreground">{booking.address}</span>
          </div>
        )}

        {/* Equipment */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>Equipamentos ({bookingEquipment.length})</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {bookingEquipment.map((eq) => (
              <Badge key={eq.id} variant="outline" className="text-xs">
                {eq.model}
              </Badge>
            ))}
          </div>
        </div>

        {/* Financial Info */}
        {booking.totalAmount && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span>Valor Total:</span>
              <span className="font-medium">R$ {booking.totalAmount.toLocaleString('pt-BR')}</span>
            </div>
            {booking.totalPerDay && (
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Por dia:</span>
                <span>R$ {booking.totalPerDay.toLocaleString('pt-BR')}</span>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            {booking.notes}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleEdit} className="flex-1">
            <Edit className="h-3 w-3 mr-1" />
            Editar
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}