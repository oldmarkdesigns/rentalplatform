import { formatSek } from "../../lib/formatters";
import { CalendarIcon, ClockIcon, CoinsIcon, EyeIcon, PinIcon, RulerIcon, StarIcon, UserIcon } from "../icons/UiIcons";

function ListingVisualCard({ listing, shortlisted, onOpenListing, onBookViewing, onToggleShortlist }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-black/10 bg-white">
      <button type="button" onClick={() => onOpenListing(listing)} className="relative block w-full text-left">
        <img src={listing.image} alt={listing.title} className="h-52 w-full object-cover" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-xl border border-white/40 bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">{listing.type}</span>
          {listing.verified ? <span className="rounded-xl border border-white/40 bg-white/90 px-2 py-1 text-[11px] font-semibold text-black">Verifierad</span> : null}
        </div>
        <div className="absolute bottom-3 left-3 rounded-xl bg-white/92 px-2 py-1 text-[11px] font-semibold text-black">{listing.score} match</div>
      </button>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-lg font-semibold text-black">{listing.title}</h3>
          <p className="inline-flex items-center gap-1.5 text-xs text-ink-500">
            <PinIcon className="h-3.5 w-3.5" />
            {listing.district} • {listing.address}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="inline-flex items-center gap-1.5 rounded-2xl border border-black/10 bg-[#fafafa] px-2 py-2">
            <CoinsIcon className="h-3.5 w-3.5 text-ink-600" />
            {formatSek(listing.priceMonthly)} / månad
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-2xl border border-black/10 bg-[#fafafa] px-2 py-2">
            <RulerIcon className="h-3.5 w-3.5 text-ink-600" />
            {listing.sizeSqm} kvm
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-2xl border border-black/10 bg-[#fafafa] px-2 py-2">
            <UserIcon className="h-3.5 w-3.5 text-ink-600" />
            {listing.capacity} platser
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-2xl border border-black/10 bg-[#fafafa] px-2 py-2">
            <ClockIcon className="h-3.5 w-3.5 text-ink-600" />
            Svar: {listing.responseHours}h
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onBookViewing(listing)} className="inline-flex items-center gap-1.5 rounded-2xl border border-[#0f1930] bg-[#0f1930] hover:bg-[#16233f] px-3 py-2 text-xs font-semibold text-white">
            <CalendarIcon className="h-3.5 w-3.5" />
            Boka visning
          </button>
          <button type="button" onClick={() => onToggleShortlist(listing.id)} className="inline-flex items-center gap-1.5 rounded-2xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-black">
            <StarIcon className="h-3.5 w-3.5" />
            {shortlisted ? "Sparad" : "Spara"}
          </button>
          <button type="button" onClick={() => onOpenListing(listing)} className="inline-flex items-center gap-1.5 rounded-2xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-black">
            <EyeIcon className="h-3.5 w-3.5" />
            Visa
          </button>
        </div>
      </div>
    </article>
  );
}

export default ListingVisualCard;
