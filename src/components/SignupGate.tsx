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

  // حالة "نسيت كلمة السر" — عرض رقم التواصل بدل إرسال إيميل
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
    if (!fullName.trim() || (!isOwner && !college.trim()) || !phone.trim() || !email.trim() || !password) {
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
        college: isOwner ? '' : college.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password,
        user_type: userType,
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
          <div className={`mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl ${context === 'header' ? 'bg-primary/15' :
