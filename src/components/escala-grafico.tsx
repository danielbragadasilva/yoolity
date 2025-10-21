"use client";

import { useState } from "react";
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
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useFreshchatAgents } from "@/hooks/useFreshchatAgents";

// Função para formatar horas (0-24) para exibição no gráfico
const formatHora = (hora: number) => {
  return `${hora.toString().padStart(2, "0")}:00`;
};

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
  | "offline";

// Mapeamento de IDs de status do Freshchat para FreshStatus
const freshchatStatusMap: Record<string, FreshStatus> = {
  "633ef7ea-a1ce-4b27-8392-59d889bc364c": "feedback",
  "bc87d9ab-5182-4262-869d-3c15becafed7": "reuniao",
  "89a84427-67ba-49ef-a29c-9bd3438bf314": "yoga",
  "08c972df-8a8b-478f-9312-19ba67d7dc79": "pausa",
  "78de2fb5-cdeb-4876-8bfd-93bf6f4690b3": "agua",
  "0e6d80bf-aa09-40e7-bc6d-0e8b2f189298": "demandas",
  "Active on Intelli Assign": "disponivel",
  "Inactive on Intelli Assign": "indisponivel",
  "AVAILABLE": "disponivel",
};

// Função para gerar dados de horário para um agente
const gerarHorarioAgente = (
  nome: string,
  inicio: number,
  fim: number,
  status: "ativo" | "troca" | "folga" = "ativo",
  freshStatus: FreshStatus = "offline"
) => {
  return {
    nome,
    inicio,
    fim,
    duracao: fim - inicio,
    status,
    freshStatus,
  };
};

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
};

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
};

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
};

export function EscalaGrafico() {
  const [filtro, setFiltro] = useState("todos");

    // Obter dados reais dos agentes do Freshchat
  const { agents, loading } = useFreshchatAgents();
  
  // Interface para o agente do Freshchat
  interface FreshchatAgent {
    availability_status?: string;
    agent_status?: {
      id?: string;
      name?: string;
    };
    login_status?: boolean;
  }

  // Função para determinar o status do Fresh com base nos dados do Freshchat
  const getFreshStatus = (agent: FreshchatAgent): FreshStatus => {
    // Verificar availability_status
    if (agent.availability_status === "AVAILABLE") {
      return "disponivel";
    }
    
    // Verificar agent_status.id ou agent_status.name
    if (agent.agent_status?.id) {
      return freshchatStatusMap[agent.agent_status.id] || "offline";
    }
    
    if (agent.agent_status?.name) {
      return freshchatStatusMap[agent.agent_status.name] || "offline";
    }
    
    // Se não tiver status ou não estiver logado
    if (!agent.login_status) {
      return "offline";
    }
    
    return "indisponivel";
  };
  
  // Função para determinar o turno com base na hora atual (simplificada)
  const determinarTurno = (): { inicio: number; fim: number } => {
    // Aqui você pode implementar a lógica real para determinar o turno
    // Por enquanto, vamos usar uma lógica simplificada baseada no nome do agente
    const hora = new Date().getHours();
    
    // Manhã: 8h às 14h
    if (hora >= 6 && hora < 12) {
      return { inicio: 8, fim: 14 };
    }
    // Tarde: 14h às 20h
    else if (hora >= 12 && hora < 18) {
      return { inicio: 14, fim: 20 };
    }
    // Noite: 20h às 2h
    else {
      return { inicio: 20, fim: 2 };
    }
  };
  
  // Converter agentes do Freshchat para o formato do gráfico
  const agentes = agents.map((agent) => {
    const turno = determinarTurno();
    const freshStatus = getFreshStatus(agent);
    
    return gerarHorarioAgente(
      `${agent.first_name} ${agent.last_name || ""}`,
      turno.inicio,
      turno.fim,
      "ativo", // Por padrão, todos são ativos
      freshStatus
    );
  });

  // Filtragem dos agentes com base no filtro selecionado
  const agentesFiltrados =
    filtro === "todos"
      ? agentes
      : agentes.filter((agente) => {
          if (filtro === "manha") return agente.inicio === 8;
          if (filtro === "tarde") return agente.inicio === 14;
          if (filtro === "noite") return agente.inicio === 20;
          return true;
        });

  // Interface para o payload do tooltip
  interface TooltipPayload {
    payload: {
      nome: string;
      inicio: number;
      fim: number;
      status: string;
      freshStatus: string;
    };
  }

  // Formatador personalizado para o tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-md shadow-sm p-3 text-sm">
          <p className="font-medium text-base">{data.nome}</p>
          <p className="mb-1">
            Horário: {formatHora(data.inicio)} -{" "}
            {data.fim === 2 ? "02:00" : formatHora(data.fim)}
          </p>
          <div className="flex items-center gap-1 mb-1">
            <span>Status de escala: </span>
            <Badge
              variant={
                data.status === "ativo"
                  ? "default"
                  : data.status === "troca"
                  ? "outline"
                  : "secondary"
              }
            >
              {data.status === "ativo"
                ? "Ativo"
                : data.status === "troca"
                ? "Troca"
                : "Folga"}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <span>Status atual: </span>
            <Badge
              variant="outline"
              className="flex items-center gap-1"
              style={{
                backgroundColor: freshStatusColors[data.freshStatus as FreshStatus],
                color: ["disponivel", "yoga", "agua"].includes(data.freshStatus)
                  ? "#000"
                  : "#fff",
              }}
            >
              {freshStatusIcons[data.freshStatus as FreshStatus]}{" "}
              {freshStatusDescriptions[data.freshStatus as FreshStatus]}
            </Badge>
          </div>
        </div>
      );
    }
    return null;
  };

  // Hora atual para a linha de referência
  const horaAtual = new Date().getHours();

  // Gerar itens de legenda para os status do Fresh
  // const freshStatusLegendItems = Object.entries(freshStatusDescriptions).map(
  //   ([key, description]) => {
  //     const status = key as FreshStatus;
  //     return (
  //       <div key={key} className="flex items-center gap-2">
  //         <div
  //           className="w-3 h-3 rounded-full"
  //           style={{ backgroundColor: freshStatusColors[status] }}
  //         ></div>
  //         <span className="text-xs">
  //           {freshStatusIcons[status]} {description}
  //         </span>
  //       </div>
  //     );
  //   }
  // );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
          {/* Legenda de status */}
          {/* <div className="col-span-2 md:col-span-4 lg:col-span-6 grid grid-cols-3 md:grid-cols-6 gap-2">
            {Object.entries(freshStatusDescriptions).map(([key, description]) => {
              const status = key as FreshStatus;
              return (
                <div key={key} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: freshStatusColors[status] }}
                  ></div>
                  <span className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                    {freshStatusIcons[status]} {description}
                  </span>
                </div>
              );
            })}
          </div> */}
          
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
      </div>

      {loading ? (
        <div className="h-[500px] w-full flex items-center justify-center">
          <p className="text-muted-foreground">Carregando dados dos agentes...</p>
        </div>
      ) : agentes.length === 0 ? (
        <div className="h-[500px] w-full flex items-center justify-center">
          <p className="text-muted-foreground">Nenhum agente encontrado</p>
        </div>
      ) : (
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
            <YAxis
              dataKey="nome"
              type="category"
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine
              x={horaAtual}
              stroke="#ef4444"
              strokeWidth={2}
              label={{ value: "Agora", position: "top", fill: "#ef4444" }}
            />
            <Bar
              dataKey="duracao"
              name="Horário de Trabalho"
              barSize={20}
              radius={[4, 4, 4, 4]}
            >
              {agentesFiltrados.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={freshStatusColors[entry.freshStatus]}
                  // Adiciona uma borda para destacar o status da escala
                  stroke={
                    entry.status === "troca"
                      ? "#f97316"
                      : entry.status === "folga"
                      ? "#6b7280"
                      : "none"
                  }
                  strokeWidth={entry.status !== "ativo" ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      )}
    </div>
  );
}
