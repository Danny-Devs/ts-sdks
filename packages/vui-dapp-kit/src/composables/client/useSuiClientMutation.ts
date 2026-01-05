// Copyright (c) Danny & Claude, Apache-2.0

import { useMutation } from '@tanstack/vue-query'
import type { UseMutationOptions, UseMutationReturnType } from '@tanstack/vue-query'
import { useSuiClient } from './useSuiClient'
import type { SuiRpcMethods } from './useSuiClientQuery'

/**
 * Options for useSuiClientMutation
 */
export type UseSuiClientMutationOptions<T extends keyof SuiRpcMethods> = Omit<
	UseMutationOptions<
		SuiRpcMethods[T]['result'],
		Error,
		SuiRpcMethods[T]['params']
	>,
	'mutationFn'
>

/**
 * Mutation hook for making RPC calls that modify blockchain state
 *
 * Use this for write operations or any RPC calls you want to trigger manually.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useSuiClientMutation } from '@dannydevs/vui-dapp-kit'
 *
 * const { mutate: executeTransaction, isPending } = useSuiClientMutation({
 *   method: 'executeTransactionBlock',
 * })
 *
 * function handleSubmit(txBytes: string, signature: string) {
 *   executeTransaction(
 *     {
 *       transactionBlock: txBytes,
 *       signature,
 *       options: { showEffects: true },
 *     },
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
 * @param config - Mutation configuration
 * @returns Vue Query mutation result
 */
export function useSuiClientMutation<T extends keyof SuiRpcMethods>(config: {
	method: T
} & UseSuiClientMutationOptions<T>): UseMutationReturnType<
	SuiRpcMethods[T]['result'],
	Error,
	SuiRpcMethods[T]['params'],
	unknown
> {
	const { method, ...options } = config
	const client = useSuiClient()

	return useMutation({
		...options,
		mutationFn: async (params: SuiRpcMethods[T]['params']) => {
			return await client[method](params as never)
		},
	})
}
