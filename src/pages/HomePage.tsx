import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export default function PolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-12">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-8 w-8" />
          </div>

          <h1 className="mb-2 text-2xl font-extrabold sm:text-3xl">
            سياسة العمل، الحجز، والاسترجاع المالي
          </h1>

          <p className="text-sm text-muted-foreground">
            قراءة هذه الشروط والموافقة عليها إلزامية قبل أول تواصل مع مالك أي
            شقة عبر المنصة.
          </p>
        </div>

        <div className="space-y-6">

          <div className="rounded-xl border border-emerald-300/60 bg-emerald-50 p-4 text-center text-emerald-900">
            <p className="font-bold">
              🎉 إعلان مجاني بالكامل للمالك — 0% عمولة
            </p>
            <p className="mt-1 text-sm">
              الطالب يدفع <b>25%</b> مقسمة على دفعتين: <b>12.5%</b> عند تأكيد
              الحجز + <b>12.5%</b> أثناء المعاينة.
            </p>
          </div>

          <section className="space-y-3 rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
            <h2 className="font-bold text-primary">
              1. سياسة حجز الشقة والدفع (خاص بالطالب)
            </h2>

            <p>
              <b>دفعة التأكيد (الأولى):</b> بمجرد تواصل الطالب مع المنصة
              واختيار الشقة لتأكيد الحجز، يلتزم بدفع{' '}
              <b>12.5% من قيمة الإيجار الشهري</b> خلال{' '}
              <b>48 ساعة (يومان)</b> كحد أقصى من لحظة التواصل لتأكيد الحجز.
              ولا يُعتبر الحجز مؤكدًا إلا بعد إتمام الدفع.
            </p>

            <p>
              <b>دفعة المعاينة (الثانية):</b> عند الذهاب للمعاينة والاتفاق على
              الشقة، يلتزم الطالب بدفع <b>12.5% إضافية</b> من قيمة الإيجار
              الشهري، ليصبح إجمالي رسوم المنصة <b>25%</b>.
            </p>

            <p className="rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-amber-900">
              <b>أسبقية الدفع لا أسبقية التواصل:</b> الشقق تُتاح بنظام أسبقية
              الدفع وليس أسبقية التواصل. في حال وجود أكثر من طالب يتفاوض على
              نفس الشقة في نفس الفترة، يتم تأكيد الحجز للطالب الذي يقوم
              بالتحويل أولًا، وتُلغى المفاوضات الأخرى تلقائيًا.
            </p>

            <p>
              <b>حالات استرداد رسوم الطالب:</b> نسبة الـ <b>25%</b> التي يدفعها
              الطالب للمنصة <b>غير مستردة نهائيًا</b> كأصل عام، ويُستثنى من ذلك
              الحالات الموضحة أدناه فقط.
            </p>

            <ul className="list-inside list-disc space-y-1 ps-2">
              <li>وجود وصف خاطئ أو مضلل للشقة على المنصة.</li>
              <li>
                وجود عيوب جوهرية غير مذكورة في الإعلان (مثل: أعطال السباكة،
                انقطاع المياه، أو تلف الأثاث الأساسي).
              </li>
              <li>
                تراجع المالك بعد موافقته على الطالب وفق الحالات والرسوم
                الموضحة في القسم الرابع.
              </li>
            </ul>

            <p className="rounded-lg border border-rose-300/60 bg-rose-50 p-3 text-rose-900">
              <b>شروط تقديم طلب الاسترجاع:</b> للاستفادة من حق الاسترداد في
              الحالات المستثناة أعلاه، يجب تقديم الطلب خلال{' '}
              <b>أسبوع واحد (7 أيام)</b> من تاريخ الدفع كحد أقصى، مع إرفاق صورة
              واضحة من إيصال التحويل (Screenshot) تُظهر تاريخ ووقت التحويل
              بدقة.
              <br />
              <br />
              بعد مرور الأسبوع، لا يُقبل أي طلب استرجاع وفق هذه السياسة.
            </p>
          </section>

          <section className="space-y-3 rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
            <h2 className="font-bold text-primary">
              2. مسؤولية وصف العقار والتصوير (خاص بالمالك)
            </h2>

            <p>
              <b>دقة البيانات والصور:</b> يلتزم المالك بتقديم وصف دقيق وشامل
              لكافة تفاصيل الشقة وحالة الأثاث، وإرفاق صور واضحة وحقيقية تمامًا.
            </p>

            <p>
              <b>خدمة التصوير المخصصة:</b> إذا كانت الصور التي رفعها المالك
              غير واضحة أو غير كافية، تقوم المنصة بإرسال فريق مخصص من طرفها
              لتصوير الشقة بشكل احترافي، لضمان جودة العرض على المنصة.
            </p>

            <p className="rounded-lg border border-rose-300/60 bg-rose-50 p-3 text-rose-900">
              <b>عقوبة الوصف الخاطئ:</b> إذا تبيّن أثناء المعاينة وجود وصف غير
              صحيح أو عيب مخفٍ لم يذكره المالك، مما أدى إلى تراجع الطالب
              واسترداده لنسبة الـ <b>25%</b> التي دفعها للمنصة، يتم فرض{' '}
              <b>غرامة مالية على المالك تتراوح بين 7% و10% كحد أقصى</b>{' '}
              (حسب قدر الخطأ وشدته)، ويتحمل المالك كامل المسؤولية القانونية
              والمالية تجاه الطالب. <b>لا يتم حظر المالك من المنصة.</b>
            </p>
          </section>

          <section className="space-y-3 rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
            <h2 className="font-bold text-primary">
              3. سياسة رسوم المالك وتكاليف الإعلان
            </h2>

            <p>
              <b>رسوم النشر والتسويق:</b> نسبة المالك <b>0%</b> — الإعلان
              والتسويق <b>مجاني بالكامل</b> للمالك. المنصة تتحمل جميع تكاليف
              النشر والتسويق والتصوير الاحترافي.
            </p>

            <p>
              <b>إلغاء الإعلان:</b> يحق للمالك إلغاء إعلانه في أي وقت{' '}
              <b>قبل قيام أي طالب بدفع دفعة التأكيد (12.5%)</b> بدون أي غرامات
              أو رسوم إضافية، لأن الإعلان مجاني.
            </p>

            <p className="rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-amber-900">
              <b>إلغاء الإعلان بعد دفع الطالب:</b> إذا قام طالب بدفع دفعة
              التأكيد (12.5%) وقام المالك بإلغاء الإعلان بعد ذلك دون سبب إلزامي
              تقبله المنصة، يتم فرض <b>غرامة 7%</b> على المالك كرسوم إعلان
              وتسويق ومجهود تم بذله، ويلتزم برد كامل المبلغ المستحق للطالب.
            </p>
          </section>

          <section className="space-y-3 rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
            <h2 className="font-bold text-primary">
              4. سياسة المعاينة وتراجع المالك
            </h2>

            <p>
              <b>عدم الاتفاق الطبيعي:</b> في حال عدم التوافق أثناء المعاينة
              لأسباب موضوعية خارجة عن أي مخالفة من المالك أو الطالب، يسترد
              الطالب <b>الدفعة الأولى (12.5%)</b> كاملة، ولا يُطلب منه دفع
              الدفعة الثانية.
            </p>

            <p className="rounded-lg border border-rose-300/60 bg-rose-50 p-3 text-rose-900">
              <b>تراجع المالك بدون سبب إلزامي:</b> إذا كان المالك قد وافق على
              الطالب ثم تراجع أو ألغى الحجز دون سبب إلزامي أو مبرر تقبله
              المنصة، يلتزم المالك بدفع <b>7% من قيمة الإيجار الشهري</b> كرسوم
              إعلان وتسويق ومجهود تم بذله، ويسترد الطالب <b>12.5%</b> (دفعة
              التأكيد) وفق السياسة.
            </p>

            <p className="rounded-lg border border-emerald-300/60 bg-emerald-50 p-3 text-emerald-900">
              <b>تراجع المالك لسبب إلزامي:</b> إذا كان تراجع المالك بسبب
              إلزامي أو ظرف قهري تقبله إدارة المنصة، يلتزم المالك بدفع{' '}
              <b>4% من قيمة الإيجار الشهري</b> فقط كرسوم إعلان وتسويق ومجهود
              تم بذله، ويسترد الطالب <b>12.5%</b> (دفعة التأكيد) وفق السياسة.
            </p>
          </section>

          <section className="space-y-3 rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
            <h2 className="font-bold text-primary">
              5. آلية التعاقد وإخلاء المسؤولية التام
            </h2>

            <p>
              <b>توقيع العقد المباشر:</b> يتم توقيع عقد الإيجار الرسمي بين
              المالك والطالب وجهًا لوجه أثناء المعاينة، ويقوم الطالب عند
              التوقيع بدفع المستحقات المباشرة للمالك، وهي:
            </p>

            <ul className="list-inside list-disc space-y-1 ps-2">
              <li>
                <b>مبلغ التأمين:</b> يعادل قيمة شهر إيجار واحد، ويُسترد عند
                الإخلاء وفق الاتفاق بين الطرفين.
              </li>
              <li>
                <b>إيجار الشهر الأول:</b> يُدفع مقدمًا للمالك مباشرة.
              </li>
            </ul>

            <p>
              يتم الاتفاق بين الطرفين مباشرة على باقي التفاصيل الشخصية
              وفواتير الخدمات.
            </p>

            <p className="rounded-lg border border-border bg-secondary/50 p-3">
              <b>إخلاء مسؤولية المنصة التام:</b> ينتهي دور المنصة تمامًا
              بمجرد توقيع عقد الإيجار بين المالك والطالب. المنصة غير مسؤولة
              قانونيًا أو ماليًا عن أي نزاعات أو خلافات أو تأخر في الإيجار أو
              تلفيات في الأثاث أو أي مشاكل تطرأ بين الطرفين بعد توقيع العقد،
              وليس لها أي صلة أو تدخل في تفاصيل العلاقة الإيجارية اللاحقة.
            </p>
          </section>

          <section className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
            <h2 className="font-bold text-primary">
              ملخص سريع للأرقام والمهل الزمنية
            </h2>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-xs">
                  <tbody>
                    <tr>
                      <td className="p-2.5 font-medium">
                        نسبة رسوم المنصة (من الطالب)
                      </td>
                      <td className="p-2.5 text-muted-foreground">
                        25% (12.5% تأكيد + 12.5% معاينة)
                      </td>
                    </tr>

                    <tr className="bg-secondary/40">
                      <td className="p-2.5 font-medium">
                        نسبة رسوم المنصة (من المالك)
                      </td>
                      <td className="p-2.5 text-muted-foreground">
                        0% — إعلان مجاني
                      </td>
                    </tr>

                    <tr>
                      <td className="p-2.5 font-medium">
                        دفعة التأكيد (عند التواصل)
                      </td>
                      <td className="p-2.5 text-muted-foreground">
                        12.5% — خلال 48 ساعة
                      </td>
                    </tr>

                    <tr className="bg-secondary/40">
                      <td className="p-2.5 font-medium">
                        دفعة المعاينة (عند الاتفاق)
                      </td>
                      <td className="p-2.5 text-muted-foreground">
                        12.5% — أثناء المعاينة وقبل توقيع العقد
                      </td>
                    </tr>

                    <tr>
                      <td className="p-2.5 font-medium">
                        مهلة تقديم طلب استرجاع الطالب
                      </td>
                      <td className="p-2.5 text-muted-foreground">
                        أسبوع واحد (7 أيام) من الدفع
                      </td>
                    </tr>

                    <tr className="bg-secondary/40">
                      <td className="p-2.5 font-medium">
                        غرامة المالك (تراجع بدون سبب إلزامي)
                      </td>
                      <td className="p-2.5 text-muted-foreground">
                        7% من قيمة الإيجار الشهري — + استرداد الطالب لـ 12.5%
                      </td>
                    </tr>

                    <tr>
                      <td className="p-2.5 font-medium">
                        رسوم المالك (تراجع لسبب إلزامي)
                      </td>
                      <td className="p-2.5 text-muted-foreground">
                        4% من قيمة الإيجار الشهري — + استرداد الطالب لـ 12.5%
                      </td>
                    </tr>

                    <tr className="bg-secondary/40">
                      <td className="p-2.5 font-medium">
                        غرامة المالك (وصف خاطئ)
                      </td>
                      <td className="p-2.5 text-muted-foreground">
                        7% إلى 10% كحد أقصى (حسب الخطأ)
                      </td>
                    </tr>

                    <tr>
                      <td className="p-2.5 font-medium">
                        غرامة المالك (إلغاء بعد دفع الطالب)
                      </td>
                      <td className="p-2.5 text-muted-foreground">
                        7% — + رد المبلغ المستحق للطالب
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <p className="pt-1 text-center text-[11px] text-muted-foreground">
            منصة سكنك — المنيا، جمهورية مصر العربية | هذه الوثيقة سارية
            اعتبارًا من تاريخ اعتمادها من إدارة المنصة
          </p>

          <div className="pt-2 text-center">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة للرئيسية
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
