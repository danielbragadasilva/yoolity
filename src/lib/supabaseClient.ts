// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://akbekomlgyptovjdjvyg.supabase.co'; // Substitua pelo seu URL do Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrYmVrb21sZ3lwdG92amRqdnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NjAyODcsImV4cCI6MjA2MzEzNjI4N30.wiCuYwwiROtG33Zz7HaE3jKR_py9J4YAGUS4i_xyFI0'; // Substitua pela sua chave anônima

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
