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
   - Clean up `src/app/layout.tsx` metadata to match your project

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

3.1. Get the Uniswap V3 subgraph query URL
   - Navigate to [The Graph Explorer - Uniswap V3 Subgraph](https://thegraph.com/explorer/subgraphs/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV)
   - Locate the "Query URL" section on the subgraph page
   - Copy the query endpoint: `/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`
   - The full query URL will be: `https://gateway.thegraph.com/api/[api-key]/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`
       - Replace `[api-key]` with your API key obtained from step 1.1

> 💡 **Note**: This Uniswap V3 subgraph (v0.0.3) provides access to mainnet data including pools, positions, swaps, and liquidity information.

3.2. Set up environment variables

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

---

3.3. Create GraphQL API service

   - Install the required GraphQL client dependencies:
   ```bash
   npm install urql @urql/core
   ```
   
   - Create the API service file `src/lib/graphql.ts` and build it step by step:

   **Step 1: Import the required dependencies**
   ```typescript
   // Import URQL components for GraphQL operations
   import { createClient, gql } from "urql";
   import { cacheExchange, fetchExchange } from "@urql/core";
   ```
   
   **Step 2: Define the subgraph URL constant**
   ```typescript
   // Store the complete endpoint URL for the Uniswap V3 subgraph
   export const SUBGRAPH_URL =
     "https://gateway.thegraph.com/api/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV";
   ```
   
   **Step 3: Create the authenticated GraphQL client**
   ```typescript
   // Initialize URQL client with authentication and caching
   export const client = createClient({
     url: SUBGRAPH_URL, // Where to send GraphQL queries
     fetchOptions: () => ({
       headers: { 
         // Use Bearer token authentication with your API key
         Authorization: `Bearer ${process.env.GRAPH_API_KEY ?? ""}` 
       },
     }),
     exchanges: [cacheExchange, fetchExchange], // Enable caching and HTTP requests
   });
   ```
   
   **Step 4: Export the GraphQL template literal**
   ```typescript
   // Re-export gql for writing GraphQL queries in your components
   export { gql };
   ```
   
   **Complete file (`src/lib/graphql.ts`):**
   ```typescript
   import { createClient, gql } from "urql";
   import { cacheExchange, fetchExchange } from "@urql/core";

   export const SUBGRAPH_URL =
     "https://gateway.thegraph.com/api/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV";

   export const client = createClient({
     url: SUBGRAPH_URL,
     fetchOptions: () => ({
       headers: { Authorization: `Bearer ${process.env.GRAPH_API_KEY ?? ""}` },
     }),
     exchanges: [cacheExchange, fetchExchange],
   });

   export { gql };
   ```

---

3.4. Create GraphQL queries file

   Create a dedicated file to organize all your GraphQL queries for better maintainability.

   3.4.1. Create the queries directory structure
   ```bash
   # Create directories for organizing GraphQL queries
   mkdir -p src/lib/queries
   ```

   3.4.2. Import the GraphQL utilities
   
   Create `src/lib/queries/network.ts` and import the required dependencies:
   ```typescript
   import { gql } from "@/lib/graphql";
   ```

   3.4.3. Define the network KPI query
   
   Add the GraphQL query for fetching network statistics:
   ```typescript
   export const NETWORK_KPI_QUERY = gql`
     query NetworkKPI {
       # Latest day snapshot (most recent daily rollup)
       current: uniswapDayDatas(
         first: 1
         orderBy: date
         orderDirection: desc
       ) {
         date
         tvlUSD
         volumeUSD
         feesUSD
         txCount
       }

       # Previous day (to compute deltas if you want)
       prev: uniswapDayDatas(
         skip: 1
         first: 1
         orderBy: date
         orderDirection: desc
       ) {
         date
         tvlUSD
         volumeUSD
         feesUSD
         txCount
       }
     }
   `;
   ```

   3.4.4. Complete queries file
   
   The complete `src/lib/queries/network.ts` file:
   ```typescript
   import { gql } from "@/lib/graphql";

   export const NETWORK_KPI_QUERY = gql`
     query NetworkKPI {
       current: uniswapDayDatas(
         first: 1
         orderBy: date
         orderDirection: desc
       ) {
         date
         tvlUSD
         volumeUSD
         feesUSD
         txCount
       }

       prev: uniswapDayDatas(
         skip: 1
         first: 1
         orderBy: date
         orderDirection: desc
       ) {
         date
         tvlUSD
         volumeUSD
         feesUSD
         txCount
       }
     }
   `;
   ```

---

3.5. Create the useNetworkKPI hook

   Create `src/hooks/useNetworkKPI.ts` and build a React hook that uses the query from step 3.4:

   3.5.1. Import the required dependencies and query
   ```typescript
   import React from "react";
   import { useQuery } from "urql";
   import { client } from "@/lib/graphql";
   import { NETWORK_KPI_QUERY } from "@/lib/queries/network";
   ```

   3.5.2. Create the hook function and execute the query
   ```typescript
   export function useNetworkKPI() {
     const [result] = useQuery({
       query: NETWORK_KPI_QUERY, // Using the query from our queries file
       context: { client }, // Use our configured URQL client
     });

     const { data, fetching, error } = result;
   ```

   3.5.3. Process the raw data for easier consumption
   ```typescript
     // Transform the subgraph data into a structured format
     const processedData = React.useMemo(() => {
       if (!data?.current?.[0]) return null;

       const current = data.current[0];
       const prev = data.prev?.[0];

       return {
         tvl: {
           value: parseFloat(current.tvlUSD),
           label: "TVL (USD)",
         },
         volume24h: {
           value: parseFloat(current.volumeUSD),
           label: "24h Volume (USD)",
         },
         fees24h: {
           value: parseFloat(current.feesUSD),
           label: "24h Fees (USD)",
         },
         txCount24h: {
           value: parseInt(current.txCount),
           label: "24h Tx Count",
         },
         // Include previous day data for potential delta calculations
         previousDay: prev ? {
           tvl: parseFloat(prev.tvlUSD),
           volume: parseFloat(prev.volumeUSD),
           fees: parseFloat(prev.feesUSD),
           txCount: parseInt(prev.txCount),
         } : null,
       };
     }, [data]);
   ```

   3.5.4. Return the processed data and loading states
   ```typescript
     return {
       data: processedData,
       loading: fetching,
       error,
     };
   }
   ```


> 💡 **Note**: This hook imports the `NETWORK_KPI_QUERY` from the queries file created in step 3.4, demonstrating proper code organization and reusability.

---

3.6. Create formatting utilities

   Create helper functions to format the numerical data for better display in the dashboard.

   3.6.1. Create the formatting utilities file
   ```bash
   # Create the lib/format.ts file
   touch src/lib/format.ts
   ```

   3.6.2. Add currency formatting function
   ```typescript
   // lib/format.ts
   export function fmtUSD(n: number) {
     return new Intl.NumberFormat(undefined, { 
       style: "currency", 
       currency: "USD", 
       maximumFractionDigits: 0 
     }).format(n);
   }
   ```

   3.6.3. Add number formatting function
   ```typescript
   export function fmtNum(n: number) {
     return new Intl.NumberFormat(undefined, { 
       maximumFractionDigits: 0 
     }).format(n);
   }
   ```

   3.6.4. Add percentage formatting function
   ```typescript
   export function fmtPct(n: number | null) {
     if (n === null) return "—";
     const sign = n >= 0 ? "+" : "";
     return `${sign}${n.toFixed(1)}%`;
   }
   ```

   **Complete formatting file (`src/lib/format.ts`):**
   ```typescript
   // lib/format.ts
   export function fmtUSD(n: number) {
     return new Intl.NumberFormat(undefined, { 
       style: "currency", 
       currency: "USD", 
       maximumFractionDigits: 0 
     }).format(n);
   }

   export function fmtNum(n: number) {
     return new Intl.NumberFormat(undefined, { 
       maximumFractionDigits: 0 
     }).format(n);
   }

   export function fmtPct(n: number | null) {
     if (n === null) return "—";
     const sign = n >= 0 ? "+" : "";
     return `${sign}${n.toFixed(1)}%`;
   }
   ```

> 💡 **Note**: These utilities use the browser's built-in `Intl.NumberFormat` API for consistent, localized number formatting across different regions.

---

3.7. Create the TopBarKPIs UI component

   Build a React component that displays the network KPIs using the hook and formatting utilities from previous steps.

   3.7.1. Create the components directory and file
   ```bash
   # Create the components directory
   mkdir -p src/components
   # Create the TopBarKPIs component file
   touch src/components/TopBarKPIs.tsx
   ```

   3.7.2. Add imports and client directive
   ```typescript
   // components/TopBarKPIs.tsx
   "use client";

   import { useNetworkKPI } from "@/hooks/useNetworkKPI";
   import { fmtNum, fmtPct, fmtUSD } from "@/lib/format";
   ```

   3.7.3. Create the StatCard component
   ```typescript
   function StatCard({
     label,
     value,
     delta,
   }: {
     label: string;
     value: string;
     delta?: number | null;
   }) {
     const up = (delta ?? 0) >= 0;
     return (
       <div className="rounded-2xl border p-4 shadow-sm">
         <div className="text-xs text-gray-500">{label}</div>
         <div className="mt-1 text-xl font-semibold">{value}</div>
         {delta !== undefined && (
           <div className={`mt-1 text-sm ${up ? "text-green-600" : "text-red-600"}`}>
             {fmtPct(delta)}
           </div>
         )}
       </div>
     );
   }
   ```

   3.7.4. Create the main TopBarKPIs component
   ```typescript
   export default function TopBarKPIs() {
     const { loading, error, data } = useNetworkKPI();

     if (loading) return <div className="p-4">Loading KPIs…</div>;
     if (error || !data) return <div className="p-4 text-red-600">Error: {error ?? "No data"}</div>;

     return (
       <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4">
         <StatCard label="TVL (USD)" value={fmtUSD(data.tvl.value)} />
         <StatCard label="24h Volume (USD)" value={fmtUSD(data.volume24h.value)} />
         <StatCard label="24h Fees (USD)" value={fmtUSD(data.fees24h.value)} />
         <StatCard label="24h Tx Count" value={fmtNum(data.txCount24h.value)} />
       </div>
     );
   }
   ```

   **Complete component file (`src/components/TopBarKPIs.tsx`):**
   ```typescript
   // components/TopBarKPIs.tsx
   "use client";

   import { useNetworkKPI } from "@/hooks/useNetworkKPI";
   import { fmtNum, fmtPct, fmtUSD } from "@/lib/format";

   function StatCard({
     label,
     value,
     delta,
   }: {
     label: string;
     value: string;
     delta?: number | null;
   }) {
     const up = (delta ?? 0) >= 0;
     return (
       <div className="rounded-2xl border p-4 shadow-sm">
         <div className="text-xs text-gray-500">{label}</div>
         <div className="mt-1 text-xl font-semibold">{value}</div>
         {delta !== undefined && (
           <div className={`mt-1 text-sm ${up ? "text-green-600" : "text-red-600"}`}>
             {fmtPct(delta)}
           </div>
         )}
       </div>
     );
   }

   export default function TopBarKPIs() {
     const { loading, error, data } = useNetworkKPI();

     if (loading) return <div className="p-4">Loading KPIs…</div>;
     if (error || !data) return <div className="p-4 text-red-600">Error: {error ?? "No data"}</div>;

     return (
       <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4">
         <StatCard label="TVL (USD)" value={fmtUSD(data.tvl.value)} />
         <StatCard label="24h Volume (USD)" value={fmtUSD(data.volume24h.value)} />
         <StatCard label="24h Fees (USD)" value={fmtUSD(data.fees24h.value)} />
         <StatCard label="24h Tx Count" value={fmtNum(data.txCount24h.value)} />
       </div>
     );
   }
   ```
