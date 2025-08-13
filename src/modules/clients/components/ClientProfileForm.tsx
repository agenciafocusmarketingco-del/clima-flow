import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/stores/appStore"
import { ClientSchema, type Client } from "@/domain/types"
import { 
  User, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  Settings, 
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  Plus,
  Edit
} from "lucide-react"

interface ClientProfileFormProps {
  open: boolean
}

type ClientFormData = Omit<Client, 'id'>

export function ClientProfileForm({ open }: ClientProfileFormProps) {
  const { addClient, updateClient, closeModal, editing, clearEditing, bookings, payments } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const form = useForm<ClientFormData>({
    resolver: zodResolver(ClientSchema.omit({ id: true })),
    defaultValues: {
      name: "",
      clientType: "person",
      company: "",
      email: "",
      phone: "",
      cellPhone: "",
      whatsapp: "",
      address: "",
      addressNumber: "",
      complement: "",
      neighborhood: "",
      zipCode: "",
      city: "",
      state: "",
      preferredEquipment: "",
      safetyMarginHours: 6,
      accessNotes: "",
      technicalNotes: "",
      isVip: false,
      preferredContact: "phone",
      communicationHistory: [],
      paymentStatus: "current",
      creditLimit: 0,
      paymentTerms: 0,
      status: "active",
      notes: "",
      tags: []
    }
  })

  const isEditing = !!editing.client
  const currentClient = editing.client

  // Get client's bookings and payments for history
  const clientBookings = currentClient ? bookings.filter(b => b.clientId === currentClient.id) : []
  const clientPayments = currentClient ? payments.filter(p => p.clientId === currentClient.id) : []

  // Populate form when editing
  useEffect(() => {
    if (editing.client) {
      const client = editing.client
      form.reset({
        name: client.name,
        clientType: client.clientType || "person",
        doc: client.doc || "",
        stateRegistration: client.stateRegistration || "",
        municipalRegistration: client.municipalRegistration || "",
        company: client.company || "",
        email: client.email || "",
        phone: client.phone || "",
        cellPhone: client.cellPhone || "",
        whatsapp: client.whatsapp || "",
        address: client.address || "",
        addressNumber: client.addressNumber || "",
        complement: client.complement || "",
        neighborhood: client.neighborhood || "",
        zipCode: client.zipCode || "",
        city: client.city || "",
        state: client.state || "",
        installationAddress: client.installationAddress || "",
        installationNumber: client.installationNumber || "",
        installationComplement: client.installationComplement || "",
        installationNeighborhood: client.installationNeighborhood || "",
        installationZipCode: client.installationZipCode || "",
        installationCity: client.installationCity || "",
        installationState: client.installationState || "",
        preferredEquipment: client.preferredEquipment || "",
        safetyMarginHours: client.safetyMarginHours || 6,
        accessNotes: client.accessNotes || "",
        technicalNotes: client.technicalNotes || "",
        isVip: client.isVip || false,
        preferredContact: client.preferredContact || "phone",
        communicationHistory: client.communicationHistory || [],
        nextFollowUp: client.nextFollowUp || "",
        paymentStatus: client.paymentStatus || "current",
        creditLimit: client.creditLimit || 0,
        paymentTerms: client.paymentTerms || 0,
        status: client.status,
        notes: client.notes || "",
        tags: client.tags || [],
        lastBooking: client.lastBooking,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt
      })
    } else if (open) {
      form.reset()
    }
  }, [editing.client, open, form])

  const onSubmit = async (data: ClientFormData) => {
    setIsLoading(true)
    try {
      const clientData = {
        ...data,
        updatedAt: new Date().toISOString()
      }

      if (isEditing && editing.client) {
        updateClient(editing.client.id, clientData)
        toast({
          title: "Cliente atualizado",
          description: "As informações do cliente foram atualizadas com sucesso."
        })
      } else {
        addClient({
          ...clientData,
          createdAt: new Date().toISOString()
        })
        toast({
          title: "Cliente criado",
          description: "O cliente foi adicionado com sucesso."
        })
      }
      handleClose()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o cliente.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    closeModal('clientForm')
    clearEditing('client')
    form.reset()
    setActiveTab("general")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-success" />
      case "inactive": return <XCircle className="h-4 w-4 text-muted-foreground" />
      default: return null
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit className="h-5 w-5" />
                Perfil do Cliente: {currentClient?.name}
              </>
            ) : (
              <>
                <User className="h-5 w-5" />
                Novo Cliente
              </>
            )}
            {currentClient?.isVip && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Star className="h-3 w-3 mr-1" />
                VIP
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Visualize e edite todas as informações do cliente." 
              : "Cadastre um novo cliente com informações completas."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="address" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Endereços
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              Preferências
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Financeiro
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Comunicação
            </TabsTrigger>
          </TabsList>

          <div className="max-h-[60vh] overflow-y-auto pr-2">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Aba Geral - Identificação */}
              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Identificação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientType">Tipo de Cliente</Label>
                        <Select
                          value={form.watch("clientType")}
                          onValueChange={(value: "person" | "company") => form.setValue("clientType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="person">Pessoa Física</SelectItem>
                            <SelectItem value="company">Pessoa Jurídica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={form.watch("status")}
                          onValueChange={(value: "active" | "inactive") => form.setValue("status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="inactive">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          {form.watch("clientType") === "company" ? "Razão Social" : "Nome Completo"} *
                        </Label>
                        <Input
                          id="name"
                          {...form.register("name")}
                        />
                        {form.formState.errors.name && (
                          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                      </div>

                      {form.watch("clientType") === "company" && (
                        <div className="space-y-2">
                          <Label htmlFor="company">Nome Fantasia</Label>
                          <Input
                            id="company"
                            {...form.register("company")}
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doc">
                          {form.watch("clientType") === "company" ? "CNPJ" : "CPF"}
                        </Label>
                        <Input
                          id="doc"
                          {...form.register("doc")}
                          placeholder={form.watch("clientType") === "company" ? "00.000.000/0000-00" : "000.000.000-00"}
                        />
                      </div>

                      {form.watch("clientType") === "company" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="stateRegistration">Inscrição Estadual</Label>
                            <Input
                              id="stateRegistration"
                              {...form.register("stateRegistration")}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="municipalRegistration">Inscrição Municipal</Label>
                            <Input
                              id="municipalRegistration"
                              {...form.register("municipalRegistration")}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isVip"
                        checked={form.watch("isVip")}
                        onCheckedChange={(checked) => form.setValue("isVip", checked)}
                      />
                      <Label htmlFor="isVip" className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Cliente VIP
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          {...form.register("email")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          {...form.register("phone")}
                          placeholder="(11) 3000-0000"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cellPhone">Celular</Label>
                        <Input
                          id="cellPhone"
                          {...form.register("cellPhone")}
                          placeholder="(11) 99999-9999"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <Input
                          id="whatsapp"
                          {...form.register("whatsapp")}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Aba Endereços */}
              <TabsContent value="address" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Endereço Principal
                    </CardTitle>
                    <CardDescription>Endereço de cobrança e correspondência</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="address">Logradouro</Label>
                        <Input
                          id="address"
                          {...form.register("address")}
                          placeholder="Rua, Avenida, etc."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="addressNumber">Número</Label>
                        <Input
                          id="addressNumber"
                          {...form.register("addressNumber")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input
                          id="complement"
                          {...form.register("complement")}
                          placeholder="Apto, Sala, etc."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input
                          id="neighborhood"
                          {...form.register("neighborhood")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode">CEP</Label>
                        <Input
                          id="zipCode"
                          {...form.register("zipCode")}
                          placeholder="00000-000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          {...form.register("city")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          {...form.register("state")}
                          placeholder="SP"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Endereço de Instalação
                    </CardTitle>
                    <CardDescription>Local onde os equipamentos serão instalados (se diferente do endereço principal)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="installationAddress">Logradouro</Label>
                        <Input
                          id="installationAddress"
                          {...form.register("installationAddress")}
                          placeholder="Rua, Avenida, etc."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="installationNumber">Número</Label>
                        <Input
                          id="installationNumber"
                          {...form.register("installationNumber")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="installationComplement">Complemento</Label>
                        <Input
                          id="installationComplement"
                          {...form.register("installationComplement")}
                          placeholder="Apto, Sala, etc."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="installationNeighborhood">Bairro</Label>
                        <Input
                          id="installationNeighborhood"
                          {...form.register("installationNeighborhood")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="installationZipCode">CEP</Label>
                        <Input
                          id="installationZipCode"
                          {...form.register("installationZipCode")}
                          placeholder="00000-000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="installationCity">Cidade</Label>
                        <Input
                          id="installationCity"
                          {...form.register("installationCity")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="installationState">Estado</Label>
                        <Input
                          id="installationState"
                          {...form.register("installationState")}
                          placeholder="SP"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Aba Preferências */}
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Preferências Técnicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferredEquipment">Equipamento Preferido</Label>
                        <Select
                          value={form.watch("preferredEquipment")}
                          onValueChange={(value) => form.setValue("preferredEquipment", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CT50">CT50 - 5 TR</SelectItem>
                            <SelectItem value="CT80">CT80 - 8 TR</SelectItem>
                            <SelectItem value="CT90">CT90 - 9 TR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="safetyMarginHours">Margem de Segurança (horas)</Label>
                        <Input
                          id="safetyMarginHours"
                          type="number"
                          min="0"
                          max="24"
                          {...form.register("safetyMarginHours", { valueAsNumber: true })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accessNotes">Notas de Acesso</Label>
                      <Textarea
                        id="accessNotes"
                        {...form.register("accessNotes")}
                        placeholder="Informações sobre portaria, chaves, horários de acesso, etc."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="technicalNotes">Notas Técnicas</Label>
                      <Textarea
                        id="technicalNotes"
                        {...form.register("technicalNotes")}
                        placeholder="Particularidades técnicas, restrições de instalação, etc."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Comunicação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferredContact">Canal Preferido</Label>
                      <Select
                        value={form.watch("preferredContact")}
                        onValueChange={(value: "phone" | "email" | "whatsapp") => form.setValue("preferredContact", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Telefone</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Observações Gerais</Label>
                      <Textarea
                        id="notes"
                        {...form.register("notes")}
                        placeholder="Observações internas sobre o cliente..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Aba Histórico */}
              <TabsContent value="history" className="space-y-6">
                {isEditing && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Histórico de Locações
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {clientBookings.length > 0 ? (
                          <div className="space-y-3">
                            {clientBookings.slice(0, 5).map((booking) => (
                              <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <p className="font-medium">{booking.site}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(booking.start).toLocaleDateString()} - {new Date(booking.end).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge variant={booking.status === "scheduled" ? "default" : "secondary"}>
                                  {booking.status}
                                </Badge>
                              </div>
                            ))}
                            {clientBookings.length > 5 && (
                              <p className="text-sm text-muted-foreground text-center">
                                +{clientBookings.length - 5} locações anteriores
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center py-8">
                            Nenhuma locação encontrada
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Histórico de Pagamentos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {clientPayments.length > 0 ? (
                          <div className="space-y-3">
                            {clientPayments.slice(0, 5).map((payment) => (
                              <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <p className="font-medium">R$ {payment.amount.toFixed(2)}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(payment.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge variant={payment.status === "paid" ? "default" : "destructive"}>
                                  {payment.status === "paid" ? "Pago" : "Pendente"}
                                </Badge>
                              </div>
                            ))}
                            {clientPayments.length > 5 && (
                              <p className="text-sm text-muted-foreground text-center">
                                +{clientPayments.length - 5} pagamentos anteriores
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center py-8">
                            Nenhum pagamento encontrado
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}

                {!isEditing && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        O histórico ficará disponível após o cliente ser criado
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Aba Financeiro */}
              <TabsContent value="financial" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Configurações Financeiras
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentStatus">Status de Pagamento</Label>
                        <Select
                          value={form.watch("paymentStatus")}
                          onValueChange={(value: "current" | "pending" | "overdue" | "recurrent") => form.setValue("paymentStatus", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="current">Em Dia</SelectItem>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="overdue">Em Atraso</SelectItem>
                            <SelectItem value="recurrent">Contrato Recorrente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentTerms">Prazo de Pagamento (dias)</Label>
                        <Input
                          id="paymentTerms"
                          type="number"
                          min="0"
                          {...form.register("paymentTerms", { valueAsNumber: true })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="creditLimit">Limite de Crédito (R$)</Label>
                      <Input
                        id="creditLimit"
                        type="number"
                        min="0"
                        step="0.01"
                        {...form.register("creditLimit", { valueAsNumber: true })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {isEditing && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumo Financeiro</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-success">
                            R$ {clientPayments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">Total Pago</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-destructive">
                            R$ {clientPayments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">Pendente</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            {clientBookings.length}
                          </p>
                          <p className="text-sm text-muted-foreground">Total Locações</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Aba Comunicação */}
              <TabsContent value="communication" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Próximo Follow-up
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nextFollowUp">Data do Próximo Contato</Label>
                      <Input
                        id="nextFollowUp"
                        type="date"
                        {...form.register("nextFollowUp")}
                      />
                    </div>
                  </CardContent>
                </Card>

                {isEditing && currentClient?.communicationHistory && currentClient.communicationHistory.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Histórico de Comunicação
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentClient.communicationHistory.slice(0, 5).map((comm) => (
                          <div key={comm.id} className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="mt-1">
                              {comm.type === "call" && <Phone className="h-4 w-4 text-blue-500" />}
                              {comm.type === "email" && <Mail className="h-4 w-4 text-green-500" />}
                              {comm.type === "whatsapp" && <MessageSquare className="h-4 w-4 text-green-600" />}
                              {comm.type === "visit" && <Building2 className="h-4 w-4 text-purple-500" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{comm.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(comm.date).toLocaleDateString()} - {comm.type}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Botões de ação */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading 
                    ? (isEditing ? "Atualizando..." : "Criando...") 
                    : (isEditing ? "Atualizar Cliente" : "Criar Cliente")}
                </Button>
              </div>
            </form>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}