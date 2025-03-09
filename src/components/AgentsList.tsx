"use client";

import React, { useEffect, useState } from "react";

const agentStates = {
    "633ef7ea-a1ce-4b27-8392-59d889bc364c": "💙Feedback💙",
    "bc87d9ab-5182-4262-869d-3c15becafed7": "👥Reunião/Treinamento👥",
    "89a84427-67ba-49ef-a29c-9bd3438bf314": "⏰Yooga Time⏰",
    "08c972df-8a8b-478f-9312-19ba67d7dc79": "🚨Pausa - Aprovada pela Supervisão🚨",
    "78de2fb5-cdeb-4876-8bfd-93bf6f4690b3": "💧Água/Banheiro💩",
    "0e6d80bf-aa09-40e7-bc6d-0e8b2f189298": "💼Demandas Externas💼",
    "Active on Intelli Assign": "✅ Disponível",
    "Inactive on Intelli Assign": "❌ Indisponível"
};

const AgentsList = () => {
    const [agents, setAgents] = useState([]);
    const [filteredAgents, setFilteredAgents] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(null);

    // Função para buscar os agentes
    const fetchAgents = async () => {
        try {
            const response = await fetch("/api/proxy"); // Mantendo o fetch na API do Next.js
            const data = await response.json();
            setAgents(data.agents || []);
            setFilteredAgents(data.agents || []);
        } catch (error) {
            console.error("Erro ao buscar agentes:", error);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    // Função para filtrar os agentes com base na pesquisa e status
    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearch(value);

        const filtered = agents.filter(agent =>
            (agent.first_name + " " + agent.last_name).toLowerCase().includes(value) ||
            agent.email.toLowerCase().includes(value) ||
            (agentStates[agent.agent_status?.id] || "").toLowerCase().includes(value)
        );

        setFilteredAgents(filtered);
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        
        const filtered = agents.filter(agent =>
            agent.agent_status?.id === status || 
            agent.agent_status?.name === status
        );

        setFilteredAgents(filtered);
    };

    const clearFilters = () => {
        setSearch("");
        setSelectedStatus(null);
        setFilteredAgents(agents); // Restaura a lista completa de agentes
    };

    return (
        <div className="p-4">
            {/* Filtros */}
            <div className="mb-4 flex flex-col md:flex-row gap-2">
                <input
                    type="text"
                    placeholder="🔎 Buscar por nome, e-mail ou status..."
                    className="p-2 border rounded-md w-full md:w-1/2"
                    value={search}
                    onChange={handleSearch}
                />
                <button
                    className="bg-primary duration-300 ease-in-out hover:bg-primary-darker font-semibold text-white px-4 py-2 rounded-md"
                    onClick={fetchAgents}
                >
                    Atualizar
                </button>
            </div>

            {/* Filtro de Status */}
            <div className="mb-4 flex flex-wrap gap-2">
                {Object.entries(agentStates).map(([id, label]) => (
                    <button
                        key={id}
                        className={`px-4 py-2 rounded-md ${selectedStatus === id ? "bg-primary text-white" : "bg-gray-200"}`}
                        onClick={() => handleStatusFilter(id)}
                    >
                        {label}
                    </button>
                ))}
                {/* Botão para limpar os filtros */}
                <button
                    className="px-4 py-2 rounded-md bg-gray-400 text-white"
                    onClick={clearFilters}
                >
                    Limpar Filtros
                </button>
            </div>

            {/* Lista de agentes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAgents.map((agent) => {
                    const agentStatus =
                        agentStates[agent.agent_status?.id] ||
                        agentStates[agent.agent_status?.name] || 
                        "Desconhecido";

                    return (
                        <div key={agent.id} className="bg-white shadow-lg rounded-xl p-4 border-gray-400 border-1 flex flex-col items-center">
                            {/* Avatar */}
                            <img 
                                src={agent.avatar.url || "https://ui.shadcn.com/placeholder.svg"} 
                                alt={`Avatar de ${agent.first_name}`} 
                                className="w-20 h-20 rounded-full mb-2 object-cover"
                            />
                            
                            {/* Nome e Email */}
                            <h3 className="text-xl font-bold text-center">{agent.first_name} {agent.last_name}</h3>
                            <p className="text-primary-darkin text-[10px]">{agent.email}</p>
                            
                            {/* Status */}
                            <p className="text-sm font-semibold text-gray-500">Status: {agentStatus}</p>
                            <p className={`mt-2 text-sm font-medium ${agent.login_status ? "text-green-600" : "text-red-600"}`}>
                                {agent.login_status ? "🟢 Online" : "🔴 Offline"}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AgentsList;
