import type { Listing } from './types';
import { REGION_LABELS, GENDER_LABELS } from './types';

// بناء رابط واتساب برسالة معبأة تلقائيًا ببيانات الشقة
export function buildWhatsAppUrl(listing: Listing): string {
  const message =
    `مرحبًا، أنا مهتم بالشقة: ${listing.title} - ${REGION_LABELS[listing.region]} - ${GENDER_LABELS[listing.gender]}. هل ما زالت متاحة؟`;
  const number = listing.whatsapp_number.replace(/[^\d]/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(listing: Listing) {
  window.open(buildWhatsAppUrl(listing), '_blank', 'noopener,noreferrer');
}
