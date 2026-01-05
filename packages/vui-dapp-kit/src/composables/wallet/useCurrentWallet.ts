// Copyright (c) Danny & Claude, Apache-2.0

import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import { useWalletStore } from '../../stores/walletStore'

export interface UseCurrentWalletResult {
	/** Currently connected wallet (null if not connected) */
	wallet: ComputedRef<WalletWithRequiredFeatures | null>
	/** Connection status */
	connectionStatus: ComputedRef<string>
	/** Is wallet connected */
	isConnected: ComputedRef<boolean>
	/** Is wallet connecting */
	isConnecting: ComputedRef<boolean>
	/** Is wallet disconnected */
	isDisconnected: ComputedRef<boolean>
}

/**
 * Get the currently connected wallet
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useCurrentWallet } from '@dannydevs/vui-dapp-kit'
 *
 * const { wallet, isConnected } = useCurrentWallet()
 * </script>
 *
 * <template>
 *   <div v-if="isConnected">
 *     Connected to: {{ wallet?.name }}
 *   </div>
 * </template>
 * ```
 */
export function useCurrentWallet(): UseCurrentWalletResult {
	const walletStore = useWalletStore()

	return {
		wallet: computed(() => walletStore.currentWallet),
		connectionStatus: computed(() => walletStore.connectionStatus),
		isConnected: computed(() => walletStore.isConnected),
		isConnecting: computed(() => walletStore.isConnecting),
		isDisconnected: computed(() => walletStore.isDisconnected),
	}
}
