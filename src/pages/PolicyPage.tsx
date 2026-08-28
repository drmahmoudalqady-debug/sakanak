import { ShieldCheck, Percent, Clock, AlertTriangle, CheckCircle, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export default function PolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12" dir="rtl">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-3xl font-extrabold">سياسة العمل، الحجز، والاسترجاع المالي</h1>
        <p className="text-muted-foreground">وثيقة رسمية تحكم التعامل بين منصة "سكنك" والطلاب وملّاك الشقق</p>
      </div>

      {/* بانر مهم */}
      <div className="mb-8 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-center">
        <p className="text-lg font-bold text-emerald-900">🎉 إعلان مجاني بالكامل للمالك — 0% عمولة</p>
        <p className="text-sm text-emerald-800 mt-1">
          الطالب يدفع <b>25%</b> مقسمة على دفعتين: <b>12.5%</b> عند التواصل + <b>12.5%</b> عند المعاينة.
        </p>
      </div>

      <div className="space-y-8">
        <section className="rounded-2xl border border-border/70 bg-card p-6">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold">1</span>
            <h2 className="text-lg font-bold">سياسة حجز الشقة والدفع (خاص بالطالب)</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
            <p>
              <b>دفعة التأكيد (الأولى):</b> بمجرد تواصل الطالب مع المنصة عبر واتساب واختيار الشقة، يلتزم بدفع
              <b> 12.5% من قيمة الإيجار الشهري</b>، خلال <b>48 ساعة (يومان)</b> كحد أقصى من لحظة التواصل لتأكيد الحجز.
            </p>
            <p>
              <b>دفعة المعاينة (الثانية):</b> عند الذهاب للمعاينة والاتفاق على الشقة، يلتزم الطالب بدفع
              <b> 12.5% إضافية</b> من قيمة الإيجار الشهري، ليصبح الإجمالي <b>25%</b>.
            </p>
            <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-amber-900">
              <b>أسبقية الدفع لا أسبقية التواصل:</b> الشقق تُتاح بنظام أسبقية الدفع وليس أسبقية التواصل. في حال وجود أكثر من طالب يتفاوض على نفس الشقة في نفس الفترة، يتم تأكيد الحجز للطالب الذي يقوم بالتحويل أولًا، وتُلغى المفاوضات الأخرى تلقائيًا.
            </div>
            <p>
              <b>حالات استرداد رسوم الطالب:</b> نسبة الـ 25% التي يدفعها الطالب للمنصة <b>غير مستردة نهائيًا</b> كأصل عام، ويُستثنى من ذلك الحالتان التاليتان فقط:
            </p>
            <ul className="list-inside list-disc space-y-1 ps-2">
              <li>وجود وصف خاطئ أو مضلل للشقة على المنصة.</li>
              <li>وجود عيوب جوهرية غير مذكورة في الإعلان (مثل: أعطال السباكة، انقطاع المياه، أو تلف الأثاث الأساسي).</li>
            </ul>
            <div className="rounded-lg border border-rose-300/60 bg-rose-50 p-3 text-rose-900">
              <b>شروط تقديم طلب الاسترجاع:</b> للاستفادة من حق الاسترداد في الحالات المستثناة أعلاه، يجب تقديم الطلب خلال <b>أسبوع واحد (7 أيام)</b> من تاريخ الدفع كحد أقصى، مع إرفاق صورة واضحة من إيصال التحويل (Screenshot) تُظهر تاريخ ووقت التحويل بدقة.
              <br /><br />
              بعد مرور الأسبوع، لا يُقبل أي طلب استرجاع مهما كان السبب.
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card p-6">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold">2</span>
            <h2 className="text-lg font-bold">مسؤولية وصف العقار والتصوير (خاص بالمالك)</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
            <p>
              <b>دقة البيانات والصور:</b> يلتزم المالك بتقديم وصف دقيق وشامل لكافة تفاصيل الشقة وحالة الأثاث، وإرفاق صور واضحة وحقيقية تمامًا.
            </p>
            <p>
              <b>خدمة التصوير المخصصة:</b> إذا كانت الصور التي رفعها المالك غير واضحة أو غير كافية، تقوم المنصة بإرسال فريق مخصص من طرفها لتصوير الشقة بشكل احترافي، لضمان جودة العرض على المنصة.
            </p>
            <div className="rounded-lg border border-rose-300/60 bg-rose-50 p-3 text-rose-900">
              <b>عقوبة الوصف الخاطئ:</b> إذا تبيّن أثناء المعاينة وجود وصف غير صحيح أو عيب مخفٍ لم يذكره المالك، مما أدى إلى تراجع الطالب واسترداده لنسبة الـ 25% التي دفعها للمنصة، يتم فرض <b>غرامة مالية على المالك تتراوح بين 7% و10% كحد أقصى</b> (حسب قدر الخطأ وشدته)، ويتحمل المالك كامل المسؤولية القانونية والمالية تجاه الطالب. <b>لا يتم حظر المالك من المنصة.</b>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card p-6">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold">3</span>
            <h2 className="text-lg font-bold">سياسة رسوم المالك وتكاليف الإعلان</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
            <div className="rounded-lg border border-emerald-300/60 bg-emerald-50 p-3 text-emerald-900">
              <b>رسوم النشر والتسويق:</b> نسبة المالك <b>0%</b> — الإعلان والتسويق <b>مجاني بالكامل</b> للمالك. المنصة تتحمل جميع تكاليف النشر والتسويق والتصوير الاحترافي.
            </div>
            <p>
              <b>إلغاء الإعلان:</b> يحق للمالك إلغاء إعلانه في أي وقت <b>قبل قيام أي طالب بدفع دفعة التأكيد (12.5%)</b>، بدون أي غرامات أو رسوم إضافية، لأن الإعلان مجاني.
            </p>
            <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-amber-900">
              <b>إلغاء الإعلان بعد دفع الطالب:</b> إذا قام طالب بدفع دفعة التأكيد (12.5%) وقام المالك بإلغاء الإعلان بعد ذلك، يتم فرض <b>غرامة 7%</b> على المالك كتعويض لإهدار وقت الطالب والمنصة، ويلتزم برد كامل المبلغ المستحق للطالب. <b>لا يتم حظر المالك من المنصة.</b>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card p-6">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold">4</span>
            <h2 className="text-lg font-bold">سياسة المعاينة وعدم الاتفاق</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
            <p>
              <b>عدم الاتفاق الطبيعي:</b> في حال عدم التوافق أثناء المعاينة لأسباب موضوعية خارجة عن أي مخالفة، يسترد الطالب <b>الدفعة الأولى (12.5%)</b> كاملة وفورًا، ولا يُطلب منه دفع الدفعة الثانية.
            </p>
            <div className="rounded-lg border border-rose-300/60 bg-rose-50 p-3 text-rose-900">
              <b>اعتراض المالك غير المبرر:</b> إذا وافق المالك على الطالب ثم تراجع واعترض عليه لأسباب واهية لا ترتضيها المنصة بعد المعاينة، يتم:
              <ul className="list-inside list-disc space-y-1 ps-2 mt-1">
                <li>فرض <b>غرامة 7%</b> على المالك كعقوبة لإهدار وقت الطالب والمنصة.</li>
                <li>استرداد الطالب لـ <b>12.5%</b> (الدفعة الأولى) كاملة.</li>
                <li>إذا رغب المالك في نشر الشقة مرة أخرى، يلتزم بدفع <b>نسبة الـ 25% مقدمًا</b> (بدلاً عن الطلاب) كضمان للجدية. يتم تسكين الطلاب من هذه النسبة، ويسترد المالك النسبة بعد التسكين الناجح. <b>إذا تكرر الأمر، لا تُسترد النسبة.</b></li>
              </ul>
              <b>لا يتم حظر المالك من المنصة.</b>
            </div>
            <div className="rounded-lg border border-emerald-300/60 bg-emerald-50 p-3 text-emerald-900">
              <b>اعتراض المالك المبرر:</b> إذا كان تراجع المالك لسبب منطقي ترتضيه المنصة (مثل: مخالفة الطالب للشروط المتفق عليها مسبقًا كعدد الأفراد)، يستمر إعلان المالك نشطًا بدون أي تكلفة إضافية، حتى تجد له المنصة مستأجرين آخرين. الطالب يسترد الـ 12.5% (الدفعة الأولى) فقط.
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card p-6">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold">5</span>
            <h2 className="text-lg font-bold">آلية التعاقد وإخلاء المسؤولية التام</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
            <p>
              <b>توقيع العقد المباشر:</b> يتم توقيع عقد الإيجار الرسمي بين المالك والطالب وجهًا لوجه أثناء المعاينة، ويقوم الطالب عند التوقيع بدفع المستحقات المباشرة للمالك، وهي:
            </p>
            <ul className="list-inside list-disc space-y-1 ps-2">
              <li><b>مبلغ التأمين:</b> يعادل قيمة شهر إيجار واحد، ويُسترد عند الإخلاء.</li>
              <li><b>إيجار الشهر الأول:</b> يُدفع مقدمًا للمالك مباشرة.</li>
            </ul>
            <p>يتم الاتفاق بين الطرفين مباشرة على باقي التفاصيل الشخصية وفواتير الخدمات.</p>
            <div className="rounded-lg border border-border bg-secondary/50 p-3">
              <b>إخلاء مسؤولية المنصة التام:</b> ينتهي دور المنصة تمامًا بمجرد توقيع عقد الإيجار بين المالك والطالب. المنصة غير مسؤولة قانونيًا أو ماليًا عن أي نزاعات أو خلافات أو تأخر في الإيجار أو تلفيات في الأثاث أو أي مشاكل تطرأ بين الطرفين بعد توقيع العقد، وليس لها أي صلة أو تدخل في تفاصيل العلاقة الإيجارية اللاحقة.
            </div>
          </div>
        </section>

        {/* ملخص */}
        <section className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-primary">
            <FileText className="h-5 w-5" />
            ملخص سريع للأرقام والمهل الزمنية
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['نسبة عمولة المنصة (من الطالب)', '25% (12.5% تأكيد + 12.5% معاينة)', <Percent className="h-4 w-4 text-primary" key="p1" />],
                  ['نسبة عمولة المنصة (من المالك)', '0% — إعلان مجاني', <CheckCircle className="h-4 w-4 text-emerald-600" key="p2" />],
                  ['دفعة التأكيد (عند التواصل)', '12.5% — خلال 48 ساعة', <Clock className="h-4 w-4 text-primary" key="p3" />],
                  ['دفعة المعاينة (عند الاتفاق)', '12.5% — وقت التوقيع', <Clock className="h-4 w-4 text-primary" key="p4" />],
                  ['مهلة تقديم طلب استرجاع الطالب', 'أسبوع واحد (7 أيام) من الدفع', <Clock className="h-4 w-4 text-primary" key="p5" />],
                  ['غرامة المالك (اعتراض غير مبرر)', '7% — + استرداد الطالب لـ 12.5%', <AlertTriangle className="h-4 w-4 text-amber-600" key="p6" />],
                  ['غرامة المالك (وصف خاطئ)', '7% إلى 10% كحد أقصى (حسب الخطأ)', <AlertTriangle className="h-4 w-4 text-amber-600" key="p7" />],
                  ['غرامة المالك (إلغاء بعد دفع الطالب)', '7% — + رد المبلغ للطالب', <AlertTriangle className="h-4 w-4 text-amber-600" key="p8" />],
                  ['إعادة النشر بعد اعتراض غير مبرر', '25% مقدمًا من المالك — تُسترد بعد التسكين', <Percent className="h-4 w-4 text-primary" key="p9" />],
                ].map(([label, value, icon], i) => (
                  <tr key={i} className={i % 2 ? 'bg-secondary/40' : ''}>
                    <td className="p-3 font-medium flex items-center gap-2">{icon}{label}</td>
                    <td className="p-3 text-muted-foreground">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="mt-8 text-center">
        <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          العودة للرئيسية
        </Button>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        منصة سكنك — المنيا، جمهورية مصر العربية | هذه الوثيقة سارية اعتبارًا من تاريخ اعتمادها من إدارة المنصة
      </p>
    </div>
  );
}
