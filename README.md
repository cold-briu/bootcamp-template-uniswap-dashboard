# 🧪 Bootcamp Template - Uniswap Dashboard

A beginner-friendly tutorial for building and deploying a Uniswap v3 dashboard using The Graph subgraph and React TypeScript. This bootcamp template provides end-to-end guidance for Web3 developers learning to interact with DeFi protocols.

---

## 📘 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Initialization](#project-initialization)
3. [Pool Dashboard](#pool-dashboard)

---

## 1. Prerequisites

#### Context
Before starting this tutorial, ensure you have the necessary tools and accounts set up for building a Uniswap dashboard with subgraph integration.

1.1. Create an account at [The Graph Studio](https://thegraph.com/studio/) and obtain an API key
   - Navigate to The Graph Studio website
   - Click "Sign Up" to create a new account
   - Complete the registration process

1.2. Connect wallet
   - Click "Connect Wallet" in The Graph Studio dashboard
   - Select your preferred wallet (MetaMask, WalletConnect, etc.)
   - Approve the connection request in your wallet

1.3. Add and verify email
   - Go to your account settings in The Graph Studio
   - Add your email address to receive important notifications
   - Check your inbox and click the verification link
   - Confirm your email is verified in the dashboard

> 💡 **Note**: Email verification is required to access certain features and receive API usage notifications.


1.4 Get the Uniswap V3 subgraph query URL
   - Navigate to [The Graph Explorer - Uniswap V3 Subgraph](https://thegraph.com/explorer/subgraphs/ESdrTJ3twMwWVoQ1hUE2u7PugEHX3QkenudD6aXCkDQ4)
   - Locate the "Query URL" section on the subgraph page
   - Copy the query endpoint: `/subgraphs/id/ESdrTJ3twMwWVoQ1hUE2u7PugEHX3QkenudD6aXCkDQ4`
   - The full query URL will be: `https://gateway.thegraph.com/api/[api-key]/subgraphs/id/ESdrTJ3twMwWVoQ1hUE2u7PugEHX3QkenudD6aXCkDQ4`
       - Replace `[api-key]` with your API key obtained from step 1.1

> 💡 **Note**: This Uniswap V3 subgraph (v0.0.3) provides access to mainnet data including pools, positions, swaps, and liquidity information.


---

## 2. Project Initialization

#### Context
Set up your Next.js project with TypeScript and Tailwind CSS, then clean up the default template to prepare for building your Uniswap dashboard.

2.1. Create a new Next.js application with TypeScript and Tailwind CSS
   ```bash
   npx create-next-app@latest uniswap-dashboard --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   ```
   - Navigate to your project directory:
   ```bash
   cd uniswap-dashboard
   ```

2.2. Clean up the default template files
   - Remove unnecessary content from `src/app/page.tsx`:
   ```bash
   # Replace the entire content with a clean starting point
   ```
   - Delete the default favicon and replace with your own (optional)
   - Remove unused CSS from `src/app/globals.css` (keep Tailwind imports)
   ```

2.3. Verify your setup
   ```bash
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Confirm the app runs without errors
   - You should see a clean page ready for development

> ⚠️ **Note**: Make sure you have Node.js 18.17 or later installed before running these commands.


---

## 3. Pool Dashboard

#### Context
Create a dashboard component that displays pool-specific data using the subgraph to show detailed pool information.

### 3.1. Create subgraph API Route

This component requires a subgraph call, an api route is required to protect keys.

**3.1.1. Create route file**

Create the API route file to handle subgraph requests server-side.

```bash
code ./src/app/api/subgraph/route.ts
```

**3.1.2. Import responses**

Import the necessary Next.js modules for handling API requests.

```typescript
import { NextRequest, NextResponse } from 'next/server';
```

**3.1.3. Create empty route export**

Create the basic POST route handler structure.

```typescript
export async function POST(req: NextRequest) {
  return new NextResponse();
}
```

**3.1.4. Get query from request**

Extract the GraphQL query from the request body.

```typescript
const { query } = await req.json();
```

**3.1.5. Make request to subgraph**

Set up the subgraph URL and make the request to The Graph.

```typescript
const SUBGRAPH_URL = 'https://gateway.thegraph.com/api/subgraphs/id/8cLf29KxAedWLVaEqjV8qKomdwwXQxjptBZFrqWNH5u2';

const response = await fetch(SUBGRAPH_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.GRAPH_API_KEY!}`,
  },
  body: JSON.stringify({ query }),
});
```

**3.1.6. Parse response as JSON and return**

Parse the response from the subgraph and return it to the client.

```typescript
const data = await response.json();
return NextResponse.json(data);
```

**3.1.7. Catch errors**

Wrap the entire function in a try-catch block to handle any errors.

```typescript
try {
  // ... previous code ...
} catch (error) {
  console.error('Error fetching subgraph data:', error);
  return NextResponse.json(
    { error: 'Failed to fetch subgraph data' },
    { status: 500 }
  );
}
```

**3.1.8. Create environment variables file**

Set up the environment variables file to securely store your Graph API key.

```bash
# Create .env.local file in your project root
touch .env.local
```

Add your Graph API key to `.env.local`:

```bash
# .env.local
GRAPH_API_KEY=your-api-key-here
```

> ⚠️ **Security Note**: Never commit your actual API key to version control. The `.env.local` file is automatically ignored by Next.js and should be added to your `.gitignore` file if not already present.

### 3.2. Create PoolDashboard Component

**3.2.1. Create new PoolDashboard component file**

Create a new React component file to display pool data.

```bash
code ./src/components/PoolDashboard.tsx
```

**3.2.2. Empty component that renders component name as h1**

Create a basic component structure with a heading. Add the "use client" directive since this component will use React hooks.

```typescript
'use client';

export default function PoolDashboard() {
  return (
    <div>
      <h1>PoolDashboard</h1>
    </div>
  );
}
```

**3.2.3. Import in page**

Import and use the PoolDashboard component in your main page.

```typescript
import PoolDashboard from '@/components/PoolDashboard';

export default function Home() {
  return (
    <main>
      <PoolDashboard />
    </main>
  );
}
```

**3.2.4. Update PoolDashboard component to add state handlers**

Import React hooks and add state management for data, error, and loading states.

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function PoolDashboard() {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <h1>PoolDashboard</h1>
    </div>
  );
}
```

**3.2.5. Create query constant**

Define the GraphQL query to fetch pool data from the subgraph.

```typescript
const QUERY = `
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
```

**3.2.6. Create data fetching function**

Create a placeholder fetchData function that will be implemented later using the service layer.

```typescript
const fetchData = async () => {
  // This will be implemented in section 3.4 using the service layer
};
```

**3.2.6.1. Add useEffect to trigger data fetch**

Use useEffect to automatically fetch data when the component mounts.

```typescript
useEffect(() => {
  fetchData();
}, []);
```

**3.2.7. Add render logic**

**3.2.7.1. Handle error state**

Display error message if there's an error fetching data.

```typescript
if (err) {
  return (
    <div>
      <h1>PoolDashboard</h1>
      <p>Error: {err}</p>
    </div>
  );
}
```

**3.2.7.2. Handle loading state**

Show loading message while data is being fetched.

```typescript
if (isLoading) {
  return (
    <div>
      <h1>PoolDashboard</h1>
      <p>Loading...</p>
    </div>
  );
}
```

**3.2.7.3. Handle data display**

Display the fetched data as formatted JSON when available.

```typescript
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
```

### 3.3. Create Pool Data Service

**3.3.1. Add getPoolData function to subgraph service**

Add a new function to handle pool data requests in the existing subgraph service file.

```bash
code ./src/lib/subgraph-service.ts
```

**3.3.2. Create getPoolData function**

**3.3.2.1. Create empty async await function**

Create the basic function structure with async/await pattern and define the pool query within the service.

```typescript
const POOL_QUERY = `
  {
    liquidityPool(id: "0x357596DD7a0EF5CB703C5AAe4dA01EDFf176aE95") {
      name
      inputTokenBalances
      symbol
      id
      cumulativeSwapCount
    }
  }
`;

export async function getPoolData() {
  // Function implementation will go here
}
```

**3.3.2.2. Add fetch and parse data**

Implement the fetch request and JSON parsing logic using the defined pool query.

```typescript
export async function getPoolData() {
  const res = await fetch('/api/subgraph', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: POOL_QUERY }),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const json = await res.json();
  return json.data;
}
```

**3.3.2.3. Handle error**

Wrap the function in try-catch block to handle any errors that occur.

```typescript
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
```

### 3.4. Implement getPoolData Function

**3.4.1. Import into component**

Import the getPoolData service function into the PoolDashboard component.

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getPoolData } from '@/lib/subgraph-service';
```

**3.4.2. Create empty fetchData function**

Create a placeholder function for handling data fetching within the component.

```typescript
const fetchData = async () => {
  // Data fetching logic will go here
};
```

**3.4.3. Try catch and finally getPoolData and update loaders**

Implement the fetchData function with proper loading states and error handling using the getPoolData service.

```typescript
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
```

**3.4.4. Implement fetchData in useEffect**

Call the fetchData function when the component mounts using useEffect.

```typescript
useEffect(() => {
  fetchData();
}, []);
```

### 3.5. UI Implementation

#### Context
Enhance the PoolDashboard component with proper UI styling and error handling to create a professional-looking dashboard with user-friendly error states.

**3.5.1. Error UI**

Implement a comprehensive error handling UI that provides clear feedback to users when data fetching fails.

**3.5.1.1. Style the error state**

Replace the basic error display with a styled error UI that includes visual indicators and user actions.

```typescript
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
```

**3.5.1.2. Add no data state**

Handle cases where the API returns successfully but with no pool data available.

```typescript
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
```

> 💡 **Design Note**: The error UI uses Tailwind CSS classes to create a professional appearance with:
> - Red border and colors for critical errors
> - Yellow/amber colors for warning states (no data)
> - Clear messaging and actionable retry buttons
> - Consistent spacing and typography

**3.5.2. UI Loader**

Implement an elegant loading state with animated skeleton placeholders to provide visual feedback while data is being fetched.

**3.5.2.1. Style the loading state**

Replace the basic loading message with an animated skeleton loader that mimics the content structure.

```typescript
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
```

> 💡 **Design Note**: The loading UI features:
> - Animated pulse effect using Tailwind's `animate-pulse` class
> - Skeleton placeholders with varying widths to simulate content
> - Consistent styling with the main dashboard layout
> - Clear loading message for accessibility

**3.5.3. No Data UI**

Implement a user-friendly no data state that handles cases where the API returns successfully but contains no pool information.

**3.5.3.1. Style the no data state**

Create a warning-style UI component that clearly communicates when pool data is unavailable and provides recovery options.

```typescript
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
```

> 💡 **Design Note**: The no data UI provides:
> - Yellow/amber color scheme to indicate a warning state (not an error)
> - Clear messaging explaining the situation to users
> - Retry functionality to attempt data loading again
> - Consistent styling with other UI states for cohesive user experience

**3.5.4. Render UI**

Implement the main dashboard UI that displays pool data in a professional, organized layout with clear visual hierarchy.

**3.5.4.1. Create the main dashboard structure**

Replace the JSON display with a structured dashboard layout that includes header, metrics, and content sections.

```typescript
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
```

> 💡 **Design Note**: The main dashboard UI features:
> - Clean header section with pool name, symbol, and shortened ID
> - Color-coded metric cards for different data types
> - Responsive grid layout that adapts to different screen sizes
> - Professional styling with consistent spacing and typography
> - Interactive refresh button with loading states and accessibility features