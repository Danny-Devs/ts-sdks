// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useLayoutEffect } from 'react';

/**
 * A hook that uses `useLayoutEffect` in browser environments and `useEffect` on the server.
 *
 * This avoids the "useLayoutEffect does nothing on the server" warning that occurs
 * during SSR/SSG builds, while preserving the synchronous execution behavior in the browser.
 *
 * @see https://github.com/MystenLabs/ts-sdks/issues/757
 */
export const useIsomorphicLayoutEffect =
	typeof window !== 'undefined' ? useLayoutEffect : useEffect;
