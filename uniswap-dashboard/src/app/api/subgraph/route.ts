import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // Get query from request
        const { query } = await req.json();

        // Make request to subgraph
        const SUBGRAPH_URL = 'https://gateway.thegraph.com/api/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV';

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
        console.error('Error fetching subgraph data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subgraph data' },
            { status: 500 }
        );
    }
}
