// بيانات تجريبية (Demo) — تُستخدم فقط عند عدم ضبط مفاتيح Firebase
// عشان تقدر تشوف شكل الموقع وتجربه قبل ربط قاعدة البيانات.
import type { Listing, Region, Gender } from './types';

// توليد صورة SVG تجريبية خفيفة (data URI) لكل شقة
function demoImage(title: string, hue: number, variant: number): string {
  const h2 = (hue + 40) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue},45%,${26 + variant * 4}%)"/>
      <stop offset="1" stop-color="hsl(${h2},50%,${14 + variant * 3}%)"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <g opacity="0.16" fill="hsl(${h2},60%,75%)">
    <rect x="${80 + variant * 30}" y="${330 - variant * 20}" width="130" height="270" rx="6"/>
    <rect x="${260 + variant * 25}" y="${260 - variant * 15}" width="160" height="340" rx="6"/>
    <rect x="${470 + variant * 20}" y="${360 - variant * 10}" width="120" height="240" rx="6"/>
    <rect x="${630 - variant * 15}" y="${300}" width="110" height="300" rx="6"/>
    <circle cx="120" cy="110" r="46"/>
  </g>
  <text x="400" y="560" font-family="sans-serif" font-size="34" font-weight="bold"
    fill="hsl(${h2},70%,88%)" text-anchor="middle">${title}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function makeListing(
  id: string, region: Region, gender: Gender, title: string,
  description: string, hue: number, imagesCount: number
): Listing {
  return {
    id,
    region,
    gender,
    title,
    description,
    images: Array.from({ length: imagesCount }, (_, i) =>
      demoImage(`${title} — صورة ${i + 1}`, hue + i * 12, i)
    ),
    whatsapp_number: '201000000000', // رقم تجريبي — غيّره من لوحة التحكم
    status: 'available',
    created_at: Date.now() - Math.floor(Math.random() * 30) * 86400000,
  };
}

export const DEMO_LISTINGS: Listing[] = [
  makeListing('demo-1', 'new-minya', 'girls', 'شقة مفروشة قرب جامعة المنيا الجديدة',
    'شقة 3 غرف مفروشة بالكامل في الدور الثاني، على بعد 5 دقائق مشي من بوابة الجامعة. السعر 1500 جنيه للفرد شهريًا شامل المياه، والإنترنت متوفر. الشقة بها سخان وغسالة وثلاجة ومطبخ مجهز.', 195, 4),
  makeListing('demo-2', 'new-minya', 'girls', 'سكن بنات هادئ بجوار المستشفى الجامعي',
    'غرفة في شقة مشتركة للبنات فقط، منطقة آمنة وهادئة بجوار المستشفى الجامعي. إشراف دوري والتزام بالمواعيد. السعر 1200 جنيه شهريًا.', 285, 3),
  makeListing('demo-3', 'new-minya', 'boys', 'شقة شباب قريبة من موقف الأقاليم',
    'شقة 4 غرف للشباب، الدور الثالث، قريبة من موقف الأقاليم ووسائل المواصلات. السعر 900 جنيه للفرد. متاحة فورًا.', 210, 5),
  makeListing('demo-4', 'minya', 'girls', 'سكن بنات بمنطقة كورنيش النيل',
    'شقة مميزة على كورنيش النيل، 3 غرف، مفروشة ونظيفة، بجوار كليات جامعة المنيا بالمدينة. السعر 1300 جنيه للفرد شهريًا.', 170, 4),
  makeListing('demo-5', 'minya', 'boys', 'غرف للشباب بجوار كلية الهندسة',
    'غرف فردية وثنائية للشباب بجوار كلية الهندسة، منطقة تجارية بها كل الخدمات. الأسعار تبدأ من 800 جنيه شهريًا.', 250, 3),
  makeListing('demo-6', 'minya', 'boys', 'شقة 2 غرفة بشارع طه حسين',
    'شقة صغيرة مناسبة لطالبين، بشارع طه حسين، قريبة من كليات الطب والصيدلة. إيجار الشقة كاملة 2500 جنيه شهريًا.', 320, 4),
];
