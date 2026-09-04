// نموذج إضافة/تعديل شقة — يشمل رفع صور متعددة مع ضغط ومعاينة وترتيب قبل الحفظ
import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImagePlus, Loader2, X, ArrowUp, ArrowDown } from 'lucide-react';
import type { Listing, Region, Gender } from '@/lib/types';
import { REGION_LABELS, GENDER_LABELS, STATUS_LABELS } from '@/lib/types';
import { addListing, updateListing, uploadListingImages } from '@/lib/data-service';
import { formatBytes } from '@/lib/image-utils';

interface Props {
  open: boolean;
  onClose: () => void;
  editing: Listing | null;
}

const MAX_IMAGES = 8;

type ImageItem =
  | { type: 'existing'; url: string }
  | { type: 'new'; file: File; preview: string };

export default function ListingFormDialog({ open, onClose, editing }: Props) {
  const [region, setRegion] = useState<Region>('new-minya');
  const [gender, setGender] = useState<Gender>('girls');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [status, setStatus] = useState<Listing['status']>('available');
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setRegion(editing?.region ?? 'new-minya');
      setGender(editing?.gender ?? 'girls');
      setTitle(editing?.title ?? '');
      setDescription(editing?.description ?? '');
      setWhatsapp(editing?.whatsapp_number ?? '');
      setStatus(editing?.status ?? 'available');
      
      const items: ImageItem[] = (editing?.images ?? []).map(url => ({ type: 'existing', url }));
      setImageItems(items);
      setError('');
    }
  }, [open, editing]);

  function handlePickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/'));
    const room = MAX_IMAGES - imageItems.length;
    const picked = files.slice(0, room);
    
    const newItems: ImageItem[] = picked.map(file => ({
      type: 'new',
      file,
      preview: URL.createObjectURL(file),
    }));
    
    setImageItems(prev => [...prev, ...newItems]);
    if (files.length > room) setError(`الحد الأقصى ${MAX_IMAGES} صور لكل شقة`);
    else setError('');
    e.target.value = '';
  }

  function removeImage(index: number) {
    const item = imageItems[index];
    if (item.type === 'new') URL.revokeObjectURL(item.preview);
    setImageItems(prev => prev.filter((_, i) => i !== index));
  }

  function moveImage(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === imageItems.length - 1) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    setImageItems(prev => {
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const cleanNumber = whatsapp.replace(/[^\d]/g, '');
    if (!title.trim()) return setError('اكتب عنوان الشقة');
    if (!description.trim()) return setError('اكتب وصف الشقة');
    if (cleanNumber.length < 10) return setError('اكتب رقم واتساب صحيح بالصيغة الدولية (مثال: 2010xxxxxxxx)');
    if (imageItems.length === 0) return setError('أضف صورة واحدة على الأقل');

    setSaving(true);
    try {
      // نرفع الصور الجديدة بالترتيب
      const newFiles = imageItems.filter(i => i.type === 'new').map(i => (i as Extract<ImageItem, { type: 'new' }>).file);
      const uploadedUrls = newFiles.length ? await uploadListingImages(newFiles) : [];
      
      // ندمج الصور بالترتيب المحدد
      const images: string[] = [];
      let uploadIdx = 0;
      for (const item of imageItems) {
        if (item.type === 'existing') {
          images.push(item.url);
        } else {
          images.push(uploadedUrls[uploadIdx++]);
        }
      }

      const data = {
        region, gender,
        title: title.trim(),
        description: description.trim(),
        whatsapp_number: cleanNumber,
        status,
        images,
      };

      if (editing) {
        await updateListing(editing.id, data);
      } else {
        await addListing(data);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !saving && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl">{editing ? 'تعديل الشقة' : 'إضافة شقة جديدة'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-5">
          {/* المنطقة والنوع */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>المنطقة</Label>
              <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-minya">{REGION_LABELS['new-minya']}</SelectItem>
                  <SelectItem value="minya">{REGION_LABELS['minya']}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>نوع السكن</Label>
              <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="girls">{GENDER_LABELS.girls}</SelectItem>
                  <SelectItem value="boys">{GENDER_LABELS.boys}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">عنوان الشقة</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: شقة مفروشة قرب جامعة المنيا الجديدة" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="desc">الوصف التفصيلي</Label>
            <Textarea
              id="desc" rows={5} value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="عدد الغرف، الدور، قريبة من إيه، الأثاث، السعر..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="wa">رقم واتساب المالك (صيغة دولية)</Label>
              <Input id="wa" dir="ltr" className="text-end" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="2010xxxxxxxx" />
            </div>
            <div className="space-y-1.5">
              <Label>الحالة</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Listing['status'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">{STATUS_LABELS.available}</SelectItem>
                  <SelectItem value="reserved">{STATUS_LABELS.reserved}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* رفع الصور */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>صور الشقة ({imageItems.length}/{MAX_IMAGES})</Label>
              <Button
                type="button" variant="outline" size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageItems.length >= MAX_IMAGES}
                className="gap-1.5"
              >
                <ImagePlus className="h-4 w-4" />
                إضافة صور
              </Button>
              <input
                ref={fileInputRef} type="file" accept="image/*" multiple
                className="hidden" onChange={handlePickFiles}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              الصور تُضغط تلقائيًا لأقل من 300 كيلوبايت قبل الرفع. استخدم الأسهم لتحديد الترتيب.
            </p>

            {imageItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {imageItems.map((item, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-lg border border-border bg-black/5">
                    <div className="aspect-[4/3]">
                      <img 
                        src={item.type === 'existing' ? item.url : item.preview} 
                        alt="" 
                        className="h-full w-full object-contain" 
                      />
                    </div>
                    
                    {/* أزرار الترتيب */}
                    <div className="absolute start-1 top-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveImage(i, 'up')}
                        disabled={i === 0}
                        className="rounded bg-black/60 p-1 text-white transition hover:bg-black/80 disabled:opacity-30"
                        title="أعلى"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(i, 'down')}
                        disabled={i === imageItems.length - 1}
                        className="rounded bg-black/60 p-1 text-white transition hover:bg-black/80 disabled:opacity-30"
                        title="أسفل"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>

                    {/* رقم الترتيب */}
                    <span className="absolute bottom-1 start-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                      {i + 1}
                    </span>

                    {/* حذف */}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute end-1 top-1 rounded-full bg-black/60 p-1 text-white transition hover:bg-red-500"
                      aria-label="حذف الصورة"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    {item.type === 'new' && (
                      <span className="absolute bottom-1 end-1 rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                        جديدة · {formatBytes(item.file.size)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border py-8 text-muted-foreground transition hover:border-primary/50 hover:text-primary"
              >
                <ImagePlus className="h-8 w-8" />
                <span className="text-sm">اضغط لاختيار صورة أو أكثر</span>
              </button>
            )}
          </div>

          {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={saving} className="flex-1 gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? 'جارٍ الضغط والحفظ...' : editing ? 'حفظ التعديلات فورًا' : 'إضافة الشقة'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>إلغاء</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
