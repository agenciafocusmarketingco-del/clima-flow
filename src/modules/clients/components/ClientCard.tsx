import { Edit, Mail, Phone, MapPin, Building, History } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/stores/appStore"
import { type Client } from "@/domain/types"

interface ClientCardProps {
  client: Client
}

export function ClientCard({ client }: ClientCardProps) {
  const { openModal, setEditing, bookings } = useAppStore()

  const handleEdit = () => {
    setEditing('client', client)
    openModal('clientForm')
  }

  const clientBookings = bookings.filter(booking => booking.clientId === client.id)
  const recentBookings = clientBookings
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
    .slice(0, 3)

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-success" : "bg-muted"
  }

  const getStatusText = (status: string) => {
    return status === "active" ? "Ativo" : "Inativo"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{client.name}</CardTitle>
            {client.company && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Building className="h-3 w-3 mr-1" />
                {client.company}
              </div>
            )}
          </div>
          <Badge 
            variant="secondary" 
            className={`${getStatusColor(client.status)} text-white`}
          >
            {getStatusText(client.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-2">
          {client.email && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="h-3 w-3 mr-2" />
              <span className="truncate">{client.email}</span>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="h-3 w-3 mr-2" />
              {client.phone}
            </div>
          )}
          {client.address && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-2" />
              <span className="truncate">{client.address}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {client.tags && client.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {client.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center text-sm font-medium">
              <History className="h-3 w-3 mr-1" />
              Locações Recentes
            </div>
            <div className="space-y-1">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="text-xs text-muted-foreground flex justify-between">
                  <span className="truncate">{booking.site}</span>
                  <span>{new Date(booking.start).toLocaleDateString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {client.notes && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            {client.notes}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleEdit} className="flex-1">
            <Edit className="h-3 w-3 mr-1" />
            Editar
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <History className="h-3 w-3 mr-1" />
            Histórico
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}