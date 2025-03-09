// import AgentsList from "@/components/AgentsList";
import Sidebar from "@/components/SideBar";


export default function Home() {
    return (
        <div className="container mx-auto p-2">
            <h1 className="text-2xl font-bold mb-6">Dashboard de Agentes</h1>
            <Sidebar/>
            {/* <AgentsList /> */}
        </div>
    );
}
