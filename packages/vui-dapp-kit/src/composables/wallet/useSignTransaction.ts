// Copyright (c) Danny & Claude, Apache-2.0

import { useMutation } from '@tanstack/vue-query'
import type { UseMutationOptions, UseMutationReturnType } from '@tanstack/vue-query'
import type { Transaction } from '@mysten/sui/transactions'
import type { SignedTransaction } from '@mysten/wallet-standard'
import { useWalletStore } from '../../stores/walletStore'
import { useCurrentAccount } from './useCurrentAccount'

export interface SignTransactionArgs {
	/** Transaction to sign (not execute) */
	transaction: Transaction
	/** Optional chain identifier */
	chain?: string
}

type UseSignTransactionOptions = Omit<
	UseMutationOptions<SignedTransaction, Error, SignTransactionArgs>,
	'mutationFn'
>

/**
 * Composable for signing a transaction without executing it
 *
 * Use this when you want to sign a transaction but execute it later or elsewhere.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useSignTransaction } from '@dannydevs/vui-dapp-kit'
 * import { Transaction } from '@mysten/sui/transactions'
 *
 * const { mutate: sign, data: signedTx } = useSignTransaction()
 *
 * function signForLater() {
 *   const tx = new Transaction()
 *   // ... build transaction
 *
 *   sign(
 *     { transaction: tx },
 *     {
 *       onSuccess: (result) => {
 *         console.log('Signature:', result.signature)
 *         console.log('Signed bytes:', result.bytes)
 *         // Can execute later with signedTx
 *       },
 *     }
 *   )
 * }
 * </script>
 * ```
 *
 * @param options - Vue Query mutation options
 * @returns Vue Query mutation result with sign function
 */
export function useSignTransaction(
	options?: UseSignTransactionOptions,
): UseMutationReturnType<SignedTransaction, Error, SignTransactionArgs, unknown> {
	const walletStore = useWalletStore()
	const { account } = useCurrentAccount()

	return useMutation({
		mutationKey: ['wallet', 'signTransaction'],
		mutationFn: async ({ transaction, chain }) => {
			const wallet = walletStore.currentWallet
			const currentAccount = account.value

			if (!wallet) {
				throw new Error('No wallet connected')
			}

			if (!currentAccount) {
				throw new Error('No account selected')
			}

			if (!wallet.features['sui:signTransaction']) {
				throw new Error('Wallet does not support transaction signing')
			}

			// Sign the transaction
			const chainId = currentAccount.chains[0]?.split(':')[1] || 'mainnet'
			const result = await wallet.features['sui:signTransaction'].signTransaction({
				transaction,
				account: currentAccount,
				chain: (chain || `sui:${chainId}`) as `${string}:${string}`,
			})

			return result
		},
		...options,
	})
}
