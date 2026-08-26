import { createBrowserClient } from "@supabase/ssr";

/**
 * Build-safe Supabase client.
 * During a Vercel build, NEXT_PUBLIC_SUPABASE_* may not be present yet.
 * In that case we return a harmless no-op client so static generation can finish.
 * In the browser, once the variables are configured, the real Supabase client is used.
 */
export function createClient(): any {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (url && key) {
    return createBrowserClient(url, key);
  }

  const error = new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in Vercel.");

  const query = () => {
    const builder: any = {
      select: () => builder,
      eq: () => builder,
      order: () => builder,
      update: () => builder,
      delete: () => builder,
      insert: () => builder,
      upsert: () => builder,
      single: async () => ({ data: null, error }),
      then: (resolve: any, reject?: any) => Promise.resolve({ data: [], error }).then(resolve, reject),
    };
    return builder;
  };

  return {
    from: query,
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithPassword: async () => ({ data: { session: null, user: null }, error }),
      signOut: async () => ({ error: null }),
    },
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error }),
        remove: async () => ({ data: null, error }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  };
}
