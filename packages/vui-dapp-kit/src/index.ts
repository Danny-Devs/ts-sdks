// Copyright (c) Danny & Claude, Apache-2.0

/**
 * vui-dapp-kit - The delightful Vue 3 dApp Kit for SUI
 *
 * Built with Composition API magic for superior DX.
 * Everything you loved about React dApp Kit, but better—because it's Vue.
 *
 * @packageDocumentation
 */

// ==================== COMPOSABLES ====================

// Wallet Composables
export { useConnectWallet } from './composables/wallet/useConnectWallet'
export { useDisconnectWallet } from './composables/wallet/useDisconnectWallet'
export { useCurrentWallet } from './composables/wallet/useCurrentWallet'
export { useCurrentAccount } from './composables/wallet/useCurrentAccount'
export { useAccounts } from './composables/wallet/useAccounts'
export { useWallets } from './composables/wallet/useWallets'
export { useSwitchAccount } from './composables/wallet/useSwitchAccount'
export { useSignTransaction } from './composables/wallet/useSignTransaction'
export { useSignAndExecuteTransaction } from './composables/wallet/useSignAndExecuteTransaction'
export { useSignPersonalMessage } from './composables/wallet/useSignPersonalMessage'

// SUI Client Composables
export { useSuiClient, useSuiClientContext, SuiClientContextKey } from './composables/client/useSuiClient'
export type { SuiClientContext } from './composables/client/useSuiClient'
export {
	useSuiClientQuery,
	getSuiClientQuery,
} from './composables/client/useSuiClientQuery'
export type {
	SuiRpcMethodName,
	SuiRpcMethods,
	UseSuiClientQueryOptions,
	GetSuiClientQueryOptions,
} from './composables/client/useSuiClientQuery'
export { useSuiClientMutation } from './composables/client/useSuiClientMutation'
export type { UseSuiClientMutationOptions } from './composables/client/useSuiClientMutation'

// ==================== STORES ====================

export { useWalletStore } from './stores/walletStore'
export type { WalletStoreConfig } from './stores/walletStore'

// ==================== TYPES ====================

export type {
	WalletConnectionStatus,
	ConnectWalletArgs,
	ConnectWalletResult,
	NetworkConfig,
	NetworkConfigs,
	WalletState,
	WalletActions,
	WalletStore,
} from './types'

// Re-export wallet-standard types for convenience
export type {
	Wallet,
	WalletAccount,
	WalletWithRequiredFeatures,
} from '@mysten/wallet-standard'

// ==================== COMPONENTS ====================

export { default as SuiClientProvider } from './components/SuiClientProvider.vue'
export type { SuiClientProviderProps } from './components/SuiClientProvider.vue'

export { default as ConnectButton } from './components/ConnectButton.vue'
export type { ConnectButtonProps } from './components/ConnectButton.vue'

export { default as ConnectModal } from './components/connect-modal/ConnectModal.vue'
export type { ConnectModalProps } from './components/connect-modal/ConnectModal.vue'

export { default as Button } from './components/ui/Button.vue'
export type { ButtonProps } from './components/ui/Button.vue'

// TODO: WalletProvider component coming soon
// export { default as WalletProvider } from './components/WalletProvider.vue'

// ==================== UTILS ====================

export { getWalletUniqueIdentifier, getSelectedAccount, filterSuiAccounts } from './utils/walletUtils'
