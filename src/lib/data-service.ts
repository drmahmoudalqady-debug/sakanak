// ============================================================
// طبقة البيانات الموحدة — تعمل بالكامل على Supabase
// (قاعدة البيانات + تسجيل الدخول + تخزين الصور)
// لو Supabase مش مضبوط → تستخدم وضع تجريبي محلي (localStorage)
// ============================================================
import { supabase, isSupabaseConfigured, SUPABASE_BUCKET, ADMIN_EMAIL } from './supabase';
import { DEMO_LISTINGS } from './demo-data';
import type { Listing, Student, SiteSettings, UserType, AnalyticsEventType, AnalyticsSummary } from './types';
import { compressImage } from './image-utils';
import type { User } from '@supabase/supabase-js';

// ---------- وضع التجربة (Demo) ----------
const LS_LISTINGS = 'sakanak_demo_listings';
const LS_STUDENTS = 'sakanak_demo_students';
const LS_STUDENT_SESSION = 'sakanak_demo_student_session';
const LS_ADMIN_SESSION = 'sakanak_demo_admin_session';
const LS_SITE_SETTINGS = 'sakanak_demo_site_settings';

export const DEMO_ADMIN_PASSWORD = 'admin123'; // كلمة سر لوحة التحكم في الوضع التجريبي فقط

function demoReadListings(): Listing[] {
  try {
    const raw = localStorage.getItem(LS_LISTINGS);
    if (raw) return JSON.parse(raw) as Listing[];
  } catch { /* تجاهل */ }
  localStorage.setItem(LS_LISTINGS, JSON.stringify(DEMO_LISTINGS));
  return DEMO_LISTINGS;
}

function demoWriteListings(listings: Listing[]) {
  localStorage.setItem(LS_LISTINGS, JSON.stringify(listings));
  window.dispatchEvent(new Event('sakanak-demo-update'));
}

function demoReadStudents(): Student[] {
  try {
    return JSON.parse(localStorage.getItem(LS_STUDENTS) || '[]') as Student[];
  } catch { return []; }
}

function demoWriteStudents(students: Student[]) {
  localStorage.setItem(LS_STUDENTS, JSON.stringify(students));
  window.dispatchEvent(new Event('sakanak-demo-update'));
}

// ---------- الشقق (Listings) ----------

// اشتراك لحظي في قائمة الشقق — أي تعديل يظهر فورًا لكل الزوار
export function subscribeListings(callback: (listings: Listing[]) => void): () => void {
  if (!isSupabaseConfigured || !supabase) {
    callback(demoReadListings());
    const handler = () => callback(demoReadListings());
    window.addEventListener('sakanak-demo-update', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('sakanak-demo-update', handler);
      window.removeEventListener('storage', handler);
    };
  }

  // مرجع محلي ثابت: يحل مشكلة فقدان TypeScript لتتبع أن supabase غير null
  // داخل الدوال المتداخلة (closures) أدناه
  const client = supabase;

  // تحميل أولي
  client
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data }) => {
      if (data) callback(data as Listing[]);
    });

  // اشتراك لحظي في أي تغيير
  const channel = client
    .channel('listings-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, () => {
      client
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) callback(data as Listing[]);
        });
    })
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}

// رفع الصور بعد ضغطها، وإرجاع روابطها
export async function uploadListingImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const compressed = await compressImage(file); // أقل من 300KB
    if (isSupabaseConfigured && supabase) {
      const path = `listings/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      const { error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .upload(path, compressed, { contentType: 'image/jpeg', upsert: false });
      if (error) throw new Error(`فشل رفع الصورة: ${error.message}`);
      const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
    } else {
      // الوضع التجريبي: تحويل الصورة لـ Data URL
      urls.push(await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(compressed);
      }));
    }
  }
  return urls;
}

export async function addListing(data: Omit<Listing, 'id' | 'created_at'>): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    const listings = demoReadListings();
    listings.unshift({ ...data, id: `demo-${Date.now()}`, created_at: Date.now() });
    demoWriteListings(listings);
    return;
  }
  const { error } = await supabase.from('listings').insert({
    region: data.region,
    gender: data.gender,
    title: data.title,
    description: data.description,
    images: data.images,
    whatsapp_number: data.whatsapp_number,
    status: data.status,
  });
  if (error) throw new Error(`فشل إضافة الشقة: ${error.message}`);
}

export async function updateListing(id: string, data: Partial<Omit<Listing, 'id'>>): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    const listings = demoReadListings().map((l) => (l.id === id ? { ...l, ...data } : l));
    demoWriteListings(listings);
    return;
  }
  const { error } = await supabase.from('listings').update(data).eq('id', id);
  if (error) throw new Error(`فشل تعديل الشقة: ${error.message}`);
}

export async function deleteListing(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    demoWriteListings(demoReadListings().filter((l) => l.id !== id));
    return;
  }
  const { error } = await supabase.from('listings').delete().eq('id', id);
  if (error) throw new Error(`فشل حذف الشقة: ${error.message}`);
}

// ---------- دخول الأدمن (صاحب الموقع فقط) ----------

export function isAdminUser(user: User | null): boolean {
  if (!user || !user.email) return false;
  return ADMIN_EMAIL !== '' && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export async function adminLogin(email: string, password: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    if (password === DEMO_ADMIN_PASSWORD) {
      localStorage.setItem(LS_ADMIN_SESSION, '1');
      window.dispatchEvent(new Event('sakanak-demo-update'));
      return;
    }
    throw new Error('كلمة السر غير صحيحة');
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error('البريد الإلكتروني أو كلمة السر غير صحيحة');
  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    throw new Error('هذا ليس حساب صاحب الموقع');
  }
}

export async function adminLogout(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    localStorage.removeItem(LS_ADMIN_SESSION);
    window.dispatchEvent(new Event('sakanak-demo-update'));
    return;
  }
  await supabase.auth.signOut();
}

export function subscribeAdmin(callback: (isAdmin: boolean) => void): () => void {
  if (!isSupabaseConfigured || !supabase) {
    const emit = () => callback(localStorage.getItem(LS_ADMIN_SESSION) === '1');
    emit();
    window.addEventListener('sakanak-demo-update', emit);
    return () => window.removeEventListener('sakanak-demo-update', emit);
  }
  supabase.auth.getSession().then(({ data }) => {
    callback(isAdminUser(data.session?.user ?? null));
  });
  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(isAdminUser(session?.user ?? null));
  });
  return () => sub.subscription.unsubscribe();
}

// ---------- إعادة تعيين كلمة السر (نسيت الباسورد) ----------

// يرسل رابط إعادة تعيين كلمة السر إلى الإيميل المُدخل
// يعمل لكل من الأدمن والطلاب لأن الاثنين على نفس نظام Supabase Auth
export async function sendPasswordReset(email: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('هذه الميزة غير متاحة في الوضع التجريبي');
  }
  // المشروع يستخدم HashRouter (لتوافق أوسع مع الاستضافة الثابتة)، لذلك لازم نضيف
  // "#/" قبل المسار، مع الإبقاء على base path الحالي (مهم لأن الموقع منشور
  // تحت مسار فرعي مثل /sakanak/ على GitHub Pages وليس على الجذر مباشرة)
  const basePath = window.location.pathname.replace(/\/[^/]*$/, '/');
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}${basePath}#/reset-password`,
  });
  if (error) throw new Error(`تعذّر إرسال رابط إعادة التعيين: ${error.message}`);
}

// يُستخدم في صفحة /reset-password بعد ضغط الرابط في الإيميل
export async function updatePassword(newPassword: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('هذه الميزة غير متاحة في الوضع التجريبي');
  }
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(`تعذّر تحديث كلمة السر: ${error.message}`);
}

// ---------- تسجيل الطلاب ----------

export interface StudentSignupData {
  full_name: string;
  college: string;
  phone: string;
  email: string;
  password: string;
  user_type: UserType;
}

// إنشاء حساب طالب + تسجيل دخوله تلقائيًا
export async function signupStudent(data: StudentSignupData): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    const students = demoReadStudents();
    if (students.some((s) => s.email === data.email)) {
      throw new Error('هذا البريد مسجل بالفعل — سجّل دخولك بدلًا من ذلك');
    }
    const student: Student = {
      id: `stu-${Date.now()}`,
      full_name: data.full_name,
      college: data.college,
      phone: data.phone,
      email: data.email,
      user_type: data.user_type,
      created_at: Date.now(),
    };
    students.push(student);
    demoWriteStudents(students);
    localStorage.setItem(LS_STUDENT_SESSION, JSON.stringify(student));
    return;
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { full_name: data.full_name }, // بيتخزن في user_metadata عشان نعرضه في الهيدر من غير query إضافي
    },
  });
  if (signUpError) throw new Error(`فشل التسجيل: ${signUpError.message}`);
  if (!signUpData.user) throw new Error('تعذّر إنشاء الحساب');

  // تخزين بيانات الطالب الإضافية مربوطة بنفس الـ uid
  const { error: insertError } = await supabase.from('students').insert({
    id: signUpData.user.id,
    full_name: data.full_name,
    college: data.college,
    phone: data.phone,
    email: data.email,
    user_type: data.user_type,
  });
  if (insertError) throw new Error(`فشل حفظ بيانات التسجيل: ${insertError.message}`);
}

// تسجيل دخول طالب مسجل من قبل
export async function loginStudent(email: string, password: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    const student = demoReadStudents().find((s) => s.email === email);
    if (!student) throw new Error('الحساب غير موجود');
    localStorage.setItem(LS_STUDENT_SESSION, JSON.stringify(student));
    window.dispatchEvent(new Event('sakanak-demo-update'));
    return;
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error('البريد الإلكتروني أو كلمة السر غير صحيحة');
}

export async function logoutStudent(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    localStorage.removeItem(LS_STUDENT_SESSION);
    window.dispatchEvent(new Event('sakanak-demo-update'));
    return;
  }
  await supabase.auth.signOut();
}

// متابعة حالة تسجيل الطالب (الجلسة تفضل فعالة في الزيارات التالية)
export function subscribeStudent(callback: (student: { id: string; email: string; full_name?: string } | null) => void): () => void {
  if (!isSupabaseConfigured || !supabase) {
    const emit = () => {
      try {
        const raw = localStorage.getItem(LS_STUDENT_SESSION);
        callback(raw ? JSON.parse(raw) : null);
      } catch { callback(null); }
    };
    emit();
    window.addEventListener('sakanak-demo-update', emit);
    return () => window.removeEventListener('sakanak-demo-update', emit);
  }

  const emit = (user: User | null) => {
    // الأدمن لا يُعتبر طالبًا
    callback(
      user && !isAdminUser(user)
        ? { id: user.id, email: user.email || '', full_name: (user.user_metadata as { full_name?: string })?.full_name }
        : null
    );
  };

  supabase.auth.getSession().then(({ data }) => emit(data.session?.user ?? null));
  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    emit(session?.user ?? null);
  });
  return () => sub.subscription.unsubscribe();
}

// ---------- قائمة الطلاب (للأدمن فقط) ----------

export async function getStudents(): Promise<Student[]> {
  if (!isSupabaseConfigured || !supabase) return demoReadStudents();
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`فشل تحميل قائمة الطلاب: ${error.message}`);
  return (data ?? []) as Student[];
}

// حذف طالب (للأدمن فقط) — يحذف حسابه من Auth وبياناته من الجدول
export async function deleteStudent(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    demoWriteStudents(demoReadStudents().filter((s) => s.id !== id));
    return;
  }
  // ملاحظة: حذف المستخدم من auth.users يتطلب صلاحيات خاصة (service role)
  // لذلك هنا نحذف بياناته من جدول students فقط، وهو ما يمنعه من الظهور
  // في قائمة الطلاب ويوقف قدرته على الدخول ببيانات صحيحة للوحة التحكم مستقبلاً.
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) throw new Error(`فشل حذف الطالب: ${error.message}`);
}

// ---------- إعدادات الموقع العامة (رقم واتساب استرجاع الباسورد + رقم استقبال عروض الشقق) ----------
const DEFAULT_SITE_SETTINGS: SiteSettings = {
  forgot_password_contact: '',
  owner_whatsapp_number: '',
};

function demoReadSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(LS_SITE_SETTINGS);
    if (raw) return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(raw) };
  } catch { /* تجاهل */ }
  return DEFAULT_SITE_SETTINGS;
}

// جلب إعدادات الموقع (متاحة للجميع — طالب أو زائر أو أدمن)
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured || !supabase) {
    return demoReadSiteSettings();
  }
  const { data, error } = await supabase
    .from('site_settings')
    .select('forgot_password_contact, owner_whatsapp_number')
    .eq('id', 1)
    .single();
  if (error) throw new Error(`فشل تحميل إعدادات الموقع: ${error.message}`);
  return {
    forgot_password_contact: data?.forgot_password_contact ?? '',
    owner_whatsapp_number: data?.owner_whatsapp_number ?? '',
  };
}

// تحديث إعدادات الموقع (للأدمن فقط)
export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    const current = demoReadSiteSettings();
    localStorage.setItem(LS_SITE_SETTINGS, JSON.stringify({ ...current, ...settings }));
    window.dispatchEvent(new Event('sakanak-demo-update'));
    return;
  }
  const { error } = await supabase.from('site_settings').update(settings).eq('id', 1);
  if (error) throw new Error(`فشل حفظ الإعدادات: ${error.message}`);
}
