import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ChevronLeft, ChevronRight, Users, Package, Calendar, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/stores/appStore"
import { BookingSchema, type Booking } from "@/domain/types"
import { addHours, format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface BookingFormProps {
  open: boolean
}

type BookingFormData = Omit<Booking, 'id' | 'holdStart' | 'holdEnd'>

const STEPS = [
  { id: 1, title: "Cliente", icon: Users },
  { id: 2, title: "Equipamentos", icon: Package },
  { id: 3, title: "Datas & Margem", icon: Calendar }
]

export function BookingForm({ open }: BookingFormProps) {
  const { 
    clients, 
    equipment, 
    addBooking, 
    updateBooking, 
    closeModal, 
    editing, 
    clearEditing,
    checkEquipmentAvailability 
  } = useAppStore()
  
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [conflicts, setConflicts] = useState<Booking[]>([])

  const form = useForm<BookingFormData>({
    resolver: zodResolver(BookingSchema.omit({ id: true, holdStart: true, holdEnd: true })),
    defaultValues: {
      clientId: "",
      equipmentIds: [],
      site: "",
      start: "",
      end: "",
      marginHours: 6,
      status: "scheduled",
      address: "",
      notes: "",
      totalPerDay: 0,
      days: 1,
      totalAmount: 0
    }
  })

  const isEditing = !!editing.booking
  const selectedClient = clients.find(c => c.id === form.watch("clientId"))
  const selectedEquipment = equipment.filter(eq => form.watch("equipmentIds").includes(eq.id))

  // Calculate days and total when dates change
  useEffect(() => {
    const start = form.watch("start")
    const end = form.watch("end")
    const totalPerDay = form.watch("totalPerDay")

    if (start && end) {
      const startDate = new Date(start)
      const endDate = new Date(end)
      const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
      
      form.setValue("days", days)
      form.setValue("totalAmount", days * totalPerDay)
    }
  }, [form.watch("start"), form.watch("end"), form.watch("totalPerDay")])

  // Check for conflicts when dates, equipment or margin change
  useEffect(() => {
    const equipmentIds = form.watch("equipmentIds")
    const start = form.watch("start")
    const end = form.watch("end")
    const marginHours = form.watch("marginHours")

    if (equipmentIds.length > 0 && start && end) {
      const { available, conflicts: foundConflicts } = checkEquipmentAvailability(
        equipmentIds,
        start,
        end,
        marginHours,
        editing.booking?.id
      )
      
      setConflicts(foundConflicts)
    }
  }, [form.watch("equipmentIds"), form.watch("start"), form.watch("end"), form.watch("marginHours")])

  // Populate form when editing
  useEffect(() => {
    if (editing.booking) {
      form.reset(editing.booking)
      setCurrentStep(3) // Go to last step when editing
    } else if (open) {
      form.reset({
        clientId: "",
        equipmentIds: [],
        site: "",
        start: "",
        end: "",
        marginHours: 6,
        status: "scheduled",
        address: "",
        notes: "",
        totalPerDay: 0,
        days: 1,
        totalAmount: 0
      })
      setCurrentStep(1)
      setConflicts([])
    }
  }, [editing.booking, open, form])

  const onSubmit = async (data: BookingFormData) => {
    if (conflicts.length > 0 && !isEditing) {
      toast({
        title: "Conflito de disponibilidade",
        description: "Existem conflitos com outras locações. Verifique os equipamentos e datas.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      if (isEditing && editing.booking) {
        updateBooking(editing.booking.id, data)
        toast({
          title: "Locação atualizada",
          description: "A locação foi atualizada com sucesso."
        })
      } else {
        addBooking(data)
        toast({
          title: "Locação criada",
          description: "A locação foi agendada com sucesso."
        })
      }
      handleClose()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a locação.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    closeModal('bookingForm')
    clearEditing('booking')
    setCurrentStep(1)
    setConflicts([])
    form.reset()
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedFromStep1 = form.watch("clientId") !== ""
  const canProceedFromStep2 = form.watch("equipmentIds").length > 0
  const canSubmit = form.watch("start") && form.watch("end") && form.watch("site")

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Locação" : "Nova Locação"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize as informações da locação." 
              : "Crie uma nova locação em 3 passos simples."}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        {!isEditing && (
          <div className="flex items-center justify-between mb-6">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : isCompleted 
                        ? 'border-success bg-success text-white'
                        : 'border-muted bg-background'
                  }`}>
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <div className="ml-2 text-sm font-medium">
                    {step.title}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`mx-4 h-px flex-1 ${
                      isCompleted ? 'bg-success' : 'bg-muted'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Client Selection */}
          {(currentStep === 1 || isEditing) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">1. Selecionar Cliente</h3>
              
              <div className="space-y-2">
                <Label htmlFor="clientId">Cliente *</Label>
                <Select
                  value={form.watch("clientId")}
                  onValueChange={(value) => form.setValue("clientId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.filter(c => c.status === 'active').map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          {client.company && (
                            <div className="text-sm text-muted-foreground">{client.company}</div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedClient && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">{selectedClient.name}</h4>
                      {selectedClient.company && (
                        <p className="text-sm text-muted-foreground">{selectedClient.company}</p>
                      )}
                      {selectedClient.phone && (
                        <p className="text-sm">{selectedClient.phone}</p>
                      )}
                      {selectedClient.email && (
                        <p className="text-sm">{selectedClient.email}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 2: Equipment Selection */}
          {(currentStep === 2 || isEditing) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">2. Selecionar Equipamentos</h3>
              
              <div className="grid gap-4">
                {equipment.filter(eq => eq.quantity.available > 0).map((eq) => {
                  const isSelected = form.watch("equipmentIds").includes(eq.id)
                  
                  return (
                    <Card 
                      key={eq.id} 
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => {
                        const currentIds = form.watch("equipmentIds")
                        const newIds = isSelected 
                          ? currentIds.filter(id => id !== eq.id)
                          : [...currentIds, eq.id]
                        form.setValue("equipmentIds", newIds)
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{eq.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {eq.airflow_m3h.toLocaleString()} m³/h • {eq.motor_w}W
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {eq.quantity.available} disponíveis
                            </p>
                          </div>
                          <Badge variant={isSelected ? "default" : "outline"}>
                            {isSelected ? "Selecionado" : "Selecionar"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {selectedEquipment.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Equipamentos Selecionados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedEquipment.map((eq) => (
                        <div key={eq.id} className="flex justify-between items-center">
                          <span className="text-sm">{eq.name}</span>
                          <Badge variant="outline">{eq.model}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Dates, Margin & Details */}
          {(currentStep === 3 || isEditing) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">3. Datas e Detalhes</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Data/Hora de Início *</Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    {...form.register("start")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end">Data/Hora de Fim *</Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    {...form.register("end")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="marginHours">Margem de Segurança (horas)</Label>
                <Select
                  value={form.watch("marginHours").toString()}
                  onValueChange={(value) => form.setValue("marginHours", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 horas</SelectItem>
                    <SelectItem value="7">7 horas</SelectItem>
                    <SelectItem value="8">8 horas</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Tempo adicional antes e depois do evento para instalação/retirada
                </p>
              </div>

              {/* Show calculated hold times */}
              {form.watch("start") && form.watch("end") && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Período de Bloqueio dos Equipamentos:</span>
                      </div>
                      <div className="text-sm text-muted-foreground ml-6">
                        <p>
                          Início: {format(
                            addHours(new Date(form.watch("start")), -form.watch("marginHours")), 
                            "dd/MM/yyyy 'às' HH:mm", 
                            { locale: ptBR }
                          )}
                        </p>
                        <p>
                          Fim: {format(
                            addHours(new Date(form.watch("end")), form.watch("marginHours")), 
                            "dd/MM/yyyy 'às' HH:mm", 
                            { locale: ptBR }
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Conflict Warning */}
              {conflicts.length > 0 && (
                <Card className="border-destructive">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">
                        Conflito de Disponibilidade
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Os seguintes equipamentos não estão disponíveis no período selecionado:
                    </p>
                    <div className="space-y-1">
                      {conflicts.map((conflict) => (
                        <div key={conflict.id} className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                          {conflict.site} - {format(new Date(conflict.start), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="site">Local do Evento *</Label>
                <Input
                  id="site"
                  {...form.register("site")}
                  placeholder="Ex: Centro de Convenções Anhembi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <Textarea
                  id="address"
                  {...form.register("address")}
                  rows={2}
                  placeholder="Endereço completo para instalação..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalPerDay">Valor por Dia (R$)</Label>
                  <Input
                    id="totalPerDay"
                    type="number"
                    step="0.01"
                    {...form.register("totalPerDay", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="days">Dias</Label>
                  <Input
                    id="days"
                    type="number"
                    {...form.register("days", { valueAsNumber: true })}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Valor Total (R$)</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    {...form.register("totalAmount", { valueAsNumber: true })}
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  {...form.register("notes")}
                  rows={3}
                  placeholder="Observações sobre a locação..."
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <div>
              {!isEditing && currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
              )}
            </div>

            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>

              {!isEditing && currentStep < STEPS.length ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !canProceedFromStep1) ||
                    (currentStep === 2 && !canProceedFromStep2)
                  }
                >
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isLoading || !canSubmit || (conflicts.length > 0 && !isEditing)}
                >
                  {isLoading 
                    ? (isEditing ? "Atualizando..." : "Criando...") 
                    : (isEditing ? "Atualizar" : "Criar Locação")}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}