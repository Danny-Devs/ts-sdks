<template>
	<div class="container">
			<h1>🧪 vui-dapp-kit Smoke Test</h1>
			<p class="subtitle">Validating core features before PumpSui integration</p>

			<!-- Test 1: Wallet Connection -->
			<div class="test-section">
				<h2>
					Test 1: Wallet Connection
					<span :class="['status', test1Status]">{{ test1StatusText }}</span>
				</h2>
				<div class="test-content">
					<ConnectButton connect-text="Connect Wallet" />

					<div v-if="account" class="result success">
						✅ SUCCESS: Wallet connected
						<br />
						Address: {{ account.address }}
						<br />
						Chains: {{ account.chains.join(', ') }}
					</div>
					<div v-else class="result">
						⏳ Waiting for wallet connection...
					</div>
				</div>
			</div>

			<!-- Test 2: Balance Query -->
			<div class="test-section">
				<h2>
					Test 2: Balance Query
					<span :class="['status', test2Status]">{{ test2StatusText }}</span>
				</h2>
				<div class="test-content">
					<p v-if="!account">⚠️ Connect wallet first to test balance query</p>
					<div v-else>
						<div v-if="balanceLoading" class="result">
							⏳ Loading balance...
						</div>
						<div v-else-if="balanceError" class="result error">
							❌ ERROR: {{ balanceError.message }}
						</div>
						<div v-else-if="balance" class="result success">
							✅ SUCCESS: Balance query working
							<br />
							Total Balance: {{ balance.totalBalance }} MIST
							<br />
							Coin Type: {{ balance.coinType }}
						</div>
					</div>
				</div>
			</div>

			<!-- Test 3: Transaction Signing -->
			<div class="test-section">
				<h2>
					Test 3: Transaction Signing
					<span :class="['status', test3Status]">{{ test3StatusText }}</span>
				</h2>
				<div class="test-content">
					<p v-if="!account">⚠️ Connect wallet first to test transaction signing</p>
					<div v-else>
						<button @click="testTransaction" :disabled="txPending">
							{{ txPending ? 'Signing...' : 'Test Transaction (Dry Run)' }}
						</button>

						<div v-if="txResult" class="result success">
							✅ SUCCESS: Transaction signing working
							<br />
							{{ txResult }}
						</div>
						<div v-if="txError" class="result error">
							❌ ERROR: {{ txError }}
						</div>
					</div>
				</div>
			</div>

			<!-- Overall Status -->
			<div class="test-section" style="background: #f3f4f6; border: 2px solid #6366f1">
				<h2 style="color: #6366f1">📊 Overall Status</h2>
				<div class="test-content">
					<div v-if="allTestsPassed" class="result success" style="font-size: 16px; font-weight: 600">
						🎉 ALL TESTS PASSED!
						<br />
						<br />
						vui-dapp-kit is ready for PumpSui integration.
					</div>
					<div v-else class="result">
						<strong>Test Progress:</strong>
						<br />
						✅ Wallet Connection: {{ test1Status }}
						<br />
						{{ test2Status === 'success' ? '✅' : '⏳' }} Balance Query: {{ test2Status }}
						<br />
						{{ test3Status === 'success' ? '✅' : '⏳' }} Transaction Signing: {{ test3Status }}
					</div>
				</div>
			</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Transaction } from '@mysten/sui/transactions'
import {
	ConnectButton,
	useCurrentAccount,
	useSuiClientQuery,
	useSignTransaction,
} from '@dannydevs/vui-dapp-kit'

// Test 1: Wallet Connection
const { account, isConnected } = useCurrentAccount()

const test1Status = computed(() => {
	if (!account.value) return 'pending'
	return 'success'
})

const test1StatusText = computed(() => {
	if (!account.value) return 'Pending'
	return 'Passed'
})

// Test 2: Balance Query
const {
	data: balance,
	isLoading: balanceLoading,
	error: balanceError,
} = useSuiClientQuery({
	method: 'getBalance',
	params: computed(() => {
		if (!account.value?.address) return { owner: '' }
		return { owner: account.value.address }
	}),
	enabled: computed(() => !!account.value?.address),
})

const test2Status = computed(() => {
	if (!account.value) return 'pending'
	if (balanceLoading.value) return 'testing'
	if (balanceError.value) return 'error'
	if (balance.value) return 'success'
	return 'pending'
})

const test2StatusText = computed(() => {
	if (!account.value) return 'Pending'
	if (balanceLoading.value) return 'Testing...'
	if (balanceError.value) return 'Failed'
	if (balance.value) return 'Passed'
	return 'Pending'
})

// Test 3: Transaction Signing
const { mutate: signTx, isPending: txPending } = useSignTransaction()
const txResult = ref<string | null>(null)
const txError = ref<string | null>(null)

function testTransaction() {
	if (!account.value) return

	txResult.value = null
	txError.value = null

	// Create a simple transaction (just for testing signing, not executing)
	const tx = new Transaction()
	tx.setSender(account.value.address)

	signTx(
		{ transaction: tx },
		{
			onSuccess: (result) => {
				txResult.value = `Transaction signed successfully! Signature length: ${result.signature.length} bytes`
			},
			onError: (error) => {
				txError.value = error.message
			},
		},
	)
}

const test3Status = computed(() => {
	if (!account.value) return 'pending'
	if (txPending.value) return 'testing'
	if (txError.value) return 'error'
	if (txResult.value) return 'success'
	return 'pending'
})

const test3StatusText = computed(() => {
	if (!account.value) return 'Pending'
	if (txPending.value) return 'Testing...'
	if (txError.value) return 'Failed'
	if (txResult.value) return 'Passed'
	return 'Pending'
})

// Overall status
const allTestsPassed = computed(() => {
	return (
		test1Status.value === 'success' &&
		test2Status.value === 'success' &&
		test3Status.value === 'success'
	)
})

// Watch for all tests passing
watch(allTestsPassed, (passed) => {
	if (passed) {
		console.log('🎉 ALL SMOKE TESTS PASSED!')
		console.log('vui-dapp-kit is ready for production use in PumpSui')
	}
})
</script>
