'use client';

import { useEffect, useState } from 'react';
import { getPoolData } from '@/lib/subgraph-service';

// Helper function to format large numbers
const formatNumber = (num: string | number) => {
    const value = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(value)) return '0';

    if (value >= 1e9) {
        return (value / 1e9).toFixed(2) + 'B';
    }
    if (value >= 1e6) {
        return (value / 1e6).toFixed(2) + 'M';
    }
    if (value >= 1e3) {
        return (value / 1e3).toFixed(2) + 'K';
    }
    return value.toLocaleString();
};

// Helper function to shorten addresses
const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper function to format token balances
const formatTokenBalance = (balance: string | number, tokenIndex: number) => {
    if (!balance) return '0';
    const value = typeof balance === 'string' ? parseFloat(balance) : balance;
    if (isNaN(value)) return '0';

    if (tokenIndex === 0) {
        // Token 0: Scale down from wei-like units and format as integer with commas
        // Assuming 18 decimals for token 0, divide by 10^18
        const scaledValue = value / Math.pow(10, 18);
        return Math.round(scaledValue).toLocaleString();
    } else {
        // Token 1: Scale down and format with 2 decimal places  
        // Assuming 6 decimals for token 1 (like USDC), divide by 10^6
        const scaledValue = value / Math.pow(10, 6);
        return scaledValue.toFixed(2);
    }
};

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
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Pool Data</h2>
                <p className="text-red-600">{err}</p>
                <button
                    onClick={fetchData}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Loading Pool Data...</h2>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!data || !data.liquidityPool) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                <h2 className="text-xl font-semibold text-yellow-700 mb-2">No Pool Data Available</h2>
                <p className="text-yellow-600">Unable to load pool information at this time.</p>
                <button
                    onClick={fetchData}
                    className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    const pool = data.liquidityPool;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-blue-50 px-6 py-4 border-b">
                <h2 className="text-2xl font-bold text-blue-900">{pool.name || 'Uniswap Pool'}</h2>
                <p className="text-blue-700 text-sm mt-1">{pool.symbol || 'N/A'}</p>
                <p className="text-blue-600 text-xs font-mono mt-2">
                    ID: {shortenAddress(pool.id)}
                </p>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="text-sm font-medium text-purple-700 mb-1">Cumulative Swaps</h3>
                        <p className="text-2xl font-bold text-purple-900">
                            {formatNumber(pool.cumulativeSwapCount || 0)}
                        </p>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                        <h3 className="text-sm font-medium text-indigo-700 mb-1">Pool ID</h3>
                        <p className="text-sm font-mono text-indigo-900 break-all">
                            {pool.id}
                        </p>
                    </div>
                </div>

                {/* Token Balances */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Token Balances</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Token 0 Balance</h4>
                            <p className="text-lg font-mono text-gray-900">
                                {formatTokenBalance(pool.inputTokenBalances?.[0] || '0', 0)}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Token 1 Balance</h4>
                            <p className="text-lg font-mono text-gray-900">
                                {formatTokenBalance(pool.inputTokenBalances?.[1] || '0', 1)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Refresh Button */}
                <div className="flex justify-end">
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
            </div>
        </div>
    );
}
