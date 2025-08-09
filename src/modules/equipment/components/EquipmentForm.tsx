import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/stores/appStore"
import { EquipmentSchema, EQUIPMENT_SPECS, type Equipment, type EquipmentModel } from "@/domain/types"

interface EquipmentFormProps {
  open: boolean
}

type EquipmentFormData = Omit<Equipment, 'id'>

export function EquipmentForm({ open }: EquipmentFormProps) {
  const { addEquipment, updateEquipment, closeModal, editing, clearEditing } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(EquipmentSchema.omit({ id: true })),
    defaultValues: {
      code: "",
      model: "CT50",
      name: "",
      status: "available",
      airflow_m3h: 0,
      motor_w: 0,
      voltage: "220v",
      frequency_hz: 60,
      noise_db: 0,
      tank_l: 0,
      dimensions_m: { w: 0, d: 0, h: 0 },
      quantity: { total: 1, available: 1, reserved: 0, maintenance: 0 },
      notes: ""
    }
  })

  const isEditing = !!editing.equipment
  const selectedModel = form.watch("model")

  // Auto-populate specs when model changes
  useEffect(() => {
    if (selectedModel && EQUIPMENT_SPECS[selectedModel]) {
      const specs = EQUIPMENT_SPECS[selectedModel]
      form.setValue("airflow_m3h", specs.airflow_m3h)
      form.setValue("motor_w", specs.motor_w)
      form.setValue("noise_db", specs.noise_db)
      form.setValue("tank_l", specs.tank_l)
      form.setValue("water_lph", specs.water_lph)
      form.setValue("dimensions_m", specs.dimensions_m)
      
      if (!isEditing) {
        form.setValue("name", `${selectedModel} - Climatizador Evaporativo`)
      }
    }
  }, [selectedModel, form, isEditing])

  // Populate form when editing
  useEffect(() => {
    if (editing.equipment) {
      form.reset(editing.equipment)
    } else if (open) {
      form.reset({
        code: "",
        model: "CT50",
        name: "",
        status: "available",
        airflow_m3h: 0,
        motor_w: 0,
        voltage: "220v",
        frequency_hz: 60,
        noise_db: 0,
        tank_l: 0,
        dimensions_m: { w: 0, d: 0, h: 0 },
        quantity: { total: 1, available: 1, reserved: 0, maintenance: 0 },
        notes: ""
      })
    }
  }, [editing.equipment, open, form])

  const onSubmit = async (data: EquipmentFormData) => {
    setIsLoading(true)
    try {
      if (isEditing && editing.equipment) {
        updateEquipment(editing.equipment.id, data)
        toast({
          title: "Equipamento atualizado",
          description: "As informações do equipamento foram atualizadas com sucesso."
        })
      } else {
        addEquipment(data)
        toast({
          title: "Equipamento criado",
          description: "O equipamento foi adicionado com sucesso."
        })
      }
      handleClose()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o equipamento.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    closeModal('equipmentForm')
    clearEditing('equipment')
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Equipamento" : "Novo Equipamento"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize as informações do equipamento." 
              : "Adicione um novo equipamento ao estoque."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Básicas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  {...form.register("code")}
                  placeholder="CT50-001"
                />
                {form.formState.errors.code && (
                  <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Modelo *</Label>
                <Select
                  value={form.watch("model")}
                  onValueChange={(value: EquipmentModel) => form.setValue("model", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CT50">CT50</SelectItem>
                    <SelectItem value="CT80">CT80</SelectItem>
                    <SelectItem value="CT90">CT90</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="CT50 - Climatizador Evaporativo"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value: "available" | "reserved" | "maintenance") => form.setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="reserved">Reservado</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Especificações Técnicas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="airflow">Vazão de Ar (m³/h)</Label>
                <Input
                  id="airflow"
                  type="number"
                  {...form.register("airflow_m3h", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motor">Motor (W)</Label>
                <Input
                  id="motor"
                  type="number"
                  {...form.register("motor_w", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="noise">Ruído (dB)</Label>
                <Input
                  id="noise"
                  type="number"
                  {...form.register("noise_db", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tank">Reservatório (L)</Label>
                <Input
                  id="tank"
                  type="number"
                  {...form.register("tank_l", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="water">Consumo de Água (L/h)</Label>
              <Input
                id="water"
                type="number"
                {...form.register("water_lph", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>Dimensões (metros)</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Largura"
                  type="number"
                  step="0.01"
                  {...form.register("dimensions_m.w", { valueAsNumber: true })}
                />
                <Input
                  placeholder="Profundidade"
                  type="number"
                  step="0.01"
                  {...form.register("dimensions_m.d", { valueAsNumber: true })}
                />
                <Input
                  placeholder="Altura"
                  type="number"
                  step="0.01"
                  {...form.register("dimensions_m.h", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          {/* Quantity Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Controle de Quantidade</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total">Total de Unidades</Label>
                <Input
                  id="total"
                  type="number"
                  {...form.register("quantity.total", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="available">Disponíveis</Label>
                <Input
                  id="available"
                  type="number"
                  {...form.register("quantity.available", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reserved">Reservadas</Label>
                <Input
                  id="reserved"
                  type="number"
                  {...form.register("quantity.reserved", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance">Em Manutenção</Label>
                <Input
                  id="maintenance"
                  type="number"
                  {...form.register("quantity.maintenance", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lastMaintenance">Última Manutenção</Label>
              <Input
                id="lastMaintenance"
                type="date"
                {...form.register("lastMaintenance")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                {...form.register("notes")}
                rows={3}
                placeholder="Observações sobre o equipamento..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
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
                : (isEditing ? "Atualizar" : "Criar")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}