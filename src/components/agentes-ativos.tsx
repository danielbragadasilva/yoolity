import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function AgentesAtivos() {
  const agentes = [
    {
      id: 1,
      nome: "Carlos Silva",
      avatar: "/placeholder.svg?height=40&width=40",
      horario: "08:00 - 14:00",
      tempoRestante: "2h 30m",
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      avatar: "/placeholder.svg?height=40&width=40",
      horario: "08:00 - 14:00",
      tempoRestante: "2h 30m",
    },
    {
      id: 5,
      nome: "Luiza Costa",
      avatar: "/placeholder.svg?height=40&width=40",
      horario: "14:00 - 20:00",
      tempoRestante: "8h 30m",
    },
    {
      id: 6,
      nome: "Pedro Alves",
      avatar: "/placeholder.svg?height=40&width=40",
      horario: "14:00 - 20:00",
      tempoRestante: "8h 30m",
    },
  ]

  return (
    <div className="space-y-4">
      {agentes.map((agente) => (
        <div key={agente.id} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={agente.avatar || "/placeholder.svg"} alt={agente.nome} />
            <AvatarFallback>{agente.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{agente.nome}</p>
            <p className="text-xs text-muted-foreground">{agente.horario}</p>
          </div>
          <Badge variant="outline" className="ml-auto">
            {agente.tempoRestante}
          </Badge>
        </div>
      ))}
    </div>
  )
}
