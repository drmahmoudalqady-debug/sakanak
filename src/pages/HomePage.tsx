import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '@/context/AppContext';
import Scene3D from '@/components/Scene3D';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Building2, Landmark, MessageCircle, Images, ShieldCheck,
  ArrowDown, Users, GraduationCap, MapPin, KeyRound,
} from 'lucide-react';
import type { Region } from '@/lib/types';
import { REGION_LABELS } from '@/lib/types';
import { getSiteSettings } from '@/lib/data-service';

export default function HomePage() {
  const { listings } = useApp();
  const navigate = useNavigate();

  // ديالوج احتياطي: يظهر فقط لو رقم واتساب المالك غير مُعدّ من لوحة التحكم
  const [showOwnerContact, setShowOwnerContact] = useState(false);
  const [loadingOwnerNumber, setLoadingOwnerNumber] = useState(false);

  async function openOwnerContact() {
    setLoadingOwnerNumber(true);
    try {
      const s = await getSiteSettings();
      const number = (s.owner_whatsapp_number || '').replace(/[^\d]/g, ''); // إزالة أي رموز غير أرقام (+ مسافات إلخ)
      if (number) {
        const message = encodeURIComponent('السلام عليكم، عندي شقة وعايز أعرضها على منصة سكنك.');
        window.open(`https://wa.me/${number}?text=${message}`, '_blank');
      } else {
        // لا يوجد رقم مُعدّ حاليًا من لوحة التحكم — نعرض نافذة توضيحية بدل فتح رابط فاسد
        setShowOwnerContact(true);
      }
    } catch {
      setShowOwnerContact(true);
    } finally {
      setLoadingOwnerNumber(false);
    }
  }

  function scrollToOwnerCard() {
    document.getElementById('list-your-apartment')?.scrollIntoView({ behavior: 'smooth' });
  }

  const countFor = (region: Region, gender: 'girls' | 'boys') =>
    listings.filter((l) => l.region === region && l.gender === gender && l.status === 'available').length;

  const regions: { key: Region; icon: typeof Building2; tagline: string }[] = [
    { key: 'new-minya', icon: Building2, tagline: 'مدينة جامعية حديثة بجوار الحرم الجامعي الجديد' },
    { key: 'minya', icon: Landmark, tagline: 'قلب المدينة على كورنيش النيل وبجوار الكليات' },
  ];

  return (
    <div>
      {/* ============ قسم البطل مع خلفية 3D ============ */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        <Scene3D />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-amber-300" />
            المنيا — عروس الصعيد
          </div>

          <h1 className="mb-4 text-6xl font-black tracking-tight text-white sm:text-7xl md:text-8xl">
            سَكَنَك
          </h1>
          <p className="text-gold-gradient mb-3 text-2xl font-extrabold sm:text-3xl">
            سكنك الطلابي في المنيا يبدأ من هنا
          </p>
          <p className="mx-auto mb-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            تصفّح شقق سكن البنات والشباب في المنيا الجديدة والمنيا،
            شاهد الصور والتفاصيل، وتواصل مع المالك مباشرة عبر واتساب بضغطة واحدة.
          </p>

          <button
            onClick={scrollToOwnerCard}
            className="mx-auto mb-8 flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/15"
          >
            <Building2 className="h-3.5 w-3.5 text-amber-300" />
            عندك شقة؟ اعرضها معانا (خاص بالملاك)
          </button>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="w-full gap-2 bg-accent px-8 text-base font-bold text-accent-foreground shadow-xl shadow-amber-900/30 hover:bg-accent/90 sm:w-auto"
              onClick={() => document.getElementById('regions')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Building2 className="h-5 w-5" />
              تصفح الشقق المتاحة
            </Button>
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/85 backdrop-blur-sm">
              <span className="text-2xl font-black text-amber-300">
                {listings.filter((l) => l.status === 'available').length}
              </span>
              شقة متاحة الآن
            </div>
          </div>

          <button
            onClick={() => document.getElementById('regions')?.scrollIntoView({ behavior: 'smooth' })}
            className="mx-auto mt-14 flex flex-col items-center gap-1 text-white/50 transition hover:text-white/80"
            aria-label="انزل للأسفل"
          >
            <span className="text-xs">اختر منطقتك</span>
            <ArrowDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* ============ اختيار المنطقة ============ */}
      <section id="regions" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-extrabold text-foreground">اختار منطقتك</h2>
          <p className="text-muted-foreground">منطقتان رئيسيتان، وفي كل منطقة سكن بنات وسكن شباب</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {regions.map(({ key, icon: Icon, tagline }) => (
            <div key={key} className="card-glow overflow-hidden rounded-3xl border border-border/70 bg-card">
              <div className="relative bg-primary p-6 text-primary-foreground">
                <div className="absolute -end-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
                <div className="absolute -bottom-8 -start-4 h-24 w-24 rounded-full bg-white/5" />
                <div className="relative flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                    <Icon className="h-7 w-7" />
                  </span>
                  <div>
                    <h3 className="text-2xl font-extrabold">{REGION_LABELS[key]}</h3>
                    <p className="mt-1 text-sm text-primary-foreground/75">{tagline}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-5">
                <button
                  onClick={() => navigate(`/region/${key}?g=girls`)}
                  className="group rounded-2xl border border-pink-200 bg-pink-50 p-5 text-start transition hover:border-pink-400 hover:shadow-md"
                >
                  <Users className="mb-2 h-6 w-6 text-pink-500" />
                  <div className="font-bold text-foreground group-hover:text-pink-600">سكن بنات</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {countFor(key, 'girls')} شقة متاحة
                  </div>
                </button>
                <button
                  onClick={() => navigate(`/region/${key}?g=boys`)}
                  className="group rounded-2xl border border-sky-200 bg-sky-50 p-5 text-start transition hover:border-sky-400 hover:shadow-md"
                >
                  <GraduationCap className="mb-2 h-6 w-6 text-sky-600" />
                  <div className="font-bold text-foreground group-hover:text-sky-700">سكن شباب</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {countFor(key, 'boys')} شقة متاحة
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ لماذا سكنك ============ */}
      <section className="border-y border-border/60 bg-secondary/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-extrabold text-foreground">لماذا سكنك؟</h2>
            <p className="text-muted-foreground">صممناه ليكون أسرع وأأمن طريق لسكنك الجامعي</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: MessageCircle,
                title: 'تواصل مباشر',
                desc: 'زرار واتساب واحد يفتح محادثة مع المالك برسالة جاهزة ببيانات الشقة — بدون وسطاء.',
                color: 'text-emerald-600 bg-emerald-100',
              },
              {
                icon: Images,
                title: 'صور وتفاصيل حقيقية',
                desc: 'كل شقة بصورها ووصفها الكامل: عدد الغرف، الدور، القرب من الكلية، والسعر.',
                color: 'text-sky-600 bg-sky-100',
              },
              {
                icon: ShieldCheck,
                title: 'بياناتك محمية',
                desc: 'التسجيل مطلوب فقط عند التواصل، وبياناتك لا يراها إلا إدارة الموقع لغرض السكن فقط.',
                color: 'text-amber-600 bg-amber-100',
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card-glow rounded-2xl border border-border/70 bg-card p-6 text-center">
                <span className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mb-2 text-lg font-bold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          {/* ============ كارت خاص بالملاك: لعرض شقتك ============ */}
          <div
            id="list-your-apartment"
            className="mt-6 scroll-mt-20 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center sm:p-8"
          >
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Building2 className="h-7 w-7" />
            </span>
            <h3 className="mb-2 text-lg font-bold">عندك شقة؟ اعرضها معانا</h3>
            <p className="mx-auto mb-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              خاص بالملاك — تواصل معانا عبر واتساب وابعتلنا تفاصيل شقتك عشان نضيفها للموقع ويشوفها آلاف الطلاب.
            </p>
            <Button onClick={openOwnerContact} disabled={loadingOwnerNumber} className="gap-2">
              <MessageCircle className="h-4 w-4" />
              {loadingOwnerNumber ? 'جارٍ التحويل...' : 'تواصل لعرض شقتك'}
            </Button>
          </div>
        </div>
      </section>

      {/* ديالوج احتياطي: يظهر فقط لو رقم واتساب المالك غير مُعدّ من لوحة التحكم */}
      <Dialog open={showOwnerContact} onOpenChange={setShowOwnerContact}>
        <DialogContent className="max-w-sm" dir="rtl">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
              <KeyRound className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl">لعرض شقتك</DialogTitle>
            <DialogDescription className="text-center leading-relaxed">
              التواصل غير متاح حاليًا — حاول لاحقًا.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
