// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { inject } from 'vue';
import type { DAppKit, RegisteredDAppKit } from '@mysten/dapp-kit-core';
import { DAPP_KIT_KEY } from '../constants.js';

export function useDAppKit<TDAppKit extends DAppKit<any> = RegisteredDAppKit>(
	dAppKit?: TDAppKit,
): TDAppKit {
	if (dAppKit) {
		return dAppKit;
	}

	const injectedDAppKit = inject<TDAppKit>(DAPP_KIT_KEY);

	if (!injectedDAppKit) {
		throw new Error(
			'Could not find DAppKit. Ensure that you have set up the `DAppKitProvider` component.',
		);
	}

	return injectedDAppKit;
}
