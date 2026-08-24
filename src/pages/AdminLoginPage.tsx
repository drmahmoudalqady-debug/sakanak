// صفحة دخول لوحة التحكم — لصاحب الموقع فقط
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Loader2, Info, CheckCircle2 } from 'lucide-react';
import { adminLogin, sendPasswordReset } from '@/lib/data-service';
import { isSupabaseConfigured } from '@/lib/supabase';
import { DEMO_ADMIN_PASSWORD } from '@/lib/data-service';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const isDemo = !isSupabaseConfigured;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // في وضع Supabase نستخدم الإيميل + الباسورد، وفي الوضع التجريبي الباسورد فقط
      await adminLogin(email.trim() || 'admin@demo.local', password);
      navigate('/admin/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setError(msg || 'حدث خطأ — حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResetLoading(true);
    try {
      await sendPasswordReset(email.trim());
      setResetSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر إرسال رابط إعادة التعيين');
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-4">
      <div className="card-glow w-full max-w-md rounded-3xl border border-border/70 bg-card p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </span>
          <h1 className="text-2xl font-extrabold">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-muted-foreground">هذه المنطقة مخصصة لصاحب الموقع فقط</p>
        </div>

        {showReset ? (
          resetSent ? (
            <div className="space-y-4 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                أرسلنا رابط إعادة تعيين كلمة السر إلى <bdi dir="ltr" className="font-semibold text-foreground">{email}</bdi>.
                افتح الرابط من بريدك لتعيين كلمة سر جديدة.
              </p>
              <Button variant="outline" className="w-full" onClick={() => { setShowReset(false); setResetSent(false); }}>
                رجوع لتسجيل الدخول
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة السر.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="reset-email">البريد الإلكتروني</Label>
                <Input id="reset-email" type="email" dir="ltr" className="text-end" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
              </div>
              {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={resetLoading} className="w-full gap-2">
                {resetLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {resetLoading ? 'جارٍ الإرسال...' : 'إرسال رابط إعادة التعيين'}
              </Button>
              <button
                type="button"
                onClick={() => { setShowReset(false); setError(''); }}
                className="w-full text-center text-sm text-muted-foreground underline-offset-2 hover:underline"
              >
                رجوع لتسجيل الدخول
              </button>
            </form>
          )
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isDemo && (
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">البريد الإلكتروني</Label>
              <Input id="admin-email" type="email" dir="ltr" className="text-end" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="admin-pass">كلمة السر</Label>
            <Input id="admin-pass" type="password" dir="ltr" className="text-end" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'جارٍ التحقق...' : 'دخول لوحة التحكم'}
          </Button>

          {!isDemo && (
            <button
              type="button"
              onClick={() => { setShowReset(true); setError(''); }}
              className="w-full text-center text-sm text-muted-foreground underline-offset-2 hover:underline"
            >
              نسيت كلمة السر؟
            </button>
          )}
        </form>
        )}

        {isDemo && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-accent/10 p-3 text-xs leading-relaxed text-accent-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>
              وضع تجريبي: كلمة السر هي <bdi dir="ltr" className="font-mono font-bold">{DEMO_ADMIN_PASSWORD}</bdi>.
              بعد ربط Firebase سيصبح الدخول بالبريد وكلمة السر اللذين تحددهما في Firebase Authentication.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
