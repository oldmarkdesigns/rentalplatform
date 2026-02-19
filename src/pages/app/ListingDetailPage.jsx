import { useMemo } from "react";
import { formatSek } from "../../lib/formatters";
import { navigateTo } from "../../lib/router";
import { BuildingIcon, ClockIcon, CoinsIcon, PinIcon, RulerIcon, UserIcon } from "../../components/icons/UiIcons";

function ListingDetailPage({ app, listingId, isGuest = false, onRequireAuth }) {
  const listing = useMemo(() => app.listings.find((item) => String(item.id) === String(listingId)), [app.listings, listingId]);
  const similarListings = useMemo(() => {
    if (!listing) return [];
    return app.listings
      .filter((item) => item.id !== listing.id && item.district === listing.district)
      .slice(0, 3);
  }, [app.listings, listing]);

  if (!listing) {
    return (
      <section className="h-full overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl p-6">
          <button type="button" className="rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-ink-700" onClick={() => navigateTo("/app/rent")}>
            Tillbaka till sökresultat
          </button>
          <div className="mt-4 rounded-2xl border border-black/10 bg-white p-6">
            <h1 className="text-2xl font-semibold">Objektet hittades inte</h1>
            <p className="mt-2 text-sm text-ink-600">Det här objektet kan ha tagits bort eller saknar data.</p>
          </div>
        </div>
      </section>
    );
  }

  const images = Array.isArray(listing.images) && listing.images.length > 0
    ? listing.images
    : [listing.image || "/object-images/object-1.jpeg"];

  return (
    <section className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-7xl p-4 pb-8 sm:p-6">
      <button type="button" className="rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-ink-700" onClick={() => navigateTo("/app/rent")}>
        Tillbaka till sökresultat
      </button>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
        <article className="rounded-3xl border border-black/10 bg-white p-4">
          <h1 className="text-3xl font-semibold">{listing.title}</h1>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-500">
            <PinIcon className="h-4 w-4" />
            {listing.district} • {listing.address}
          </p>

          <img src={images[0]} alt={listing.title} className="mt-4 h-72 w-full rounded-2xl object-cover sm:h-[420px]" />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {images.slice(0, 4).map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt={`${listing.title} ${index + 1}`} className="h-20 w-full rounded-xl border border-black/10 object-cover" />
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-black/10 bg-[#f8fafc] p-4">
            <h2 className="text-xl font-semibold">Objektbeskrivning</h2>
            <p className="mt-2 text-sm text-ink-700">
              {listing.description || `Kontorsobjekt i ${listing.district} med flexibel planlösning för team som behöver ${listing.capacity} platser.`}
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-ink-700">
                <PinIcon className="h-3.5 w-3.5 text-ink-500" />
                {listing.address}
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-ink-700">
                <RulerIcon className="h-3.5 w-3.5 text-ink-500" />
                {listing.sizeSqm} m²
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-ink-700">
                <ClockIcon className="h-3.5 w-3.5 text-ink-500" />
                {listing.term || "12-24 månader"}
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-ink-700">
                <BuildingIcon className="h-3.5 w-3.5 text-ink-500" />
                {listing.advertiserName || "Annonsör"}
              </div>
            </div>
          </div>
        </article>

        <aside className="space-y-4">
          <article className="rounded-3xl border border-black/10 bg-white p-5">
            <p className="text-3xl font-semibold">{formatSek(listing.priceMonthly)} /månad</p>
            <p className="mt-1 text-sm text-ink-500">Hyresperiod: {listing.term || "6-24 månader"}</p>
            <h3 className="mt-5 text-lg font-semibold">Bekvämligheter</h3>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {(listing.amenities || []).map((amenity) => (
                <li key={amenity} className="rounded-xl border border-black/10 bg-[#f8fafc] px-3 py-2 text-sm text-ink-700">
                  {amenity}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-5 w-full rounded-2xl border border-[#0f1930] bg-[#0f1930] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#16233f]"
              onClick={() => {
                if (isGuest) {
                  onRequireAuth?.("signup", "renter");
                  return;
                }
                app.pushToast("Kontaktförfrågan skickad till annonsör.", "success");
              }}
            >
              Kontakta uthyrare
            </button>
          </article>

          <article className="rounded-3xl border border-black/10 bg-white p-5">
            <h3 className="text-lg font-semibold">Snabbfakta</h3>
            <div className="mt-3 grid gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-[#f8fafc] px-3 py-2 text-sm text-ink-700">
                <CoinsIcon className="h-4 w-4 text-ink-500" />
                {formatSek(listing.priceMonthly)} / månad
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-[#f8fafc] px-3 py-2 text-sm text-ink-700">
                <RulerIcon className="h-4 w-4 text-ink-500" />
                {listing.sizeSqm} kvm
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-[#f8fafc] px-3 py-2 text-sm text-ink-700">
                <UserIcon className="h-4 w-4 text-ink-500" />
                {listing.capacity} platser
              </div>
            </div>
          </article>
        </aside>
      </div>

      {similarListings.length > 0 ? (
        <section className="mt-6">
          <h2 className="text-2xl font-semibold">Liknande objekt</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {similarListings.map((item) => (
              <button key={item.id} type="button" className="overflow-hidden rounded-2xl border border-black/10 bg-white text-left" onClick={() => navigateTo(`/app/listings/${encodeURIComponent(item.id)}`)}>
                <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />
                <div className="p-3">
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className="text-xs text-ink-500">{item.district} • {item.address}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : null}
      </div>
    </section>
  );
}

export default ListingDetailPage;
