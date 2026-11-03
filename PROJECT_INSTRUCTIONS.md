# Join the Waitlist | Next.js + Supabase

**Date:** November 11, 2026
**Date for part-time:** TBD

## Goal

Build a real waitlist product: a landing page where visitors sign in with Google, get saved to a Supabase table, and see their own profile. By the end you must be able to explain the login flow yourself, even if AI wrote parts of the code.

## Concepts You Will Learn

| Concept | What it means in this project |
|---|---|
| `user_metadata` | Supabase stores Google profile data (name, picture) here after login. |
| Row Level Security (RLS), `auth.uid()` | Database rules that restrict which rows a user can read or write. `auth.uid()` returns the ID of the logged-in user. |
| Unique constraint, upsert | A unique constraint blocks duplicate emails. An upsert inserts a row or updates it if it already exists. |
| `.env.local`, `NEXT_PUBLIC_` | `.env.local` holds your keys and stays out of git. Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. |
| Server vs Client Components | Server Components render on the server (can read cookies and the session). Client Components run in the browser (handle clicks and state). |
| `next/image` remote images | Google profile pictures come from another domain, which must be allowed in `next.config`. |
| `redirect_uri_mismatch` | Google error shown when the redirect URL in Google Cloud does not exactly match the one Supabase uses. |

## Steps

### 1. Run the app
- Create the Next.js app and start it locally.
- **Check:** the landing page loads on your laptop.

### 2. Set up Supabase
- Create a Supabase project.
- Put the project URL and anon key in `.env.local` using `NEXT_PUBLIC_` names.
- Add `.env.local` to `.gitignore`.

### 3. Add Google login
- Create OAuth credentials in Google Cloud.
- Add the Supabase callback URL as an authorized redirect URI.
- Enable the Google provider in Supabase.
- Add a "Sign in with Google" button that returns the user to your app.
- **Check:** clicking the button logs you in and brings you back.

### 4. Save the user to a waitlist table
- Create a `waitlist` table with a **unique** email column.
- After login, **upsert** the user's email into the table.
- **Check:** your email appears as a row, and logging in again does not create a second one.

### 5. Show the profile
- Read name, picture and email from the session (`user_metadata`).
- Render the picture with `next/image` (allow the Google image domain).
- **Check:** the page shows your name, picture and email.

### 6. Add log out
- Add a log out button.
- **Check:** it ends the session and shows the landing page again.

### 7. Lock down the database
- Enable Row Level Security on `waitlist`.
- Write policies using `auth.uid()` so users can only access their own row.
- **Check:** RLS is on for the table.

### 8. Verify secrets
- Search the code and git history for keys.
- Only the public anon key may appear in client code; never the service role key.

### 9. Teammate test
- Ask a teammate to log in to your app.
- Help teammates until everyone's app works.

## Done Means

| Check | Done when |
|---|---|
| App runs | Your landing page loads on your laptop |
| Google login | The button logs you in with Google and brings you back to your app |
| Saved | Your email is a row in your waitlist table |
| No duplicates | Logging in again does not create a second row |
| Profile shown | The page shows your name, picture and email from Google |
| Log out | Works and brings back the landing page |
| Locked down | Row Level Security is on for the waitlist table |
| Secrets safe | No secret keys in your code or repo |
| Teammate test | A teammate can log in on your app |
| Everyone | Every team member has all of the above |

## House Rules

| Rule | Why |
|---|---|
| Any tool goes | AI, templates and UI kits are all allowed. The goal is a working product. |
| You own your app | AI wrote it? Fine. You still explain the login flow at the end. |
| Stuck for 5 minutes, say it out loud | A teammate has probably just solved it. |
| Stuck on Google for 25 minutes, switch to GitHub login | Same lesson, fewer settings. Nobody leaves without a working app. |
| Nobody is done alone | Your team is done when everyone's app works. |
| Secrets stay secret | Never commit keys. Don't paste secret keys into chats or AI tools. |
| Read the error first | Browser console, terminal, Supabase logs and Google's error page usually say exactly what's wrong. |
| Keep the UI simple | A heading, a button, a profile card. Design comes after it works; stylize if time allows. |

## Troubleshooting

- **`redirect_uri_mismatch`:** copy the callback URL from Supabase (Auth > Providers > Google) into Google Cloud's authorized redirect URIs exactly, with no trailing differences.
- **Env variables undefined:** restart the dev server after editing `.env.local`.
- **Profile image not loading:** add `lh3.googleusercontent.com` to `images.remotePatterns` in `next.config`.
- **Insert or read fails after enabling RLS:** check that a policy exists for the operation and uses `auth.uid()`.
