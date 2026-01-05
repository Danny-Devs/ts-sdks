# Example 02: Balance Checker

**Demonstrates:** Querying blockchain data using `useSuiClientQuery`

## What This Shows

- Multiple queries running in parallel
- Automatic type inference for RPC methods
- Loading and error states
- Data transformation with `select`
- Reactive query parameters

## Run This Example

```bash
pnpm install
pnpm dev
```

Open http://localhost:5175/

## Code Walkthrough

### 1. Basic Query

```ts
const { data: balance, isLoading, error } = useSuiClientQuery({
  method: 'getBalance',
  params: computed(() => ({ owner: account.value?.address || '' })),
  enabled: computed(() => !!account.value),
})
```

**Key Points:**
- `method` - Any SuiClient RPC method (types are auto-inferred!)
- `params` - Parameters for that method (also type-checked)
- `enabled` - Only run when account exists
- Returns reactive `data`, `isLoading`, `error`

### 2. Multiple Queries

```ts
// Query 1: SUI balance
const { data: balance } = useSuiClientQuery({
  method: 'getBalance',
  params: computed(() => ({ owner: account.value?.address || '' })),
})

// Query 2: All coin balances
const { data: allBalances } = useSuiClientQuery({
  method: 'getAllBalances',
  params: computed(() => ({ owner: account.value?.address || '' })),
})
```

Both queries run in parallel automatically!

### 3. Data Transformation

```ts
const { data: coinCount } = useSuiClientQuery({
  method: 'getAllBalances',
  params: computed(() => ({ owner: account.value?.address || '' })),
  select: (balances) => balances.length, // Transform data before returning
})
```

The `select` option lets you transform the data before it reaches your component.

## Available RPC Methods

The `method` parameter accepts any `SuiClient` method:

**Balance & Coins:**
- `getBalance` - Get SUI balance
- `getAllBalances` - Get all coin balances
- `getCoins` - Get coin objects
- `getAllCoins` - Get all coins with pagination

**Objects:**
- `getObject` - Get object details
- `getOwnedObjects` - Get all owned objects
- `multiGetObjects` - Batch get objects

**Transactions:**
- `getTransactionBlock` - Get transaction details
- `multiGetTransactionBlocks` - Batch get transactions
- `queryTransactionBlocks` - Query with filters

**And 40+ more methods!** All with automatic type inference.

## Key Features

✅ **Type-Safe** - Method and params are fully typed
✅ **Auto-Caching** - Results cached by Vue Query
✅ **Auto-Refetch** - Keeps data fresh in background
✅ **Loading States** - Built-in loading/error handling
✅ **Reactive** - Updates when params change

## Next Steps

- [Example 03: Transaction Signer](../03-transaction-signer/) - Sign and execute transactions
- [Full API Documentation](../../README.md)
