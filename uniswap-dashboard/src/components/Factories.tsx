'use client';

import { useEffect, useState } from 'react';
import { getFactory } from '@/lib/subgraph-service';

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

export default function Factories() {
    const [data, setData] = useState<any>(null);
    const [err, setErr] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        setErr(null);

        try {
            const result = await getFactory(QUERY);
            setData(result);
        } catch (e: any) {
            setErr(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (err) {
        return (
            <div>
                <h1>Factories</h1>
                <p>Error: {err}</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div>
                <h1>Factories</h1>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Factories</h1>
            {data && (
                <pre>
                    <span>{JSON.stringify(data, null, 2)}</span>
                </pre>
            )}
        </div>
    );
}
