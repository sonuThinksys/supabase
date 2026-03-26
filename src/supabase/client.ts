import { createClient } from '@supabase/supabase-js';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SUPABASE_URL = "https://grtrtnjvsjxawmckyazd.supabase.co"
const SUPABASE_ANON_KEY="sb_publishable_tU8fDivplxrqAcc2ZQ-BJw_vWgK_bOU"
console.log("SUPABASE_URL=========", SUPABASE_URL);
console.log("SUPABASE_ANON_KE=======Y",SUPABASE_ANON_KEY);
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY,{
    auth: {
        storage: AsyncStorage,        // 👈 THIS FIXES YOUR ISSUE
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
});