# 🧪 Bootcamp Template - Uniswap Dashboard

A beginner-friendly tutorial for building and deploying a Uniswap v3 dashboard using The Graph subgraph and React TypeScript. This bootcamp template provides end-to-end guidance for Web3 developers learning to interact with DeFi protocols.

---

## 📘 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Initialization](#project-initialization)
3. [Dashboard Development](#dashboard-development)

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

## 3. Dashboard Development

#### Context
Implement the core dashboard functionality by integrating with the Uniswap v3 subgraph to display real-time DeFi data.

### 3.1. Get the Uniswap V3 subgraph query URL
   - Navigate to [The Graph Explorer - Uniswap V3 Subgraph](https://thegraph.com/explorer/subgraphs/ESdrTJ3twMwWVoQ1hUE2u7PugEHX3QkenudD6aXCkDQ4)
   - Locate the "Query URL" section on the subgraph page
   - Copy the query endpoint: `/subgraphs/id/ESdrTJ3twMwWVoQ1hUE2u7PugEHX3QkenudD6aXCkDQ4`
   - The full query URL will be: `https://gateway.thegraph.com/api/[api-key]/subgraphs/id/ESdrTJ3twMwWVoQ1hUE2u7PugEHX3QkenudD6aXCkDQ4`
       - Replace `[api-key]` with your API key obtained from step 1.1

> 💡 **Note**: This Uniswap V3 subgraph (v0.0.3) provides access to mainnet data including pools, positions, swaps, and liquidity information.

### 3.2. Set up environment variables

   - Create an environment variables file:
   ```bash
   # Create .env.local file in your project root
   touch .env.local
   ```
   
   - Add your Graph API key to `.env.local`:
   ```bash
   # .env.local
   GRAPH_API_KEY=your-key-here
   ```

> ⚠️ **Security Note**: Never commit your actual API key to version control. Add `.env.local` to your `.gitignore` file.

### 3.3. Create Subgraph API route

**3.3.1. Create route file**

Create the API route file to handle subgraph requests server-side.

```bash
code ./src/app/api/subgraph/route.ts
```

**3.3.2. Import responses**

Import the necessary Next.js modules for handling API requests.

```typescript
import { NextRequest, NextResponse } from 'next/server';
```

**3.3.3. Create empty route export**

Create the basic POST route handler structure.

```typescript
export async function POST(req: NextRequest) {
  return new NextResponse();
}
```

**3.3.4. Get query from request**

Extract the GraphQL query from the request body.

```typescript
const { query } = await req.json();
```

**3.3.5. Make request to subgraph**

Set up the subgraph URL and make the request to The Graph.

```typescript
const SUBGRAPH_URL = 'https://gateway.thegraph.com/api/subgraphs/id/ESdrTJ3twMwWVoQ1hUE2u7PugEHX3QkenudD6aXCkDQ4';

const response = await fetch(SUBGRAPH_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.GRAPH_API_KEY!}`,
  },
  body: JSON.stringify({ query }),
});
```

**3.3.6. Parse response as JSON and return**

Parse the response from the subgraph and return it to the client.

```typescript
const data = await response.json();
return NextResponse.json(data);
```

**3.3.7. Catch errors**

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

### 3.4. Create Query Component

**3.4.1. Create new Factory component file**

Create a new React component file to display Uniswap factory data.

```bash
code ./src/components/Factories.tsx
```

**3.4.2. Empty component that renders component name as h1**

Create a basic component structure with a heading. Add the "use client" directive since this component will use React hooks.

```typescript
'use client';

export default function Factories() {
  return (
    <div>
      <h1>Factories</h1>
    </div>
  );
}
```

**3.4.3. Import in page**

Import and use the Factories component in your main page.

```typescript
import Factories from '@/components/Factories';

export default function Home() {
  return (
    <main>
      <Factories />
    </main>
  );
}
```

**3.4.4. Update Factories component to add state handlers**

Import React hooks and add state management for data, error, and loading states.

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function Factories() {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <h1>Factories</h1>
    </div>
  );
}
```

**3.4.5. Create data fetching function**

Create a placeholder fetchData function that will be implemented later using the service layer.

```typescript
const fetchData = async () => {
  // This will be implemented in section 3.6 using the service layer
};
```

**3.4.5.1. Add useEffect to trigger data fetch**

Use useEffect to automatically fetch data when the component mounts.

```typescript
useEffect(() => {
  fetchData();
}, []);
```

**3.4.6. Add render logic**

**3.4.6.1. Handle error state**

Display error message if there's an error fetching data.

```typescript
if (err) {
  return (
    <div>
      <h1>Factories</h1>
      <p>Error: {err}</p>
    </div>
  );
}
```

**3.4.6.2. Handle loading state**

Show loading message while data is being fetched.

```typescript
if (isLoading) {
  return (
    <div>
      <h1>Factories</h1>
      <p>Loading...</p>
    </div>
  );
}
```

**3.4.6.3. Handle data display**

Display the fetched data as formatted JSON when available.

```typescript
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
```

### 3.5. Create Query Factory Service

**3.5.1. Create file src/lib/subgraph-service**

Create a dedicated service file to handle subgraph API requests.

```bash
code ./src/lib/subgraph-service.ts
```

**3.5.2. Create getFactory function**

**3.5.2.1. Create empty async await function**

Create the basic function structure with async/await pattern and define the query within the service.

```typescript
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
  // Function implementation will go here
}
```

**3.5.2.2. Add fetch and parse data**

Implement the fetch request and JSON parsing logic using the defined query.

```typescript
export async function getFactory() {
  const res = await fetch('/api/subgraph', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY }),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const json = await res.json();
  return json.data;
}
```

**3.5.2.3. Handle error**

Wrap the function in try-catch block to handle any errors that occur.

```typescript
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
```

### 3.6. Implement getFactory Function

**3.6.1. Import into component**

Import the getFactory service function into the Factories component.

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getFactory } from '@/lib/subgraph-service';
```

**3.6.2. Create empty fetchData function**

Create a placeholder function for handling data fetching within the component.

```typescript
const fetchData = async () => {
  // Data fetching logic will go here
};
```

**3.6.3. Try catch and finally getFactory and update loaders**

Implement the fetchData function with proper loading states and error handling using the getFactory service.

```typescript
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
```

**3.6.4. Implement fetchData in useEffect**

Call the fetchData function when the component mounts using useEffect.

```typescript
useEffect(() => {
  fetchData();
}, []);
```

### 3.7. Create Factory Render Card

**3.7.1. Add main container with background**

Create a full-height light gray background with page padding.

```typescript
return (
  <main className="min-h-screen bg-gray-100 p-6">
    {/* Content will go here */}
  </main>
);
```

**3.7.2. Add outer card container**

Create a centered card with white background, shadow, and rounded corners.

```typescript
<main className="min-h-screen bg-gray-100 p-6">
  <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 border">
    {/* Card content will go here */}
  </div>
</main>
```

**3.7.3. Add title heading**

Create a bigger, bold heading with bottom margin.

```typescript
<div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 border">
  <h2 className="text-xl font-semibold mb-4">Factory Data</h2>
  {/* Rest of content */}
</div>
```

**3.7.4. Add content wrapper**

Create a container with vertical spacing between sections.

```typescript
<h2 className="text-xl font-semibold mb-4">Factory Data</h2>
<div className="space-y-3">
  {/* Sections will go here */}
</div>
```

**3.7.5. Add Factory ID block**

Display factory ID with small, muted label text.

```typescript
<div className="space-y-3">
  <div>
    <label className="text-sm text-gray-500">Factory ID</label>
    <p className="font-mono text-sm break-all">{data.factories[0]?.id}</p>
  </div>
</div>
```

**3.7.6. Add two-column stats grid**

Create a grid layout for statistics with mini cards.

```typescript
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
```

**3.7.7. Add Total Volume section**

Format large decimal string using Number().toLocaleString() to add thousands separators and drop decimals.

```typescript
<div>
  <label className="text-sm text-gray-500">Total Volume USD</label>
  <p className="text-lg font-bold text-green-600">
    ${Number(data.factories[0]?.totalVolumeUSD).toLocaleString(undefined, { maximumFractionDigits: 0 })}
  </p>
</div>
```

**3.7.8. Add ETH Price section**

Display ETH price from bundles data with proper formatting.

```typescript
<div>
  <label className="text-sm text-gray-500">ETH Price</label>
  <p className="text-lg font-bold text-blue-600">
    ${Number(data.bundles[0]?.ethPriceUSD).toLocaleString(undefined, { maximumFractionDigits: 2 })}
  </p>
</div>
```

---

## 4. Pool Dashboard

#### Context
Create a second dashboard component that displays pool-specific data using the Messari subgraph to show detailed pool information.

### 4.1. Create Messari API Route

This component requires a Messari subgraph so another route is required.

**4.1.1. Create route file**

Create the API route file to handle Messari subgraph requests server-side.

```bash
code ./src/app/api/messari/route.ts
```

**4.1.2. Import responses**

Import the necessary Next.js modules for handling API requests.

```typescript
import { NextRequest, NextResponse } from 'next/server';
```

**4.1.3. Create empty route export**

Create the basic POST route handler structure.

```typescript
export async function POST(req: NextRequest) {
  return new NextResponse();
}
```

**4.1.4. Get query from request**

Extract the GraphQL query from the request body.

```typescript
const { query } = await req.json();
```

**4.1.5. Make request to Messari subgraph**

Set up the Messari subgraph URL and make the request to The Graph.

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

**4.1.6. Parse response as JSON and return**

Parse the response from the subgraph and return it to the client.

```typescript
const data = await response.json();
return NextResponse.json(data);
```

**4.1.7. Catch errors**

Wrap the entire function in a try-catch block to handle any errors.

```typescript
try {
  // ... previous code ...
} catch (error) {
  console.error('Error fetching Messari subgraph data:', error);
  return NextResponse.json(
    { error: 'Failed to fetch Messari subgraph data' },
    { status: 500 }
  );
}
```

### 4.2. Create PoolDashboard Component

**4.2.1. Create new PoolDashboard component file**

Create a new React component file to display pool data.

```bash
code ./src/components/PoolDashboard.tsx
```

**4.2.2. Empty component that renders component name as h1**

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

**4.2.3. Import in page**

Import and use the PoolDashboard component in your main page.

```typescript
import Factories from '@/components/Factories';
import PoolDashboard from '@/components/PoolDashboard';

export default function Home() {
  return (
    <main>
      <Factories />
      <PoolDashboard />
    </main>
  );
}
```

**4.2.4. Update PoolDashboard component to add state handlers**

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

**4.2.5. Create query constant**

Define the GraphQL query to fetch pool data from the Messari subgraph.

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

**4.2.6. Create data fetching function**

Create a placeholder fetchData function that will be implemented later using the service layer.

```typescript
const fetchData = async () => {
  // This will be implemented in section 4.4 using the service layer
};
```

**4.2.6.1. Add useEffect to trigger data fetch**

Use useEffect to automatically fetch data when the component mounts.

```typescript
useEffect(() => {
  fetchData();
}, []);
```

**4.2.7. Add render logic**

**4.2.7.1. Handle error state**

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

**4.2.7.2. Handle loading state**

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

**4.2.7.3. Handle data display**

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

### 4.3. Create Pool Data Service

**4.3.1. Add getPoolData function to subgraph service**

Add a new function to handle pool data requests in the existing subgraph service file.

```bash
code ./src/lib/subgraph-service.ts
```

**4.3.2. Create getPoolData function**

**4.3.2.1. Create empty async await function**

Create the basic function structure with async/await pattern and define the pool query within the service.

```typescript
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
  // Function implementation will go here
}
```

**4.3.2.2. Add fetch and parse data**

Implement the fetch request and JSON parsing logic using the defined pool query.

```typescript
export async function getPoolData() {
  const res = await fetch('/api/messari', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: POOL_QUERY }),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const json = await res.json();
  return json.data;
}
```

**4.3.2.3. Handle error**

Wrap the function in try-catch block to handle any errors that occur.

```typescript
export async function getPoolData() {
  try {
    const res = await fetch('/api/messari', {
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

### 4.4. Implement getPoolData Function

**4.4.1. Import into component**

Import the getPoolData service function into the PoolDashboard component.

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getPoolData } from '@/lib/subgraph-service';
```

**4.4.2. Create empty fetchData function**

Create a placeholder function for handling data fetching within the component.

```typescript
const fetchData = async () => {
  // Data fetching logic will go here
};
```

**4.4.3. Try catch and finally getPoolData and update loaders**

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

**4.4.4. Implement fetchData in useEffect**

Call the fetchData function when the component mounts using useEffect.

```typescript
useEffect(() => {
  fetchData();
}, []);
```

---
