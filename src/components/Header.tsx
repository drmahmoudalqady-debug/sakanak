import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Home, ShieldCheck, User, LogOut, CircleUserRound, KeyRound, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import SignupGate from './SignupGate';
import { logoutStudent, updatePassword } from '@/lib/data-service';

export default function Header() {
  const { isDemoMode, student } = useApp();
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);

  // حالة ديالوج تغيير كلمة السر
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changing, setChanging] = useState(false);
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);

  function resetChangePasswordState() {
    setNewPassword('');
    setConfirmPassword('');
    setChangeError('');
    setChangeSuccess(false);
    setChanging(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setChangeError('');
    if (newPassword.length < 6) {
      setChangeError('كلمة السر لازم تكون 6 حروف/أرقام على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeError('كلمتا السر غير متطابقتين');
      return;
    }
    setChanging(true);
    try {
      await updatePassword(newPassword);
      setChangeSuccess(true);
    } catch (err) {
      setChangeError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setChanging(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Home className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold text-primary">سكنك</span>
            <span className="text-[11px] text-muted-foreground">سكن طلابي في المنيا</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {isDemoMode && (
            <Badge variant="outline" className="border-accent/50 text-accent-foreground bg-accent/10 text-[11px]">
              وضع تجريبي
            </Badge>
          )}
          {student ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  title={student.full_name || student.email}
                >
                  <CircleUserRound className="h-4 w-4 text-primary" />
                  <span className="max-w-[100px] truncate">
                    {student.full_name ? student.full_name.trim().split(/\s+/)[0] : student.email}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => { resetChangePasswordState(); setShowChangePassword(true); }}
                  className="gap-2"
                >
                  <KeyRound className="h-4 w-4" />
                  تغيير كلمة السر
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logoutStudent()} className="gap-2 text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => setShowSignup(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <User className="h-4 w-4" />
              <span>تسجيل دخول</span>
            </Button>
          )}
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="لوحة تحكم صاحب الموقع"
          >
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">لوحة التحكم</span>
          </button>
        </nav>
      </div>

      <SignupGate
        open={showSignup}
        onClose={() => setShowSignup(false)}
        onSuccess={() => setShowSignup(false)}
        context="header"
      />

      <Dialog open={showChangePassword} onOpenChange={(open) => { if (!open) resetChangePasswordState(); setShowChangePassword(open); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>تغيير كلمة السر</DialogTitle>
            <DialogDescription>اكتب كلمة السر الجديدة اللي هتستخدمها للدخول من المرة الجاية.</DialogDescription>
          </DialogHeader>

          {changeSuccess ? (
            <div className="space-y-3 pt-1 text-center">
              <p className="text-sm text-muted-foreground">تم تغيير كلمة السر بنجاح.</p>
              <Button className="w-full" onClick={() => setShowChangePassword(false)}>
                تمام
              </Button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="new_password">كلمة السر الجديدة</Label>
                <Input
                  id="new_password"
                  type="password"
                  dir="ltr"
                  className="text-end"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm_password">تأكيد كلمة السر</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  dir="ltr"
                  className="text-end"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {changeError && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{changeError}</p>
              )}
              <Button type="submit" disabled={changing} className="w-full">
                {changing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'حفظ كلمة السر الجديدة'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
}
