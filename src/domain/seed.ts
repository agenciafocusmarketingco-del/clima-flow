// Seed data for development and demo
import { Client, Equipment, Booking, Payment, Quote } from './types'
import { addHours, format } from 'date-fns'

export const seedClients: Client[] = [
  {
    id: "client-1",
    name: "João Silva",
    company: "Silva Eventos",
    email: "joao@silvaeventos.com",
    phone: "(11) 99999-9999",
    address: "Rua das Flores, 123 - São Paulo/SP",
    status: "active",
    lastBooking: "2024-01-15",
    notes: "Cliente VIP, sempre pontual nos pagamentos"
  },
  {
    id: "client-2", 
    name: "Maria Santos",
    company: "Santos Construções",
    email: "maria@santosconstrucoes.com",
    phone: "(11) 88888-8888",
    address: "Av. Paulista, 1000 - São Paulo/SP",
    status: "active",
    lastBooking: "2024-01-10",
    tags: ["corporativo", "grandes-eventos"]
  },
  {
    id: "client-3",
    name: "Pedro Costa",
    company: "Costa Festas",
    email: "pedro@costafestas.com",
    phone: "(11) 77777-7777",
    address: "Rua Augusta, 500 - São Paulo/SP",
    status: "inactive",
    lastBooking: "2023-12-05",
    notes: "Verificar pendências financeiras"
  }
]

export const seedEquipment: Equipment[] = [
  {
    id: "eq-ct50-001",
    code: "CT50-001",
    model: "CT50",
    name: "CT50 - Climatizador Evaporativo",
    status: "available",
    image: "/equipments/CT50.jpg",
    airflow_m3h: 10000,
    motor_w: 380,
    voltage: "220v",
    frequency_hz: 60,
    noise_db: 60,
    tank_l: 100,
    water_lph: 8,
    dimensions_m: { w: 1.30, d: 0.80, h: 0.53 },
    quantity: {
      total: 15,
      available: 12,
      reserved: 3,
      maintenance: 0
    },
    lastMaintenance: "2024-01-10",
    notes: "Unidade com melhor eficiência energética"
  },
  {
    id: "eq-ct80-001", 
    code: "CT80-001",
    model: "CT80",
    name: "CT80 - Climatizador Evaporativo",
    status: "available",
    image: "/equipments/CT80.jpg",
    airflow_m3h: 16000,
    motor_w: 510,
    voltage: "220v",
    frequency_hz: 60,
    noise_db: 60,
    tank_l: 80,
    dimensions_m: { w: 1.96, d: 0.69, h: 0.43 },
    quantity: {
      total: 12,
      available: 10,
      reserved: 2,
      maintenance: 0
    },
    lastMaintenance: "2024-01-05",
    notes: "Ideal para eventos médios"
  },
  {
    id: "eq-ct90-001",
    code: "CT90-001", 
    model: "CT90",
    name: "CT90 - Climatizador Evaporativo",
    status: "available",
    image: "/equipments/CT90.jpeg",
    airflow_m3h: 20000,
    motor_w: 750,
    voltage: "220v", 
    frequency_hz: 60,
    noise_db: 68,
    tank_l: 150,
    dimensions_m: { w: 1.52, d: 0.92, h: 0.85 },
    quantity: {
      total: 8,
      available: 6,
      reserved: 2,
      maintenance: 0
    },
    lastMaintenance: "2023-12-20",
    notes: "Maior capacidade, para grandes eventos"
  }
]

// Create a demo booking with margin calculation
const startDate = new Date()
startDate.setDate(startDate.getDate() + 7) // 7 days from now
const endDate = new Date(startDate)
endDate.setDate(endDate.getDate() + 2) // 2-day event

const marginHours = 6
const holdStart = addHours(startDate, -marginHours)
const holdEnd = addHours(endDate, marginHours)

export const seedBookings: Booking[] = [
  {
    id: "booking-1",
    clientId: "client-1",
    equipmentIds: ["eq-ct50-001", "eq-ct80-001"],
    site: "Centro de Convenções Anhembi",
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    marginHours: 6,
    status: "scheduled",
    address: "Av. Olavo Fontoura, 1209 - Santana, São Paulo/SP",
    totalPerDay: 800,
    days: 2,
    totalAmount: 1600,
    holdStart: holdStart.toISOString(),
    holdEnd: holdEnd.toISOString(),
    notes: "Evento corporativo - requer instalação às 6h"
  },
  {
    id: "booking-2",
    clientId: "client-2",
    equipmentIds: ["eq-ct90-001"],
    site: "Espaço Villa Country",
    start: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),   // 15 days from now
    marginHours: 8,
    status: "scheduled",
    address: "Rod. Raposo Tavares, km 22 - Cotia/SP",
    totalPerDay: 1200,
    days: 1,
    totalAmount: 1200,
    notes: "Casamento - evento de alta qualidade"
  }
]

export const seedPayments: Payment[] = [
  {
    id: "payment-1",
    clientId: "client-1",
    bookingId: "booking-1",
    date: new Date().toISOString(),
    amount: 800,
    method: "pix",
    status: "paid",
    notes: "Entrada do evento Anhembi"
  },
  {
    id: "payment-2",
    clientId: "client-2", 
    bookingId: "booking-2",
    date: new Date().toISOString(),
    amount: 1200,
    method: "boleto",
    status: "pending",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Pagamento evento Villa Country"
  }
]

export const seedQuotes: Quote[] = [
  {
    id: "quote-1",
    clientId: "client-1",
    bookingId: "booking-1",
    title: "Proposta - Centro de Convenções Anhembi",
    description: "Climatização para evento corporativo",
    items: [
      {
        equipmentId: "eq-ct50-001",
        quantity: 1,
        days: 2,
        dailyRate: 300,
        total: 600
      },
      {
        equipmentId: "eq-ct80-001", 
        quantity: 1,
        days: 2,
        dailyRate: 400,
        total: 800
      }
    ],
    subtotal: 1400,
    discount: 100,
    taxes: 0,
    total: 1300,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "sent",
    conditions: "Instalação inclusa. Manutenção e operação por conta do cliente.",
    paymentTerms: "50% na confirmação, 50% após o evento",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]