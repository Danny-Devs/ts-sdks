// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from 'vitest';

import { parseGrpcExecutionError } from '../../../src/grpc/core.js';
import {
	CommandArgumentError_CommandArgumentErrorKind,
	ExecutionError_ExecutionErrorKind,
	TypeArgumentError_TypeArgumentErrorKind,
} from '../../../src/grpc/proto/sui/rpc/v2/execution_status.js';

describe('parseGrpcExecutionError', () => {
	it('maps command-argument error kinds against the CommandArgumentError enum', () => {
		const result = parseGrpcExecutionError({
			errorDetails: {
				oneofKind: 'commandArgumentError',
				commandArgumentError: {
					argument: 0,
					kind: CommandArgumentError_CommandArgumentErrorKind.TYPE_MISMATCH,
				},
			},
		});

		expect(result).toMatchObject({
			$kind: 'CommandArgumentError',
			CommandArgumentError: { name: 'TypeMismatch' },
		});
	});

	it('maps type-argument error kinds against the TypeArgumentError enum, not CommandArgumentError', () => {
		// Regression: TypeArgumentError CONSTRAINT_NOT_SATISFIED (= 2) was reverse-mapped
		// against CommandArgumentError, which reports `2` as INVALID_BCS_BYTES, so the
		// name came back as "InvalidBcsBytes" instead of "ConstraintNotSatisfied".
		const result = parseGrpcExecutionError({
			errorDetails: {
				oneofKind: 'typeArgumentError',
				typeArgumentError: {
					typeArgument: 0,
					kind: TypeArgumentError_TypeArgumentErrorKind.CONSTRAINT_NOT_SATISFIED,
				},
			},
		});

		expect(result).toMatchObject({
			$kind: 'TypeArgumentError',
			TypeArgumentError: { name: 'ConstraintNotSatisfied' },
		});
	});

	it('maps top-level execution error kinds against the ExecutionError enum', () => {
		// Regression: an ExecutionError kind (OBJECT_TOO_BIG = 5) was reverse-mapped
		// against CommandArgumentError instead of ExecutionError, producing the wrong name.
		const result = parseGrpcExecutionError({
			kind: ExecutionError_ExecutionErrorKind.OBJECT_TOO_BIG,
			errorDetails: {
				oneofKind: 'sizeError',
				sizeError: { size: 100n, maxSize: 50n },
			},
		});

		expect(result).toMatchObject({
			$kind: 'SizeError',
			SizeError: { name: 'ObjectTooBig' },
		});
	});
});
