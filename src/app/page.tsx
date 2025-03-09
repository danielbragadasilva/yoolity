import AgentsList from "@/components/AgentsList";

export default function Home() {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard de Agentes</h1>
            <AgentsList />
        </div>
    );
}
