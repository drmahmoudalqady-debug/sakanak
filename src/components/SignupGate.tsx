// بوابة تسجيل الطلاب — تظهر فقط عند الضغط على زرار واتساب لأول مرة
// بعد التسجيل الناجح: دخول تلقائي + فتح محادثة واتساب مباشرة
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Loader2, MessageCircle } from 'lucide-react';
import { signupStudent, loginStudent } from '@/lib/data-service';
import { isSupabaseConfigured } from '@/lib/supabase';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // تُستدعى بعد نجاح التسجيل/الدخول
  context?: 'whatsapp' | 'header'; // يغيّر نص الرسالة فقط
}

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes('email-already-in-use')) return 'هذا البريد مسجل بالفعل — سجّل دخولك من التبويب المجاور';
  if (msg.includes('invalid-email')) return 'البريد الإلكتروني غير صحيح';
  if (msg.includes('weak-password')) return 'كلمة السر ضعيفة — استخدم 6 أحرف على الأقل';
  if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found'))
    return 'البريد أو كلمة السر غير صحيحة';
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

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !college.trim() || !phone.trim() || !email.trim() || !password) {
      setError('من فضلك أكمل كل الحقول');
      return;
    }
    if (password.length < 6) {
      setError('كلمة السر يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    setLoading(true);
    try {
      await signupStudent({
        full_name: fullName.trim(),
        college: college.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password,
      });
      onSuccess(); // دخول تلقائي + فتح واتساب
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
            {context === 'header'
              ? <GraduationCap className="h-7 w-7 text-primary" />
              : <MessageCircle className="h-7 w-7 text-[#128C4B]" />}
          </div>
          <DialogTitle className="text-center text-xl">
            {context === 'header' ? 'تسجيل / دخول' : 'خطوة واحدة قبل التواصل'}
          </DialogTitle>
          <DialogDescription className="text-center leading-relaxed">
            {context === 'header'
              ? 'سجّل بياناتك مرة واحدة، وهتقدر تتواصل مع أصحاب الشقق مباشرة من أي إعلان.'
              : 'سجّل بياناتك مرة واحدة فقط، وبعدها يفتح زر واتساب مباشرة في كل مرة.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => { setTab(v as 'signup' | 'login'); setError(''); }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">تسجيل جديد</TabsTrigger>
            <TabsTrigger value="login">مسجل بالفعل</TabsTrigger>
          </TabsList>

          {/* نموذج تسجيل جديد */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="full_name">الاسم الكامل</Label>
                <Input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="مثال: أحمد محمد علي" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="college">الكلية</Label>
                <Input id="college" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="مثال: كلية الهندسة — جامعة المنيا" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input id="phone" type="tel" dir="ltr" className="text-end" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" dir="ltr" className="text-end" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">كلمة السر</Label>
                  <Input id="password" type="password" dir="ltr" className="text-end" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 أحرف على الأقل" />
                </div>
              </div>

              {/* نص الموافقة القانونية — قانون حماية البيانات الشخصية المصري */}
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

          {/* نموذج دخول لطالب مسجل */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="login_email">البريد الإلكتروني</Label>
                <Input id="login_email" type="email" dir="ltr" className="text-end" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@mail.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login_password">كلمة السر</Label>
                <Input id="login_password" type="password" dir="ltr" className="text-end" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              </div>
              {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-[#25D366] text-white hover:bg-[#1eb85a]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                {loading ? 'جارٍ الدخول...' : context === 'header' ? 'دخول' : 'ادخل وافتح واتساب'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
