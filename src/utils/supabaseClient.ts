import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hlongfbfbnrlkbrxkolf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsb25nZmJmYm5ybGticnhrb2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MjAzMzAsImV4cCI6MjA1NzM5NjMzMH0.WJiKSB7GfqgF2fffgyp5WzUgWhoPbbmJ2lHnK9YwYbA';
export const supabase = createClient(supabaseUrl, supabaseKey);
