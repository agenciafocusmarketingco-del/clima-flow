import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/stores/appStore"
import { type Client } from "@/domain/types"
import { ClientDetailsDrawer } from "./ClientDetailsDrawer"
import { User, Building2, Mail, Phone, Edit, Trash2, Eye, Star } from "lucide-react"

interface ClientCardProps {
  client: Client
}

export function ClientCard({ client }: ClientCardProps) {
  const { openModal, setEditing, deleteClient } = useAppStore()

  const handleEdit = () => {
    setEditing('client', client)
    openModal('clientForm')
  }

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteClient(client.id)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {client.company ? (
                <Building2 className="h-4 w-4 text-primary" />
              ) : (
                <User className="h-4 w-4 text-primary" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {client.name}
                {client.isVip && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    VIP
                  </Badge>
                )}
              </CardTitle>
              {client.company && (
                <p className="text-sm text-muted-foreground">{client.company}</p>
              )}
            </div>
          </div>
          <Badge variant={client.status === "active" ? "default" : "secondary"}>
            {client.status === "active" ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          {client.email && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{client.email}</span>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{client.phone}</span>
            </div>
          )}
          {client.cellPhone && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{client.cellPhone}</span>
              <Badge variant="outline" className="text-xs">Celular</Badge>
            </div>
          )}
        </div>

        {client.tags && client.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {client.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <ClientDetailsDrawer client={client}>
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Ver Perfil
            </Button>
          </ClientDetailsDrawer>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}