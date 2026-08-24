// ============================================================
// إعداد Supabase — قاعدة البيانات + تسجيل الدخول + تخزين الصور
// المفاتيح تُقرأ من متغيرات البيئة فقط، لا تكتبها هنا مباشرة!
// ============================================================
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// البريد الإلكتروني لصاحب الموقع — هذا الإيميل وحده يملك صلاحية الأدمن
export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined) ?? '';

// اسم الـ bucket في Supabase Storage — لازم يكون منشأ فعلاً وPublic
export const SUPABASE_BUCKET = 'listing-images';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  supabase = createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);
}

export { supabase };
