import { Home, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Home className="h-5 w-5" />
            </span>
            <span className="text-2xl font-extrabold">سكنك</span>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-primary-foreground/80">
            <MapPin className="h-4 w-4" />
            منصة السكن الطلابي — المنيا، مصر
          </p>
          <p className="max-w-md text-xs leading-relaxed text-primary-foreground/60">
            نساعد طلاب جامعة المنيا في إيجار سكن مناسب وقريب من الكلية،
            مع تواصل مباشر مع المالك عبر واتساب.
          </p>
          <div className="mt-2 border-t border-white/10 pt-4 text-xs text-primary-foreground/50">
            سكنك © {new Date().getFullYear()} — جميع الحقوق محفوظة
          </div>
        </div>
      </div>
    </footer>
  );
}
