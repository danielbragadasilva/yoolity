"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, Clock, Plus, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TrocasPage() {
  const [date, setDate] = useState<Date>()
  const [paymentDate, setPaymentDate] = useState<Date>()
  const [tipoUsuario, setTipoUsuario] = useState("agente") // ou "supervisor"
  const [tipoTroca, setTipoTroca] = useState("com-pagamento") // ou "em-aberto"
  const [showPaymentOptions, setShowPaymentOptions] = useState(true)

  const trocas = [
    {
      id: 1,
      solicitante: {
        nome: "Roberto Dias",
        avatar: "/placeholder.svg?height=40&width=40",
        turno: "14:00 - 20:00",
        data: "Hoje",
      },
      substituto: {
        nome: "Camila Rocha",
        avatar: "/placeholder.svg?height=40&width=40",
        turno: "20:00 - 02:00",
        data: "Amanhã",
      },
      pagamento: {
        tipo: "definido",
        data: "23/05/2025",
        turno: "20:00 - 02:00",
      },
      motivo: "Consulta médica",
      status: "pendente",
      dataSolicitacao: "15/05/2025",
    },
    {
      id: 2,
      solicitante: {
        nome: "Juliana Lima",
        avatar: "/placeholder.svg?height=40&width=40",
        turno: "14:00 - 20:00",
        data: "Quinta-feira",
      },
      substituto: {
        nome: "João Pereira",
        avatar: "/placeholder.svg?height=40&width=40",
        turno: "08:00 - 14:00",
        data: "Sexta-feira",
      },
      pagamento: {
        tipo: "em-aberto",
        mensagem: "A definir",
      },
      motivo: "Compromisso familiar",
      status: "pendente",
      dataSolicitacao: "14/05/2025",
    },
    {
      id: 3,
      solicitante: {
        nome: "Carlos Silva",
        avatar: "/placeholder.svg?height=40&width=40",
        turno: "08:00 - 14:00",
        data: "Segunda-feira",
      },
      substituto: {
        nome: "Maria Oliveira",
        avatar: "/placeholder.svg?height=40&width=40",
        turno: "08:00 - 14:00",
        data: "Terça-feira",
      },
      pagamento: {
        tipo: "definido",
        data: "25/05/2025",
        turno: "08:00 - 14:00",
      },
      motivo: "Viagem",
      status: "aprovada",
      dataSolicitacao: "10/05/2025",
    },
  ]

  const agentes = [
    { id: 1, nome: "Carlos Silva", avatar: "/placeholder.svg?height=40&width=40", turno: "Manhã" },
    { id: 2, nome: "Maria Oliveira", avatar: "/placeholder.svg?height=40&width=40", turno: "Manhã" },
    { id: 3, nome: "João Pereira", avatar: "/placeholder.svg?height=40&width=40", turno: "Manhã" },
    { id: 5, nome: "Luiza Costa", avatar: "/placeholder.svg?height=40&width=40", turno: "Tarde" },
    { id: 9, nome: "Fernanda Gomes", avatar: "/placeholder.svg?height=40&width=40", turno: "Noite" },
    { id: 10, nome: "Ricardo Souza", avatar: "/placeholder.svg?height=40&width=40", turno: "Noite" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Solicitações de Troca</h1>
        <div className="flex items-center gap-2">
          <Select defaultValue={tipoUsuario} onValueChange={setTipoUsuario}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agente">Agente</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nova Solicitação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Nova Solicitação de Troca</DialogTitle>
                <DialogDescription>Preencha os dados para solicitar uma troca de escala</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="data">Data da sua escala que precisa de substituição</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="turno">Seu turno</Label>
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
                <div className="grid gap-2">
                  <Label htmlFor="substituto">Agente substituto</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o agente" />
                    </SelectTrigger>
                    <SelectContent>
                      {agentes.map((agente) => (
                        <SelectItem key={agente.id} value={agente.id.toString()}>
                          {agente.nome} ({agente.turno})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Tipo de pagamento da troca</Label>
                  <RadioGroup
                    defaultValue="com-pagamento"
                    onValueChange={(value) => {
                      setTipoTroca(value)
                      setShowPaymentOptions(value === "com-pagamento")
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="com-pagamento" id="com-pagamento" />
                      <Label htmlFor="com-pagamento">Definir data para pagar a troca</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="em-aberto" id="em-aberto" />
                      <Label htmlFor="em-aberto">Deixar em aberto para pagar depois</Label>
                    </div>
                  </RadioGroup>
                </div>

                {showPaymentOptions && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="data-pagamento">Data para pagar a troca</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !paymentDate && "text-muted-foreground",
                            )}
                          >
                            {paymentDate
                              ? format(paymentDate, "PPP", { locale: ptBR })
                              : "Selecione uma data para pagamento"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={paymentDate} onSelect={setPaymentDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="turno-pagamento">Turno para pagamento</Label>
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
                  </>
                )}

                {!showPaymentOptions && (
                  <Alert>
                    <AlertDescription>
                      Você poderá definir a data de pagamento desta troca posteriormente, de acordo com sua
                      disponibilidade e a do agente substituto.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="motivo">Motivo da solicitação</Label>
                  <Textarea placeholder="Descreva o motivo da sua solicitação de troca" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Enviar solicitação</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="pendentes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
          <TabsTrigger value="recusadas">Recusadas</TabsTrigger>
          <TabsTrigger value="minhas">Minhas Solicitações</TabsTrigger>
          <TabsTrigger value="supervisor">Supervisor</TabsTrigger>
          <TabsTrigger value="agente">Agente</TabsTrigger>
        </TabsList>
        <TabsContent value="pendentes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {trocas
              .filter((t) => t.status === "pendente")
              .map((troca) => (
                <Card key={troca.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Solicitação #{troca.id}</CardTitle>
                      <Badge className="w-fit">Pendente</Badge>
                    </div>
                    <CardDescription>{troca.dataSolicitacao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={troca.solicitante.avatar || "/placeholder.svg"}
                            alt={troca.solicitante.nome}
                          />
                          <AvatarFallback>{troca.solicitante.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{troca.solicitante.nome}</p>
                          <p className="text-xs text-muted-foreground">{troca.solicitante.turno}</p>
                          <p className="text-xs text-muted-foreground">{troca.solicitante.data}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={troca.substituto.avatar || "/placeholder.svg"}
                            alt={troca.substituto.nome}
                          />
                          <AvatarFallback>{troca.substituto.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{troca.substituto.nome}</p>
                          <p className="text-xs text-muted-foreground">{troca.substituto.turno}</p>
                          <p className="text-xs text-muted-foreground">{troca.substituto.data}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm mb-2">
                      <span className="font-medium">Motivo: </span>
                      {troca.motivo}
                    </div>
                    <div className="text-sm flex items-center gap-1">
                      <span className="font-medium">Pagamento: </span>
                      {troca.pagamento.tipo === "definido" ? (
                        <span>
                          {troca.pagamento.data} ({troca.pagamento.turno})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600">
                          <Clock className="h-3 w-3" /> Em aberto
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <X className="h-4 w-4 mr-1" /> Recusar
                    </Button>
                    <Button size="sm">
                      <Check className="h-4 w-4 mr-1" /> Aprovar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="aprovadas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {trocas
              .filter((t) => t.status === "aprovada")
              .map((troca) => (
                <Card key={troca.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Solicitação #{troca.id}</CardTitle>
                      <Badge variant="default" className="bg-green-500 w-fit">
                        Aprovada
                      </Badge>
                    </div>
                    <CardDescription>{troca.dataSolicitacao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={troca.solicitante.avatar || "/placeholder.svg"}
                            alt={troca.solicitante.nome}
                          />
                          <AvatarFallback>{troca.solicitante.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{troca.solicitante.nome}</p>
                          <p className="text-xs text-muted-foreground">{troca.solicitante.turno}</p>
                          <p className="text-xs text-muted-foreground">{troca.solicitante.data}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={troca.substituto.avatar || "/placeholder.svg"}
                            alt={troca.substituto.nome}
                          />
                          <AvatarFallback>{troca.substituto.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{troca.substituto.nome}</p>
                          <p className="text-xs text-muted-foreground">{troca.substituto.turno}</p>
                          <p className="text-xs text-muted-foreground">{troca.substituto.data}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm mb-2">
                      <span className="font-medium">Motivo: </span>
                      {troca.motivo}
                    </div>
                    <div className="text-sm flex items-center gap-1">
                      <span className="font-medium">Pagamento: </span>
                      {troca.pagamento.tipo === "definido" ? (
                        <span>
                          {troca.pagamento.data} ({troca.pagamento.turno})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600">
                          <Clock className="h-3 w-3" /> Em aberto
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="recusadas">
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-muted-foreground">Não há solicitações recusadas no momento.</p>
          </div>
        </TabsContent>
        <TabsContent value="minhas">
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-muted-foreground">Você não tem solicitações de troca ativas.</p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Nova Solicitação
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="supervisor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Painel do Supervisor</CardTitle>
              <CardDescription>Gerencie todas as solicitações de troca da sua equipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-medium">Solicitações Pendentes de Aprovação Final</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {trocas
                    .filter((t) => t.status === "pendente")
                    .map((troca) => (
                      <Card key={troca.id} className="border-amber-200 bg-amber-50">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Solicitação #{troca.id}</CardTitle>
                            <Badge className="bg-amber-500">Aguardando Supervisor</Badge>
                          </div>
                          <CardDescription>{troca.dataSolicitacao}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarImage
                                  src={troca.solicitante.avatar || "/placeholder.svg"}
                                  alt={troca.solicitante.nome}
                                />
                                <AvatarFallback>{troca.solicitante.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{troca.solicitante.nome}</p>
                                <p className="text-xs text-muted-foreground">{troca.solicitante.turno}</p>
                                <p className="text-xs text-muted-foreground">{troca.solicitante.data}</p>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarImage
                                  src={troca.substituto.avatar || "/placeholder.svg"}
                                  alt={troca.substituto.nome}
                                />
                                <AvatarFallback>{troca.substituto.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{troca.substituto.nome}</p>
                                <p className="text-xs text-muted-foreground">{troca.substituto.turno}</p>
                                <p className="text-xs text-muted-foreground">{troca.substituto.data}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm mb-2">
                            <span className="font-medium">Motivo: </span>
                            {troca.motivo}
                          </div>
                          <div className="text-sm flex items-center gap-1 mb-2">
                            <span className="font-medium">Pagamento: </span>
                            {troca.pagamento.tipo === "definido" ? (
                              <span>
                                {troca.pagamento.data} ({troca.pagamento.turno})
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-amber-600">
                                <Clock className="h-3 w-3" /> Em aberto
                              </span>
                            )}
                          </div>
                          <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-100">
                            <p className="text-sm text-green-700">
                              <span className="font-medium">Status: </span>
                              Aprovado pelo agente substituto
                            </p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <X className="h-4 w-4 mr-1" /> Recusar
                          </Button>
                          <Button size="sm">
                            <Check className="h-4 w-4 mr-1" /> Aprovar Final
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agente" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações para Você</CardTitle>
              <CardDescription>Solicitações de troca que precisam da sua aprovação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Solicitação #4</CardTitle>
                        <Badge className="bg-blue-500">Aguardando Sua Aprovação</Badge>
                      </div>
                      <CardDescription>15/05/2025</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Marcelo Nunes" />
                            <AvatarFallback>MN</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Marcelo Nunes</p>
                            <p className="text-xs text-muted-foreground">20:00 - 02:00</p>
                            <p className="text-xs text-muted-foreground">Sexta-feira</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Você" />
                            <AvatarFallback>VC</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Você</p>
                            <p className="text-xs text-muted-foreground">20:00 - 02:00</p>
                            <p className="text-xs text-muted-foreground">Sábado</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm mb-2">
                        <span className="font-medium">Motivo: </span>
                        Compromisso familiar importante
                      </div>
                      <div className="text-sm flex items-center gap-1 mb-2">
                        <span className="font-medium">Pagamento: </span>
                        <span className="flex items-center gap-1 text-amber-600">
                          <Clock className="h-3 w-3" /> Em aberto
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <Switch id="definir-pagamento" />
                          <Label htmlFor="definir-pagamento">Definir data de pagamento agora</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal" disabled>
                                Selecionar data
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" initialFocus />
                            </PopoverContent>
                          </Popover>
                          <Select disabled>
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
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <X className="h-4 w-4 mr-1" /> Recusar
                      </Button>
                      <Button size="sm">
                        <Check className="h-4 w-4 mr-1" /> Aceitar Troca
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trocas em Aberto</CardTitle>
              <CardDescription>Trocas que você aceitou e ainda precisa definir uma data de pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Troca #5</CardTitle>
                        <Badge className="bg-green-500">Pagamento Pendente</Badge>
                      </div>
                      <CardDescription>10/05/2025</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Fernanda Gomes" />
                            <AvatarFallback>FG</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Fernanda Gomes</p>
                            <p className="text-xs text-muted-foreground">20:00 - 02:00</p>
                            <p className="text-xs text-muted-foreground">12/05/2025</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Você" />
                            <AvatarFallback>VC</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Você</p>
                            <p className="text-xs text-muted-foreground">20:00 - 02:00</p>
                            <p className="text-xs text-green-600 font-medium">Você cobriu este turno</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-2">Definir data para pagamento da troca</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                Selecionar data
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" initialFocus />
                            </PopoverContent>
                          </Popover>
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
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button>
                        <Check className="h-4 w-4 mr-1" /> Definir Pagamento
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
