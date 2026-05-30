---
'@mysten/sui': patch
---

Fix `SuiGrpcClient` reporting the wrong name for most execution errors. `parseGrpcExecutionError` looked every error `kind` up in the `CommandArgumentError` enum, but there are four error-kind enums with overlapping numeric values — so, for example, an `INSUFFICIENT_GAS` error was reported as `TypeMismatch`, and others fell back to `Unknown`. Each kind is now mapped against its own enum.
