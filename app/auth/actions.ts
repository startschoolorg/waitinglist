// STEP 6: log out.
// "use server" at the top makes every export a Server Action:
// a function the browser can call, but which runs on the server.
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  // Ends the session and clears the auth cookies
  // (allowed here because a Server Action may write cookies).
  await supabase.auth.signOut();
  // Send the visitor back to the landing page.
  redirect("/");
}
