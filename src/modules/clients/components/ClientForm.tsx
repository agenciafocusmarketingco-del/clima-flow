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
import { ClientSchema, type Client } from "@/domain/types"

interface ClientFormProps {
  open: boolean
}

type ClientFormData = Omit<Client, 'id'>

export function ClientForm({ open }: ClientFormProps) {
  const { addClient, updateClient, closeModal, editing, clearEditing } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ClientFormData>({
    resolver: zodResolver(ClientSchema.omit({ id: true })),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      status: "active",
      notes: "",
      tags: []
    }
  })

  const isEditing = !!editing.client

  // Populate form when editing
  useEffect(() => {
    if (editing.client) {
      form.reset({
        name: editing.client.name,
        company: editing.client.company || "",
        email: editing.client.email || "",
        phone: editing.client.phone || "",
        address: editing.client.address || "",
        status: editing.client.status,
        notes: editing.client.notes || "",
        tags: editing.client.tags || [],
        doc: editing.client.doc || "",
        lastBooking: editing.client.lastBooking
      })
    } else if (open) {
      form.reset({
        name: "",
        company: "",
        email: "",
        phone: "",
        address: "",
        status: "active",
        notes: "",
        tags: []
      })
    }
  }, [editing.client, open, form])

  const onSubmit = async (data: ClientFormData) => {
    setIsLoading(true)
    try {
      if (isEditing && editing.client) {
        updateClient(editing.client.id, data)
        toast({
          title: "Cliente atualizado",
          description: "As informações do cliente foram atualizadas com sucesso."
        })
      } else {
        addClient(data)
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
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize as informações do cliente." 
              : "Adicione um novo cliente ao sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                {...form.register("company")}
              />
              {form.formState.errors.company && (
                <p className="text-sm text-destructive">{form.formState.errors.company.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                {...form.register("phone")}
                placeholder="(11) 99999-9999"
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doc">CPF/CNPJ</Label>
              <Input
                id="doc"
                {...form.register("doc")}
              />
              {form.formState.errors.doc && (
                <p className="text-sm text-destructive">{form.formState.errors.doc.message}</p>
              )}
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

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              {...form.register("address")}
            />
            {form.formState.errors.address && (
              <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              rows={3}
              placeholder="Observações internas sobre o cliente..."
            />
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