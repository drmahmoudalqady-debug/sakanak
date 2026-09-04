// بوابة تسجيل الطلاب — تظهر فقط عند الضغط على زرار واتساب لأول مرة
// بعد التسجيل الناجح: دخول تلقائي + فتح محادثة واتساب مباشرة
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GraduationCap, Loader2, MessageCircle, KeyRound, Copy, Check } from 'lucide-react';
import { signupStudent, loginStudent, getSiteSettings } from '@/lib/data-service';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { UserType } from '@/lib/types';
import { USER_TYPE_LABELS } from '@/lib/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  context?: 'whatsapp' | 'header';
}

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes('email-already-in-use')) return 'هذا البريد مسجل بالفعل — سجّل دخولك من التبويب المجاور';
  if (msg.includes('invalid-email')) return 'البريد الإلكتروني غير صحيح';
  if (msg.includes('weak-password')) return 'كلمة السر ضعيفة — استخدم 6 أحرف على الأقل';
  if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found'))
    return 'البريد أو كلمة السر غير صحيحة';
  if (msg.toLowerCase().includes('rate limit'))
    return 'محاولات كتير في وقت قصير — استنى شوية وحاول تاني';
  return msg || 'حدث خطأ غير متوقع — حاول مرة أخرى';
}

export default function SignupGate({ open, onClose, onSuccess, context = 'whatsapp' }: Props) {
  const [tab, setTab] = useState<'signup' | 'login'>('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('male_student');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [forgotMode, setForgotMode] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [loadingContact, setLoadingContact] = useState(false);
  const [copied, setCopied] = useState(false);

  function openForgotMode() {
    setForgotMode(true);
    setError('');
    setLoadingContact(true);
    getSiteSettings()
      .then((s) => setContactInfo(s.forgot_password_contact))
      .catch(() => setContactInfo(''))
      .finally(() => setLoadingContact(false));
  }

  function copyContact() {
    if (!contactInfo) return;
    navigator.clipboard.writeText(contactInfo).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const isOwner = userType === 'owner';
    
    // المالك: اسم + رقم + إيميل فقط | الطالب: كل الحقول
    if (!fullName.trim() || (!isOwner && !college.trim()) || !phone.trim() || !email.trim() || (!isOwner && !password)) {
      setError('من فضلك أكمل كل الحقول');
      return;
    }
    if (!isOwner && password.length < 6) {
      setError('كلمة السر يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    
    setLoading(true);
    try {
      // لو مالك: ننشئ باسورد عشوائي تلقائي مش هيشوفه
      const finalPassword = isOwner 
        ? `owner-${Date.now()}-${Math.random().toString(36).slice(2, 10)}` 
        : password;
        
      await signupStudent({
        full_name: fullName.trim(),
        college: isOwner ? '' : college.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password: finalPassword,
        user_type: userType,
      });
      onSuccess();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginStudent(loginEmail.trim(), loginPassword);
      onSuccess();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <div className={`mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl ${context === 'header' ? 'bg-primary/15' : 'bg-[#25D366]/15'}`}>
            {context === 'header' ? (
              <GraduationCap className="h-7 w-7 text-primary" />
            ) : (
              <MessageCircle className="h-7 w-7 text-[#25D366]" />
            )}
          </div>
          <DialogTitle className="text-center">
            {context === 'header' ? 'سجّل حسابك' : 'سجّل عشان تتواصل'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {context === 'header' 
              ? 'إنشاء حساب جديد أو تسجيل الدخول' 
              : 'التسجيل مرة واحدة فقط — بعدها تفتح واتساب مباشرة'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => { setTab(v as 'signup' | 'login'); setError(''); setForgotMode(false); }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">حساب جديد</TabsTrigger>
            <TabsTrigger value="login">دخول</TabsTrigger>
          </TabsList>

          {/* نموذج تسجيل جديد */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label>نوع الحساب</Label>
                <RadioGroup
                  value={userType}
                  onValueChange={(v) => setUserType(v as UserType)}
                  className="grid grid-cols-3 gap-2"
                >
                  {(Object.keys(USER_TYPE_LABELS) as UserType[]).map((type) => (
                    <Label
                      key={type}
                      htmlFor={`user-type-${type}`}
                      className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-sm transition-colors ${
                        userType === type
                          ? 'border-primary bg-primary/10 font-semibold text-primary'
                          : 'border-border/70 text-muted-foreground'
                      }`}
                    >
                      <RadioGroupItem value={type} id={`user-type-${type}`} className="sr-only" />
                      {USER_TYPE_LABELS[type]}
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="full_name">الاسم الكامل</Label>
                <Input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="مثال: أحمد محمد علي" />
              </div>
              
              {userType !== 'owner' && (
                <div className="space-y-1.5">
                  <Label htmlFor="college">الكلية</Label>
                  <Input id="college" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="مثال: كلية الهندسة — جامعة المنيا" />
                </div>
              )}
              
              <div className="space-y-1.5">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input id="phone" type="tel" dir="ltr" className="text-end" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" dir="ltr" className="text-end" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" />
              </div>
              
              {userType !== 'owner' && (
                <div className="space-y-1.5">
                  <Label htmlFor="password">كلمة السر</Label>
                  <Input id="password" type="password" dir="ltr" className="text-end" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 أحرف على الأقل" />
                </div>
              )}

              <p className="rounded-lg bg-muted px-3 py-2 text-center text-[11px] leading-relaxed text-muted-foreground">
                بالتسجيل، أوافق على استخدام بياناتي للتواصل بخصوص السكن الطلابي فقط
              </p>

              {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full bg-[#25D366] text-white hover:bg-[#1eb85a]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GraduationCap className="h-4 w-4" />}
                {loading ? 'جارٍ التسجيل...' : context === 'header' ? 'سجّل الآن' : 'سجّل وافتح واتساب'}
              </Button>
              
              {!isSupabaseConfigured && (
                <p className="text-center text-[11px] text-muted-foreground">
                  (وضع تجريبي — البيانات تحفظ في متصفحك فقط حتى ربط Supabase)
                </p>
              )}
            </form>
          </TabsContent>

          {/* نموذج دخول */}
          <TabsContent value="login">
            {forgotMode ? (
              <div className="space-y-3 pt-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <KeyRound className="h-6 w-6 text-primary" />
                </div>
                {loadingContact ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                ) : contactInfo ? (
                  <>
                    <p className="text-center text-sm text-muted-foreground">
                      تواصل معانا على الرقم ده عشان نساعدك تستعيد حسابك:
                    </p>
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-secondary/40 px-3 py-2.5">
                      <span dir="ltr" className="font-bold text-foreground">{contactInfo}</span>
                      <button
                        type="button"
                        onClick={copyContact}
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-primary hover:bg-primary/10"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? 'اتنسخ' : 'نسخ'}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    التواصل غير متاح حاليًا — حاول لاحقًا.
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setForgotMode(false)}
                >
                  الرجوع لتسجيل الدخول
                </Button>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="login_email">البريد الإلكتروني</Label>
                  <Input id="login_email" type="email" dir="ltr" className="text-end" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@mail.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login_password">كلمة السر</Label>
                  <Input id="login_password" type="password" dir="ltr" className="text-end" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>
                <button
                  type="button"
                  onClick={openForgotMode}
                  className="block text-start text-xs text-primary hover:underline"
                >
                  نسيت كلمة السر؟
                </button>
                {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full bg-[#25D366] text-white hover:bg-[#1eb85a]">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                  {loading ? 'جارٍ الدخول...' : context === 'header' ? 'دخول' : 'ادخل وافتح واتساب'}
                </Button>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
