// SERVER client.
// Used inside Server Components, Route Handlers and Server Actions.
// It runs on the server, so it reads the login session from the request cookies.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  // In this Next.js version cookies() is async, so we must await it.
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Supabase asks: "which cookies did the browser send me?"
        getAll() {
          return cookieStore.getAll();
        },
        // Supabase asks: "please store these cookies" (after login or token refresh).
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Writing cookies is only allowed in Route Handlers and Server Actions.
            // When this runs inside a Server Component the call throws, which is
            // safe to ignore: the callback route already saved the session.
          }
        },
      },
    },
  );
}
