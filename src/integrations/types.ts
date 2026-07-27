export type IntegrationError = {
  code: string;
  message: string;
};

export type IntegrationResult<T = unknown> = {
  success: boolean;
  provider: string;
  latencyMs: number;
  data?: T;
  error?: IntegrationError;
};
