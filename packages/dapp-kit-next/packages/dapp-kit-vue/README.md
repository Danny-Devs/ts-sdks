# @mysten/dapp-kit-vue

Vue 3 bindings for `@mysten/dapp-kit-core` - build Sui dApps with Vue's Composition API.

## Installation

```bash
npm install @mysten/dapp-kit-vue @mysten/sui vue
# or
pnpm add @mysten/dapp-kit-vue @mysten/sui vue
```

## Quick Start

```vue
<script setup lang="ts">
import { createDAppKit, DAppKitProvider } from '@mysten/dapp-kit-vue';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

const dAppKit = createDAppKit({
	networks: ['mainnet', 'testnet'],
	defaultNetwork: 'mainnet',
	getClient: (network) => new SuiClient({ url: getFullnodeUrl(network) }),
});
</script>

<template>
	<DAppKitProvider :dAppKit="dAppKit">
		<MyApp />
	</DAppKitProvider>
</template>
```

Then in your components:

```vue
<script setup lang="ts">
import { useCurrentAccount, useConnection } from '@mysten/dapp-kit-vue';

const account = useCurrentAccount();
const connection = useConnection();
</script>

<template>
	<div v-if="connection.isConnected">Connected: {{ account?.address }}</div>
	<div v-else>Not connected</div>
</template>
```

## Available Composables

| Composable            | Description                                            |
| --------------------- | ------------------------------------------------------ |
| `useDAppKit()`        | Get the DAppKit instance                               |
| `useConnection()`     | Get connection state (isConnected, isConnecting, etc.) |
| `useCurrentAccount()` | Get the current connected account                      |
| `useCurrentWallet()`  | Get the current wallet                                 |
| `useWallets()`        | Get all available wallets                              |
| `useSuiClient()`      | Get the Sui client for the current network             |
| `useCurrentNetwork()` | Get the current network                                |

## Connecting & Disconnecting

Use the DAppKit instance to manage wallet connections:

```vue
<script setup lang="ts">
import { useDAppKit, useConnection, useWallets } from '@mysten/dapp-kit-vue';

const dAppKit = useDAppKit();
const connection = useConnection();
const wallets = useWallets();

const connect = async () => {
	const wallet = wallets.value[0]; // Or let user select
	if (wallet) {
		await dAppKit.connect(wallet);
	}
};

const disconnect = async () => {
	await dAppKit.disconnect();
};
</script>

<template>
	<button v-if="!connection.isConnected" @click="connect">Connect</button>
	<button v-else @click="disconnect">Disconnect</button>
</template>
```

## UI Components

The `@mysten/dapp-kit-core` package includes Lit web components for wallet connection UI. These work
**natively in Vue 3** without wrappers:

```vue
<script setup lang="ts">
import '@mysten/dapp-kit-core/web';
</script>

<template>
	<dapp-kit-connect-button></dapp-kit-connect-button>
	<dapp-kit-connect-modal></dapp-kit-connect-modal>
</template>
```

> **Why no Vue component wrappers?** Vue 3 has first-class web component support. The Lit components
> work directly with full reactivity. Wrappers would add complexity without benefit.

## Advanced: Injection Key

For custom composables, access the injection key directly:

```ts
import { DAPP_KIT_KEY } from '@mysten/dapp-kit-vue';
import { inject } from 'vue';

const dAppKit = inject(DAPP_KIT_KEY);
```

## License

Apache-2.0
