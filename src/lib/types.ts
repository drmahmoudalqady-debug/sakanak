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

export interface Student {
  id: string;                // uid من Firebase Auth
  full_name: string;
  college: string;
  phone: string;
  email: string;
  created_at: number;
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
