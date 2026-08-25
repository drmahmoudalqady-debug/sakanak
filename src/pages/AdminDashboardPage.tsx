// لوحة تحكم صاحب الموقع: إدارة الشقق (إضافة/تعديل/حذف) + قائمة الطلاب المسجلين
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus, Pencil, Trash2, LogOut, Building2, Users as UsersIcon,
  Phone, Mail, GraduationCap, CalendarDays, Loader2, ChevronDown,
  Settings as SettingsIcon, Save, KeyRound, MessageCircle,
} from 'lucide-react';
import type { Listing, Student, Region, Gender, SiteSettings } from '@/lib/types';
import { REGION_LABELS, GENDER_LABELS, STATUS_LABELS } from '@/lib/types';
import {
  subscribeAdmin, adminLogout, deleteListing, getStudents, deleteStudent,
  getSiteSettings, updateSiteSettings,
} from '@/lib/data-service';
import ListingFormDialog from '@/components/admin/ListingFormDialog';
import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { listings, isDemoMode } = useApp();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Listing | null>(null);
  const [deleting, setDeleting] = useState<Listing | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const [filterRegion, setFilterRegion] = useState<'all' | Region>('all');
  const [filterGender, setFilterGender] = useState<'all' | Gender>('all');

  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [activeTab, setActiveTab] = useState('listings');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [deletingStudentBusy, setDeletingStudentBusy] = useState(false);

  // ---- إعدادات الموقع (رقم نسيت الباسوورد + رقم عرض الشقق) ----
  const [settings, setSettings] = useState<SiteSettings>({ forgot_password_contact: '', owner_whatsapp_number: '' });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  function loadSettings() {
    setLoadingSettings(true);
    setSettingsError('');
    getSiteSettings()
      .then(setSettings)
      .catch((err) => setSettingsError(err instanceof Error ? err.message : 'تعذّر تحميل الإعدادات'))
      .finally(() => setLoadingSettings(false));
  }

  useEffect(() => {
    if (activeTab === 'settings' && isAdmin) loadSettings();
  }, [activeTab, isAdmin]);

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsError('');
    setSettingsSaved(false);
    try {
      await updateSiteSettings(settings);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : 'تعذّر حفظ الإعدادات');
    } finally {
      setSavingSettings(false);
    }
  }

  // التحقق من صلاحية الأدمن — غير المصرح لهم يُوجهون لصفحة الدخول
  useEffect(() => {
    return subscribeAdmin((admin) => {
      setIsAdmin(admin);
      if (!admin) navigate('/admin', { replace: true });
    });
  }, [navigate]);

  // تحميل الطلاب عند فتح التبويب
  function loadStudents() {
    setLoadingStudents(true);
    getStudents()
      .then(setStudents)
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false));
  }

  useEffect(() => {
    if (activeTab === 'students' && isAdmin) loadStudents();
  }, [activeTab, isAdmin]);

  async function confirmDeleteStudent() {
    if (!deletingStudent) return;
    setDeletingStudentBusy(true);
    try {
      await deleteStudent(deletingStudent.id);
      setStudents((prev) => prev.filter((s) => s.id !== deletingStudent.id));
      setDeletingStudent(null);
      setExpandedStudent(null);
    } finally {
      setDeletingStudentBusy(false);
    }
  }

  const filteredListings = useMemo(
    () => listings
      .filter((l) => filterRegion === 'all' || l.region === filterRegion)
      .filter((l) => filterGender === 'all' || l.gender === filterGender),
    [listings, filterRegion, filterGender]
  );

  async function confirmDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await deleteListing(deleting.id); // حذف نهائي من قاعدة البيانات
      setDeleting(null);
    } finally {
      setDeletingBusy(false);
    }
  }

  if (isAdmin === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAdmin) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* ترويسة اللوحة */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground">
            إدارة الشقق والطلاب — التعديلات تُحفظ وتظهر للزوار فورًا
            {isDemoMode && <span className="text-accent"> (وضع تجريبي)</span>}
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={async () => { await adminLogout(); navigate('/'); }}>
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="listings" className="gap-2">
            <Building2 className="h-4 w-4" />
            الشقق ({listings.length})
          </TabsTrigger>
          <TabsTrigger value="students" className="gap-2">
            <UsersIcon className="h-4 w-4" />
            الطلاب المسجلون
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            الإعدادات
          </TabsTrigger>
        </TabsList>

        {/* ================= تبويب الشقق ================= */}
        <TabsContent value="listings" className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              <Select value={filterRegion} onValueChange={(v) => setFilterRegion(v as typeof filterRegion)}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المناطق</SelectItem>
                  <SelectItem value="new-minya">{REGION_LABELS['new-minya']}</SelectItem>
                  <SelectItem value="minya">{REGION_LABELS['minya']}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterGender} onValueChange={(v) => setFilterGender(v as typeof filterGender)}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الأنواع</SelectItem>
                  <SelectItem value="girls">{GENDER_LABELS.girls}</SelectItem>
                  <SelectItem value="boys">{GENDER_LABELS.boys}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="gap-2" onClick={() => { setEditing(null); setFormOpen(true); }}>
              <Plus className="h-4 w-4" />
              إضافة شقة جديدة
            </Button>
          </div>

          {filteredListings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border py-16 text-center text-muted-foreground">
              لا توجد شقق مطابقة للفلتر — أضف أول شقة من الزر بالأعلى
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-4 sm:flex-row sm:items-center"
                >
                  <img
                    src={listing.images[0]}
                    alt=""
                    className="h-24 w-full shrink-0 rounded-xl object-cover sm:h-20 sm:w-28"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{listing.title}</h3>
                      <Badge variant={listing.status === 'available' ? 'default' : 'secondary'}
                        className={listing.status === 'available' ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'}>
                        {STATUS_LABELS[listing.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {REGION_LABELS[listing.region]} · {GENDER_LABELS[listing.gender]} · {listing.images.length} صور
                      · واتساب: <bdi dir="ltr">{listing.whatsapp_number}</bdi>
                    </p>
                  </div>
                  <div className="flex gap-2 self-end sm:self-center">
                    <Button
                      variant="outline" size="sm" className="gap-1.5"
                      onClick={() => { setEditing(listing); setFormOpen(true); }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      تعديل
                    </Button>
                    <Button
                      variant="outline" size="sm"
                      className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleting(listing)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      حذف
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ================= تبويب الطلاب ================= */}
        <TabsContent value="students">
          <div className="mb-4 rounded-xl border border-border/70 bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
            هذه البيانات خاصة وتظهر لصاحب الموقع فقط — قواعد أمان Supabase (Row Level Security) تمنع أي زائر من قراءتها.
          </div>

          {loadingStudents ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : students.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border py-16 text-center text-muted-foreground">
              لا يوجد طلاب مسجلون بعد — يظهر هنا كل طالب يسجل من نافذة التواصل عبر واتساب
            </div>
          ) : (
            <div className="grid gap-3">
              {students.map((s) => {
                const isOpen = expandedStudent === s.id;
                return (
                  <div key={s.id} className="overflow-hidden rounded-2xl border border-border/70 bg-card">
                    <button
                      type="button"
                      onClick={() => setExpandedStudent(isOpen ? null : s.id)}
                      className="flex w-full flex-wrap items-center justify-between gap-2 p-4 text-start transition-colors hover:bg-secondary/40"
                    >
                      <h3 className="flex items-center gap-2 font-bold">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        {s.full_name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(s.created_at).toLocaleDateString('ar-EG', { dateStyle: 'medium' })}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-border/70 p-4 pt-3">
                        <div className="grid gap-2 text-sm sm:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="text-muted-foreground">الكلية:</span>
                            <span className="font-medium">{s.college}</span>
                          </div>
                          <div className="flex items-center gap-2" dir="ltr">
                            <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="font-medium">{s.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:col-span-2" dir="ltr">
                            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="font-medium">{s.email}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="outline" size="sm"
                            className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
                            onClick={() => setDeletingStudent(s)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            حذف هذا الطالب
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ================= تبويب الإعدادات ================= */}
        <TabsContent value="settings" className="max-w-xl">
          {loadingSettings ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="rounded-2xl border border-border/70 bg-card p-5">
                <div className="mb-3 flex items-center gap-2 font-bold">
                  <KeyRound className="h-4 w-4 text-primary" />
                  رقم التواصل لاسترجاع كلمة السر
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  يظهر هذا الرقم للطالب لما يدوس على "نسيت كلمة السر" — يتواصل بيك مباشرة عشان تساعده يستعيد حسابه.
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="forgot_contact">رقم واتساب أو أي وسيلة تواصل</Label>
                  <Input
                    id="forgot_contact"
                    dir="ltr"
                    className="text-end"
                    value={settings.forgot_password_contact}
                    onChange={(e) => setSettings((s) => ({ ...s, forgot_password_contact: e.target.value }))}
                    placeholder="مثال: 01xxxxxxxxx"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-5">
                <div className="mb-3 flex items-center gap-2 font-bold">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  رقم واتساب استقبال طلبات عرض الشقق
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  يظهر هذا الرقم للمالك لما يدوس على "لعرض شقتك" في نهاية الصفحة الرئيسية.
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="owner_wa">رقم واتساب (بصيغة دولية بدون +، مثال 2010xxxxxxxx)</Label>
                  <Input
                    id="owner_wa"
                    dir="ltr"
                    className="text-end"
                    value={settings.owner_whatsapp_number}
                    onChange={(e) => setSettings((s) => ({ ...s, owner_whatsapp_number: e.target.value }))}
                    placeholder="2010xxxxxxxx"
                  />
                </div>
              </div>

              {settingsError && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{settingsError}</p>
              )}
              {settingsSaved && (
                <p className="rounded-lg bg-emerald-100 px-3 py-2 text-sm text-emerald-700">تم الحفظ بنجاح</p>
              )}

              <Button type="submit" disabled={savingSettings} className="gap-2">
                {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                حفظ الإعدادات
              </Button>
            </form>
          )}
        </TabsContent>
      </Tabs>

      {/* نموذج إضافة/تعديل */}
      <ListingFormDialog open={formOpen} onClose={() => setFormOpen(false)} editing={editing} />

      {/* نافذة تأكيد الحذف — إلزامية لمنع الحذف بالخطأ */}
      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && !deletingBusy && setDeleting(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              تأكيد حذف الشقة
            </AlertDialogTitle>
            <AlertDialogDescription className="leading-relaxed">
              هل أنت متأكد من حذف «{deleting?.title}»؟
              <br />
              سيتم حذفها نهائيًا من قاعدة البيانات والموقع، ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={deletingBusy}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); confirmDelete(); }}
              disabled={deletingBusy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'نعم، احذف نهائيًا'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* نافذة تأكيد حذف طالب — إلزامية لمنع الحذف بالخطأ */}
      <AlertDialog open={!!deletingStudent} onOpenChange={(v) => !v && !deletingStudentBusy && setDeletingStudent(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              تأكيد حذف الطالب
            </AlertDialogTitle>
            <AlertDialogDescription className="leading-relaxed">
              هل أنت متأكد من حذف بيانات «{deletingStudent?.full_name}»؟
              <br />
              سيتم حذف بياناته نهائيًا من قاعدة البيانات، ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={deletingStudentBusy}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); confirmDeleteStudent(); }}
              disabled={deletingStudentBusy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingStudentBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'نعم، احذف نهائيًا'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
