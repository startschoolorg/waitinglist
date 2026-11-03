// STEP 3: the "Sign in with Google" button.
// It needs onClick, so it must be a Client Component.
"use client";

import { createClient } from "@/lib/supabase/client";

export function SignInButton() {
  async function handleClick() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Where Supabase should send the user AFTER Google login.
        // window.location.origin = "http://localhost:3000" on your laptop.
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-full bg-black px-6 py-3 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
    >
      Sign in with Google
    </button>
  );
}
