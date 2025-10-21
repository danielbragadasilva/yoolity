"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function EscalaPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState("dia")
  const [turnoFiltro, setTurnoFiltro] = useState("todos")

  // Dados simulados para a visualização da escala
  const turnos = [
    {
      nome: "Manhã",
      horario: "08:00 - 14:00",
      agentes: [
        { id: 1, nome: "Carlos Silva", avatar: "/placeholder.svg?height=40&width=40", status: "ativo" },
        { id: 2, nome: "Maria Oliveira", avatar: "/placeholder.svg?height=40&width=40", status: "ativo" },
        { id: 3, nome: "João Pereira", avatar: "/placeholder.svg?height=40&width=40", status: "ativo" },
        { id: 4, nome: "Ana Santos", avatar: "/placeholder.svg?height=40&width=40", status: "ativo" },
      ],
    },
    {
      nome: "Tarde",
      horario: "14:00 - 20:00",
      agentes: [
        { id: 5, nome: "Luiza Costa", avatar: "/placeholder.svg?height=40&width=40", status: "ativo" },
        { id: 6, nome: "Pedro Alves", avatar: "/placeholder.svg?height=40&width=40", status: "ativo" },
        { id: 7, nome: "Juliana Lima", avatar: "/placeholder.svg?height=40&width=40", status: "ativo" },
        { id: 8, nome: "Roberto Dias", avatar: "/placeholder.svg?height=40&width=40", status: "troca" },
      ],
    },
    {
      nome: "Noite",
      horario: "20:00 - 02:00",
      agentes: [
        { id: 9, nome: "Fernanda Gomes", avatar: "/placeholder.svg?height=40&width=40", status: "ativo" },
        { id: 10, nome: "Ricardo Souza", avatar: "/placeholder.svg?height=40&width=40", status: "ativo" },
        { id: 11, nome: "Camila Rocha", avatar: "/placeholder.svg?height=40&width=40", status: "folga" },
        { id: 12, nome: "Marcelo Nunes", avatar: "/placeholder.svg?height=40&width=40", status: "ativo" },
      ],
    },
  ]

  // Filtra os turnos com base no filtro selecionado
  const turnosFiltrados =
    turnoFiltro === "todos"
      ? turnos
      : turnos.filter((turno) => {
          if (turnoFiltro === "manha") return turno.nome === "Manhã"
          if (turnoFiltro === "tarde") return turno.nome === "Tarde"
          if (turnoFiltro === "noite") return turno.nome === "Noite"
          return true
        })

  const formatDate = (date: Date) => {
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Escala de Trabalho</h1>
        <Select value={turnoFiltro} onValueChange={setTurnoFiltro}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por turno" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os turnos</SelectItem>
            <SelectItem value="manha">Manhã</SelectItem>
            <SelectItem value="tarde">Tarde</SelectItem>
            <SelectItem value="noite">Noite</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
            <CardDescription>Selecione uma data para ver a escala</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{formatDate(date)}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={view} onValueChange={setView}>
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="dia">Dia</TabsTrigger>
                  <TabsTrigger value="semana">Semana</TabsTrigger>
                  <TabsTrigger value="mes">Mês</TabsTrigger>
                </TabsList>

                <TabsContent value="dia">
                  <div className="grid gap-4 md:grid-cols-3">
                    {turnosFiltrados.map((turno) => (
                      <Card key={turno.nome} className="border-none shadow-none">
                        <CardHeader className="px-0 pt-0">
                          <CardTitle className="text-lg">{turno.nome}</CardTitle>
                          <CardDescription>{turno.horario}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-0">
                          <div className="space-y-4">
                            {turno.agentes.map((agente) => (
                              <div key={agente.id} className="flex items-center gap-4">
                                <Avatar>
                                  <AvatarImage src={agente.avatar || "/placeholder.svg"} alt={agente.nome} />
                                  <AvatarFallback>{agente.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium">{agente.nome}</p>
                                </div>
                                <Badge
                                  variant={
                                    agente.status === "ativo"
                                      ? "default"
                                      : agente.status === "troca"
                                        ? "outline"
                                        : "secondary"
                                  }
                                >
                                  {agente.status === "ativo" ? "Ativo" : agente.status === "troca" ? "Troca" : "Folga"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="semana">
                  <div className="text-center p-12 text-muted-foreground">
                    <h3 className="text-lg font-medium mb-2">Visualização Semanal</h3>
                    <p>Aqui você verá a escala da semana inteira.</p>
                    <div className="mt-4 grid grid-cols-7 gap-2">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="p-2 border rounded-md">
                          <div className="font-medium">
                            {format(new Date(date.getTime() + i * 24 * 60 * 60 * 1000), "EEE", { locale: ptBR })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(date.getTime() + i * 24 * 60 * 60 * 1000), "dd/MM", { locale: ptBR })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mes">
                  <div className="text-center p-12 text-muted-foreground">
                    <h3 className="text-lg font-medium mb-2">Visualização Mensal</h3>
                    <p>Aqui você verá a escala do mês inteiro.</p>
                    <div className="mt-4 grid grid-cols-7 gap-1">
                      {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                        <div key={day} className="p-1 font-medium text-sm">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 31 }).map((_, i) => (
                        <div key={i} className="p-1 border rounded-md h-12 text-sm">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
