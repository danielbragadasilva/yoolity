import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type Agent = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: { url: string };
  agent_status?: { id: string; name: string };
  login_status: boolean;
};

export function AgentCard({ agent }: { agent: Agent }) {
  const agentStates: { [key: string]: string } = {
    "633ef7ea-a1ce-4b27-8392-59d889bc364c": "💙Feedback💙",
    "bc87d9ab-5182-4262-869d-3c15becafed7": "👥Reunião/Treinamento👥",
    "89a84427-67ba-49ef-a29c-9bd3438bf314": "⏰Yooga Time⏰",
    "08c972df-8a8b-478f-9312-19ba67d7dc79": "🚨Pausa - Aprovada pela Supervisão🚨",
    "78de2fb5-cdeb-4876-8bfd-93bf6f4690b3": "💧Água/Banheiro💩",
    "0e6d80bf-aa09-40e7-bc6d-0e8b2f189298": "💼Demandas Externas💼",
    "Active on Intelli Assign": "✅ Disponível",
    "Inactive on Intelli Assign": "❌ Indisponível"
  };

  const getStatusEmoji = (status: string) => {
    return agentStates[status] || "Status Desconhecido";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "633ef7ea-a1ce-4b27-8392-59d889bc364c": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "bc87d9ab-5182-4262-869d-3c15becafed7": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "89a84427-67ba-49ef-a29c-9bd3438bf314": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "08c972df-8a8b-478f-9312-19ba67d7dc79": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "78de2fb5-cdeb-4876-8bfd-93bf6f4690b3": return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300";
      case "0e6d80bf-aa09-40e7-bc6d-0e8b2f189298": return "bg-gray-100 text-gray-800 dark:bg-orange-300 dark:text-gray-300";
      case "Active on Intelli Assign": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Inactive on Intelli Assign": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const agentStatusId = agent.agent_status?.id || agent.agent_status?.name || "Inactive on Intelli Assign";

  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${agent.login_status ? "bg-green-500" : "bg-gray-400"}`} />
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={agent.avatar.url || "https://ui.shadcn.com/placeholder.svg"} alt={agent.first_name} />
            <AvatarFallback>{agent.first_name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{agent.first_name} {agent.last_name}</h3>
            </div>
            <p className="text-[10px] text-muted-foreground">{agent.email}</p>
            <div
              className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(agentStatusId)}`}
            >
              {getStatusEmoji(agentStatusId)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
