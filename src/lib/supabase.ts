import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tzgqdogzgfruzauabjgv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6Z3Fkb2d6Z2ZydXphdWFiamd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjU4MjgsImV4cCI6MjA3MDMwMTgyOH0.sy_VMb4GvSohczceDGiV5CguDCIaNphLMOKt_3S26i4';
export const supabase = createClient(supabaseUrl, supabaseKey);