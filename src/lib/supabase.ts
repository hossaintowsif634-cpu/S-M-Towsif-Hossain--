/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mucfozvkixzpoomrakrk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Y2ZvenZraXh6cG9vbXJha3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MTAzOTcsImV4cCI6MjA4NzQ4NjM5N30.b5kdhoFgMQ5e_saimyjdxS-_RCbi1JIVlp75xSl_NNc';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
