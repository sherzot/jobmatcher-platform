export type AIExecutionStatusValue =
  | 'REQUESTED'
  | 'RUNNING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'BLOCKED';

const ALLOWED_TRANSITIONS: Record<
  AIExecutionStatusValue,
  readonly AIExecutionStatusValue[]
> = {
  REQUESTED: ['RUNNING', 'BLOCKED'],
  RUNNING: ['SUCCEEDED', 'FAILED'],
  SUCCEEDED: [],
  FAILED: [],
  BLOCKED: [],
};

export function canTransitionAIExecution(
  from: AIExecutionStatusValue,
  to: AIExecutionStatusValue,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function hasValidAIUsage(
  inputTokens: number,
  outputTokens: number,
  latencyMs: number,
  costMicros?: bigint,
): boolean {
  return (
    Number.isSafeInteger(inputTokens) &&
    inputTokens >= 0 &&
    Number.isSafeInteger(outputTokens) &&
    outputTokens >= 0 &&
    Number.isSafeInteger(latencyMs) &&
    latencyMs >= 0 &&
    (costMicros === undefined || costMicros >= 0n)
  );
}
