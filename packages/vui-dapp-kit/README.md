# 🎯 vui-dapp-kit

**The delightful Vue 3 dApp Kit for SUI - built with Composition API magic.**

> Superior developer experience, comprehensive features, and AI-friendly structure. Everything you loved about React dApp Kit, but better—because it's Vue.

[![NPM Version](https://img.shields.io/npm/v/@dannydevs/vui-dapp-kit)](https://www.npmjs.com/package/@dannydevs/vui-dapp-kit)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9%2B-blue)](https://www.typescriptlang.org/)
[![Vue](https://img.shields.io/badge/Vue-3.3%2B-green)](https://vuejs.org/)

---

## ✨ Why vui-dapp-kit?

### For Vue Developers
- 🎨 **Native Vue 3** - Built from the ground up with Composition API
- 🔥 **Better DX** - Composables > Hooks (fight me)
- 💪 **Full TypeScript** - Strict typing with excellent inference
- ⚡ **Reactive** - Vue's reactivity system just works™
- 🎯 **Tree-shakeable** - Only bundle what you use

### Feature Parity + More
- ✅ All React dApp Kit features
- ✅ Better TypeScript types
- ✅ Pinia integration for state management
- ✅ VueUse utilities for enhanced UX
- ✅ Comprehensive documentation
- ✅ AI-friendly code structure
- ✅ Real-world examples

---

## 🚀 Quick Start

### Installation

```bash
npm install @dannydevs/vui-dapp-kit @mysten/sui @tanstack/vue-query pinia
# or
pnpm add @dannydevs/vui-dapp-kit @mysten/sui @tanstack/vue-query pinia
```

### Basic Setup

```vue
<script setup lang="ts">
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { SuiClientProvider } from '@dannydevs/vui-dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'

const pinia = createPinia()
const queryClient = new QueryClient()

const networks = {
  localnet: { url: getFullnodeUrl('localnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
}
</script>

<template>
  <div id="app">
    <VueQueryPlugin :client="queryClient">
      <SuiClientProvider :networks="networks" default-network="mainnet">
        <App />
      </SuiClientProvider>
    </VueQueryPlugin>
  </div>
</template>
```

### Connect a Wallet

```vue
<script setup lang="ts">
import { ConnectButton } from '@dannydevs/vui-dapp-kit'
</script>

<template>
  <ConnectButton />
</template>
```

That's it! You now have a fully-functional SUI dApp with wallet connection.

---

## 📚 Core Features

### Wallet Composables

```vue
<script setup lang="ts">
import {
  useWallets,
  useConnectWallet,
  useCurrentWallet,
  useCurrentAccount,
  useAccounts,
  useDisconnectWallet,
} from '@dannydevs/vui-dapp-kit'

// Get all available wallets
const { wallets, hasWallets } = useWallets()

// Connect to a wallet
const { mutate: connect, isPending } = useConnectWallet()

// Get current connected wallet
const { wallet, isConnected } = useCurrentWallet()

// Get current active account
const { account, isConnected } = useCurrentAccount()

// Get all accounts
const { accounts, count } = useAccounts()

// Disconnect
const { mutate: disconnect } = useDisconnectWallet()
</script>
```

### Transaction Signing

```vue
<script setup lang="ts">
import {
  useSignAndExecuteTransaction,
  useSignTransaction,
  useSignPersonalMessage,
} from '@dannydevs/vui-dapp-kit'

// Sign and execute transaction
const { mutate: signAndExecute } = useSignAndExecuteTransaction()

signAndExecute({
  transaction: myTransaction,
  onSuccess: (result) => {
    console.log('Transaction executed:', result.digest)
  },
})

// Just sign (don't execute)
const { mutate: sign } = useSignTransaction()

// Sign a message
const { mutate: signMessage } = useSignPersonalMessage()
</script>
```

### SUI Client Queries

```vue
<script setup lang="ts">
import {
  useSuiClient,
  useSuiClientQuery,
  useSuiClientMutation,
} from '@dannydevs/vui-dapp-kit'

// Get SUI client instance
const client = useSuiClient()

// Query balance with automatic type inference
const { data: balance, isLoading } = useSuiClientQuery({
  method: 'getBalance',
  params: { owner: account.value?.address },
})

// Query with data transformation
const { data: coinCount } = useSuiClientQuery({
  method: 'getAllBalances',
  params: { owner: account.value?.address },
  select: (balances) => balances.length,
})

// Mutation for write operations
const { mutate: executeRpc } = useSuiClientMutation({
  method: 'dryRunTransactionBlock',
})
</script>
```

---

## 🎨 Components

### ConnectButton

Beautiful, accessible wallet connection button.

```vue
<template>
  <ConnectButton />

  <!-- Custom text -->
  <ConnectButton connect-text="Link Wallet" />

  <!-- Custom styling -->
  <ConnectButton class="my-custom-button" />
</template>
```

### ConnectModal

Fully-featured wallet connection modal with educational content.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ConnectModal } from '@dannydevs/vui-dapp-kit'

const isOpen = ref(false)
</script>

<template>
  <button @click="isOpen = true">Connect Wallet</button>
  <ConnectModal v-model:open="isOpen" />
</template>
```

---

## 🏗️ Architecture

### Built on Solid Foundations

- **@mysten/sui** - Official SUI TypeScript SDK
- **@tanstack/vue-query** - Powerful async state management
- **Pinia** - Vue's official state management
- **VueUse** - Essential Vue composition utilities
- **@mysten/wallet-standard** - Wallet standard implementation

### Why These Choices?

**Vue Query** handles all the hard parts of data fetching:
- Automatic caching and invalidation
- Background refetching
- Optimistic updates
- Request deduplication

**Pinia** manages wallet state:
- Type-safe stores
- DevTools integration
- Plugin ecosystem
- SSR support

**VueUse** provides utilities that make composables delightful:
- `useLocalStorage` for persistence
- `useEventListener` for wallet events
- `useDebounce` for search/filters

---

## 📖 Examples

### Real-World dApp

Check out `/examples/complete-dapp/` for a full-featured example showing:
- Wallet connection
- Transaction signing
- NFT minting
- Token transfers
- Object interactions
- SuiNS integration

### Minimal Examples

Each composable and component has its own example in `/examples/`:
- `wallet-connection/` - Basic wallet integration
- `transaction-signing/` - Sign and execute transactions
- `balance-checker/` - Query blockchain data
- `custom-ui/` - Build your own components

---

## 🎓 Documentation

### Composables

#### Wallet Composables
- [`useWallets()`](./docs/composables/useWallets.md) - Get all available wallets
- [`useConnectWallet()`](./docs/composables/useConnectWallet.md) - Connect to wallet
- [`useDisconnectWallet()`](./docs/composables/useDisconnectWallet.md) - Disconnect wallet
- [`useCurrentWallet()`](./docs/composables/useCurrentWallet.md) - Get connected wallet
- [`useCurrentAccount()`](./docs/composables/useCurrentAccount.md) - Get active account
- [`useAccounts()`](./docs/composables/useAccounts.md) - Get all accounts
- [`useSwitchAccount()`](./docs/composables/useSwitchAccount.md) - Switch accounts
- [`useSignTransaction()`](./docs/composables/useSignTransaction.md) - Sign transaction
- [`useSignAndExecuteTransaction()`](./docs/composables/useSignAndExecuteTransaction.md) - Sign + execute
- [`useSignPersonalMessage()`](./docs/composables/useSignPersonalMessage.md) - Sign message
- [`useAutoConnectWallet()`](./docs/composables/useAutoConnectWallet.md) - Auto-reconnect

#### SUI Client Composables
- [`useSuiClient()`](./docs/composables/useSuiClient.md) - Get SUI client
- [`useSuiClientQuery()`](./docs/composables/useSuiClientQuery.md) - Query blockchain
- [`useSuiClientQueries()`](./docs/composables/useSuiClientQueries.md) - Multiple queries
- [`useSuiClientInfiniteQuery()`](./docs/composables/useSuiClientInfiniteQuery.md) - Paginated queries
- [`useSuiClientMutation()`](./docs/composables/useSuiClientMutation.md) - Mutate state

### Components
- [`<ConnectButton />`](./docs/components/ConnectButton.md) - Wallet connect button
- [`<ConnectModal />`](./docs/components/ConnectModal.md) - Connection modal
- [`<SuiClientProvider />`](./docs/components/SuiClientProvider.md) - Network config
- [`<WalletProvider />`](./docs/components/WalletProvider.md) - Wallet state

---

## 🔥 Advanced Usage

### Custom Wallet UI

Build your own wallet connection UI:

```vue
<script setup lang="ts">
import { useWallets, useConnectWallet } from '@dannydevs/vui-dapp-kit'

const wallets = useWallets()
const { mutate: connect, isPending } = useConnectWallet()

const handleConnect = (walletName: string) => {
  connect(
    { wallet: walletName },
    {
      onSuccess: () => console.log('Connected!'),
      onError: (error) => console.error('Failed:', error),
    }
  )
}
</script>

<template>
  <div class="wallet-list">
    <button
      v-for="wallet in wallets"
      :key="wallet.name"
      :disabled="isPending"
      @click="handleConnect(wallet.name)"
    >
      <img :src="wallet.icon" :alt="wallet.name" />
      {{ wallet.name }}
    </button>
  </div>
</template>
```

### State Persistence

Automatically persist wallet connection:

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useWalletStore } from '@dannydevs/vui-dapp-kit'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

// Wallet state persists to localStorage automatically
const walletStore = useWalletStore()
```

### Network Switching

Switch between networks dynamically:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useSuiClient } from '@dannydevs/vui-dapp-kit'

const currentNetwork = ref('mainnet')
const client = useSuiClient({ network: currentNetwork })

// Switch network
const switchToTestnet = () => {
  currentNetwork.value = 'testnet'
  // Client automatically updates!
}
</script>
```

---

## 🤝 Contributing

We welcome contributions! This library was built to serve the SUI + Vue community.

### How to Contribute

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests
5. Run `pnpm lint` and `pnpm test`
6. Commit: `git commit -m 'feat: add amazing feature'`
7. Push: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Development Setup

```bash
# Clone the monorepo
git clone https://github.com/Danny-Devs/ts-sdks.git
cd ts-sdks

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Work on vui-dapp-kit
cd packages/vui-dapp-kit
pnpm dev

# Run tests
pnpm test

# Run example app
cd examples/complete-dapp
pnpm dev
```

---

## 🐛 Issues & Support

Found a bug? Have a feature request?

- 🐛 [Report an issue](https://github.com/Danny-Devs/ts-sdks/issues/new)
- 💬 [Join SUI Discord](https://discord.gg/sui)
- 📧 Email: danny@dannydevs.com

---

## 📝 License

Apache-2.0 © Danny

---

## 🙏 Acknowledgments

- **Mysten Labs** - For the incredible SUI blockchain and React dApp Kit inspiration
- **Vue.js Team** - For the best frontend framework
- **TanStack** - For Vue Query
- **SUI Community** - For being awesome

---

## 🎯 Roadmap

### v0.1.0 (Current - November 2024)
- ✅ Core wallet composables (9 composables)
- ✅ SUI client composables with type inference
- ✅ ConnectButton component with dropdown
- ✅ ConnectModal component
- ✅ Full TypeScript support
- ✅ Pinia state management
- ✅ Vue Query integration
- ✅ Comprehensive README

### v0.2.0 (Next)
- [ ] Comprehensive documentation for each composable
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] Example applications
- [ ] SuiNS name resolution integration

### v0.3.0 (Future)
- [ ] Advanced UI components (transaction history, NFT gallery)
- [ ] SSR/SSG support (Nuxt 3 compatibility)
- [ ] zkSend integration
- [ ] Transaction builder UI
- [ ] DevTools extension

---

**Built with ❤️ by [@Danny-Devs](https://github.com/Danny-Devs)**

*Making Vue + SUI development delightful, one composable at a time.*
