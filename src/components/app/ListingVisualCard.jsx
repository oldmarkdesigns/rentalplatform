import { formatSek } from "../../lib/formatters";
import { ClockIcon, CoinsIcon, PinIcon, RulerIcon, StarIcon, UserIcon } from "../icons/UiIcons";

function buildListingSummary(listing) {
  const explicit = String(listing?.description || "").trim();
  if (explicit) return explicit;

  const amenityText = Array.isArray(listing?.amenities) && listing.amenities.length > 0
    ? listing.amenities.slice(0, 2).join(" och ").toLowerCase()
    : "grundläggande bekvämligheter";
  const transitText = listing?.transitDistance
    ? `med ${String(listing.transitDistance).toLowerCase()} till kommunaltrafik`
    : "med goda kommunikationer";
  return `${listing.type} i ${listing.district} med plats för cirka ${listing.capacity} personer, ${listing.sizeSqm} kvm och ${amenityText}. Passar team som söker lokaler ${transitText}.`;
}

function ListingVisualCard({ listing, shortlisted, onOpenListing, onToggleShortlist }) {
  const summary = buildListingSummary(listing);

  return (
    <article className="overflow-hidden rounded-3xl border border-black/10 bg-white md:h-[272px]">
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
        className="block w-full cursor-pointer text-left md:h-full"
      >
        <div className="grid md:h-full md:grid-cols-[44%_56%]">
          <div className="relative h-52 overflow-hidden md:h-full">
            <img src={listing.image} alt={listing.title} className="h-full w-full object-cover" />
          </div>

          <div className="flex h-full flex-col p-4 md:p-5">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-black">{listing.title}</h3>
                  <p className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                    <PinIcon className="h-3.5 w-3.5" />
                    {listing.district} • {listing.address}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={shortlisted ? "Ta bort sparad" : "Spara"}
                  className="inline-flex h-9 w-9 min-h-9 min-w-9 aspect-square shrink-0 items-center justify-center rounded-full border border-black/15 bg-white p-0 text-ink-700 hover:bg-[#eef3fa]"
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleShortlist(listing.id);
                  }}
                >
                  <StarIcon className={`h-4 w-4 ${shortlisted ? "fill-current text-[#0f1930]" : ""}`} />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full border border-black/10 bg-[#f8fafc] px-2.5 py-1 text-[11px] font-semibold text-ink-700">
                  {listing.type}
                </span>
                {listing.verified ? (
                  <span className="rounded-full border border-black/10 bg-[#f8fafc] px-2.5 py-1 text-[11px] font-semibold text-ink-700">
                    Verifierad
                  </span>
                ) : null}
              </div>

              <p className="relative min-h-[52px] text-sm text-ink-600">
                <span
                  className="block"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {summary}
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-5 rounded-b-md"
                  style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.98) 72%)" }}
                />
              </p>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2 pt-2 text-xs">
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
      </div>
    </article>
  );
}

export default ListingVisualCard;
