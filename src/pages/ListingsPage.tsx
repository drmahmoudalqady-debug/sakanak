// صفحة قسم (منطقة × نوع سكن): تبويبات بنات/شباب + بحث + شبكة الشقق
import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router';
import { useApp } from '@/context/AppContext';
import ListingCard from '@/components/ListingCard';
import ListingDetail from '@/components/ListingDetail';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Search, Building2, Landmark } from 'lucide-react';
import type { Listing, Region, Gender } from '@/lib/types';
import { REGION_LABELS, GENDER_LABELS } from '@/lib/types';

export default function ListingsPage() {
  const { region } = useParams<{ region: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { listings, loadingListings } = useApp();
  const [selected, setSelected] = useState<Listing | null>(null);
  const [search, setSearch] = useState('');

  const validRegion: Region = region === 'new-minya' ? 'new-minya' : 'minya';
  const gender: Gender = searchParams.get('g') === 'boys' ? 'boys' : 'girls';

  const filtered = useMemo(() => {
    return listings
      .filter((l) => l.region === validRegion && l.gender === gender)
      .filter((l) => {
        if (!search.trim()) return true;
        const q = search.trim();
        return l.title.includes(q) || l.description.includes(q);
      })
      .sort((a, b) => (a.status === 'available' ? 0 : 1) - (b.status === 'available' ? 0 : 1));
  }, [listings, validRegion, gender, search]);

  const RegionIcon = validRegion === 'new-minya' ? Building2 : Landmark;
  const otherRegion: Region = validRegion === 'new-minya' ? 'minya' : 'new-minya';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* مسار التنقل */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="transition hover:text-primary">الرئيسية</Link>
        <ArrowRight className="h-3.5 w-3.5" />
        <span className="font-semibold text-foreground">{REGION_LABELS[validRegion]}</span>
        <ArrowRight className="h-3.5 w-3.5" />
        <span className="font-semibold text-foreground">{GENDER_LABELS[gender]}</span>
      </nav>

      {/* الترويسة */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <RegionIcon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold">{REGION_LABELS[validRegion]}</h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'شقة' : 'شقق'} في هذا القسم
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/region/${otherRegion}?g=${gender}`)}
          className="self-start rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary transition hover:bg-secondary sm:self-auto"
        >
          الانتقال إلى {REGION_LABELS[otherRegion]}
        </button>
      </div>

      {/* تبويبات بنات / شباب + البحث */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={gender} onValueChange={(v) => setSearchParams({ g: v })}>
          <TabsList className="h-12">
            <TabsTrigger value="girls" className="px-6 text-sm data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700">
              سكن بنات
            </TabsTrigger>
            <TabsTrigger value="boys" className="px-6 text-sm data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700">
              سكن شباب
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative sm:w-72">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم الشقة أو ميزة في الوصف..."
            className="ps-9"
          />
        </div>
      </div>

      {/* شبكة الشقق */}
      {loadingListings ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border/60 bg-card">
              <div className="aspect-[4/3] bg-muted" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/60 py-20 text-center">
          <RegionIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="mb-1 text-lg font-bold text-foreground">لا توجد شقق هنا حاليًا</h3>
          <p className="text-sm text-muted-foreground">
            {search ? 'جرّب كلمة بحث مختلفة' : 'يضيف صاحب الموقع شققًا جديدة باستمرار — عُد قريبًا'}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onOpen={setSelected} />
          ))}
        </div>
      )}

      <ListingDetail listing={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
