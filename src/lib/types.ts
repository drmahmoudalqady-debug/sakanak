// أنواع البيانات الأساسية للمشروع

export type Region = 'new-minya' | 'minya';
export type Gender = 'girls' | 'boys';

export interface Listing {
  id: string;
  region: Region;            // المنيا الجديدة / المنيا
  gender: Gender;            // بنات / شباب
  title: string;             // عنوان مختصر للشقة
  description: string;       // وصف تفصيلي
  images: string[];          // روابط الصور (حد أدنى 1)
  whatsapp_number: string;   // رقم السمسار/المالك بصيغة دولية بدون +
  status: 'available' | 'reserved';
  created_at: number;        // timestamp
}

export type UserType = 'male_student' | 'female_student' | 'owner';

export interface Student {
  id: string;                // uid من Supabase Auth
  full_name: string;
  college: string;
  phone: string;
  email: string;
  user_type: UserType;       // طالب / طالبة / مالك
  created_at: number;
}

export const USER_TYPE_LABELS: Record<UserType, string> = {
  male_student: 'طالب',
  female_student: 'طالبة',
  owner: 'مالك',
};

// ---------- الإحصائيات ----------
export type AnalyticsEventType = 'page_view' | 'listing_view' | 'whatsapp_click';

export interface AnalyticsEvent {
  id: string;
  event_type: AnalyticsEventType;
  listing_id: string | null;
  region: Region | null;
  page_path: string | null;
  created_at: string; // ISO timestamp من Supabase
}

export interface AnalyticsSummary {
  totalPageViews: number;
  totalListingViews: number;
  totalWhatsappClicks: number;
  conversionRate: number; // (whatsapp / listingViews) * 100
  dailyActivity: { date: string; page_view: number; listing_view: number; whatsapp_click: number }[];
  topListings: { listing_id: string; title: string; views: number }[];
  regionBreakdown: { region: Region; count: number }[];
  recentEvents: (AnalyticsEvent & { listing_title?: string })[];
}

// إعدادات عامة للموقع يتحكم فيها الأدمن من لوحة التحكم
export interface SiteSettings {
  forgot_password_contact: string; // رقم/معلومات التواصل لاسترجاع كلمة السر
  owner_whatsapp_number: string;   // رقم واتساب استقبال طلبات عرض الشقق من الملاك
}

export const REGION_LABELS: Record<Region, string> = {
  'new-minya': 'المنيا الجديدة',
  'minya': 'المنيا',
};

export const GENDER_LABELS: Record<Gender, string> = {
  girls: 'سكن بنات',
  boys: 'سكن شباب',
};

export const STATUS_LABELS: Record<Listing['status'], string> = {
  available: 'متاحة',
  reserved: 'محجوزة',
};
