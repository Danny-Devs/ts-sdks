<script setup lang="ts">
// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { provide } from 'vue';
import type { RegisteredDAppKit } from '@mysten/dapp-kit-core';
import { DAPP_KIT_KEY } from '../constants.js';

const props = defineProps<{
	dAppKit: RegisteredDAppKit;
}>();

provide(DAPP_KIT_KEY, props.dAppKit);
</script>

<template>
	<slot />
</template>
