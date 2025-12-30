// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Re-export everything from core
export * from '@mysten/dapp-kit-core';

// Components
export { default as DAppKitProvider } from './components/DAppKitProvider.vue';

// Composables
export { useDAppKit } from './composables/useDAppKit.js';
export { useConnection } from './composables/useConnection.js';
export type { UseConnectionOptions } from './composables/useConnection.js';
export { useCurrentAccount } from './composables/useCurrentAccount.js';
export type { UseCurrentAccountOptions } from './composables/useCurrentAccount.js';
export { useCurrentWallet } from './composables/useCurrentWallet.js';
export type { UseCurrentWalletOptions } from './composables/useCurrentWallet.js';
export { useWallets } from './composables/useWallets.js';
export type { UseWalletsOptions } from './composables/useWallets.js';
export { useSuiClient } from './composables/useSuiClient.js';
export type { UseSuiClientOptions } from './composables/useSuiClient.js';
export { useCurrentNetwork } from './composables/useCurrentNetwork.js';
export type { UseCurrentNetworkOptions } from './composables/useCurrentNetwork.js';

// Constants (for advanced usage)
export { DAPP_KIT_KEY } from './constants.js';
