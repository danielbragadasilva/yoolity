"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Função para formatar horas (0-24) para exibição no gráfico
const formatHora = (hora: number) => {
  return `${hora.toString().padStart(2, "0")}:00`
}

// Tipos de status do Fresh
type FreshStatus =
  | "feedback"
  | "reuniao"
  | "yoga"
  | "pausa"
  | "agua"
  | "demandas"
  | "disponivel"
  | "indisponivel"
  | "offline"

// Função para gerar dados de horário para um agente
const gerarHorarioAgente = (
  nome: string,
  inicio: number,
  fim: number,
  status: "ativo" | "troca" | "folga" = "ativo",
  freshStatus: FreshStatus = "offline",
) => {
  return {
    nome,
    inicio,
    fim,
    duracao: fim - inicio,
    status,
    freshStatus,
  }
}

// Mapeamento de cores para os status do Fresh
const freshStatusColors: Record<FreshStatus, string> = {
  feedback: "#3b82f6", // 💙 Azul
  reuniao: "#8b5cf6", // 👥 Roxo
  yoga: "#f59e0b", // ⏰ Amarelo âmbar
  pausa: "#ef4444", // 🚨 Vermelho
  agua: "#06b6d4", // 💧 Ciano
  demandas: "#6366f1", // 💼 Indigo
  disponivel: "#10b981", // ✅ Verde
  indisponivel: "#f43f5e", // ❌ Rosa
  offline: "#9ca3af", // Cinza (quando não está em nenhum status)
}

// Mapeamento de ícones para os status do Fresh
const freshStatusIcons: Record<FreshStatus, string> = {
  feedback: "💙",
  reuniao: "👥",
  yoga: "⏰",
  pausa: "🚨",
  agua: "💧",
  demandas: "💼",
  disponivel: "✅",
  indisponivel: "❌",
  offline: "⚪",
}

// Mapeamento de descrições para os status do Fresh
const freshStatusDescriptions: Record<FreshStatus, string> = {
  feedback: "Feedback",
  reuniao: "Reunião/Treinamento",
  yoga: "Yooga Time",
  pausa: "Pausa - Aprovada",
  agua: "Água/Banheiro",
  demandas: "Demandas Externas",
  disponivel: "Disponível",
  indisponivel: "Indisponível",
  offline: "Offline",
}

export function EscalaGrafico() {
  const [filtro, setFiltro] = useState("todos")

  // Dados dos agentes com seus horários e status do Fresh
  const agentes = [
    gerarHorarioAgente("Carlos Silva", 8, 14, "ativo", "disponivel"),
    gerarHorarioAgente("Maria Oliveira", 8, 14, "ativo", "feedback"),
    gerarHorarioAgente("João Pereira", 8, 14, "ativo", "reuniao"),
    gerarHorarioAgente("Ana Santos", 8, 14, "ativo", "agua"),
    gerarHorarioAgente("Luiza Costa", 14, 20, "ativo", "disponivel"),
    gerarHorarioAgente("Pedro Alves", 14, 20, "ativo", "yoga"),
    gerarHorarioAgente("Juliana Lima", 14, 20, "ativo", "demandas"),
    gerarHorarioAgente("Roberto Dias", 14, 20, "troca", "pausa"),
    gerarHorarioAgente("Fernanda Gomes", 20, 2, "ativo", "disponivel"),
    gerarHorarioAgente("Ricardo Souza", 20, 2, "ativo", "indisponivel"),
    gerarHorarioAgente("Camila Rocha", 20, 2, "folga", "offline"),
    gerarHorarioAgente("Marcelo Nunes", 20, 2, "ativo", "disponivel"),
  ]

  // Filtragem dos agentes com base no filtro selecionado
  const agentesFiltrados =
    filtro === "todos"
      ? agentes
      : agentes.filter((agente) => {
          if (filtro === "manha") return agente.inicio === 8
          if (filtro === "tarde") return agente.inicio === 14
          if (filtro === "noite") return agente.inicio === 20
          return true
        })

  // Cores para os diferentes status
  const getBarColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "#3b82f6" // blue-500
      case "troca":
        return "#f97316" // orange-500
      case "folga":
        return "#6b7280" // gray-500
      default:
        return "#3b82f6"
    }
  }

  // Formatador personalizado para o tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-md shadow-sm p-3 text-sm">
          <p className="font-medium text-base">{data.nome}</p>
          <p className="mb-1">
            Horário: {formatHora(data.inicio)} - {data.fim === 2 ? "02:00" : formatHora(data.fim)}
          </p>
          <div className="flex items-center gap-1 mb-1">
            <span>Status de escala: </span>
            <Badge variant={data.status === "ativo" ? "default" : data.status === "troca" ? "outline" : "secondary"}>
              {data.status === "ativo" ? "Ativo" : data.status === "troca" ? "Troca" : "Folga"}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <span>Status atual: </span>
            <Badge
              variant="outline"
              className="flex items-center gap-1"
              style={{
                backgroundColor: freshStatusColors[data.freshStatus],
                color: ["disponivel", "yoga", "agua"].includes(data.freshStatus) ? "#000" : "#fff",
              }}
            >
              {freshStatusIcons[data.freshStatus]} {freshStatusDescriptions[data.freshStatus]}
            </Badge>
          </div>
        </div>
      )
    }
    return null
  }

  // Hora atual para a linha de referência
  const horaAtual = new Date().getHours()

  // Gerar itens de legenda para os status do Fresh
  const freshStatusLegendItems = Object.entries(freshStatusDescriptions).map(([key, description]) => {
    const status = key as FreshStatus
    return (
      <div key={key} className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: freshStatusColors[status] }}></div>
        <span className="text-xs">
          {freshStatusIcons[status]} {description}
        </span>
      </div>
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">{freshStatusLegendItems}</div>
        <Select value={filtro} onValueChange={setFiltro}>
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

      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={agentesFiltrados}
            margin={{
              top: 20,
              right: 30,
              left: 100,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 24]}
              tickCount={13}
              ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]}
              tickFormatter={formatHora}
            />
            <YAxis dataKey="nome" type="category" width={100} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine
              x={horaAtual}
              stroke="#ef4444"
              strokeWidth={2}
              label={{ value: "Agora", position: "top", fill: "#ef4444" }}
            />
            <Bar dataKey="duracao" name="Horário de Trabalho" barSize={20} radius={[4, 4, 4, 4]}>
              {agentesFiltrados.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={freshStatusColors[entry.freshStatus]}
                  // Adiciona uma borda para destacar o status da escala
                  stroke={entry.status === "troca" ? "#f97316" : entry.status === "folga" ? "#6b7280" : "none"}
                  strokeWidth={entry.status !== "ativo" ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
