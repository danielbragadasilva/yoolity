"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"

export default function AgentesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const agentes = [
    {
      id: 1,
      nome: "Carlos Silva",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "carlos.silva@exemplo.com",
      turno: "Manhã",
      status: "ativo",
      cargo: "Agente",
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "maria.oliveira@exemplo.com",
      turno: "Manhã",
      status: "ativo",
      cargo: "Agente",
    },
    {
      id: 3,
      nome: "João Pereira",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "joao.pereira@exemplo.com",
      turno: "Manhã",
      status: "ativo",
      cargo: "Agente",
    },
    {
      id: 4,
      nome: "Ana Santos",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "ana.santos@exemplo.com",
      turno: "Manhã",
      status: "ativo",
      cargo: "Agente",
    },
    { id: 5, nome: "Luiza Costa", avatar: '/placeholder.svg?height=40&width=  cargo: "Agente' },
    {
      id: 5,
      nome: "Luiza Costa",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "luiza.costa@exemplo.com",
      turno: "Tarde",
      status: "ativo",
      cargo: "Agente",
    },
    {
      id: 6,
      nome: "Pedro Alves",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "pedro.alves@exemplo.com",
      turno: "Tarde",
      status: "ativo",
      cargo: "Agente",
    },
    {
      id: 7,
      nome: "Juliana Lima",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "juliana.lima@exemplo.com",
      turno: "Tarde",
      status: "ativo",
      cargo: "Agente",
    },
    {
      id: 8,
      nome: "Roberto Dias",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "roberto.dias@exemplo.com",
      turno: "Tarde",
      status: "ativo",
      cargo: "Agente",
    },
    {
      id: 9,
      nome: "Fernanda Gomes",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "fernanda.gomes@exemplo.com",
      turno: "Noite",
      status: "ativo",
      cargo: "Agente",
    },
    {
      id: 10,
      nome: "Ricardo Souza",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "ricardo.souza@exemplo.com",
      turno: "Noite",
      status: "ativo",
      cargo: "Agente",
    },
    {
      id: 11,
      nome: "Camila Rocha",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "camila.rocha@exemplo.com",
      turno: "Noite",
      status: "ativo",
      cargo: "Agente",
    },
    {
      id: 12,
      nome: "Marcelo Nunes",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "marcelo.nunes@exemplo.com",
      turno: "Noite",
      status: "ativo",
      cargo: "Agente",
    },
    {
      id: 13,
      nome: "Amanda Vieira",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "amanda.vieira@exemplo.com",
      turno: "Manhã",
      status: "inativo",
      cargo: "Agente",
    },
    {
      id: 14,
      nome: "Paulo Mendes",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "paulo.mendes@exemplo.com",
      turno: "Tarde",
      status: "inativo",
      cargo: "Agente",
    },
    {
      id: 15,
      nome: "Luciana Castro",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "luciana.castro@exemplo.com",
      turno: "Noite",
      status: "inativo",
      cargo: "Agente",
    },
  ]

  const supervisores = [
    {
      id: 16,
      nome: "Rafael Oliveira",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "rafael.oliveira@exemplo.com",
      turno: "Manhã",
      status: "ativo",
      cargo: "Supervisor",
    },
    {
      id: 17,
      nome: "Carla Martins",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "carla.martins@exemplo.com",
      turno: "Tarde",
      status: "ativo",
      cargo: "Supervisor",
    },
    {
      id: 18,
      nome: "Bruno Santos",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "bruno.santos@exemplo.com",
      turno: "Noite",
      status: "ativo",
      cargo: "Supervisor",
    },
  ]

  const filteredAgentes = agentes.filter(
    (agente) =>
      agente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agente.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredSupervisores = supervisores.filter(
    (supervisor) =>
      supervisor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Agentes</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Agente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Agente</DialogTitle>
              <DialogDescription>Preencha os dados para adicionar um novo agente ao sistema</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" placeholder="Nome do agente" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agente">Agente</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="turno">Turno</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manha">Manhã (08:00 - 14:00)</SelectItem>
                    <SelectItem value="tarde">Tarde (14:00 - 20:00)</SelectItem>
                    <SelectItem value="noite">Noite (20:00 - 02:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar agentes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="manha">Manhã</TabsTrigger>
          <TabsTrigger value="tarde">Tarde</TabsTrigger>
          <TabsTrigger value="noite">Noite</TabsTrigger>
          <TabsTrigger value="supervisores">Supervisores</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgentes.map((agente) => (
              <Card key={agente.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={agente.avatar || "/placeholder.svg"} alt={agente.nome} />
                        <AvatarFallback>{agente.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{agente.nome}</CardTitle>
                        <CardDescription>{agente.email}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={agente.status === "ativo" ? "default" : "secondary"}>
                      {agente.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Cargo:</span> {agente.cargo}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Turno:</span> {agente.turno}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm">
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {filteredSupervisores.map((supervisor) => (
              <Card key={supervisor.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={supervisor.avatar || "/placeholder.svg"} alt={supervisor.nome} />
                        <AvatarFallback>{supervisor.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{supervisor.nome}</CardTitle>
                        <CardDescription>{supervisor.email}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary text-primary-foreground">
                      {supervisor.cargo}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Cargo:</span> {supervisor.cargo}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Turno:</span> {supervisor.turno}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm">
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manha" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgentes
              .filter((agente) => agente.turno === "Manhã")
              .map((agente) => (
                <Card key={agente.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={agente.avatar || "/placeholder.svg"} alt={agente.nome} />
                          <AvatarFallback>{agente.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{agente.nome}</CardTitle>
                          <CardDescription>{agente.email}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={agente.status === "ativo" ? "default" : "secondary"}>
                        {agente.status === "ativo" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Cargo:</span> {agente.cargo}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Turno:</span> {agente.turno}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm">
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="tarde" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgentes
              .filter((agente) => agente.turno === "Tarde")
              .map((agente) => (
                <Card key={agente.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={agente.avatar || "/placeholder.svg"} alt={agente.nome} />
                          <AvatarFallback>{agente.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{agente.nome}</CardTitle>
                          <CardDescription>{agente.email}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={agente.status === "ativo" ? "default" : "secondary"}>
                        {agente.status === "ativo" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Cargo:</span> {agente.cargo}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Turno:</span> {agente.turno}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm">
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="noite" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgentes
              .filter((agente) => agente.turno === "Noite")
              .map((agente) => (
                <Card key={agente.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={agente.avatar || "/placeholder.svg"} alt={agente.nome} />
                          <AvatarFallback>{agente.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{agente.nome}</CardTitle>
                          <CardDescription>{agente.email}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={agente.status === "ativo" ? "default" : "secondary"}>
                        {agente.status === "ativo" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Cargo:</span> {agente.cargo}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Turno:</span> {agente.turno}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm">
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="supervisores" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSupervisores.map((supervisor) => (
              <Card key={supervisor.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={supervisor.avatar || "/placeholder.svg"} alt={supervisor.nome} />
                        <AvatarFallback>{supervisor.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{supervisor.nome}</CardTitle>
                        <CardDescription>{supervisor.email}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary text-primary-foreground">
                      {supervisor.cargo}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Cargo:</span> {supervisor.cargo}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Turno:</span> {supervisor.turno}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm">
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
