"use client";

import { useState } from "react";
import AgentsList from "./AgentsList"; // Importação do componente Dashboard

// Definição dos componentes que serão exibidos ao clicar nos tópicos
const Dashboard = () => <p>Em breve uma Dashboard</p>;
const Escala = () => <p>📅 Aqui está a Escala!</p>;
const Turno = () => <p>⏰ Informações sobre Turnos!</p>;
const Ranking = () => <p>🏆 Ranking atualizado!</p>;

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const content = {
    dashboard: <Dashboard />,
    agentes: <AgentsList />,
    escala: <Escala />,
    turno: <Turno />,
    ranking: <Ranking />,
  };

  return (
    <div className="flex fixed md:relative w-full h-full">
      {/* Sidebar fixa */}
      <div className="w-64 bg-primary-clean p-5 shadow-lg fixed h-full md:static rounded-sm">
        <h2 className="text-xl font-bold text-white mb-6">Menu</h2>
        <nav className="space-y-4">
          {Object.keys(content).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`block w-full text-left p-3 rounded-lg text-white font-semibold hover:bg-primary-darker ${
                activeTab === tab ? "bg-primary-dark font-bold" : ""
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Área de Conteúdo */}
      <div className="mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">{content[activeTab]}</div>
      </div>
    </div>
  );
};

export default Sidebar;
