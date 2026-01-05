// Copyright (c) Danny & Claude, Apache-2.0

import { useMutation } from '@tanstack/vue-query'
import type { UseMutationOptions, UseMutationReturnType } from '@tanstack/vue-query'
import type { Transaction } from '@mysten/sui/transactions'
import type { SuiSignAndExecuteTransactionOutput } from '@mysten/wallet-standard'
import { useWalletStore } from '../../stores/walletStore'
import { useCurrentAccount } from './useCurrentAccount'

export interface SignAndExecuteTransactionArgs {
	/** Transaction to sign and execute */
	transaction: Transaction
	/** Optional chain identifier */
	chain?: string
}

type UseSignAndExecuteTransactionOptions = Omit<
	UseMutationOptions<SuiSignAndExecuteTransactionOutput, Error, SignAndExecuteTransactionArgs>,
	'mutationFn'
>

/**
 * Composable for signing and executing a transaction
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useSignAndExecuteTransaction } from '@dannydevs/vui-dapp-kit'
 * import { Transaction } from '@mysten/sui/transactions'
 *
 * const { mutate: signAndExecute, isPending, isSuccess } = useSignAndExecuteTransaction()
 *
 * function sendTransaction() {
 *   const tx = new Transaction()
 *   // ... build transaction
 *
 *   signAndExecute(
 *     { transaction: tx },
 *     {
 *       onSuccess: (result) => {
 *         console.log('Transaction executed:', result.digest)
 *       },
 *       onError: (error) => {
 *         console.error('Transaction failed:', error)
 *       },
 *     }
 *   )
 * }
 * </script>
 * ```
 *
 * @param options - Vue Query mutation options
 * @returns Vue Query mutation result with signAndExecute function
 */
export function useSignAndExecuteTransaction(
	options?: UseSignAndExecuteTransactionOptions,
): UseMutationReturnType<SuiSignAndExecuteTransactionOutput, Error, SignAndExecuteTransactionArgs, unknown> {
	const walletStore = useWalletStore()
	const { account } = useCurrentAccount()

	return useMutation({
		mutationKey: ['wallet', 'signAndExecuteTransaction'],
		mutationFn: async ({ transaction, chain }) => {
			const wallet = walletStore.currentWallet
			const currentAccount = account.value

			if (!wallet) {
				throw new Error('No wallet connected')
			}

			if (!currentAccount) {
				throw new Error('No account selected')
			}

			if (!wallet.features['sui:signAndExecuteTransaction']) {
				throw new Error('Wallet does not support signing and executing transactions')
			}

			// Sign and execute the transaction
			const chainId = currentAccount.chains[0]?.split(':')[1] || 'mainnet'
			const result = await wallet.features['sui:signAndExecuteTransaction'].signAndExecuteTransaction({
				transaction,
				account: currentAccount,
				chain: (chain || `sui:${chainId}`) as `${string}:${string}`,
			})

			return result
		},
		...options,
	})
}
