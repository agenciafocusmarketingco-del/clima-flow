// Zustand store for application state management
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Client, Equipment, Booking, Payment, Quote, EquipmentStatus } from '../domain/types'
import { seedClients, seedEquipment, seedBookings, seedPayments, seedQuotes } from '../domain/seed'
import { addHours, parseISO, isAfter, isBefore } from 'date-fns'

interface AppState {
  // Data
  clients: Client[]
  equipment: Equipment[]
  bookings: Booking[]
  payments: Payment[]
  quotes: Quote[]
  
  // Modal states
  modals: {
    clientForm: boolean
    equipmentForm: boolean
    bookingForm: boolean
    paymentForm: boolean
    quoteForm: boolean
  }
  
  // Edit states
  editing: {
    client: Client | null
    equipment: Equipment | null
    booking: Booking | null
    payment: Payment | null
    quote: Quote | null
  }
}

interface AppActions {
  // Data actions
  addClient: (client: Omit<Client, 'id'>) => void
  updateClient: (id: string, updates: Partial<Client>) => void
  deleteClient: (id: string) => void
  
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void
  updateEquipment: (id: string, updates: Partial<Equipment>) => void
  deleteEquipment: (id: string) => void
  
  addBooking: (booking: Omit<Booking, 'id' | 'holdStart' | 'holdEnd'>) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void
  deleteBooking: (id: string) => void
  
  addPayment: (payment: Omit<Payment, 'id'>) => void
  updatePayment: (id: string, updates: Partial<Payment>) => void
  deletePayment: (id: string) => void
  
  addQuote: (quote: Omit<Quote, 'id'>) => void
  updateQuote: (id: string, updates: Partial<Quote>) => void
  deleteQuote: (id: string) => void
  
  // Modal actions
  openModal: (modal: keyof AppState['modals']) => void
  closeModal: (modal: keyof AppState['modals']) => void
  closeAllModals: () => void
  
  // Edit actions
  setEditing: <T extends keyof AppState['editing']>(type: T, item: AppState['editing'][T]) => void
  clearEditing: (type: keyof AppState['editing']) => void
  clearAllEditing: () => void
  
  // Utility actions
  loadSeedData: () => void
  checkEquipmentAvailability: (equipmentIds: string[], start: string, end: string, marginHours: number, excludeBookingId?: string) => { available: boolean; conflicts: Booking[] }
  updateEquipmentStatus: (equipmentId: string, status: EquipmentStatus) => void
  calculateBookingHoldTimes: (start: string, end: string, marginHours: number) => { holdStart: string; holdEnd: string }
}

type AppStore = AppState & AppActions

const generateId = () => crypto.randomUUID()

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      clients: [],
      equipment: [],
      bookings: [],
      payments: [],
      quotes: [],
      
      modals: {
        clientForm: false,
        equipmentForm: false,
        bookingForm: false,
        paymentForm: false,
        quoteForm: false
      },
      
      editing: {
        client: null,
        equipment: null,
        booking: null,
        payment: null,
        quote: null
      },
      
      // Actions
      addClient: (clientData) => {
        const client = { ...clientData, id: generateId() }
        set((state) => ({ clients: [...state.clients, client] }))
      },
      
      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map(client => 
            client.id === id ? { ...client, ...updates } : client
          )
        }))
      },
      
      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter(client => client.id !== id)
        }))
      },
      
      addEquipment: (equipmentData) => {
        const equipment = { ...equipmentData, id: generateId() }
        set((state) => ({ equipment: [...state.equipment, equipment] }))
      },
      
      updateEquipment: (id, updates) => {
        set((state) => ({
          equipment: state.equipment.map(eq => 
            eq.id === id ? { ...eq, ...updates } : eq
          )
        }))
      },
      
      deleteEquipment: (id) => {
        set((state) => ({
          equipment: state.equipment.filter(eq => eq.id !== id)
        }))
      },
      
      addBooking: (bookingData) => {
        const { holdStart, holdEnd } = get().calculateBookingHoldTimes(
          bookingData.start,
          bookingData.end,
          bookingData.marginHours
        )
        
        const booking = {
          ...bookingData,
          id: generateId(),
          holdStart,
          holdEnd
        }
        
        set((state) => ({ bookings: [...state.bookings, booking] }))
        
        // Update equipment status to reserved
        bookingData.equipmentIds.forEach(equipmentId => {
          get().updateEquipmentStatus(equipmentId, 'reserved')
        })
      },
      
      updateBooking: (id, updates) => {
        set((state) => {
          const booking = state.bookings.find(b => b.id === id)
          if (!booking) return state
          
          let updatedBooking = { ...booking, ...updates }
          
          // Recalculate hold times if dates or margin changed
          if (updates.start || updates.end || updates.marginHours) {
            const { holdStart, holdEnd } = get().calculateBookingHoldTimes(
              updatedBooking.start,
              updatedBooking.end,
              updatedBooking.marginHours
            )
            updatedBooking = { ...updatedBooking, holdStart, holdEnd }
          }
          
          return {
            bookings: state.bookings.map(b => 
              b.id === id ? updatedBooking : b
            )
          }
        })
      },
      
      deleteBooking: (id) => {
        const booking = get().bookings.find(b => b.id === id)
        if (booking) {
          // Update equipment status back to available
          booking.equipmentIds.forEach(equipmentId => {
            get().updateEquipmentStatus(equipmentId, 'available')
          })
        }
        
        set((state) => ({
          bookings: state.bookings.filter(b => b.id !== id)
        }))
      },
      
      addPayment: (paymentData) => {
        const payment = { ...paymentData, id: generateId() }
        set((state) => ({ payments: [...state.payments, payment] }))
      },
      
      updatePayment: (id, updates) => {
        set((state) => ({
          payments: state.payments.map(payment => 
            payment.id === id ? { ...payment, ...updates } : payment
          )
        }))
      },
      
      deletePayment: (id) => {
        set((state) => ({
          payments: state.payments.filter(payment => payment.id !== id)
        }))
      },
      
      addQuote: (quoteData) => {
        const quote = { ...quoteData, id: generateId() }
        set((state) => ({ quotes: [...state.quotes, quote] }))
      },
      
      updateQuote: (id, updates) => {
        set((state) => ({
          quotes: state.quotes.map(quote => 
            quote.id === id ? { ...quote, ...updates } : quote
          )
        }))
      },
      
      deleteQuote: (id) => {
        set((state) => ({
          quotes: state.quotes.filter(quote => quote.id !== id)
        }))
      },
      
      openModal: (modal) => {
        set((state) => ({
          modals: { ...state.modals, [modal]: true }
        }))
      },
      
      closeModal: (modal) => {
        set((state) => ({
          modals: { ...state.modals, [modal]: false }
        }))
      },
      
      closeAllModals: () => {
        set((state) => ({
          modals: Object.keys(state.modals).reduce((acc, key) => {
            acc[key as keyof AppState['modals']] = false
            return acc
          }, {} as AppState['modals'])
        }))
      },
      
      setEditing: (type, item) => {
        set((state) => ({
          editing: { ...state.editing, [type]: item }
        }))
      },
      
      clearEditing: (type) => {
        set((state) => ({
          editing: { ...state.editing, [type]: null }
        }))
      },
      
      clearAllEditing: () => {
        set((state) => ({
          editing: {
            client: null,
            equipment: null,
            booking: null,
            payment: null,
            quote: null
          }
        }))
      },
      
      loadSeedData: () => {
        set({
          clients: seedClients,
          equipment: seedEquipment,
          bookings: seedBookings,
          payments: seedPayments,
          quotes: seedQuotes
        })
      },
      
      checkEquipmentAvailability: (equipmentIds, start, end, marginHours, excludeBookingId) => {
        const { holdStart, holdEnd } = get().calculateBookingHoldTimes(start, end, marginHours)
        const startTime = parseISO(holdStart)
        const endTime = parseISO(holdEnd)
        
        const conflicts = get().bookings.filter(booking => {
          if (excludeBookingId && booking.id === excludeBookingId) return false
          if (booking.status === 'canceled') return false
          
          const hasEquipmentConflict = booking.equipmentIds.some(id => equipmentIds.includes(id))
          if (!hasEquipmentConflict) return false
          
          const bookingStart = parseISO(booking.holdStart || booking.start)
          const bookingEnd = parseISO(booking.holdEnd || booking.end)
          
          // Check for time overlap
          return !(isAfter(startTime, bookingEnd) || isBefore(endTime, bookingStart))
        })
        
        return {
          available: conflicts.length === 0,
          conflicts
        }
      },
      
      updateEquipmentStatus: (equipmentId, status) => {
        set((state) => ({
          equipment: state.equipment.map(eq => 
            eq.id === equipmentId ? { ...eq, status } : eq
          )
        }))
      },
      
      calculateBookingHoldTimes: (start, end, marginHours) => {
        const startDate = parseISO(start)
        const endDate = parseISO(end)
        
        const holdStart = addHours(startDate, -marginHours)
        const holdEnd = addHours(endDate, marginHours)
        
        return {
          holdStart: holdStart.toISOString(),
          holdEnd: holdEnd.toISOString()
        }
      }
    }),
    {
      name: 'climatize-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        clients: state.clients,
        equipment: state.equipment,
        bookings: state.bookings,
        payments: state.payments,
        quotes: state.quotes
      })
    }
  )
)