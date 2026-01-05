<template>
	<button
		:class="[
			'vui-button',
			`vui-button--${variant}`,
			`vui-button--${size}`,
			disabled && 'vui-button--disabled',
		]"
		:disabled="disabled"
		v-bind="$attrs"
	>
		<slot />
	</button>
</template>

<script setup lang="ts">
// Copyright (c) Danny & Claude, Apache-2.0

export interface ButtonProps {
	variant?: 'primary' | 'outline'
	size?: 'md' | 'lg'
	disabled?: boolean
}

withDefaults(defineProps<ButtonProps>(), {
	variant: 'primary',
	size: 'md',
	disabled: false,
})
</script>

<style scoped>
.vui-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	border-radius: 12px;
	font-weight: 500;
	transition: all 0.2s;
	cursor: pointer;
	border: none;
	font-family: inherit;
}

.vui-button--md {
	padding: 10px 16px;
	font-size: 14px;
	line-height: 20px;
}

.vui-button--lg {
	padding: 12px 24px;
	font-size: 16px;
	line-height: 24px;
}

.vui-button--primary {
	background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
	color: white;
	box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.vui-button--primary:hover:not(:disabled) {
	transform: translateY(-1px);
	box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.vui-button--outline {
	background: transparent;
	color: #6366f1;
	border: 2px solid #6366f1;
}

.vui-button--outline:hover:not(:disabled) {
	background: rgba(99, 102, 241, 0.1);
}

.vui-button--disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.vui-button:active:not(:disabled) {
	transform: translateY(0);
}
</style>
