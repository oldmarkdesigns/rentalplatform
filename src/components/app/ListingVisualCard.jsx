import { formatSek } from "../../lib/formatters";
import { ClockIcon, CoinsIcon, PinIcon, RulerIcon, StarIcon, UserIcon } from "../icons/UiIcons";

function ListingVisualCard({ listing, shortlisted, onOpenListing, onToggleShortlist }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-black/10 bg-white">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpenListing(listing)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpenListing(listing);
          }
        }}
        className="block w-full cursor-pointer text-left"
      >
        <div className="relative">
          <img src={listing.image} alt={listing.title} className="h-52 w-full object-cover" />
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="rounded-xl border border-white/40 bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">{listing.type}</span>
            {listing.verified ? <span className="rounded-xl border border-white/40 bg-white/90 px-2 py-1 text-[11px] font-semibold text-black">Verifierad</span> : null}
          </div>
          <button
            type="button"
            aria-label={shortlisted ? "Ta bort sparad" : "Spara"}
            className="absolute right-3 top-3 inline-flex h-9 w-9 min-h-9 min-w-9 aspect-square items-center justify-center rounded-full border border-white/40 bg-black/45 p-0 text-white backdrop-blur-sm hover:bg-black/60"
            onClick={(event) => {
              event.stopPropagation();
              onToggleShortlist(listing.id);
            }}
          >
            <StarIcon className={`h-4 w-4 ${shortlisted ? "fill-current" : ""}`} />
          </button>
        </div>

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
        </div>
      </div>
    </article>
  );
}

export default ListingVisualCard;
