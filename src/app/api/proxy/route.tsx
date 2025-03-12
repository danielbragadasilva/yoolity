export async function GET() {
    const API_URL = "https://yoogatecnologia.freshchat.com/v2/agents?items_per_page=44";
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
        return Response.json(data);
    } catch (error: unknown) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}
