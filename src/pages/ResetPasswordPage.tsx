// صفحة تعيين كلمة سر جديدة — يصلها المستخدم بعد ضغط رابط إعادة التعيين في بريده
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
import { updatePassword, isAdminUser } from '@/lib/data-service';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  // Supabase يضع جلسة مؤقتة تلقائيًا عند فتح رابط إعادة التعيين
  useEffect(() => {
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setReady(true);
    });
    // احتياطي: لو الحدث اتأخر، اسمح بالمحاولة بعد ثانيتين على أي حال
    const t = setTimeout(() => setReady(true), 2000);
    return () => { sub.subscription.unsubscribe(); clearTimeout(t); };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('كلمة السر يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمتا السر غير متطابقتين');
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ — حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-4">
      <div className="card-glow w-full max-w-md rounded-3xl border border-border/70 bg-card p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <KeyRound className="h-8 w-8 text-primary" />
          </span>
          <h1 className="text-2xl font-extrabold">تعيين كلمة سر جديدة</h1>
        </div>

        {done ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
            <p className="text-sm text-muted-foreground">تم تحديث كلمة السر بنجاح.</p>
            <Button
              className="w-full"
              onClick={async () => {
                const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
                navigate(isAdminUser(data.session?.user ?? null) ? '/admin' : '/');
              }}
            >
              متابعة
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-pass">كلمة السر الجديدة</Label>
              <Input id="new-pass" type="password" dir="ltr" className="text-end" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-pass">تأكيد كلمة السر</Label>
              <Input id="confirm-pass" type="password" dir="ltr" className="text-end" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
            </div>

            {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading || !ready} className="w-full gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'جارٍ الحفظ...' : 'حفظ كلمة السر الجديدة'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
