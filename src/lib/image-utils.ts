// ضغط الصور في المتصفح قبل الرفع — الهدف: أقل من 300KB للصورة
// لتسريع تحميل الموقع على الإنترنت المتوسط/الضعيف في مصر.

const MAX_SIZE_BYTES = 300 * 1024; // 300 كيلوبايت
const MAX_DIMENSION = 1280;        // أقصى عرض/ارتفاع بالبكسل

export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  // تصغير الأبعاد لو أكبر من الحد
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(bitmap, 0, 0, width, height);

  // تقليل الجودة تدريجيًا حتى نصل لأقل من 300KB
  let quality = 0.82;
  let blob = await toBlob(canvas, quality);
  while (blob.size > MAX_SIZE_BYTES && quality > 0.3) {
    quality -= 0.12;
    blob = await toBlob(canvas, quality);
  }
  // لو لسه كبيرة، صغّر الأبعاد أكثر
  while (blob.size > MAX_SIZE_BYTES && canvas.width > 480) {
    canvas.width = Math.round(canvas.width * 0.75);
    canvas.height = Math.round(canvas.height * 0.75);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    blob = await toBlob(canvas, quality);
  }
  return blob;
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('فشل ضغط الصورة'))),
      'image/jpeg',
      quality
    );
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} بايت`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} كيلوبايت`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} ميجابايت`;
}
