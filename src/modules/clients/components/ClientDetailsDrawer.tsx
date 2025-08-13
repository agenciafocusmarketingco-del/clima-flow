import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useAppStore } from "@/stores/appStore"
import { type Client } from "@/domain/types"
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  MessageSquare,
  Star,
  Building2,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Eye
} from "lucide-react"

interface ClientDetailsDrawerProps {
  client: Client
  children: React.ReactNode
}

export function ClientDetailsDrawer({ client, children }: ClientDetailsDrawerProps) {
  const { bookings, payments, setEditing, openModal } = useAppStore()
  const [open, setOpen] = useState(false)

  // Get client's bookings and payments
  const clientBookings = bookings.filter(b => b.clientId === client.id)
  const clientPayments = payments.filter(p => p.clientId === client.id)
  
  // Calculate stats
  const totalPaid = clientPayments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const totalPending = clientPayments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)
  const activeBookings = clientBookings.filter(b => b.status === "scheduled").length

  const handleEdit = () => {
    setEditing('client', client)
    openModal('clientForm')
    setOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-success"
      case "inactive": return "text-muted-foreground"
      default: return "text-muted-foreground"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "current": return "text-success"
      case "pending": return "text-warning"
      case "overdue": return "text-destructive"
      case "recurrent": return "text-primary"
      default: return "text-muted-foreground"
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="flex items-center gap-2">
                  {client.name}
                  {client.isVip && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      VIP
                    </Badge>
                  )}
                </SheetTitle>
                <SheetDescription className="flex items-center gap-2">
                  <span className={getStatusColor(client.status)}>
                    {client.status === "active" ? "Ativo" : "Inativo"}
                  </span>
                  {client.company && (
                    <>
                      <span>•</span>
                      <span>{client.company}</span>
                    </>
                  )}
                </SheetDescription>
              </div>
            </div>
            <Button onClick={handleEdit} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="text-2xl font-bold">{activeBookings}</div>
                <div className="text-xs text-muted-foreground">Locações Ativas</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div className="text-2xl font-bold text-success">R$ {totalPaid.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Total Pago</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                </div>
                <div className="text-2xl font-bold text-warning">R$ {totalPending.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Pendente</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="bookings">Locações</TabsTrigger>
              <TabsTrigger value="payments">Pagamentos</TabsTrigger>
              <TabsTrigger value="preferences">Preferências</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{client.phone}</span>
                    </div>
                  )}
                  {client.cellPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{client.cellPhone}</span>
                      <Badge variant="outline" className="text-xs">Celular</Badge>
                    </div>
                  )}
                  {client.whatsapp && (
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{client.whatsapp}</span>
                    </div>
                  )}
                  {client.preferredContact && (
                    <div className="pt-2 border-t">
                      <span className="text-xs text-muted-foreground">Canal preferido:</span>
                      <span className="ml-2 text-sm font-medium">
                        {client.preferredContact === "phone" && "Telefone"}
                        {client.preferredContact === "email" && "E-mail"}
                        {client.preferredContact === "whatsapp" && "WhatsApp"}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {client.address ? (
                    <div className="space-y-2">
                      <p className="text-sm">
                        {client.address}
                        {client.addressNumber && `, ${client.addressNumber}`}
                        {client.complement && `, ${client.complement}`}
                      </p>
                      {(client.neighborhood || client.city) && (
                        <p className="text-sm text-muted-foreground">
                          {client.neighborhood && `${client.neighborhood}, `}
                          {client.city && `${client.city}`}
                          {client.state && ` - ${client.state}`}
                        </p>
                      )}
                      {client.zipCode && (
                        <p className="text-sm text-muted-foreground">CEP: {client.zipCode}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Não informado</p>
                  )}
                </CardContent>
              </Card>

              {client.installationAddress && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Endereço de Instalação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        {client.installationAddress}
                        {client.installationNumber && `, ${client.installationNumber}`}
                        {client.installationComplement && `, ${client.installationComplement}`}
                      </p>
                      {(client.installationNeighborhood || client.installationCity) && (
                        <p className="text-sm text-muted-foreground">
                          {client.installationNeighborhood && `${client.installationNeighborhood}, `}
                          {client.installationCity && `${client.installationCity}`}
                          {client.installationState && ` - ${client.installationState}`}
                        </p>
                      )}
                      {client.installationZipCode && (
                        <p className="text-sm text-muted-foreground">CEP: {client.installationZipCode}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {(client.doc || client.stateRegistration || client.municipalRegistration) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Documentos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {client.doc && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {client.clientType === "company" ? "CNPJ:" : "CPF:"}
                        </span>
                        <span className="text-sm">{client.doc}</span>
                      </div>
                    )}
                    {client.stateRegistration && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Insc. Estadual:</span>
                        <span className="text-sm">{client.stateRegistration}</span>
                      </div>
                    )}
                    {client.municipalRegistration && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Insc. Municipal:</span>
                        <span className="text-sm">{client.municipalRegistration}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="bookings" className="space-y-4">
              {clientBookings.length > 0 ? (
                clientBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{booking.site}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.start).toLocaleDateString()} - {new Date(booking.end).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.equipmentIds.length} equipamento(s)
                          </p>
                        </div>
                        <div className="text-right">
                        <Badge variant={booking.status === "scheduled" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                          {booking.totalAmount && (
                            <p className="text-sm font-medium mt-1">R$ {booking.totalAmount.toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Nenhuma locação encontrada</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              {clientPayments.length > 0 ? (
                clientPayments.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">R$ {payment.amount.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payment.method}
                          </p>
                        </div>
                        <Badge variant={payment.status === "paid" ? "default" : "destructive"}>
                          {payment.status === "paid" ? "Pago" : "Pendente"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Nenhum pagamento encontrado</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Preferências Técnicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {client.preferredEquipment && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Equipamento preferido:</span>
                      <span className="text-sm font-medium">{client.preferredEquipment}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Margem de segurança:</span>
                    <span className="text-sm font-medium">{client.safetyMarginHours || 6}h</span>
                  </div>
                  {client.accessNotes && (
                    <div>
                      <span className="text-sm text-muted-foreground">Notas de acesso:</span>
                      <p className="text-sm mt-1">{client.accessNotes}</p>
                    </div>
                  )}
                  {client.technicalNotes && (
                    <div>
                      <span className="text-sm text-muted-foreground">Notas técnicas:</span>
                      <p className="text-sm mt-1">{client.technicalNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Configurações Financeiras</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className={`text-sm font-medium ${getPaymentStatusColor(client.paymentStatus || "current")}`}>
                      {client.paymentStatus === "current" && "Em Dia"}
                      {client.paymentStatus === "pending" && "Pendente"}
                      {client.paymentStatus === "overdue" && "Em Atraso"}
                      {client.paymentStatus === "recurrent" && "Contrato Recorrente"}
                    </span>
                  </div>
                  {client.creditLimit && client.creditLimit > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Limite de crédito:</span>
                      <span className="text-sm font-medium">R$ {client.creditLimit.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Prazo de pagamento:</span>
                    <span className="text-sm font-medium">{client.paymentTerms || 0} dias</span>
                  </div>
                </CardContent>
              </Card>

              {client.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{client.notes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}