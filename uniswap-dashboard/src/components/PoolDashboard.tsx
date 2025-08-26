'use client';

import { useEffect, useState } from 'react';
import { getPoolData } from '@/lib/subgraph-service';

export default function PoolDashboard() {
    const [data, setData] = useState<any>(null);
    const [err, setErr] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

      const fetchData = async () => {
    setIsLoading(true);
    setErr(null);
    
    try {
      const result = await getPoolData();
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
                <h1>PoolDashboard</h1>
                <p>Error: {err}</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div>
                <h1>PoolDashboard</h1>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <h1>PoolDashboard</h1>
            {data && (
                <pre>
                    <span>{JSON.stringify(data, null, 2)}</span>
                </pre>
            )}
        </div>
    );
}
