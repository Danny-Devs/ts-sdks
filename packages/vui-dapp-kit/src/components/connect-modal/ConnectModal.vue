<template>
	<Teleport to="body">
		<Transition name="vui-modal">
			<div
				v-if="open"
				class="vui-modal-overlay"
				@click="handleClose"
				style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(102, 126, 234, 0.15); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 16px;"
			>
				<div
					class="vui-modal-container"
					@click.stop
					style="background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(118, 75, 162, 0.4), 0 0 0 1px rgba(102, 126, 234, 0.1); max-width: 440px; width: 100%; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden;"
				>
					<!-- Header -->
					<div class="vui-modal-header">
						<h2 class="vui-modal-title">Connect Wallet</h2>
						<button class="vui-modal-close" @click="handleClose" aria-label="Close">
							<CloseIcon />
						</button>
					</div>

					<!-- Wallet List -->
					<div class="vui-modal-content">
						<div v-if="!wallets || wallets.length === 0" class="vui-empty-state">
							<SuiIcon style="width: 48px; height: 48px; opacity: 0.3" />
							<p class="vui-empty-text">No wallets detected</p>
							<p class="vui-empty-hint">
								Please install a SUI wallet extension to continue
							</p>
						</div>

						<div v-else class="vui-wallet-list">
							<button
								v-for="wallet in filteredWallets"
								:key="wallet.name"
								class="vui-wallet-item"
								:disabled="connecting"
								@click="handleConnect(wallet)"
							>
								<img
									v-if="wallet.icon"
									:src="wallet.icon"
									:alt="wallet.name"
									class="vui-wallet-icon"
								/>
								<div class="vui-wallet-info">
									<div class="vui-wallet-name">{{ wallet.name }}</div>
									<div v-if="connecting && selectedWallet === wallet" class="vui-wallet-status">
										Connecting...
									</div>
								</div>
							</button>
						</div>
					</div>

					<!-- Footer -->
					<div class="vui-modal-footer">
						<p class="vui-modal-footer-text">
							New to SUI?
							<a
								href="https://sui.io/wallets"
								target="_blank"
								rel="noopener noreferrer"
								class="vui-modal-link"
							>
								Get a wallet
							</a>
						</p>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
// Copyright (c) Danny & Claude, Apache-2.0

import { ref, computed } from 'vue'
import { useWallets } from '../../composables/wallet/useWallets'
import { useConnectWallet } from '../../composables/wallet/useConnectWallet'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import CloseIcon from '../icons/CloseIcon.vue'
import SuiIcon from '../icons/SuiIcon.vue'

export interface ConnectModalProps {
	open?: boolean
	walletFilter?: (wallet: WalletWithRequiredFeatures) => boolean
}

const props = withDefaults(defineProps<ConnectModalProps>(), {
	open: false,
})

const emit = defineEmits<{
	'update:open': [value: boolean]
}>()

const { wallets } = useWallets()
const { mutate: connect, isPending: connecting } = useConnectWallet()
const selectedWallet = ref<WalletWithRequiredFeatures | null>(null)

const filteredWallets = computed(() => {
	if (!wallets.value) return []
	if (!props.walletFilter) return wallets.value
	return wallets.value.filter(props.walletFilter)
})

function handleClose() {
	emit('update:open', false)
	selectedWallet.value = null
}

function handleConnect(wallet: WalletWithRequiredFeatures) {
	selectedWallet.value = wallet
	connect(
		{ wallet },
		{
			onSuccess: () => {
				handleClose()
			},
			onError: (error) => {
				console.error('Failed to connect wallet:', error)
				selectedWallet.value = null
			},
		},
	)
}
</script>

<style scoped>
.vui-modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28px 28px 20px 28px;
	background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
	border-bottom: 1px solid #e5e7eb;
}

.vui-modal-title {
	font-size: 22px;
	font-weight: 700;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	margin: 0;
}

.vui-modal-close {
	background: none;
	border: none;
	padding: 8px;
	cursor: pointer;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background 0.2s;
	color: #6b7280;
}

.vui-modal-close:hover {
	background: #f3f4f6;
}

.vui-modal-content {
	padding: 24px 28px;
	overflow-y: auto;
	flex: 1;
}

.vui-empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 48px 24px;
	text-align: center;
	color: #6b7280;
}

.vui-empty-text {
	margin: 16px 0 8px;
	font-size: 16px;
	font-weight: 500;
	color: #1f2937;
}

.vui-empty-hint {
	margin: 0;
	font-size: 14px;
}

.vui-wallet-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.vui-wallet-item {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 18px 20px;
	background: #f9fafb;
	border: 2px solid transparent;
	border-radius: 14px;
	cursor: pointer;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	width: 100%;
	text-align: left;
	position: relative;
}

.vui-wallet-item:hover:not(:disabled) {
	background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
	border-color: #667eea;
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.vui-wallet-item:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.vui-wallet-icon {
	width: 48px;
	height: 48px;
	border-radius: 12px;
	object-fit: contain;
}

.vui-wallet-info {
	flex: 1;
}

.vui-wallet-name {
	font-size: 16px;
	font-weight: 600;
	color: #1f2937;
}

.vui-wallet-status {
	font-size: 14px;
	color: #6366f1;
	margin-top: 4px;
}

.vui-modal-footer {
	padding: 20px 28px 24px 28px;
	border-top: 1px solid #e5e7eb;
	background: #f9fafb;
}

.vui-modal-footer-text {
	margin: 0;
	font-size: 14px;
	color: #6b7280;
	text-align: center;
}

.vui-modal-link {
	color: #667eea;
	text-decoration: none;
	font-weight: 600;
	transition: color 0.2s;
}

.vui-modal-link:hover {
	color: #764ba2;
	text-decoration: underline;
}

/* Transition animations */
.vui-modal-enter-active,
.vui-modal-leave-active {
	transition: opacity 0.3s ease;
}

.vui-modal-enter-active .vui-modal-container,
.vui-modal-leave-active .vui-modal-container {
	transition: transform 0.3s ease;
}

.vui-modal-enter-from,
.vui-modal-leave-to {
	opacity: 0;
}

.vui-modal-enter-from .vui-modal-container,
.vui-modal-leave-to .vui-modal-container {
	transform: scale(0.95);
}
</style>
