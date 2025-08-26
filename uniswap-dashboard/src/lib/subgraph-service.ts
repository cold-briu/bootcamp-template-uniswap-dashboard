export async function getFactory(query: string) {
    try {
        const res = await fetch('/api/subgraph', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();
        return json.data;
    } catch (e: any) {
        throw new Error(e.message);
    }
}
