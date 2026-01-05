<template>
	<SuiClientProvider :networks="networks" default-network="testnet">
		<div class="container">
			<h1>✍️ Transaction Signer</h1>
			<p class="subtitle">Sign and execute transactions using useSignAndExecuteTransaction</p>

			<div class="section">
				<h2>Connect Wallet</h2>
				<ConnectButton />
			</div>

			<div v-if="!account" class="card">
				<p>👆 Connect your wallet to sign transactions</p>
			</div>

			<template v-else>
				<!-- Transfer Form -->
				<div class="section">
					<h2>Transfer SUI</h2>
					<div class="card">
						<form @submit.prevent="handleTransfer">
							<div class="form-group">
								<label>Recipient Address</label>
								<input
									v-model="recipientAddress"
									type="text"
									placeholder="0x..."
									required
								/>
								<div class="hint">Enter the SUI address to send to</div>
							</div>

							<div class="form-group">
								<label>Amount (SUI)</label>
								<input
									v-model.number="amount"
									type="number"
									step="0.001"
									min="0.001"
									placeholder="0.1"
									required
								/>
								<div class="hint">Amount in SUI (e.g., 0.1 = 100,000,000 MIST)</div>
							</div>

							<button type="submit" :disabled="isPending || !recipientAddress || !amount">
								{{ isPending ? 'Signing & Executing...' : 'Send SUI' }}
							</button>
						</form>
					</div>
				</div>

				<!-- Result -->
				<div v-if="txResult" class="section">
					<h2>Transaction Result</h2>
					<div class="card success">
						<div class="result">
							<div class="result-row">
								<span class="result-label">Status</span>
								<span class="result-value" style="color: #065f46; font-weight: 600"
									>✅ Success</span
								>
							</div>
							<div class="result-row">
								<span class="result-label">Digest</span>
								<span class="result-value">{{ txResult.digest }}</span>
							</div>
							<div class="result-row">
								<span class="result-label">Effects</span>
								<span class="result-value">{{
									txResult.effects?.status?.status || 'N/A'
								}}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Error -->
				<div v-if="txError" class="section">
					<h2>Error</h2>
					<div class="card error">
						<p style="color: #991b1b">❌ {{ txError.message }}</p>
					</div>
				</div>

				<!-- Info -->
				<div class="section">
					<h2>About This Example</h2>
					<div class="card">
						<p style="margin-bottom: 12px">
							This example uses <code>useSignAndExecuteTransaction()</code> to:
						</p>
						<ol style="margin-left: 20px; color: #6b7280">
							<li>Build a transaction with the Transaction builder</li>
							<li>Sign it with your wallet</li>
							<li>Submit it to the network</li>
							<li>Return the result</li>
						</ol>
						<p style="margin-top: 16px; font-size: 14px; color: #6b7280">
							💡 Try sending 0.001 SUI to yourself to test!
						</p>
					</div>
				</div>
			</template>

			<div class="footer">
				<p>
					Powered by <strong>vui-dapp-kit</strong> • Using
					<code>useSignAndExecuteTransaction()</code>
				</p>
			</div>
		</div>
	</SuiClientProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getFullnodeUrl } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import {
	SuiClientProvider,
	ConnectButton,
	useCurrentAccount,
	useSignAndExecuteTransaction,
} from '@dannydevs/vui-dapp-kit'

// Network configuration
const networks = {
	mainnet: { url: getFullnodeUrl('mainnet') },
	testnet: { url: getFullnodeUrl('testnet') },
	devnet: { url: getFullnodeUrl('devnet') },
}

// Get current account
const { account } = useCurrentAccount()

// Sign and execute transaction
const { mutate: signAndExecute, isPending, data: txResult, error: txError } = useSignAndExecuteTransaction()

// Form state
const recipientAddress = ref('')
const amount = ref<number | null>(null)

function handleTransfer() {
	if (!account.value || !recipientAddress.value || !amount.value) return

	// Create transaction
	const tx = new Transaction()

	// Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
	const amountInMist = Math.floor(amount.value * 1_000_000_000)

	// Split coins and transfer
	const [coin] = tx.splitCoins(tx.gas, [amountInMist])
	tx.transferObjects([coin], recipientAddress.value)

	// Sign and execute
	signAndExecute(
		{ transaction: tx },
		{
			onSuccess: (result) => {
				console.log('Transaction executed:', result)
				// Reset form
				recipientAddress.value = ''
				amount.value = null
			},
			onError: (error) => {
				console.error('Transaction failed:', error)
			},
		},
	)
}
</script>
