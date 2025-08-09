import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { type Booking } from "@/domain/types"
import { format, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"

interface BookingCalendarProps {
  bookings: Booking[]
}

export function BookingCalendar({ bookings }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Group bookings by date
  const bookingsByDate = bookings.reduce((acc, booking) => {
    const dateKey = format(new Date(booking.start), 'yyyy-MM-dd')
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(booking)
    return acc
  }, {} as Record<string, Booking[]>)

  // Get bookings for selected date
  const selectedDateBookings = selectedDate 
    ? bookings.filter(booking => isSameDay(new Date(booking.start), selectedDate))
    : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-primary"
      case "installed": return "bg-success"
      case "returned": return "bg-muted"
      case "canceled": return "bg-destructive"
      default: return "bg-muted"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled": return "Agendado"
      case "installed": return "Instalado"
      case "returned": return "Retornado"
      case "canceled": return "Cancelado"
      default: return status
    }
  }

  // Custom day content to show booking indicators
  const renderDay = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd')
    const dayBookings = bookingsByDate[dateKey] || []
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span>{day.getDate()}</span>
        {dayBookings.length > 0 && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
            {dayBookings.slice(0, 3).map((booking, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${getStatusColor(booking.status)}`}
              />
            ))}
            {dayBookings.length > 3 && (
              <div className="w-1.5 h-1.5 rounded-full bg-muted" />
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={ptBR}
          className="w-full"
          components={{
            Day: ({ date, ...props }) => (
              <button
                {...props}
                className={`relative w-full h-10 p-0 font-normal aria-selected:opacity-100 ${
                  isSameDay(date, selectedDate || new Date()) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {renderDay(date)}
              </button>
            )
          }}
        />
      </div>

      {/* Selected Date Details */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">
            {selectedDate 
              ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
              : "Selecione uma data"
            }
          </h3>
          <p className="text-sm text-muted-foreground">
            {selectedDateBookings.length} locação(ões)
          </p>
        </div>

        <div className="space-y-3">
          {selectedDateBookings.length > 0 ? (
            selectedDateBookings.map((booking) => (
              <div key={booking.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{booking.site}</h4>
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(booking.status)} text-white text-xs`}
                  >
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(booking.start), "HH:mm")} - {format(new Date(booking.end), "HH:mm")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.equipmentIds.length} equipamento(s)
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma locação para esta data
            </p>
          )}
        </div>

        {/* Legend */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Legenda:</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Agendado</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span>Instalado</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-muted" />
              <span>Retornado</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span>Cancelado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}