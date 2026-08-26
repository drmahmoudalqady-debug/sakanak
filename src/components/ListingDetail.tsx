// نافذة تفاصيل الشقة: معرض صور + وصف + زرار واتساب (مع بوابة التسجيل)
import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, MapPin, Users, MessageCircle, ImageIcon } from 'lucide-react';
import type { Listing } from '@/lib/types';
import { REGION_LABELS, GENDER_LABELS, STATUS_LABELS } from '@/lib/types';
import { openWhatsApp } from '@/lib/whatsapp';
import { useApp } from '@/context/AppContext';
import SignupGate from './SignupGate';
import PolicyGate, { hasAgreedToPolicy } from './PolicyGate';

interface Props {
  listing: Listing | null;
  onClose: () => void;
}

export default function ListingDetail({ listing, onClose }: Props) {
  const { student } = useApp();
  const [imgIndex, setImgIndex] = useState(0);
  const [gateOpen, setGateOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  useEffect(() => { setImgIndex(0); setGateOpen(false); setPolicyOpen(false); }, [listing?.id]);

  if (!listing) return null;
  const images = listing.images.length ? listing.images : [''];

  // زرار واتساب: أولوية القواعد (مرة واحدة للأبد) ثم التسجيل ثم فتح واتساب
  function handleWhatsApp() {
    if (!hasAgreedToPolicy()) {
      setPolicyOpen(true);
      return;
    }
    proceedAfterPolicy();
  }

  function proceedAfterPolicy() {
    if (student) {
      openWhatsApp(listing!);
    } else {
      setGateOpen(true);
    }
  }

  return (
    <>
      <Dialog open={!!listing} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto p-0" dir="rtl">
          {/* معرض الصور */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted sm:aspect-[16/9]">
            {images[imgIndex] ? (
              <img src={images[imgIndex]} alt={`${listing.title} — صورة ${imgIndex + 1}`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <ImageIcon className="h-12 w-12" />
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                  className="absolute start-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                  aria-label="الصورة السابقة"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                  className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                  aria-label="الصورة التالية"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="absolute bottom-3 end-3 rounded-full bg-black/55 px-3 py-1 text-xs text-white">
                  {imgIndex + 1} / {images.length}
                </span>
              </>
            )}
            <Badge className={`absolute top-3 start-3 ${listing.status === 'available' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}>
              {STATUS_LABELS[listing.status]}
            </Badge>
          </div>

          {/* صور مصغرة */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto px-4 pt-3">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${i === imgIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}

          {/* البيانات */}
          <div className="space-y-4 p-5">
            <div>
              <h2 className="text-xl font-extrabold text-foreground">{listing.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  {REGION_LABELS[listing.region]}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-primary" />
                  {GENDER_LABELS[listing.gender]}
                </span>
              </div>
            </div>

            <p className="whitespace-pre-line rounded-xl bg-muted/60 p-4 text-sm leading-relaxed text-foreground/90">
              {listing.description}
            </p>

            {/* زرار واتساب — أهم عنصر وظيفي */}
            <Button
              onClick={handleWhatsApp}
              disabled={listing.status === 'reserved'}
              size="lg"
              className="w-full gap-2 bg-[#25D366] text-base font-bold text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#1eb85a] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
            >
              <MessageCircle className="h-5 w-5" />
              {listing.status === 'reserved' ? 'الشقة محجوزة حاليًا' : 'تواصل عبر واتساب'}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {listing.status === 'reserved'
                ? 'هذه الشقة لم تعد متاحة — تصفّح شققًا أخرى مشابهة'
                : student
                  ? 'سيتم فتح محادثة واتساب مع المالك برسالة جاهزة ببيانات الشقة'
                  : 'سيُطلب منك التسجيل مرة واحدة فقط قبل أول تواصل'}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* بوابة القواعد — تظهر مرة واحدة فقط قبل أي تسجيل أو تواصل */}
      <PolicyGate
        open={policyOpen}
        onClose={() => setPolicyOpen(false)}
        onAgree={() => {
          setPolicyOpen(false);
          proceedAfterPolicy();
        }}
      />

      {/* بوابة التسجيل — بعد النجاح يفتح واتساب مباشرة */}
      <SignupGate
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        onSuccess={() => {
          setGateOpen(false);
          openWhatsApp(listing);
        }}
      />
    </>
  );
}
