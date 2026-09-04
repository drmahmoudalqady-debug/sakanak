import { MapPin, Users, ImageIcon } from 'lucide-react';
import type { Listing } from '@/lib/types';
import { REGION_LABELS, GENDER_LABELS, STATUS_LABELS } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface Props {
  listing: Listing;
  onOpen: (listing: Listing) => void;
}

export default function ListingCard({ listing, onOpen }: Props) {
  return (
    <button
      onClick={() => onOpen(listing)}
      className="card-glow group w-full overflow-hidden rounded-2xl border border-border/70 bg-card text-start"
    >
      {/* الصورة */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
        {listing.images[0] ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
        <Badge
          className={`absolute top-3 start-3 ${
            listing.status === 'available'
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-600 text-white'
          }`}
        >
          {STATUS_LABELS[listing.status]}
        </Badge>
        {listing.images.length > 1 && (
          <span className="absolute bottom-3 end-3 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] text-white">
            <ImageIcon className="h-3 w-3" />
            {listing.images.length} صور
          </span>
        )}
      </div>

      {/* البيانات */}
      <div className="p-4">
        <h3 className="mb-2 line-clamp-1 text-base font-bold text-foreground group-hover:text-primary">
          {listing.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {REGION_LABELS[listing.region]}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-primary" />
            {GENDER_LABELS[listing.gender]}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {listing.description}
        </p>
      </div>
    </button>
  );
}
