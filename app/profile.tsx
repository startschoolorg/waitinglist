// STEP 5 + 6: the profile card, or the sign-in button if nobody is logged in.
// This is a Server Component: it reads the session from cookies on the server.
import Image from "next/image";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SignInButton } from "./sign-in-button";
import { signOut } from "./auth/actions";

export async function Profile() {
  // Tell Next.js this component only runs for a real request, never at build time.
  // The session check below calls Date.now(), which Next refuses to prerender.
  await connection();

  const supabase = await createClient();

  // getUser() checks the session cookie with Supabase and returns the user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in: show the landing page call to action.
  if (!user) {
    return <SignInButton />;
  }

  // Logged in: Google's profile data lives in user_metadata.
  const name = user.user_metadata.full_name ?? user.user_metadata.name ?? "there";
  const picture = user.user_metadata.avatar_url ?? user.user_metadata.picture;

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 p-8 dark:border-zinc-800">
      {picture && (
        // next/image needs the Google domain allowed in next.config.ts.
        <Image
          src={picture}
          alt={name}
          width={96}
          height={96}
          className="rounded-full"
        />
      )}
      <p className="text-xl font-semibold">{name}</p>
      <p className="text-zinc-600 dark:text-zinc-400">{user.email}</p>
      <p className="text-sm text-green-600">You are on the waitlist.</p>

      {/* A form whose action is a Server Action. Submitting calls signOut() on the server. */}
      <form action={signOut}>
        <button
          type="submit"
          className="mt-2 rounded-full border border-zinc-300 px-5 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
