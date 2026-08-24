// السياق العام: قائمة الشقق (لحظية) + حالة تسجيل الطالب
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Listing } from '@/lib/types';
import { subscribeListings, subscribeStudent } from '@/lib/data-service';
import { isSupabaseConfigured } from '@/lib/supabase';

interface AppContextValue {
  listings: Listing[];
  loadingListings: boolean;
  student: { id: string; email: string; full_name?: string } | null;
  isDemoMode: boolean;
}

const AppContext = createContext<AppContextValue>({
  listings: [],
  loadingListings: true,
  student: null,
  isDemoMode: false,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [student, setStudent] = useState<{ id: string; email: string; full_name?: string } | null>(null);

  useEffect(() => {
    const unsubListings = subscribeListings((data) => {
      setListings(data);
      setLoadingListings(false);
    });
    const unsubStudent = subscribeStudent(setStudent);
    return () => { unsubListings(); unsubStudent(); };
  }, []);

  return (
    <AppContext.Provider value={{
      listings,
      loadingListings,
      student,
      isDemoMode: !isSupabaseConfigured,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
