   import { createClient } from '@supabase/supabase-js'

   // One shared connection to the database for the whole app.
   export const supabase = createClient(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_KEY,
   )
   