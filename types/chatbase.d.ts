export {};

declare global {
  interface Window {
    /** Chatbase widget queue / API (loaded by embed script). */
    chatbase?: (command: string, options?: Record<string, unknown>) => unknown;
  }
}
