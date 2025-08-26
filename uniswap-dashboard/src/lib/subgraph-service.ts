const QUERY = `
  {
    factories(first: 5) {
      id
      poolCount
      txCount
      totalVolumeUSD
    }
    bundles(first: 5) {
      id
      ethPriceUSD
    }
  }
`;

export async function getFactory() {
    try {
        const res = await fetch('/api/subgraph', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: QUERY }),
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();
        return json.data;
    } catch (e: any) {
        throw new Error(e.message);
    }
}
