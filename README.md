# SK Cinematic Portfolio — Production Final

Included:
- Cinematic eye + SK logo reveal
- Modal-based project/service navigation (no unwanted anchor jumping)
- Visible AI chatbot
- Supabase-backed contact enquiries
- Authenticated `/admin` login using Supabase Auth
- Admin enquiries view and site settings
- Responsive mobile refinements
- Clean deployment package (no nested duplicate project)

## Vercel environment variables
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- OPENAI_API_KEY
- OPENAI_MODEL (optional)

## Supabase
1. Run `supabase-schema.sql` in Supabase SQL Editor.
2. In Supabase Authentication, create your admin user (email/password).
3. Add the Supabase URL and publishable key to Vercel.
4. Add OPENAI_API_KEY in Vercel for live chatbot replies.
5. Redeploy after adding environment variables.

The OpenAI key must remain server-side. Never prefix it with NEXT_PUBLIC_.

## Production backend setup

This version is wired to the existing Supabase project. Before the final Vercel deployment, add these environment variables in the Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `OPENAI_API_KEY` (required for the AI chatbot)
- `OPENAI_MODEL` (optional; defaults to `gpt-5-mini`)

The public site uses the publishable Supabase key and relies on Row Level Security. Never put a Supabase secret/service key or an OpenAI secret key in client-side code.

The admin panel requires a Supabase Auth user. Create the admin account in Supabase Authentication, then sign in at `/admin`.
