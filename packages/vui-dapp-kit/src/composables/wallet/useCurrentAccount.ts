// Copyright (c) Danny & Claude, Apache-2.0

import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { WalletAccount } from '@mysten/wallet-standard'
import { useWalletStore } from '../../stores/walletStore'

export interface UseCurrentAccountResult {
	/** Currently selected account (null if not connected) */
	account: ComputedRef<WalletAccount | null>
	/** Account address (null if not connected) */
	address: ComputedRef<string | null>
}

/**
 * Get the currently selected account
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useCurrentAccount } from '@dannydevs/vui-dapp-kit'
 *
 * const { account, address } = useCurrentAccount()
 * </script>
 *
 * <template>
 *   <div v-if="account">
 *     <div>Address: {{ address }}</div>
 *     <div>Chains: {{ account.chains.join(', ') }}</div>
 *   </div>
 * </template>
 * ```
 */
export function useCurrentAccount(): UseCurrentAccountResult {
	const walletStore = useWalletStore()

	return {
		account: computed(() => walletStore.currentAccount),
		address: computed(() => walletStore.currentAccount?.address ?? null),
	}
}
