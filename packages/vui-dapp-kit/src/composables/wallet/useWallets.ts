// Copyright (c) Danny & Claude, Apache-2.0

import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import { useWalletStore } from '../../stores/walletStore'

export interface UseWalletsResult {
	/** All available wallets */
	wallets: ComputedRef<WalletWithRequiredFeatures[]>
	/** Number of available wallets */
	count: ComputedRef<number>
	/** Has any wallets available */
	hasWallets: ComputedRef<boolean>
}

/**
 * Get all available SUI wallets
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useWallets, useConnectWallet } from '@dannydevs/vui-dapp-kit'
 *
 * const { wallets, hasWallets } = useWallets()
 * const { mutate: connect } = useConnectWallet()
 * </script>
 *
 * <template>
 *   <div v-if="hasWallets">
 *     <button
 *       v-for="wallet in wallets"
 *       :key="wallet.name"
 *       @click="connect({ wallet })"
 *     >
 *       <img v-if="wallet.icon" :src="wallet.icon" :alt="wallet.name" />
 *       {{ wallet.name }}
 *     </button>
 *   </div>
 *   <div v-else>
 *     No SUI wallets detected. Please install a wallet extension.
 *   </div>
 * </template>
 * ```
 */
export function useWallets(): UseWalletsResult {
	const walletStore = useWalletStore()

	return {
		wallets: computed(() => walletStore.wallets),
		count: computed(() => walletStore.wallets.length),
		hasWallets: computed(() => walletStore.wallets.length > 0),
	}
}
