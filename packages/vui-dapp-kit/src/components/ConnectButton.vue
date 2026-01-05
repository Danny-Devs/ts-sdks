<template>
	<div class="vui-connect-button">
		<!-- Connected: Show account dropdown -->
		<div v-if="account" class="vui-account-dropdown">
			<Button
				variant="outline"
				@click="isDropdownOpen = !isDropdownOpen"
				class="vui-account-button"
			>
				<SuiIcon style="width: 20px; height: 20px" />
				<span class="vui-account-address">{{ formattedAddress }}</span>
				<ChevronIcon :style="{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }" />
			</Button>

			<!-- Dropdown Menu -->
			<Teleport to="body">
				<div
					v-if="isDropdownOpen"
					class="vui-dropdown-overlay"
					@click="isDropdownOpen = false"
				/>
			</Teleport>
			<div v-if="isDropdownOpen" class="vui-dropdown-menu">
				<!-- Account List -->
				<div v-if="accounts && accounts.length > 1" class="vui-dropdown-section">
					<div class="vui-dropdown-label">Switch Account</div>
					<button
						v-for="acc in accounts"
						:key="acc.address"
						class="vui-dropdown-item"
						:class="{ active: acc.address === account?.address }"
						@click="handleSwitchAccount(acc.address)"
					>
						<span class="vui-account-address">{{ formatAddress(acc.address) }}</span>
					</button>
				</div>

				<!-- Disconnect -->
				<div class="vui-dropdown-section">
					<button class="vui-dropdown-item vui-disconnect" @click="handleDisconnect">
						Disconnect
					</button>
				</div>
			</div>
		</div>

		<!-- Not Connected: Show connect button -->
		<Button v-else variant="primary" @click="isModalOpen = true">
			{{ connectText || 'Connect Wallet' }}
		</Button>

		<!-- Connect Modal -->
		<ConnectModal v-model:open="isModalOpen" />
	</div>
</template>

<script setup lang="ts">
// Copyright (c) Danny & Claude, Apache-2.0

import { ref, computed } from 'vue'
import { useCurrentAccount } from '../composables/wallet/useCurrentAccount'
import { useAccounts } from '../composables/wallet/useAccounts'
import { useSwitchAccount } from '../composables/wallet/useSwitchAccount'
import { useDisconnectWallet } from '../composables/wallet/useDisconnectWallet'
import Button from './ui/Button.vue'
import SuiIcon from './icons/SuiIcon.vue'
import ChevronIcon from './icons/ChevronIcon.vue'
import ConnectModal from './connect-modal/ConnectModal.vue'

export interface ConnectButtonProps {
	connectText?: string
}

defineProps<ConnectButtonProps>()

const { account } = useCurrentAccount()
const { accounts } = useAccounts()
const { mutate: switchAccount } = useSwitchAccount()
const { mutate: disconnect } = useDisconnectWallet()

const isDropdownOpen = ref(false)
const isModalOpen = ref(false)

const formattedAddress = computed(() => {
	if (!account.value) return ''
	return formatAddress(account.value.address)
})

function formatAddress(address: string): string {
	return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function handleSwitchAccount(address: string) {
	const targetAccount = accounts.value.find((acc) => acc.address === address)
	if (targetAccount) {
		switchAccount({ account: targetAccount })
	}
	isDropdownOpen.value = false
}

function handleDisconnect() {
	disconnect()
	isDropdownOpen.value = false
}
</script>

<style scoped>
.vui-connect-button {
	position: relative;
}

.vui-account-dropdown {
	position: relative;
}

.vui-account-button {
	display: flex;
	align-items: center;
	gap: 8px;
}

.vui-account-address {
	font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
	font-size: 14px;
}

.vui-dropdown-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
}

.vui-dropdown-menu {
	position: absolute;
	top: calc(100% + 8px);
	right: 0;
	min-width: 240px;
	background: white;
	border-radius: 12px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	z-index: 1000;
	overflow: hidden;
}

.vui-dropdown-section {
	padding: 8px 0;
	border-bottom: 1px solid #e5e7eb;
}

.vui-dropdown-section:last-child {
	border-bottom: none;
}

.vui-dropdown-label {
	padding: 8px 16px;
	font-size: 12px;
	font-weight: 600;
	color: #6b7280;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.vui-dropdown-item {
	width: 100%;
	padding: 12px 16px;
	background: none;
	border: none;
	text-align: left;
	cursor: pointer;
	transition: background 0.2s;
	font-family: inherit;
	font-size: 14px;
	color: #1f2937;
}

.vui-dropdown-item:hover {
	background: #f3f4f6;
}

.vui-dropdown-item.active {
	background: #ede9fe;
	color: #6366f1;
	font-weight: 500;
}

.vui-disconnect {
	color: #dc2626;
}

.vui-disconnect:hover {
	background: #fee2e2;
}
</style>
