import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbpzzdlcottngeskansu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicHp6ZGxjb3R0bmdlc2thbnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjUwNzAsImV4cCI6MjA4OTYwMTA3MH0.c-eZYc1rEA7SinqPT8rS70yh02iuw9QDIEuz1unb5ZU';

export const supabase = createClient(supabaseUrl, supabaseKey);