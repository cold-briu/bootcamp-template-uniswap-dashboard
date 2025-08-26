const POOL_QUERY = `
  {
    liquidityPool(id: "0x357596DD7a0EF5CB703C5AAe4dA01EDFf176aE95") {
      name
      inputTokenBalances
      symbol
      totalValueLockedUSD
      id
      cumulativeSwapCount
    }
  }
`;

export async function getPoolData() {
    try {
        const res = await fetch('/api/subgraph', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: POOL_QUERY }),
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();
        return json.data;
    } catch (e: any) {
        throw new Error(e.message);
    }
}
