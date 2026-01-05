// Copyright (c) Danny & Claude, Apache-2.0

import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { WalletAccount } from '@mysten/wallet-standard'
import { useWalletStore } from '../../stores/walletStore'

export interface UseAccountsResult {
	/** All connected accounts */
	accounts: ComputedRef<readonly WalletAccount[]>
	/** Number of accounts */
	count: ComputedRef<number>
	/** Has any accounts */
	hasAccounts: ComputedRef<boolean>
}

/**
 * Get all connected accounts from the current wallet
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useAccounts } from '@dannydevs/vui-dapp-kit'
 *
 * const { accounts, count, hasAccounts } = useAccounts()
 * </script>
 *
 * <template>
 *   <div v-if="hasAccounts">
 *     <div>Total accounts: {{ count }}</div>
 *     <ul>
 *       <li v-for="account in accounts" :key="account.address">
 *         {{ account.address }}
 *       </li>
 *     </ul>
 *   </div>
 * </template>
 * ```
 */
export function useAccounts(): UseAccountsResult {
	const walletStore = useWalletStore()

	return {
		accounts: computed(() => walletStore.accounts),
		count: computed(() => walletStore.accounts.length),
		hasAccounts: computed(() => walletStore.hasAccounts),
	}
}
