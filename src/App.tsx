import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import { ClientsPage } from "./modules/clients/pages/ClientsPage";
import { EquipmentPage } from "./modules/equipment/pages/EquipmentPage";
import { BookingsPage } from "./modules/bookings/pages/BookingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/finance" element={<div>Finance - Em construção</div>} />
            <Route path="/quotes" element={<div>Quotes - Em construção</div>} />
            <Route path="/login" element={<div>Login - Em construção</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
