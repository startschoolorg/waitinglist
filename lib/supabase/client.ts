// BROWSER client.
// Used inside Client Components (files that start with "use client").
// It runs in the visitor's browser, so it can only use NEXT_PUBLIC_ variables.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    // The "!" tells TypeScript: "I promise this variable exists."
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
