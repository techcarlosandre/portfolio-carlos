import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

export const isSupabaseConfigured = !!env.SUPABASE_URL && !!env.SUPABASE_KEY;

export const supabase = isSupabaseConfigured
  ? createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
      auth: {
        persistSession: false,
      },
    })
  : null;
