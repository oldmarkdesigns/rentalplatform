import {
  BuildingIcon,
  CarIcon,
  CalendarIcon,
  LockerIcon,
  PinIcon,
  SparklesIcon,
  StarIcon,
  UtensilsIcon,
  UserIcon
} from "../icons/UiIcons";
import { formatSek } from "../../lib/formatters";

function formatPriceSek(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "Pris saknas";
  return formatSek(numeric);
}

function formatCapacity(value) {
  if (value === null || value === undefined || value === "") return "Kapacitet saknas";
  if (typeof value === "number") return `${value} platser`;
  return String(value);
}

function buildAddress(listing) {
  const parts = [listing.address, listing.district].filter(Boolean);
  return parts.join(", ") || "Address unavailable";
}

const amenityDefinitions = [
  { icon: CarIcon, aliases: ["parkering", "garage", "lastzon", "lastkaj", "loading zone"] },
  { icon: BuildingIcon, aliases: ["mötesrum", "konferensrum", "styrelserum", "telefonbås", "telefonrum", "skyltfönster"] },
  { icon: UtensilsIcon, aliases: ["kök", "kitchen", "pentry"] },
  { icon: UserIcon, aliases: ["reception", "väntrum"] },
  { icon: LockerIcon, aliases: ["förråd", "förrad", "storage", "lager"] }
];

function amenityIconFor(amenity) {
  const normalized = String(amenity || "").toLowerCase();
  const match = amenityDefinitions.find((item) => item.aliases.some((alias) => normalized.includes(alias)));
  return match?.icon || BuildingIcon;
}

function ListingVisualCard({ listing, shortlisted, onOpenListing, onToggleShortlist, compact = false, showMatchChip = false }) {
  const amenities = Array.isArray(listing.amenities) ? listing.amenities : [];
  const visibleAmenities = amenities.slice(0, 3);
  const extraAmenities = Math.max(amenities.length - visibleAmenities.length, 0);

  if (compact) {
    return (
      <article className="overflow-hidden rounded-3xl border border-black/15 bg-white">
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
          <div className="relative overflow-hidden rounded-2xl h-36">
            <img src={listing.image} alt={listing.title} className="h-full w-full rounded-2xl object-cover" />
            <button
              type="button"
              aria-label={shortlisted ? "Ta bort sparad" : "Spara"}
              className="absolute right-3 top-3 inline-flex h-9 w-9 min-h-9 min-w-9 aspect-square shrink-0 items-center justify-center rounded-full border border-black/15 bg-white p-0 text-ink-700 hover:bg-white"
              onClick={(event) => {
                event.stopPropagation();
                onToggleShortlist(listing.id);
              }}
            >
              <StarIcon className={`h-4 w-4 ${shortlisted ? "fill-current text-[#0f1930]" : ""}`} />
            </button>
          </div>
          <div className="px-3 pb-3 pt-2.5">
            <h3 className="text-[15px] leading-tight font-medium text-black">{listing.title}</h3>
            <p className="mt-1 text-xs text-ink-600">{buildAddress(listing)}</p>
            <p className="mt-1 text-sm font-medium text-ink-800">
              <span>{listing.type || "Lokal"}</span>
              <span aria-hidden="true" className="mx-1">•</span>
              <span>{listing.sizeSqm} kvm</span>
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="h-full overflow-hidden rounded-[30px] border border-black/10 bg-white">
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
        className="relative flex h-full cursor-pointer flex-col text-left"
        aria-label={`Open details for ${listing.title}`}
      >
        <div className="relative">
          <img src={listing.image} alt={listing.title} className="h-52 w-full object-cover" />
        </div>
        <div className="absolute right-4 top-4 flex items-center gap-2">
          {showMatchChip ? (
            <div className="inline-flex h-10 items-center gap-1.5 rounded-full border border-black/5 bg-white px-3.5 text-sm font-semibold text-[#0f1930]">
              <SparklesIcon className="h-4 w-4 text-[#4f46e5]" />
              <span>{listing.score || 0}% match</span>
            </div>
          ) : null}
          <button
            type="button"
            aria-label={shortlisted ? "Ta bort sparad" : "Spara"}
            className="inline-flex h-10 w-10 min-h-10 min-w-10 items-center justify-center rounded-full border border-black/15 bg-white p-0 text-ink-700 hover:bg-[#eef3fa]"
            onClick={(event) => {
              event.stopPropagation();
              onToggleShortlist(listing.id);
            }}
          >
            <StarIcon className={`h-4 w-4 ${shortlisted ? "fill-current text-[#0f1930]" : ""}`} />
          </button>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold leading-tight text-[#0f1930]">{listing.title}</h3>
            <p className="flex items-center gap-1.5 text-sm text-ink-600">
              <PinIcon className="h-4 w-4 text-ink-500" />
              <span>{buildAddress(listing)}</span>
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <p className="flex items-center gap-1.5 text-sm text-ink-600">
              <UserIcon className="h-4 w-4 text-ink-500" />
              <span>{formatCapacity(listing.capacity)}</span>
            </p>
            <p className="flex items-center gap-1.5 text-sm text-ink-600">
              <CalendarIcon className="h-4 w-4 text-ink-500" />
              <span>{listing.availability || "Availability unknown"}</span>
            </p>
          </div>

          <div className="mt-5 pb-4">
            <div className="flex flex-wrap gap-2">
            {visibleAmenities.map((amenity) => {
              const Icon = amenityIconFor(amenity);
              return (
                <span key={amenity} className="inline-flex items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-ink-700">
                  <Icon className="h-4 w-4 shrink-0 text-ink-700" />
                  {amenity}
                </span>
              );
            })}
            {extraAmenities > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-ink-700">+{extraAmenities} more</span>
            ) : null}
            </div>
          </div>

          <div className="mt-auto border-t border-black/10 pt-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold text-[#0f1930]">{formatPriceSek(listing.priceMonthly)} /månad</p>
                <p className="mt-1 text-sm text-ink-500">Hyresperiod: {listing.term || "6-24 månader"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ListingVisualCard;
