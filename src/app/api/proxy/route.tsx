export async function GET() {
    const API_URL = "https://yoogatecnologia.freshchat.com/v2/agents?items_per_page=100";
    const BEARER_TOKEN = process.env.FRESHCHAT_BEARER_TOKEN;

    if (!BEARER_TOKEN) {
        return Response.json({ error: "Bearer token não encontrado" }, { status: 500 });
    }

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();
        
        // Lista de IDs permitidos
        const allowedIds = [
            "8adf9899-3924-4340-8538-3a7fd1e99127",
            "28981349-9b86-4444-8016-adeaea56c0af",
            "61270de4-eab0-4030-bd58-c344317fb99a",
            "3675a143-cc9c-4382-9e16-ca05d396aba9",
            "c344c55f-6cb5-4f9c-b0c4-f22e5a50aab0",
            "092f21ae-1afb-43aa-99b1-b5c6af5a64df",
            "1b606bd9-9ac5-475f-b553-91553aa369d7",
            "65621928-bbba-41ee-8350-6780138e6f7e",
            "26bf4689-4e97-4a52-a6c7-43b6545378e8",
            "1a4d93db-f11c-4b5a-8d2b-8556f734ebbc",
            "43b5a51f-9727-4932-8570-d13ea59442d9",
            "487010b9-0082-4738-9647-7f26dffa3086",
            "9f9a5eff-8d86-41c9-962a-1942ffbc5315",
            "5a8d3c94-6d4c-4564-818b-a1e90816188c",
            "83110aee-7535-43e9-98e3-1bfb9d4cc09a"
        ];
        
        // Filtrar apenas os agentes com IDs permitidos
        if (data.agents && Array.isArray(data.agents)) {
            data.agents = data.agents.filter((agent: { id: string }) => allowedIds.includes(agent.id));
        }
        
        return Response.json(data);
    } catch (error: unknown) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}
