// Copyright (c) Danny & Claude, Apache-2.0

import { useMutation } from '@tanstack/vue-query'
import type { UseMutationOptions, UseMutationReturnType } from '@tanstack/vue-query'
import type { WalletAccount } from '@mysten/wallet-standard'
import { useWalletStore } from '../../stores/walletStore'

export interface SwitchAccountArgs {
	/** Account to switch to */
	account: WalletAccount
}

type UseSwitchAccountOptions = Omit<
	UseMutationOptions<void, Error, SwitchAccountArgs>,
	'mutationFn'
>

/**
 * Composable for switching between accounts
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useAccounts, useSwitchAccount } from '@dannydevs/vui-dapp-kit'
 *
 * const { accounts } = useAccounts()
 * const { mutate: switchAccount } = useSwitchAccount()
 * </script>
 *
 * <template>
 *   <select @change="(e) => switchAccount({ account: accounts[e.target.value] })">
 *     <option v-for="(account, index) in accounts" :key="account.address" :value="index">
 *       {{ account.address }}
 *     </option>
 *   </select>
 * </template>
 * ```
 *
 * @param options - Vue Query mutation options
 * @returns Vue Query mutation result with switchAccount function
 */
export function useSwitchAccount(
	options?: UseSwitchAccountOptions,
): UseMutationReturnType<void, Error, SwitchAccountArgs, unknown> {
	const walletStore = useWalletStore()

	return useMutation({
		mutationKey: ['wallet', 'switchAccount'],
		mutationFn: async ({ account }) => {
			const accounts = walletStore.accounts

			// Verify account exists
			const accountExists = accounts.some((a: WalletAccount) => a.address === account.address)
			if (!accountExists) {
				throw new Error('Account not found in connected accounts')
			}

			// Update store
			walletStore.setAccountSwitched(account)
		},
		...options,
	})
}
