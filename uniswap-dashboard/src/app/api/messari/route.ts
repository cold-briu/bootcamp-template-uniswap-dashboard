import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // Get query from request
        const { query } = await req.json();

        // Make request to Messari subgraph
        const SUBGRAPH_URL = 'https://gateway.thegraph.com/api/subgraphs/id/8cLf29KxAedWLVaEqjV8qKomdwwXQxjptBZFrqWNH5u2';

        const response = await fetch(SUBGRAPH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GRAPH_API_KEY!}`,
            },
            body: JSON.stringify({ query }),
        });

        // Parse response as JSON and return
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching Messari subgraph data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Messari subgraph data' },
            { status: 500 }
        );
    }
}
