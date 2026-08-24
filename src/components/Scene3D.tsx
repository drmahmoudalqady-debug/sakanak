// خلفية ثلاثية الأبعاد خفيفة (CSS فقط — بدون WebGL للحفاظ على سرعة التحميل)
// طبقات: تدرج لوني عميق + أرضية شبكية بمنظور + كرات ضوئية + أشكال عائمة + أفق مباني
export default function Scene3D() {
  return (
    <div className="scene-3d" aria-hidden="true">
      <div className="scene-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="geo geo-diamond" />
      <div className="geo geo-ring" />
      <div className="geo geo-square" />
      {/* أفق مباني بطابع مدينة المنيا — طبقة عمق بعيدة */}
      <svg className="city-skyline" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="sky-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(190 60% 22% / 0)" />
            <stop offset="1" stopColor="hsl(190 65% 14% / 0.9)" />
          </linearGradient>
          <linearGradient id="sky-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(192 70% 10% / 0.55)" />
            <stop offset="1" stopColor="hsl(195 75% 7%)" />
          </linearGradient>
        </defs>
        {/* الطبقة البعيدة */}
        <path fill="url(#sky-far)" d="M0,220 L0,150 L60,150 L60,120 L120,120 L120,160 L180,160 L180,100 L230,100 L230,140 L300,140 L300,90 L340,90 L340,150 L420,150 L420,110 L480,110 L480,160 L560,160 L560,80 L600,80 L600,140 L680,140 L680,105 L740,105 L740,155 L820,155 L820,95 L870,95 L870,145 L950,145 L950,115 L1010,115 L1010,160 L1090,160 L1090,125 L1150,125 L1150,150 L1200,150 L1200,220 Z" />
        {/* الطبقة القريبة */}
        <path fill="url(#sky-near)" d="M0,220 L0,185 L80,185 L80,155 L150,155 L150,195 L240,195 L240,140 L300,140 L300,185 L390,185 L390,160 L460,160 L460,200 L560,200 L560,130 L630,130 L630,180 L720,180 L720,150 L800,150 L800,195 L890,195 L890,145 L960,145 L960,185 L1050,185 L1050,165 L1120,165 L1120,190 L1200,190 L1200,220 Z" />
        {/* نوافذ مضيئة */}
        <g fill="hsl(42 95% 65%)" opacity="0.85">
          <rect x="95" y="165" width="6" height="6" /><rect x="110" y="165" width="6" height="6" />
          <rect x="255" y="152" width="6" height="6" /><rect x="272" y="165" width="6" height="6" />
          <rect x="575" y="142" width="6" height="6" /><rect x="595" y="155" width="6" height="6" />
          <rect x="905" y="157" width="6" height="6" /><rect x="925" y="170" width="6" height="6" />
          <rect x="1065" y="175" width="6" height="6" />
        </g>
      </svg>
    </div>
  );
}
