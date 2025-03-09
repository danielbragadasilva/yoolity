export async function fetchAgents() {
    const API_URL = "/api/proxy"; // Agora chamamos o proxy no Next.js

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error("Erro ao buscar agentes:", error);
        return { agents: [] };
    }
}
