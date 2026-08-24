import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Home, ShieldCheck, User, LogOut, CircleUserRound } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SignupGate from './SignupGate';
import { logoutStudent } from '@/lib/data-service';

export default function Header() {
  const { isDemoMode, student } = useApp();
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);

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
            <div className="flex items-center gap-1.5">
              <span
                className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-sm font-medium text-foreground"
                title={student.full_name || student.email}
              >
                <CircleUserRound className="h-4 w-4 text-primary" />
                <span className="max-w-[100px] truncate">
                  {student.full_name ? student.full_name.trim().split(/\s+/)[0] : student.email}
                </span>
              </span>
              <button
                onClick={() => logoutStudent()}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                title="تسجيل الخروج"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
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
    </header>
  );
}
