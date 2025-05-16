'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase'; // Se você tiver os tipos

export const supabase = createClientComponentClient<Database>();
