// The landing page. Kept simple on purpose: a heading, then the profile area.
import { Suspense } from "react";
import { Profile } from "./profile";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Join the waitlist</h1>
      <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
        Sign in with Google and we will save your spot.
      </p>

      {/*
        Profile reads cookies, which only exist at request time.
        This Next.js version has cacheComponents on, so request-time work must sit
        inside <Suspense>. The heading above is static and loads instantly;
        the profile streams in a moment later.
      */}
      <Suspense fallback={<p className="text-zinc-500">Checking your session…</p>}>
        <Profile />
      </Suspense>
    </main>
  );
}
