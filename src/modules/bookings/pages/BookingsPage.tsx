import { useState } from "react"
import { Plus, Search, Calendar as CalendarIcon, Clock, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { useAppStore } from "@/stores/appStore"
import { BookingForm } from "../components/BookingForm"
import { BookingCard } from "../components/BookingCard"
import { BookingCalendar } from "../components/BookingCalendar"

export function BookingsPage() {
  const { bookings, openModal, modals } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "scheduled" | "installed" | "returned" | "canceled">("all")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.site.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const todayBookings = bookings.filter(booking => {
    const today = new Date().toDateString()
    const bookingDate = new Date(booking.start).toDateString()
    return bookingDate === today
  })

  const upcomingBookings = bookings
    .filter(booking => new Date(booking.start) > new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5)

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Locações</h1>
          <p className="text-muted-foreground">
            Gerencie locações e acompanhe a disponibilidade dos equipamentos
          </p>
        </div>
        <Button onClick={() => openModal('bookingForm')} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Locação
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Locações</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendadas</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {bookings.filter(b => b.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {bookings.filter(b => b.status === 'installed').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <CalendarIcon className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{todayBookings.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar and Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Calendário de Locações</CardTitle>
              <CardDescription>Visualize locações por data</CardDescription>
            </CardHeader>
            <CardContent>
              <BookingCalendar bookings={bookings} />
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                Todas
              </Button>
              <Button
                variant={statusFilter === "scheduled" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("scheduled")}
              >
                Agendadas
              </Button>
              <Button
                variant={statusFilter === "installed" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("installed")}
              >
                Ativas
              </Button>
              <Button
                variant={statusFilter === "returned" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("returned")}
              >
                Finalizadas
              </Button>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Agenda de Hoje</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayBookings.length > 0 ? (
                  todayBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{booking.site}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.start).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(booking.status)} text-white`}
                      >
                        {getStatusText(booking.status)}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma locação para hoje</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Locações</CardTitle>
              <CardDescription>Próximos eventos programados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{booking.site}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.start).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma locação próxima</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma locação encontrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Tente ajustar os filtros de busca" 
                : "Comece criando sua primeira locação"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={() => openModal('bookingForm')}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Locação
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Booking Form Modal */}
      <BookingForm open={modals.bookingForm} />
    </div>
  )
}