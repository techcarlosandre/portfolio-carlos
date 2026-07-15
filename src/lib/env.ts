/**
 * Centralized Environment Variables Configuration
 * Validates variables at runtime and provides clear diagnostic messages if missing.
 */

const getEnvOrThrow = (key: string, required = true): string => {
  const value = process.env[key] || "";
  if (required && !value) {
    if (typeof window === "undefined") {
      throw new Error(`CRITICAL: Environment variable "${key}" is missing. Please check your .env.local configuration.`);
    }
  }
  return value;
};

export const env = {
  GEMINI_API_KEY: getEnvOrThrow("GEMINI_API_KEY", false), // Optional fallback in route.ts, so we don't crash the server immediately
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
  SUPABASE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "",
};
