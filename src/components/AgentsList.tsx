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

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await fetch("/api/proxy"); // Use um endpoint do Next.js para segurança
                const data = await response.json();
                setAgents(data.agents || []);
            } catch (error) {
                console.error("Erro ao buscar agentes:", error);
            }
        };

        fetchAgents();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {agents.map((agent) => (
                <div key={agent.id} className="bg-white shadow-lg rounded-xl p-4 border-gray-400 border-1">
                    <h3 className="text-xl font-bold">{agent.first_name} {agent.last_name}</h3>
                    <p className="text-primary-darkin text-[10px]">{agent.email}</p>
                    <p className="text-sm font-semibold text-gray-500">Status: {agentStates[agent.agent_status?.id] || agent.agent_status?.name || "Desconhecido"}</p>
                    <p className={`mt-2 text-sm font-medium ${agent.login_status ? "text-green-600" : "text-red-600"}`}>
                            {agent.login_status ? "Online" : "Offline"}
                        </p>
                </div>
            ))}
        </div>
    );
};

export default AgentsList;
