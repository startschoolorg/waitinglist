// STEP 3 + 4: where Google sends the user back, and where we save them.
//
// Flow: browser -> Google login -> Supabase -> THIS route (with ?code=...)
// We trade the code for a session (cookies), save the user to the waitlist
// table, then send them to the home page.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  // Supabase puts a one-time "code" in the URL after a successful Google login.
  const code = url.searchParams.get("code");

  // No code means someone opened this URL by hand. Send them home.
  if (!code) {
    return NextResponse.redirect(new URL("/?error=missing_code", url.origin));
  }

  const supabase = await createClient();

  // Exchange the code for a real session. This sets the auth cookies
  // (allowed here because a Route Handler may write cookies).
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(new URL("/?error=login_failed", url.origin));
  }

  const user = data.user;

  // STEP 4: save to the waitlist table.
  // "upsert" = insert the row, or update it if the email already exists.
  // onConflict: "email" tells Postgres which unique column decides "already exists".
  // This is why logging in twice does not create a second row.
  const { error: saveError } = await supabase.from("waitlist").upsert(
    {
      user_id: user.id,
      email: user.email,
      // Google puts the display name in user_metadata.
      name: user.user_metadata.full_name ?? user.user_metadata.name ?? null,
    },
    { onConflict: "email" },
  );

  if (saveError) {
    // Log it so you can read it in the terminal (house rule: read the error first).
    console.error("waitlist upsert failed:", saveError.message);
    return NextResponse.redirect(new URL("/?error=save_failed", url.origin));
  }

  return NextResponse.redirect(new URL("/", url.origin));
}
