'use client';

import { useEffect, useState } from 'react';
import { getFactory } from '@/lib/subgraph-service';

export default function Factories() {
    const [data, setData] = useState<any>(null);
    const [err, setErr] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        setErr(null);

        try {
            const result = await getFactory();
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
            <main className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 border">
                    <h2 className="text-xl font-semibold mb-4">Factory Data</h2>
                    <p className="text-red-600">Error: {err}</p>
                </div>
            </main>
        );
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 border">
                    <h2 className="text-xl font-semibold mb-4">Factory Data</h2>
                    <p>Loading...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 border">
                <h2 className="text-xl font-semibold mb-4">Factory Data</h2>
                <div className="space-y-3">
                    {data && (
                        <>
                            <div>
                                <label className="text-sm text-gray-500">Factory ID</label>
                                <p className="font-mono text-sm break-all">{data.factories[0]?.id}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg text-center">
                                    <p className="text-sm text-gray-500">Pool Count</p>
                                    <p className="font-semibold">{data.factories[0]?.poolCount}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg text-center">
                                    <p className="text-sm text-gray-500">TX Count</p>
                                    <p className="font-semibold">{data.factories[0]?.txCount}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">Total Volume USD</label>
                                <p className="text-lg font-bold text-green-600">
                                    ${Number(data.factories[0]?.totalVolumeUSD).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">ETH Price</label>
                                <p className="text-lg font-bold text-blue-600">
                                    ${Number(data.bundles[0]?.ethPriceUSD).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
