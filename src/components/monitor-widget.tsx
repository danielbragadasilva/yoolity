"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, User } from "lucide-react"

const statusOptions = [
  { value: "disponivel", label: "✅ Disponível", color: "bg-green-500" },
  { value: "indisponivel", label: "❌ Indisponível", color: "bg-red-500" },
  { value: "feedback", label: "💙 Feedback", color: "bg-blue-500" },
  { value: "reuniao", label: "👥 Reunião/Treinamento", color: "bg-purple-500" },
  { value: "yooga", label: "⏰ Yooga Time", color: "bg-orange-500" },
  { value: "pausa", label: "🚨 Pausa - Aprovada", color: "bg-yellow-500" },
  { value: "agua", label: "💧 Água/Banheiro", color: "bg-cyan-500" },
  { value: "demandas", label: "💼 Demandas Externas", color: "bg-gray-500" },
]

export default function AvailabilityWidget() {
  const [currentStatus, setCurrentStatus] = useState("disponivel")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [agentName, setAgentName] = useState("")
  const [agentEmail, setAgentEmail] = useState("")
  const [agentPassword, setAgentPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const handleLogin = () => {
    // Simular validação de login
    if (agentEmail === "daniel.braga@yooga.com.br" && agentPassword === "Live1313@") {
      setIsLoggedIn(true)
      setAgentName(agentEmail.split("@")[0]) // Usar parte do email como nome
      setLoginError("")
    } else {
      setLoginError("E-mail ou senha incorretos")
    }
  }

  const getCurrentStatusInfo = () => {
    return statusOptions.find((status) => status.value === currentStatus) || statusOptions[0]
  }

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus)
    setLastUpdated(new Date())

    // Simular integração com HubSpot
    console.log("Enviando para HubSpot:", {
      userId: "user_123",
      status: newStatus,
      timestamp: new Date().toISOString(),
      hubspotContactId: "contact_456",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const currentStatusInfo = getCurrentStatusInfo()

  if (!isLoggedIn) {
    return (
      <div className="font-mono" style={{ fontFamily: "Geist Mono, monospace" }}>
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5" />
              Login do Agente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">E-mail:</label>
              <input
                type="email"
                value={agentEmail}
                onChange={(e) => setAgentEmail(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md text-sm"
                placeholder="Digite seu e-mail"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha:</label>
              <input
                type="password"
                value={agentPassword}
                onChange={(e) => setAgentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md text-sm"
                placeholder="Digite sua senha"
              />
            </div>
            {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
            <Button onClick={handleLogin} disabled={!agentEmail.trim() || !agentPassword.trim()} className="w-full">
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="font-mono" style={{ fontFamily: "Geist Mono, monospace" }}>
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5" />
            Status de Disponibilidade
          </CardTitle>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{agentName}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsLoggedIn(false)
                setAgentName("")
                setAgentEmail("")
                setAgentPassword("")
                setLoginError("")
                setCurrentStatus("disponivel")
              }}
              className="text-xs"
            >
              Logout
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Status Atual */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${currentStatusInfo.color}`} />
              <span className="font-medium">{currentStatusInfo.label}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              ATIVO
            </Badge>
          </div>

          {/* Seletor de Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Alterar Status:</label>
            <Select value={currentStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${status.color}`} />
                      {status.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Informações Adicionais */}
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              Última atualização: {formatTime(lastUpdated)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
