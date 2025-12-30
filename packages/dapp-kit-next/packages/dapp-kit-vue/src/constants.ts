// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { InjectionKey } from 'vue';
import type { RegisteredDAppKit } from '@mysten/dapp-kit-core';

export const DAPP_KIT_KEY: InjectionKey<RegisteredDAppKit> = Symbol('dapp-kit');
