# مسكن (Maskan) — منصة السكن الطلابي في المنيا

موقع ويب لعرض شقق سكن طلابي في المنيا (بنات/شباب × المنيا الجديدة/المنيا) مع تواصل مباشر عبر واتساب، ولوحة تحكم لصاحب الموقع، ونظام تسجيل للطلاب.

## المكدّس التقني (مجاني بالكامل)

| المكوّن | الخدمة | الغرض |
|---|---|---|
| الواجهة | React + Vite + Tailwind CSS | تصميم عربي RTL سريع ومتجاوب |
| قاعدة البيانات | Firebase Firestore (خطة Spark المجانية) | الشقق + بيانات الطلاب |
| تخزين الصور | Firebase Storage (مجاني) | صور الشقق (تُضغط تلقائيًا لأقل من 300KB) |
| الحسابات | Firebase Authentication (مجاني) | حساب الأدمن + حسابات الطلاب |
| الاستضافة | Netlify (خطة مجانية) | نشر الموقع |

## تجربة الموقع محليًا (بدون Firebase)

```bash
npm install
npm run dev
```

بدون ملف `.env` يعمل الموقع في **وضع تجريبي** ببيانات عينة:
- لوحة التحكم: `/admin` — كلمة السر: `admin123`
- كل شيء يعمل (إضافة/تعديل/حذف/تسجيل طلاب) لكن البيانات تُحفظ في المتصفح فقط.

---

## دليل النشر خطوة بخطوة (من الصفر)

### الخطوة 1: إنشاء مشروع Firebase

1. ادخل على [console.firebase.google.com](https://console.firebase.google.com) بحساب جوجل.
2. اضغط **Add project** ← اكتب اسم المشروع (مثل `maskan`) ← عطّل Google Analytics (مش مطلوب) ← **Create**.

### الخطوة 2: تفعيل قاعدة البيانات (Firestore)

1. من القائمة الجانبية: **Build ← Firestore Database** ← **Create database**.
2. اختر **Start in production mode**.
3. اختر أقرب موقع (مثل `eur3` أوروبا — الأقرب لمصر).

### الخطوة 3: تفعيل تخزين الصور (Storage)

1. **Build ← Storage** ← **Get started** ← **production mode** ← نفس الموقع.

### الخطوة 4: تفعيل تسجيل الدخول (Authentication)

1. **Build ← Authentication** ← **Get started**.
2. من تبويب **Sign-in method** فعّل **Email/Password**.
3. من تبويب **Users** اضغط **Add user** وأنشئ حساب صاحب الموقع:
   - اكتب بريدك الإلكتروني الحقيقي (مثال: `you@gmail.com`)
   - اكتب كلمة سر قوية (12+ حرف، أرقام ورموز) — **هذه هي كلمة سر لوحة التحكم**.

### الخطوة 5: الحصول على مفاتيح API

1. اضغط أيقونة الترس ⚙️ ← **Project settings**.
2. انزل لقسم **Your apps** ← اضغط أيقونة الويب `</>` ← سجّل تطبيق باسم `maskan-web`.
3. ستظهر لك قيم `apiKey` و`authDomain` و`projectId` و`storageBucket` و`messagingSenderId` و`appId` — انسخها.

### الخطوة 6: تطبيق قواعد الأمان (مهم جدًا)

1. **Firestore Database ← تبويب Rules**: امسح المحتوى والصق محتوى ملف `firestore.rules` الموجود في هذا المشروع.
2. **قبل النشر**: غيّر السطر `request.auth.token.email == 'admin@example.com'` إلى بريدك الذي أنشأته في الخطوة 4.
3. اضغط **Publish**.
4. كرر نفس الشيء في **Storage ← تبويب Rules** بمحتوى ملف `storage.rules`.

> هذه القواعد تجعل بيانات الشقق عامة للقراءة، وتمنع أي شخص غيرك من قراءة بيانات الطلاب المسجلين.

### الخطوة 7: النشر على Netlify

**الطريقة الأسهل (من GitHub):**

1. ارفع هذا المشروع على مستودع GitHub (خاص أو عام — ملف `.env` مستبعد تلقائيًا ولن يُرفع).
2. ادخل [app.netlify.com](https://app.netlify.com) ← **Add new site ← Import an existing project** ← اختر المستودع.
3. إعدادات البناء (Netlify يكتشفها تلقائيًا):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **قبل الضغط على Deploy** اذهب إلى **Site configuration ← Environment variables** وأضف هذه المتغيرات (القيم من الخطوة 5):

| المتغير | القيمة |
|---|---|
| `VITE_FIREBASE_API_KEY` | apiKey |
| `VITE_FIREBASE_AUTH_DOMAIN` | authDomain |
| `VITE_FIREBASE_PROJECT_ID` | projectId |
| `VITE_FIREBASE_STORAGE_BUCKET` | storageBucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |
| `VITE_FIREBASE_APP_ID` | appId |
| `VITE_ADMIN_EMAIL` | بريدك من الخطوة 4 |

5. اضغط **Deploy**. خلال دقيقة سيعمل موقعك على رابط مثل `maskan.netlify.app`.

**بديل سريع بدون GitHub:** شغّل `npm run build` محليًا ثم اسحب مجلد `dist` إلى صفحة Netlify مباشرة (لكن ستحتاج تثبيت المتغيرات وإعادة البناء محليًا عند كل تعديل).

### الخطوة 8: السماح بدومين Netlify في Firebase

1. في Firebase Console: **Authentication ← Settings ← Authorized domains**.
2. اضغط **Add domain** وأضف دومين موقعك (مثل `maskan.netlify.app`).

### الخطوة 9: أول استخدام

1. افتح موقعك ← اذهب إلى `/admin` ← ادخل ببريدك وكلمة السر.
2. أضف أول شقة حقيقية (عنوان، وصف، رقم واتساب المالك بالصيغة الدولية مثل `2010xxxxxxxx`، وصور).
3. الشقة تظهر للزوار فور الحفظ، وأي تعديل أو حذف ينعكس لحظيًا.

---

## أسئلة شائعة

**هل التعديلات تظهر فورًا للزوار؟**
نعم — الموقع مشترك في قاعدة البيانات لحظيًا (real-time)، فأي إضافة/تعديل/حذف يظهر عند كل الزوار مباشرة دون نشر جديد.

**ماذا يحدث عند حذف شقة؟**
تُحذف نهائيًا من قاعدة البيانات وتختفي من الموقع فورًا (مع نافذة تأكيد قبل الحذف). قد يراها زائر لديه الصفحة مفتوحة منذ قبل الحذف حتى يحدّث الصفحة — وهذا طبيعي.

**أين تُحفظ بيانات الطلاب ومن يراها؟**
في مجموعة `students` في Firestore. قواعد الأمان تمنع قراءتها إلا من حساب الأدمن، وتظهر لك في لوحة التحكم ← تبويب "الطلاب المسجلون".

**نسيت كلمة سر لوحة التحكم؟**
من Firebase Console ← Authentication ← Users ← اضغط على حسابك ← Reset password.

**الحدود المجانية تكفي؟**
نعم بهامش كبير: خطة Spark تعطي ~50 ألف قراءة/يوم لـ Firestore و1GB تخزين للصور و5GB نقل شهريًا — وحجمك المتوقع (100 شقة، 600 صورة مضغوطة، 50 ألف زيارة/شهر) أقل بكثير منها.

---

## هيكل المشروع

```
src/
├── lib/
│   ├── firebase.ts        # قراءة مفاتيح Firebase من متغيرات البيئة
│   ├── data-service.ts    # كل عمليات البيانات (شقق/طلاب/دخول) + الوضع التجريبي
│   ├── image-utils.ts     # ضغط الصور لأقل من 300KB قبل الرفع
│   ├── whatsapp.ts        # بناء رابط واتساب برسالة معبأة تلقائيًا
│   ├── types.ts           # أنواع البيانات
│   └── demo-data.ts       # بيانات عينة للوضع التجريبي
├── context/AppContext.tsx # حالة الشقق والطالب لحظيًا
├── components/
│   ├── Scene3D.tsx        # خلفية ثلاثية الأبعاد (CSS خفيف)
│   ├── ListingCard.tsx    # بطاقة الشقة
│   ├── ListingDetail.tsx  # نافذة التفاصيل + زرار واتساب
│   ├── SignupGate.tsx     # نافذة تسجيل الطالب عند أول تواصل
│   └── admin/ListingFormDialog.tsx  # نموذج إضافة/تعديل شقة
└── pages/
    ├── HomePage.tsx           # الرئيسية
    ├── ListingsPage.tsx       # قسم (منطقة × نوع)
    ├── AdminLoginPage.tsx     # دخول الأدمن
    └── AdminDashboardPage.tsx # لوحة التحكم
firestore.rules              # قواعد أمان قاعدة البيانات
storage.rules                # قواعد أمان تخزين الصور
.env.example                 # نموذج متغيرات البيئة
public/_redirects            # إعداد توجيه المسارات على Netlify
```
