import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();

        const SUBGRAPH_URL = 'https://gateway.thegraph.com/api/subgraphs/id/8cLf29KxAedWLVaEqjV8qKomdwwXQxjptBZFrqWNH5u2';

        const response = await fetch(SUBGRAPH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GRAPH_API_KEY!}`,
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching subgraph data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subgraph data' },
            { status: 500 }
        );
    }
}
