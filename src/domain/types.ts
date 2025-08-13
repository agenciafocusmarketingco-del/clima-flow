// Core Domain Types for Climatize CRM+ERP
import { z } from 'zod'

// Equipment Types
export type EquipmentStatus = "available" | "reserved" | "maintenance"
export type EquipmentModel = "CT50" | "CT80" | "CT90"

export const EquipmentSchema = z.object({
  id: z.string(),
  code: z.string(),
  model: z.enum(["CT50", "CT80", "CT90"]),
  name: z.string(),
  status: z.enum(["available", "reserved", "maintenance"]),
  image: z.string().optional(),
  airflow_m3h: z.number(),
  motor_w: z.number(),
  voltage: z.literal("220v"),
  frequency_hz: z.literal(60),
  noise_db: z.number(),
  tank_l: z.number(),
  water_lph: z.number().optional(),
  dimensions_m: z.object({
    w: z.number(),
    d: z.number(),
    h: z.number()
  }),
  notes: z.string().optional(),
  quantity: z.object({
    total: z.number(),
    available: z.number(),
    reserved: z.number(),
    maintenance: z.number()
  }),
  lastMaintenance: z.string().optional()
})

export type Equipment = z.infer<typeof EquipmentSchema>

// Client Types
export const ClientSchema = z.object({
  id: z.string(),
  // Identificação
  name: z.string(),
  clientType: z.enum(["person", "company"]).default("person"),
  doc: z.string().optional(), // CPF/CNPJ
  stateRegistration: z.string().optional(),
  municipalRegistration: z.string().optional(),
  company: z.string().optional(),
  
  // Contato
  email: z.string().email().optional(),
  phone: z.string().optional(),
  cellPhone: z.string().optional(),
  whatsapp: z.string().optional(),
  
  // Endereços
  address: z.string().optional(),
  addressNumber: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  
  // Endereço de instalação (se diferente)
  installationAddress: z.string().optional(),
  installationNumber: z.string().optional(),
  installationComplement: z.string().optional(),
  installationNeighborhood: z.string().optional(),
  installationZipCode: z.string().optional(),
  installationCity: z.string().optional(),
  installationState: z.string().optional(),
  
  // Preferências e peculiaridades
  preferredEquipment: z.string().optional(),
  safetyMarginHours: z.number().default(6),
  accessNotes: z.string().optional(),
  technicalNotes: z.string().optional(),
  isVip: z.boolean().default(false),
  
  // Comunicação
  preferredContact: z.enum(["phone", "email", "whatsapp"]).default("phone"),
  communicationHistory: z.array(z.object({
    id: z.string(),
    date: z.string(),
    type: z.enum(["call", "email", "whatsapp", "visit"]),
    description: z.string(),
    userId: z.string().optional()
  })).default([]),
  nextFollowUp: z.string().optional(),
  
  // Financeiro
  paymentStatus: z.enum(["current", "pending", "overdue", "recurrent"]).default("current"),
  creditLimit: z.number().optional(),
  paymentTerms: z.number().default(0), // dias para pagamento
  
  // Sistema
  status: z.enum(["active", "inactive"]).default("active"),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
  lastBooking: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

export type Client = z.infer<typeof ClientSchema>

// Booking Types
export type BookingStatus = "scheduled" | "installed" | "returned" | "canceled"

export const BookingSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  equipmentIds: z.array(z.string()),
  site: z.string(),
  start: z.string(), // ISO date string
  end: z.string(),   // ISO date string
  marginHours: z.number().min(6).max(8).default(6),
  status: z.enum(["scheduled", "installed", "returned", "canceled"]),
  totalPerDay: z.number().optional(),
  days: z.number().optional(),
  totalAmount: z.number().optional(),
  address: z.string(),
  notes: z.string().optional(),
  // Calculated fields for availability checking
  holdStart: z.string().optional(), // start - marginHours
  holdEnd: z.string().optional()    // end + marginHours
})

export type Booking = z.infer<typeof BookingSchema>

// Payment Types
export type PaymentMethod = "pix" | "boleto" | "transfer" | "cash"
export type PaymentStatus = "paid" | "pending" | "overdue"

export const PaymentSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  bookingId: z.string().optional(),
  date: z.string(),
  amount: z.number(),
  method: z.enum(["pix", "boleto", "transfer", "cash"]),
  status: z.enum(["paid", "pending", "overdue"]),
  dueDate: z.string().optional(),
  notes: z.string().optional()
})

export type Payment = z.infer<typeof PaymentSchema>

// Quote Types
export const QuoteSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  bookingId: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  items: z.array(z.object({
    equipmentId: z.string(),
    quantity: z.number(),
    days: z.number(),
    dailyRate: z.number(),
    total: z.number()
  })),
  subtotal: z.number(),
  discount: z.number().default(0),
  taxes: z.number().default(0),
  total: z.number(),
  validUntil: z.string(),
  status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]),
  conditions: z.string().optional(),
  paymentTerms: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type Quote = z.infer<typeof QuoteSchema>

// User Types (for future auth)
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["admin", "client"]),
  clientId: z.string().optional(), // for client users
  avatar: z.string().optional(),
  isActive: z.boolean().default(true)
})

export type User = z.infer<typeof UserSchema>

// Equipment technical specifications
export const EQUIPMENT_SPECS: Record<EquipmentModel, Omit<Equipment, 'id' | 'code' | 'name' | 'status' | 'quantity' | 'notes' | 'image' | 'lastMaintenance'>> = {
  CT50: {
    model: "CT50",
    airflow_m3h: 10000,
    motor_w: 380,
    voltage: "220v",
    frequency_hz: 60,
    noise_db: 60,
    tank_l: 100,
    water_lph: 8,
    dimensions_m: { w: 1.30, d: 0.80, h: 0.53 }
  },
  CT80: {
    model: "CT80",
    airflow_m3h: 16000,
    motor_w: 510,
    voltage: "220v",
    frequency_hz: 60,
    noise_db: 60,
    tank_l: 80,
    dimensions_m: { w: 1.96, d: 0.69, h: 0.43 }
  },
  CT90: {
    model: "CT90",
    airflow_m3h: 20000,
    motor_w: 750,
    voltage: "220v",
    frequency_hz: 60,
    noise_db: 68,
    tank_l: 150,
    dimensions_m: { w: 1.52, d: 0.92, h: 0.85 }
  }
}