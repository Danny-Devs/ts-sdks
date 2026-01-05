<template>
	<SuiClientProvider :networks="networks" default-network="testnet">
		<div class="container">
			<h1>💰 Balance Checker</h1>
			<p class="subtitle">Query blockchain data using useSuiClientQuery</p>

			<div class="section">
				<h2>Connect Wallet</h2>
				<ConnectButton />
			</div>

			<div v-if="!account" class="card">
				<p>👆 Connect your wallet to check balances</p>
			</div>

			<template v-else>
				<!-- SUI Balance -->
				<div class="section">
					<h2>SUI Balance</h2>
					<div v-if="balanceLoading" class="loading">Loading balance...</div>
					<div v-else-if="balanceError" class="error">
						Error loading balance: {{ balanceError.message }}
					</div>
					<div v-else-if="balance" class="card highlight">
						<div class="stat">
							<span class="stat-label">Total Balance</span>
							<span class="stat-value large">{{ formatBalance(balance.totalBalance) }} SUI</span>
						</div>
						<div class="stat">
							<span class="stat-label">Coin Type</span>
							<span class="stat-value" style="font-size: 12px">{{ balance.coinType }}</span>
						</div>
					</div>
				</div>

				<!-- All Balances -->
				<div class="section">
					<h2>All Coin Balances</h2>
					<div v-if="allBalancesLoading" class="loading">Loading all balances...</div>
					<div v-else-if="allBalancesError" class="error">
						Error loading balances: {{ allBalancesError.message }}
					</div>
					<div v-else-if="allBalances" class="coin-list">
						<div v-for="coin in allBalances" :key="coin.coinType" class="coin-item">
							<div>
								<div class="coin-type">{{ formatCoinType(coin.coinType) }}</div>
							</div>
							<div class="coin-balance">{{ formatBalance(coin.totalBalance) }}</div>
						</div>
						<div v-if="allBalances.length === 0" class="card">
							<p>No coins found in this account</p>
						</div>
					</div>
				</div>

				<!-- Coin Count (using select) -->
				<div class="section">
					<h2>Data Transformation</h2>
					<div class="card">
						<div class="stat">
							<span class="stat-label">Total Coin Types</span>
							<span class="stat-value">{{ coinCount ?? '...' }}</span>
						</div>
						<p style="margin-top: 12px; font-size: 14px; color: #6b7280">
							<code>select</code> option transforms the data before returning
						</p>
					</div>
				</div>
			</template>

			<div class="footer">
				<p>
					Powered by <strong>vui-dapp-kit</strong> • All queries use
					<code>useSuiClientQuery()</code>
				</p>
			</div>
		</div>
	</SuiClientProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getFullnodeUrl } from '@mysten/sui/client'
import {
	SuiClientProvider,
	ConnectButton,
	useCurrentAccount,
	useSuiClientQuery,
} from '@dannydevs/vui-dapp-kit'

// Network configuration
const networks = {
	mainnet: { url: getFullnodeUrl('mainnet') },
	testnet: { url: getFullnodeUrl('testnet') },
	devnet: { url: getFullnodeUrl('devnet') },
}

// Get current account
const { account } = useCurrentAccount()

// Query 1: SUI balance
const {
	data: balance,
	isLoading: balanceLoading,
	error: balanceError,
} = useSuiClientQuery({
	method: 'getBalance',
	params: computed(() => ({ owner: account.value?.address || '' })),
	enabled: computed(() => !!account.value),
})

// Query 2: All balances
const {
	data: allBalances,
	isLoading: allBalancesLoading,
	error: allBalancesError,
} = useSuiClientQuery({
	method: 'getAllBalances',
	params: computed(() => ({ owner: account.value?.address || '' })),
	enabled: computed(() => !!account.value),
})

// Query 3: Using select for data transformation
const { data: coinCount } = useSuiClientQuery({
	method: 'getAllBalances',
	params: computed(() => ({ owner: account.value?.address || '' })),
	select: (balances) => balances.length,
	enabled: computed(() => !!account.value),
})

// Format balance from MIST to SUI
function formatBalance(mist: string): string {
	const sui = Number(mist) / 1_000_000_000
	return sui.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 9 })
}

// Format coin type for display
function formatCoinType(coinType: string): string {
	// Extract the last part after ::
	const parts = coinType.split('::')
	return parts[parts.length - 1] || coinType
}
</script>
