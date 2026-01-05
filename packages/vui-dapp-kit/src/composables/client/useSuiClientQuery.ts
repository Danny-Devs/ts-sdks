// Copyright (c) Danny & Claude, Apache-2.0

import { useQuery, queryOptions } from '@tanstack/vue-query'
import type { UseQueryOptions, UseQueryReturnType, QueryOptions } from '@tanstack/vue-query'
import type { SuiClient } from '@mysten/sui/client'
import { useSuiClientContext } from './useSuiClient'

/**
 * Extract RPC method names from SuiClient
 */
export type SuiRpcMethodName = {
	[K in keyof SuiClient]: SuiClient[K] extends ((input: any) => Promise<any>) | (() => Promise<any>)
		? K
		: never
}[keyof SuiClient]

/**
 * Map of SUI RPC methods with their params and return types
 */
export type SuiRpcMethods = {
	[K in SuiRpcMethodName]: SuiClient[K] extends (input: infer P) => Promise<infer R>
		? {
				name: K
				result: R
				params: P
			}
		: SuiClient[K] extends () => Promise<infer R>
			? {
					name: K
					result: R
					params: undefined | object
				}
			: never
}

/**
 * Options for useSuiClientQuery
 */
export type UseSuiClientQueryOptions<T extends keyof SuiRpcMethods, TData = SuiRpcMethods[T]['result']> = Omit<
	UseQueryOptions<SuiRpcMethods[T]['result'], Error, TData>,
	'queryFn' | 'queryKey'
> & {
	queryKey?: unknown[]
}

/**
 * Options for getSuiClientQuery helper
 */
export type GetSuiClientQueryOptions<T extends keyof SuiRpcMethods> = {
	client: SuiClient
	network: string
	method: T
	options?: Omit<QueryOptions<SuiRpcMethods[T]['result'], Error>, 'queryFn' | 'queryKey'>
} & (undefined extends SuiRpcMethods[T]['params']
	? { params?: SuiRpcMethods[T]['params'] }
	: { params: SuiRpcMethods[T]['params'] })

/**
 * Helper to create query options for SUI client queries
 *
 * Useful for manual query management or prefetching
 */
export function getSuiClientQuery<T extends keyof SuiRpcMethods>({
	client,
	network,
	method,
	params,
	options,
}: GetSuiClientQueryOptions<T>) {
	return queryOptions<SuiRpcMethods[T]['result'], Error>({
		...(options as any),
		queryKey: [network, method, params] as unknown[],
		queryFn: async () => {
			return await client[method](params as never)
		},
	})
}

/**
 * Query hook for making RPC calls to the SUI blockchain
 *
 * Automatically infers types based on the method name. Supports all SuiClient methods.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useSuiClientQuery, useCurrentAccount } from '@dannydevs/vui-dapp-kit'
 *
 * const { address } = useCurrentAccount()
 *
 * // Query balance - types are automatically inferred!
 * const { data: balance, isLoading, error } = useSuiClientQuery({
 *   method: 'getBalance',
 *   params: { owner: address.value },
 * })
 *
 * // Query with custom data transformation
 * const { data: coinCount } = useSuiClientQuery({
 *   method: 'getAllBalances',
 *   params: { owner: address.value },
 *   select: (balances) => balances.length,
 * })
 * </script>
 *
 * <template>
 *   <div v-if="isLoading">Loading...</div>
 *   <div v-else-if="error">Error: {{ error.message }}</div>
 *   <div v-else>Balance: {{ balance?.totalBalance }}</div>
 * </template>
 * ```
 *
 * @param config - Query configuration with method and params
 * @returns Vue Query result with data, loading state, etc.
 */
export function useSuiClientQuery<
	T extends keyof SuiRpcMethods,
	TData = SuiRpcMethods[T]['result'],
>(config: {
	method: T
	params?: SuiRpcMethods[T]['params']
	queryKey?: unknown[]
} & UseSuiClientQueryOptions<T, TData>): UseQueryReturnType<TData, Error> {
	const { method, params, queryKey = [], ...options } = config
	const suiContext = useSuiClientContext()

	return useQuery({
		...options,
		queryKey: [suiContext.network, method, params, ...queryKey] as unknown[],
		queryFn: async () => {
			return await suiContext.client[method](params as never)
		},
	}) as UseQueryReturnType<TData, Error>
}
