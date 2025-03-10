export interface Agent {
  id: string
  name: string
  email: string
  avatar: string
  status: string
  isOnline: boolean
  performance?: {
    responseTime: number
    satisfaction: number
    resolvedTickets: number
  }
}

export const agents: Agent[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    status: "available",
    isOnline: true,
    performance: {
      responseTime: 2.5,
      satisfaction: 4.8,
      resolvedTickets: 127,
    },
  },
  {
    id: "2",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    status: "meeting",
    isOnline: true,
    performance: {
      responseTime: 3.1,
      satisfaction: 4.5,
      resolvedTickets: 98,
    },
  },
  {
    id: "3",
    name: "Mariana Costa",
    email: "mariana.costa@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    status: "feedback",
    isOnline: true,
    performance: {
      responseTime: 1.8,
      satisfaction: 4.9,
      resolvedTickets: 145,
    },
  },
  {
    id: "4",
    name: "Rafael Santos",
    email: "rafael.santos@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    status: "yoga",
    isOnline: false,
    performance: {
      responseTime: 2.7,
      satisfaction: 4.6,
      resolvedTickets: 112,
    },
  },
  {
    id: "5",
    name: "Juliana Lima",
    email: "juliana.lima@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    status: "approved-break",
    isOnline: false,
    performance: {
      responseTime: 2.2,
      satisfaction: 4.7,
      resolvedTickets: 132,
    },
  },
  {
    id: "6",
    name: "Pedro Almeida",
    email: "pedro.almeida@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    status: "bathroom",
    isOnline: true,
    performance: {
      responseTime: 2.9,
      satisfaction: 4.4,
      resolvedTickets: 105,
    },
  },
  {
    id: "7",
    name: "Fernanda Rocha",
    email: "fernanda.rocha@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    status: "external",
    isOnline: true,
    performance: {
      responseTime: 2.4,
      satisfaction: 4.8,
      resolvedTickets: 118,
    },
  },
  {
    id: "8",
    name: "Lucas Mendes",
    email: "lucas.mendes@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    status: "unavailable",
    isOnline: false,
    performance: {
      responseTime: 3.5,
      satisfaction: 4.2,
      resolvedTickets: 87,
    },
  },
  {
    id: "9",
    name: "Camila Ferreira",
    email: "camila.ferreira@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    status: "available",
    isOnline: true,
    performance: {
      responseTime: 2.1,
      satisfaction: 4.9,
      resolvedTickets: 138,
    },
  },
  {
    id: "10",
    name: "Bruno Carvalho",
    email: "bruno.carvalho@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    status: "meeting",
    isOnline: true,
    performance: {
      responseTime: 2.8,
      satisfaction: 4.6,
      resolvedTickets: 109,
    },
  },
  {
    id: "11",
    name: "Amanda Souza",
    email: "amanda.souza@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    status: "available",
    isOnline: true,
    performance: {
      responseTime: 2.3,
      satisfaction: 4.7,
      resolvedTickets: 125,
    },
  },
  {
    id: "12",
    name: "Thiago Ribeiro",
    email: "thiago.ribeiro@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    status: "feedback",
    isOnline: true,
    performance: {
      responseTime: 2.6,
      satisfaction: 4.5,
      resolvedTickets: 115,
    },
  },
]

