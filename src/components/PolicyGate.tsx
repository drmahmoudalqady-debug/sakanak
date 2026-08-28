// نافذة "سياسة العمل، الحجز، والاسترجاع المالي" — موافقة إجبارية قبل أول تواصل واتساب
// تظهر مرة واحدة فقط لكل زائر (تُحفظ الموافقة في المتصفح للأبد)، وتفرض قراءة 35 ثانية
// قبل تفعيل زرار الموافقة، لتأكيد أن الطالب اطّلع فعليًا على الشروط.
import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck, Clock } from 'lucide-react';

const LS_KEY = 'sakanak_policy_agreed_v3'; // تغيّر المفتاح عشان يظهر للزوار القدامى من جديد
const WAIT_SECONDS = 35;

export function hasAgreedToPolicy(): boolean {
  try {
    return localStorage.getItem(LS_KEY) === '1';
  } catch {
    return false;
  }
}

function markAgreed() {
  try {
    localStorage.setItem(LS_KEY, '1');
  } catch { /* تجاهل لو التخزين غير متاح */ }
}

interface Props {
  open: boolean;
  onAgree: () => void;
  onClose: () => void;
}

export default function PolicyGate({ open, onAgree, onClose }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(WAIT_SECONDS);
  const [reachedBottom, setReachedBottom] = useState(false);
  const [checked, setChecked] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  // إعادة ضبط العداد وحالة القراءة في كل مرة تُفتح فيها النافذة
  useEffect(() => {
    if (!open) return;
    setSecondsLeft(WAIT_SECONDS);
    setReachedBottom(false);
    setChecked(false);
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  function handleScroll() {
    const el = viewportRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    if (atBottom) setReachedBottom(true);
  }

  const canAgree = secondsLeft === 0 && reachedBottom && checked;

  function handleAgree() {
    if (!canAgree) return;
    markAgreed();
    onAgree();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[88vh] max-w-lg flex-col gap-0 overflow-hidden p-0" dir="rtl">
        <DialogHeader className="border-b border-border/70 p-5 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="h-5 w-5 text-primary" />
            سياسة العمل، الحجز، والاسترجاع المالي
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            قراءة هذه الشروط والموافقة عليها إلزامية قبل أول تواصل مع مالك أي شقة عبر المنصة.
          </p>
        </DialogHeader>

        <div
          ref={viewportRef}
          onScroll={handleScroll}
          className="min-h-0 flex-1 overflow-y-auto px-5 py-4"
        >
          <div className="space-y-5 pb-2 text-sm leading-relaxed text-foreground/90">
            
            {/* بانر مهم */}
            <div className="rounded-xl border border-emerald-300/60 bg-emerald-50 p-3 text-center text-emerald-900">
              <p className="font-bold">🎉 إعلان مجاني بالكامل للمالك — 0% عمولة</p>
              <p className="text-xs mt-1">الطالب يدفع <b>25%</b> مقسمة على دفعتين: <b>12.5%</b> عند التواصل + <b>12.5%</b> عند المعاينة.</p>
            </div>

            <section className="space-y-2">
              <h3 className="font-bold text-primary">1. سياسة حجز الشقة والدفع (خاص بالطالب)</h3>
              <p>
                <b>دفعة التأكيد (الأولى):</b> بمجرد تواصل الطالب مع المنصة عبر واتساب واختيار الشقة، يلتزم بدفع
                <b> 12.5% من قيمة الإيجار الشهري</b>، خلال <b>48 ساعة (يومان)</b> كحد أقصى من لحظة التواصل لتأكيد الحجز.
              </p>
              <p>
                <b>دفعة المعاينة (الثانية):</b> عند الذهاب للمعاينة والاتفاق على الشقة، يلتزم الطالب بدفع
                <b> 12.5% إضافية</b> من قيمة الإيجار الشهري، ليصبح الإجمالي <b>25%</b>.
              </p>
              <p className="rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-amber-900">
                <b>أسبقية الدفع لا أسبقية التواصل:</b> الشقق تُتاح بنظام أسبقية الدفع وليس أسبقية التواصل. في حال
                وجود أكثر من طالب يتفاوض على نفس الشقة في نفس الفترة، يتم تأكيد الحجز للطالب الذي يقوم بالتحويل
                أولًا، وتُلغى المفاوضات الأخرى تلقائيًا.
              </p>
              <p>
                <b>حالات استرداد رسوم الطالب:</b> نسبة الـ 25% التي يدفعها الطالب للمنصة <b>غير مستردة نهائيًا</b>{' '}
                كأصل عام، ويُستثنى من ذلك الحالتان التاليتان فقط:
              </p>
              <ul className="list-inside list-disc space-y-1 ps-2">
                <li>وجود وصف خاطئ أو مضلل للشقة على المنصة.</li>
                <li>وجود عيوب جوهرية غير مذكورة في الإعلان (مثل: أعطال السباكة، انقطاع المياه، أو تلف الأثاث الأساسي).</li>
              </ul>
              <p className="rounded-lg border border-rose-300/60 bg-rose-50 p-3 text-rose-900">
                <b>شروط تقديم طلب الاسترجاع:</b> للاستفادة من حق الاسترداد في الحالات المستثناة أعلاه، يجب تقديم
                الطلب خلال <b>أسبوع واحد (7 أيام)</b> من تاريخ الدفع كحد أقصى، مع إرفاق صورة واضحة من إيصال التحويل
                (Screenshot) تُظهر تاريخ ووقت التحويل بدقة.
                <br />
                بعد مرور الأسبوع، لا يُقبل أي طلب استرجاع مهما كان السبب.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-primary">2. مسؤولية وصف العقار والتصوير (خاص بالمالك)</h3>
              <p>
                <b>دقة البيانات والصور:</b> يلتزم المالك بتقديم وصف دقيق وشامل لكافة تفاصيل الشقة وحالة الأثاث،
                وإرفاق صور واضحة وحقيقية تمامًا.
              </p>
              <p>
                <b>خدمة التصوير المخصصة:</b> إذا كانت الصور التي رفعها المالك غير واضحة أو غير كافية، تقوم المنصة
                بإرسال فريق مخصص من طرفها لتصوير الشقة بشكل احترافي، لضمان جودة العرض على المنصة.
              </p>
              <p className="rounded-lg border border-rose-300/60 bg-rose-50 p-3 text-rose-900">
                <b>عقوبة الوصف الخاطئ:</b> إذا تبيّن أثناء المعاينة وجود وصف غير صحيح أو عيب مخفٍ لم يذكره
                المالك، مما أدى إلى تراجع الطالب واسترداده لنسبة الـ 25% التي دفعها للمنصة، يتم <b>حذف إعلان المالك فورًا وإيقاف حسابه</b> على المنصة. ويلتزم المالك بتحمل كامل المسؤولية القانونية والمالية تجاه الطالب.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-primary">3. سياسة رسوم المالك وتكاليف الإعلان</h3>
              <p>
                <b>رسوم النشر والتسويق:</b> نسبة المالك <b>0%</b> — الإعلان والتسويق <b>مجاني بالكامل</b> للمالك. 
                المنصة تتحمل جميع تكاليف النشر والتسويق والتصوير الاحترافي.
              </p>
              <p>
                <b>إلغاء الإعلان:</b> يحق للمالك إلغاء إعلانه في أي وقت <b>قبل قيام أي طالب بدفع دفعة التأكيد (12.5%)</b>، 
                بدون أي غرامات أو رسوم إضافية، لأن الإعلان مجاني.
              </p>
              <p className="rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-amber-900">
                <b>إلغاء الإعلان بعد دفع الطالب:</b> إذا قام طالب بدفع دفعة التأكيد (12.5%) وقام المالك بإلغاء الإعلان بعد ذلك، 
                يتم حذف الإعلان وحظر المالك من المنصة، ويلتزم برد كامل المبلغ المستحق للطالب.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-primary">4. سياسة المعاينة وعدم الاتفاق</h3>
              <p>
                <b>عدم الاتفاق الطبيعي:</b> في حال عدم التوافق أثناء المعاينة لأسباب موضوعية خارجة عن أي مخالفة،
                يسترد الطالب <b>الدفعة الأولى (12.5%)</b> كاملة وفورًا، ولا يُطلب منه دفع الدفعة الثانية.
              </p>
              <p className="rounded-lg border border-rose-300/60 bg-rose-50 p-3 text-rose-900">
                <b>اعتراض المالك غير المبرر:</b> إذا وافق المالك على الطالب ثم تراجع واعترض عليه لأسباب واهية لا
                ترتضيها المنصة بعد المعاينة، يتم:
                <ul className="list-inside list-disc space-y-1 ps-2 mt-1">
                  <li>حذف إعلان المالك فورًا.</li>
                  <li>استرداد الطالب لـ <b>12.5%</b> (الدفعة الأولى) كاملة.</li>
                  <li>فرض <b>غرامة 7%</b> على المالك كعقوبة لإهدار وقت الطالب والمنصة.</li>
                </ul>
                وإذا رغب المالك في نشر الشقة مرة أخرى، يلتزم بدفع نسبة الـ 25% من جديد كاملة.
              </p>
              <p className="rounded-lg border border-emerald-300/60 bg-emerald-50 p-3 text-emerald-900">
                <b>اعتراض المالك المبرر:</b> إذا كان تراجع المالك لسبب منطقي ترتضيه المنصة (مثل: مخالفة الطالب
                للشروط المتفق عليها مسبقًا كعدد الأفراد)، يستمر إعلان المالك نشطًا بدون أي تكلفة إضافية، حتى تجد له
                المنصة مستأجرين آخرين. الطالب يسترد الـ 12.5% (الدفعة الأولى) فقط.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-primary">5. آلية التعاقد وإخلاء المسؤولية التام</h3>
              <p>
                <b>توقيع العقد المباشر:</b> يتم توقيع عقد الإيجار الرسمي بين المالك والطالب وجهًا لوجه أثناء
                المعاينة، ويقوم الطالب عند التوقيع بدفع المستحقات المباشرة للمالك، وهي:
              </p>
              <ul className="list-inside list-disc space-y-1 ps-2">
                <li><b>مبلغ التأمين:</b> يعادل قيمة شهر إيجار واحد، ويُسترد عند الإخلاء.</li>
                <li><b>إيجار الشهر الأول:</b> يُدفع مقدمًا للمالك مباشرة.</li>
              </ul>
              <p>يتم الاتفاق بين الطرفين مباشرة على باقي التفاصيل الشخصية وفواتير الخدمات.</p>
              <p className="rounded-lg border border-border bg-secondary/50 p-3">
                <b>إخلاء مسؤولية المنصة التام:</b> ينتهي دور المنصة تمامًا بمجرد توقيع عقد الإيجار بين المالك
                والطالب. المنصة غير مسؤولة قانونيًا أو ماليًا عن أي نزاعات أو خلافات أو تأخر في الإيجار أو تلفيات في
                الأثاث أو أي مشاكل تطرأ بين الطرفين بعد توقيع العقد، وليس لها أي صلة أو تدخل في تفاصيل العلاقة
                الإيجارية اللاحقة.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-primary">ملخص سريع للأرقام والمهل الزمنية</h3>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-xs">
                  <tbody>
                    {[
                      ['نسبة عمولة المنصة (من الطالب)', '25% من قيمة الإيجار الشهري (12.5% + 12.5%)'],
                      ['نسبة عمولة المنصة (من المالك)', '0% — إعلان مجاني'],
                      ['دفعة التأكيد (عند التواصل)', '12.5% — خلال 48 ساعة'],
                      ['دفعة المعاينة (عند الاتفاق)', '12.5% — وقت التوقيع'],
                      ['مهلة تقديم طلب استرجاع الطالب', 'أسبوع واحد (7 أيام) من الدفع'],
                      ['غرامة المالك (اعتراض غير مبرر)', '7% — + استرداد الطالب لـ 12.5%'],
                      ['عقوبة المالك عند ثبوت وصف خاطئ', 'حذف الإعلان + إيقاف الحساب'],
                    ].map(([label, value], i) => (
                      <tr key={i} className={i % 2 ? 'bg-secondary/40' : ''}>
                        <td className="p-2.5 font-medium">{label}</td>
                        <td className="p-2.5 text-muted-foreground">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <p className="pt-1 text-center text-[11px] text-muted-foreground">
              منصة سكنك — المنيا، جمهورية مصر العربية | هذه الوثيقة سارية اعتبارًا من تاريخ اعتمادها من إدارة المنصة
            </p>
          </div>
        </div>

        <div className="space-y-3 border-t border-border/70 p-5 pt-4">
          {!reachedBottom && (
            <p className="text-center text-[11px] text-muted-foreground">
              يرجى التمرير حتى نهاية الصفحة لتفعيل الموافقة
            </p>
          )}

          <label className="flex cursor-pointer items-start gap-2.5 text-sm">
            <Checkbox
              checked={checked}
              onCheckedChange={(v) => setChecked(v === true)}
              disabled={!reachedBottom}
              className="mt-0.5"
            />
            <span className={reachedBottom ? '' : 'text-muted-foreground'}>
              قرأت وأوافق على سياسة العمل والحجز والاسترجاع المالي أعلاه، وأتفهّم أن المنصة غير مسؤولة عن أي تعاملات
              بعد توقيع عقد الإيجار.
            </span>
          </label>

          <Button onClick={handleAgree} disabled={!canAgree} size="lg" className="w-full gap-2">
            {secondsLeft > 0 ? (
              <>
                <Clock className="h-4 w-4" />
                أوافق ({secondsLeft}s)
              </>
            ) : (
              'أوافق وأكمل التواصل'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
