# Example 01: Wallet Connection

**Demonstrates:** Simple wallet connection using `<ConnectButton>`

## What This Shows

- Using the `<ConnectButton>` component
- Detecting connection status with `useCurrentAccount()`
- Accessing wallet info with `useCurrentWallet()`
- Displaying connected account details

## Run This Example

```bash
pnpm install
pnpm dev
```

Open http://localhost:5174/

## Code Walkthrough

### 1. Setup Providers

```vue
<SuiClientProvider :networks="networks" default-network="testnet">
  <div class="container">
    <!-- Your app -->
  </div>
</SuiClientProvider>
```

The `SuiClientProvider` wraps your app and provides network configuration.

### 2. Add Connect Button

```vue
<ConnectButton />
```

That's it! The button handles everything:
- Shows wallet list modal
- Manages connection state
- Displays connected account
- Provides disconnect option

### 3. Access Connection State

```ts
const { account, isConnected } = useCurrentAccount()
const { wallet } = useCurrentWallet()
```

Use these composables to:
- Check if wallet is connected (`isConnected`)
- Get current account details (`account`)
- Get wallet information (`wallet`)

## Key Features

✅ **Zero Configuration** - Works out of the box
✅ **Auto-Reconnect** - Remembers last connected wallet
✅ **Multi-Account** - Dropdown to switch between accounts
✅ **Beautiful UI** - Pre-styled with smooth animations

## Next Steps

- [Example 02: Balance Checker](../02-balance-checker/) - Query blockchain data
- [Example 03: Transaction Signer](../03-transaction-signer/) - Sign transactions
- [Full Documentation](../../README.md)
