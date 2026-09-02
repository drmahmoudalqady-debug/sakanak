// تبويب الإحصائيات في لوحة تحكم الأدمن
// يعرض: ملخص عام، رسم بياني للنشاط اليومي، أكثر الشقق مشاهدة، توزيع حسب
// المنطقة، آخر 50 حدث، وأدوات تصدير CSV وحذف الأحداث القديمة يدويًا.
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  Eye, Building2, MessageCircle, TrendingUp, Loader2, Download,
  Trash2, MapPin, Activity,
} from 'lucide-react';
import { getAnalyticsSummary, deleteAnalyticsEventsBefore } from '@/lib/data-service';
import type { AnalyticsSummary } from '@/lib/types';
import { REGION_LABELS } from '@/lib/types';

// تنسيق تاريخ اليوم بصيغة YYYY-MM-DD (لحقول input type=date)
function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  page_view: 'زيارة صفحة',
  listing_view: 'فتح شقة',
  whatsapp_click: 'ضغطة واتساب',
};

const PIE_COLORS = ['#0d9488', '#f59e0b'];

// تحويل مصفوفة بيانات إلى ملف CSV وتنزيله مباشرة في المتصفح
function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (val: string | number) => {
    const s = String(val).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  // BOM في البداية لضمان ظهور الحروف العربية صحيحة عند فتح الملف في Excel
  const csv = '\uFEFF' + [headers, ...rows].map((r) => r.map(escape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AnalyticsTab() {
  const [startDate, setStartDate] = useState(daysAgoIso(30));
  const [endDate, setEndDate] = useState(todayIso());
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [cleanupBefore, setCleanupBefore] = useState(daysAgoIso(90));
  const [cleanupConfirmOpen, setCleanupConfirmOpen] = useState(false);
  const [cleanupBusy, setCleanupBusy] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<number | null>(null);

  function load() {
    setLoading(true);
    setError('');
    getAnalyticsSummary(startDate, endDate)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'تعذّر تحميل الإحصائيات'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []); // تحميل أولي بآخر 30 يوم

  function handleExport() {
    if (!data) return;
    const rangeLabel = `${startDate}_${endDate}`;

    // ملخص عام
    downloadCsv(`سكنك-ملخص-${rangeLabel}.csv`,
      ['المؤشر', 'القيمة'],
      [
        ['الفترة من', startDate],
        ['الفترة إلى', endDate],
        ['إجمالي الزيارات', data.totalPageViews],
        ['فتح شقق', data.totalListingViews],
        ['ضغطات واتساب', data.totalWhatsappClicks],
        ['معدل التحويل (%)', data.conversionRate],
      ]);

    // آخر الأحداث التفصيلية (أهم جزء للتحليل)
    downloadCsv(`سكنك-أحداث-${rangeLabel}.csv`,
      ['التاريخ والوقت', 'نوع الحدث', 'الشقة', 'المنطقة'],
      data.recentEvents.map((e) => [
        new Date(e.created_at).toLocaleString('ar-EG'),
        EVENT_TYPE_LABELS[e.event_type] ?? e.event_type,
        e.listing_title ?? '-',
        e.region ? REGION_LABELS[e.region] : '-',
      ]));
  }

  async function handleCleanupConfirm() {
    setCleanupBusy(true);
    try {
      const count = await deleteAnalyticsEventsBefore(cleanupBefore);
      setCleanupResult(count);
      setCleanupConfirmOpen(false);
      load(); // تحديث الأرقام بعد الحذف
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر حذف الأحداث القديمة');
    } finally {
      setCleanupBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* اختيار المدى الزمني */}
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border/70 bg-card p-4">
        <div className="space-y-1.5">
          <Label htmlFor="stats-start">من تاريخ</Label>
          <Input id="stats-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-40" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stats-end">إلى تاريخ</Label>
          <Input id="stats-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40" />
        </div>
        <Button onClick={load} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
          تحديث
        </Button>
        <Button variant="outline" onClick={handleExport} disabled={!data || loading} className="gap-2">
          <Download className="h-4 w-4" />
          تصدير CSV
        </Button>
      </div>

      {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      {loading && !data ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : data ? (
        <>
          {/* البطاقات الملخصة */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'إجمالي الزيارات', value: data.totalPageViews, icon: Eye, color: 'text-sky-600' },
              { label: 'فتح شقق', value: data.totalListingViews, icon: Building2, color: 'text-primary' },
              { label: 'ضغطات واتساب', value: data.totalWhatsappClicks, icon: MessageCircle, color: 'text-[#128C4B]' },
              { label: 'معدل التحويل', value: `${data.conversionRate}%`, icon: TrendingUp, color: 'text-amber-600' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-2xl border border-border/70 bg-card p-4">
                <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-secondary ${color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="text-2xl font-extrabold">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          {/* النشاط اليومي (Line chart) */}
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <h3 className="mb-3 font-bold">النشاط اليومي</h3>
            {data.dailyActivity.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">لا توجد بيانات في هذه الفترة</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="page_view" name="زيارات" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="listing_view" name="فتح شقق" stroke="#0d9488" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="whatsapp_click" name="واتساب" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* أكثر الشقق مشاهدة */}
            <div className="rounded-2xl border border-border/70 bg-card p-4">
              <h3 className="mb-3 font-bold">أكثر الشقق مشاهدة</h3>
              {data.topListings.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">لا توجد بيانات في هذه الفترة</p>
              ) : (
                <div className="space-y-2">
                  {data.topListings.map((l, i) => (
                    <div key={l.listing_id} className="flex items-center justify-between gap-2 rounded-lg bg-secondary/40 px-3 py-2 text-sm">
                      <span className="flex items-center gap-2 truncate">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
                          {i + 1}
                        </span>
                        <span className="truncate">{l.title}</span>
                      </span>
                      <span className="shrink-0 font-bold text-primary">{l.views}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* التوزيع حسب المنطقة */}
            <div className="rounded-2xl border border-border/70 bg-card p-4">
              <h3 className="mb-3 flex items-center gap-2 font-bold">
                <MapPin className="h-4 w-4 text-primary" />
                النشاط حسب المنطقة
              </h3>
              {data.regionBreakdown.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">لا توجد بيانات في هذه الفترة</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={data.regionBreakdown}
                      dataKey="count"
                      nameKey="region"
                      cx="50%" cy="50%" outerRadius={80}
                      label={(props: { region: 'new-minya' | 'minya'; count: number }) =>
                        `${REGION_LABELS[props.region]}: ${props.count}`}
                    >
                      {data.regionBreakdown.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number, _name, entry) => {
                      const region = entry.payload.region as 'new-minya' | 'minya';
                      return [value, REGION_LABELS[region]];
                    }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* آخر 50 حدث */}
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <h3 className="mb-3 font-bold">آخر الأحداث ({data.recentEvents.length})</h3>
            {data.recentEvents.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">لا توجد أحداث في هذه الفترة</p>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card text-start text-xs text-muted-foreground">
                    <tr className="border-b border-border/70">
                      <th className="p-2 text-start font-medium">التاريخ والوقت</th>
                      <th className="p-2 text-start font-medium">الحدث</th>
                      <th className="p-2 text-start font-medium">الشقة</th>
                      <th className="p-2 text-start font-medium">المنطقة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentEvents.map((e) => (
                      <tr key={e.id} className="border-b border-border/40 last:border-0">
                        <td className="p-2 text-xs text-muted-foreground" dir="ltr">
                          {new Date(e.created_at).toLocaleString('ar-EG')}
                        </td>
                        <td className="p-2">{EVENT_TYPE_LABELS[e.event_type] ?? e.event_type}</td>
                        <td className="p-2 text-muted-foreground">{e.listing_title ?? '-'}</td>
                        <td className="p-2 text-muted-foreground">{e.region ? REGION_LABELS[e.region] : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}

      {/* أداة حذف الأحداث القديمة — يدوي بالكامل، لا يعمل تلقائيًا أبدًا */}
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
        <h3 className="mb-1 flex items-center gap-2 font-bold text-destructive">
          <Trash2 className="h-4 w-4" />
          حذف الأحداث القديمة
        </h3>
        <p className="mb-3 text-sm text-muted-foreground">
          احذف يدويًا كل الأحداث الأقدم من تاريخ معيّن — مفيد بعد تصدير التقرير الشهري لتفريغ قاعدة البيانات. لا يتم أي حذف تلقائي أبدًا.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="cleanup-before">احذف كل ما قبل تاريخ</Label>
            <Input id="cleanup-before" type="date" value={cleanupBefore} onChange={(e) => setCleanupBefore(e.target.value)} className="w-40" />
          </div>
          <Button variant="destructive" onClick={() => setCleanupConfirmOpen(true)} className="gap-2">
            <Trash2 className="h-4 w-4" />
            حذف الآن
          </Button>
        </div>
        {cleanupResult !== null && (
          <p className="mt-3 rounded-lg bg-emerald-100 px-3 py-2 text-sm text-emerald-700">
            تم حذف {cleanupResult} حدث بنجاح.
          </p>
        )}
      </div>

      {/* تأكيد الحذف */}
      <AlertDialog open={cleanupConfirmOpen} onOpenChange={(v) => !v && !cleanupBusy && setCleanupConfirmOpen(false)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              تأكيد حذف الأحداث القديمة
            </AlertDialogTitle>
            <AlertDialogDescription className="leading-relaxed">
              هل أنت متأكد من حذف كل أحداث الإحصائيات قبل تاريخ {cleanupBefore}؟
              <br />
              هذا الإجراء نهائي ولا يمكن التراجع عنه — تأكد من تصدير التقرير أولًا إن احتجت الاحتفاظ بالبيانات.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={cleanupBusy}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleCleanupConfirm(); }}
              disabled={cleanupBusy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cleanupBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'نعم، احذف نهائيًا'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
