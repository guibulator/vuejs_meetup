import { createClient } from '@supabase/supabase-js'

const supabaseUrl = useRuntimeConfig().public.supabaseUrl
const supabaseKey = useRuntimeConfig().supabaseServiceKey

export const supabase = createClient(supabaseUrl, supabaseKey)
