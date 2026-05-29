import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uunxgkhhjjczeeawqflh.supabase.co";
const supabaseAnonKey = "sb_publishable_cBhuF6-XRJJxNv9hxHBUDw_M3lBpwqF";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
