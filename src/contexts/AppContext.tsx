import React, { createContext, useContext, useState, ReactNode } from 'react'

// Types
export interface Cliente {
  id: number
  nome: string
  empresa: string
  email: string
  telefone: string
  endereco: string
  status: 'Ativo' | 'Inativo'
  ultimaLocacao: string
}

export interface Equipamento {
  id: number
  nome: string
  categoria: string
  status: 'Disponível' | 'Locado' | 'Manutenção'
  total: number
  disponiveis: number
  locados: number
  manutencao: number
  potencia: string
  ultimaManutencao: string
}

export interface Agendamento {
  id: number
  cliente: string
  equipamento: string
  tipo: 'Entrega' | 'Retirada'
  data: string
  hora: string
  endereco: string
  status: 'Confirmado' | 'Pendente' | 'Cancelado'
}

export interface Contrato {
  id: number
  cliente: string
  valor: number
  status: 'Pago' | 'Pendente' | 'Vencido'
  vencimento: string
  equipamento: string
  recorrencia: 'Mensal' | 'Anual'
}

interface AppContextType {
  // Data
  clientes: Cliente[]
  equipamentos: Equipamento[]
  agendamentos: Agendamento[]
  contratos: Contrato[]
  
  // Actions
  addCliente: (cliente: Omit<Cliente, 'id'>) => void
  updateCliente: (id: number, cliente: Partial<Cliente>) => void
  addEquipamento: (equipamento: Omit<Equipamento, 'id'>) => void
  updateEquipamento: (id: number, equipamento: Partial<Equipamento>) => void
  addAgendamento: (agendamento: Omit<Agendamento, 'id'>) => void
  updateAgendamento: (id: number, agendamento: Partial<Agendamento>) => void
  addContrato: (contrato: Omit<Contrato, 'id'>) => void
  updateContrato: (id: number, contrato: Partial<Contrato>) => void
  
  // Modal states
  isClienteModalOpen: boolean
  isEquipamentoModalOpen: boolean
  isAgendamentoModalOpen: boolean
  isContratoModalOpen: boolean
  isPagamentoModalOpen: boolean
  
  setClienteModalOpen: (open: boolean) => void
  setEquipamentoModalOpen: (open: boolean) => void
  setAgendamentoModalOpen: (open: boolean) => void
  setContratoModalOpen: (open: boolean) => void
  setPagamentoModalOpen: (open: boolean) => void
  
  // Edit states
  editingCliente: Cliente | null
  editingEquipamento: Equipamento | null
  editingAgendamento: Agendamento | null
  editingContrato: Contrato | null
  
  setEditingCliente: (cliente: Cliente | null) => void
  setEditingEquipamento: (equipamento: Equipamento | null) => void
  setEditingAgendamento: (agendamento: Agendamento | null) => void
  setEditingContrato: (contrato: Contrato | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Initial data
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: 1,
      nome: "João Silva",
      empresa: "Silva Eventos",
      email: "joao@silvaeventos.com",
      telefone: "(11) 99999-9999",
      endereco: "São Paulo, SP",
      status: "Ativo",
      ultimaLocacao: "15/01/2024"
    },
    {
      id: 2,
      nome: "Maria Santos",
      empresa: "Santos Construções",
      email: "maria@santosconstrucoes.com",
      telefone: "(11) 88888-8888",
      endereco: "Rio de Janeiro, RJ",
      status: "Ativo",
      ultimaLocacao: "10/01/2024"
    },
    {
      id: 3,
      nome: "Pedro Costa",
      empresa: "Costa Festas",
      email: "pedro@costafestas.com",
      telefone: "(11) 77777-7777",
      endereco: "Belo Horizonte, MG",
      status: "Inativo",
      ultimaLocacao: "05/12/2023"
    }
  ])

  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([
    {
      id: 1,
      nome: "CT50 - Climatizador Evaporativo",
      categoria: "Climatizador",
      status: "Disponível",
      total: 15,
      disponiveis: 12,
      locados: 3,
      manutencao: 0,
      potencia: "380W - 220V monofásico - 60Hz",
      ultimaManutencao: "10/01/2024"
    },
    {
      id: 2,
      nome: "CT80 - Climatizador Evaporativo",
      categoria: "Climatizador",
      status: "Disponível",
      total: 12,
      disponiveis: 10,
      locados: 2,
      manutencao: 0,
      potencia: "510W - 220V monofásico - 60Hz",
      ultimaManutencao: "05/01/2024"
    },
    {
      id: 3,
      nome: "CT90 - Climatizador Evaporativo",
      categoria: "Climatizador",
      status: "Disponível",
      total: 8,
      disponiveis: 6,
      locados: 2,
      manutencao: 0,
      potencia: "750W - 220V monofásico - 60Hz",
      ultimaManutencao: "20/12/2023"
    }
  ])

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([
    {
      id: 1,
      cliente: "João Silva",
      equipamento: "CT50 - Climatizador Evaporativo",
      tipo: "Entrega",
      data: "2024-01-15",
      hora: "09:00",
      endereco: "Rua das Flores, 123 - São Paulo/SP",
      status: "Confirmado"
    },
    {
      id: 2,
      cliente: "Maria Santos",
      equipamento: "CT80 - Climatizador Evaporativo",
      tipo: "Retirada",
      data: "2024-01-16",
      hora: "14:00",
      endereco: "Av. Paulista, 1000 - São Paulo/SP",
      status: "Pendente"
    },
    {
      id: 3,
      cliente: "Pedro Costa",
      equipamento: "CT90 - Climatizador Evaporativo",
      tipo: "Entrega",
      data: "2024-01-17",
      hora: "08:00",
      endereco: "Rua Augusta, 500 - São Paulo/SP",
      status: "Confirmado"
    }
  ])

  const [contratos, setContratos] = useState<Contrato[]>([
    {
      id: 1,
      cliente: "João Silva",
      valor: 1200,
      status: "Pago",
      vencimento: "15/01/2024",
      equipamento: "CT50 - Climatizador Evaporativo",
      recorrencia: "Mensal"
    },
    {
      id: 2,
      cliente: "Maria Santos",
      valor: 1800,
      status: "Pendente",
      vencimento: "20/01/2024",
      equipamento: "CT80 - Climatizador Evaporativo",
      recorrencia: "Mensal"
    },
    {
      id: 3,
      cliente: "Pedro Costa",
      valor: 2200,
      status: "Vencido",
      vencimento: "10/01/2024",
      equipamento: "CT90 - Climatizador Evaporativo",
      recorrencia: "Mensal"
    }
  ])

  // Modal states
  const [isClienteModalOpen, setClienteModalOpen] = useState(false)
  const [isEquipamentoModalOpen, setEquipamentoModalOpen] = useState(false)
  const [isAgendamentoModalOpen, setAgendamentoModalOpen] = useState(false)
  const [isContratoModalOpen, setContratoModalOpen] = useState(false)
  const [isPagamentoModalOpen, setPagamentoModalOpen] = useState(false)

  // Edit states
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [editingEquipamento, setEditingEquipamento] = useState<Equipamento | null>(null)
  const [editingAgendamento, setEditingAgendamento] = useState<Agendamento | null>(null)
  const [editingContrato, setEditingContrato] = useState<Contrato | null>(null)

  // Actions
  const addCliente = (cliente: Omit<Cliente, 'id'>) => {
    const newId = Math.max(...clientes.map(c => c.id), 0) + 1
    setClientes([...clientes, { ...cliente, id: newId }])
  }

  const updateCliente = (id: number, cliente: Partial<Cliente>) => {
    setClientes(clientes.map(c => c.id === id ? { ...c, ...cliente } : c))
  }

  const addEquipamento = (equipamento: Omit<Equipamento, 'id'>) => {
    const newId = Math.max(...equipamentos.map(e => e.id), 0) + 1
    setEquipamentos([...equipamentos, { ...equipamento, id: newId }])
  }

  const updateEquipamento = (id: number, equipamento: Partial<Equipamento>) => {
    setEquipamentos(equipamentos.map(e => e.id === id ? { ...e, ...equipamento } : e))
  }

  const addAgendamento = (agendamento: Omit<Agendamento, 'id'>) => {
    const newId = Math.max(...agendamentos.map(a => a.id), 0) + 1
    setAgendamentos([...agendamentos, { ...agendamento, id: newId }])
  }

  const updateAgendamento = (id: number, agendamento: Partial<Agendamento>) => {
    setAgendamentos(agendamentos.map(a => a.id === id ? { ...a, ...agendamento } : a))
  }

  const addContrato = (contrato: Omit<Contrato, 'id'>) => {
    const newId = Math.max(...contratos.map(c => c.id), 0) + 1
    setContratos([...contratos, { ...contrato, id: newId }])
  }

  const updateContrato = (id: number, contrato: Partial<Contrato>) => {
    setContratos(contratos.map(c => c.id === id ? { ...c, ...contrato } : c))
  }

  const value: AppContextType = {
    // Data
    clientes,
    equipamentos,
    agendamentos,
    contratos,
    
    // Actions
    addCliente,
    updateCliente,
    addEquipamento,
    updateEquipamento,
    addAgendamento,
    updateAgendamento,
    addContrato,
    updateContrato,
    
    // Modal states
    isClienteModalOpen,
    isEquipamentoModalOpen,
    isAgendamentoModalOpen,
    isContratoModalOpen,
    isPagamentoModalOpen,
    
    setClienteModalOpen,
    setEquipamentoModalOpen,
    setAgendamentoModalOpen,
    setContratoModalOpen,
    setPagamentoModalOpen,
    
    // Edit states
    editingCliente,
    editingEquipamento,
    editingAgendamento,
    editingContrato,
    
    setEditingCliente,
    setEditingEquipamento,
    setEditingAgendamento,
    setEditingContrato
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}