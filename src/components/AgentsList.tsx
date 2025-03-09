"use client";

import React, { useEffect, useState } from "react";

const agentStates = {
    "633ef7ea-a1ce-4b27-8392-59d889bc364c": "💙Feedback💙",
    "bc87d9ab-5182-4262-869d-3c15becafed7": "👥Reunião/Treinamento👥",
    "89a84427-67ba-49ef-a29c-9bd3438bf314": "⏰Yooga Time⏰",
    "08c972df-8a8b-478f-9312-19ba67d7dc79": "🚨Pausa - Aprovada pela Supervisão🚨",
    "78de2fb5-cdeb-4876-8bfd-93bf6f4690b3": "💧Água/Banheiro💩",
    "0e6d80bf-aa09-40e7-bc6d-0e8b2f189298": "💼Demandas Externas💼"
};

const AgentsList = () => {
    const [agents, setAgents] = useState([]);
    const [filteredAgents, setFilteredAgents] = useState([]);
    const [search, setSearch] = useState("");

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

    // Função para filtrar os agentes
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
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
                    onClick={fetchAgents}
                >
                    🔄 Atualizar
                </button>
            </div>

            {/* Lista de agentes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAgents.map((agent) => (
                    <div key={agent.id} className="bg-white shadow-lg rounded-xl p-4 border-gray-400 border-1">
                        <h3 className="text-xl font-bold">{agent.first_name} {agent.last_name}</h3>
                        <p className="text-primary-darkin text-[10px]">{agent.email}</p>
                        <p className="text-sm font-semibold text-gray-500">
                            Status: {agentStates[agent.agent_status?.id] || agent.agent_status?.name || "Desconhecido"}
                        </p>
                        <p className={`mt-2 text-sm font-medium ${agent.login_status ? "text-green-600" : "text-red-600"}`}>
                            {agent.login_status ? "🟢 Online" : "🔴 Offline"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentsList;
