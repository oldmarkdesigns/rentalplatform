import { useMemo } from "react";
import { navigateTo } from "../../lib/router";

function seededViews(id) {
  return String(id || "")
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0) % 30 + 2;
}

function ListingRow({ listing, muted = false }) {
  return (
    <button
      type="button"
      className={`grid w-full grid-cols-[112px_1fr_auto] items-center gap-3 rounded-2xl border p-3 text-left transition ${
        muted ? "border-black/10 bg-[#fafafa] opacity-75" : "border-[#c8d1de] bg-white hover:border-[#aebdd0]"
      }`}
      onClick={() => navigateTo(`/app/my-listings/${encodeURIComponent(listing.id)}`)}
    >
      <img src={listing.image || "/object-images/object-1.jpeg"} alt={listing.title} className="h-20 w-full rounded-xl object-cover" />
      <div>
        <p className="text-lg font-semibold leading-tight">{listing.title}</p>
        <p className="mt-1 text-sm text-ink-600">{listing.district} • {listing.address}</p>
      </div>
      <span className="rounded-xl border border-black/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700">Hantera</span>
    </button>
  );
}

function PublisherOverviewPage({ app }) {
  const { user, listings } = app;

  const ownListings = useMemo(
    () => listings.filter((listing) => listing.ownerId === user?.id),
    [listings, user?.id]
  );

  const activeListings = ownListings.filter((listing) => String(listing.status) === "active");
  const inactiveListings = ownListings.filter((listing) => String(listing.status) !== "active");

  const topStats = ownListings
    .slice(0, 3)
    .map((listing) => ({ title: listing.title, views: seededViews(listing.id) }))
    .sort((a, b) => b.views - a.views);

  return (
    <section className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-7xl p-4 pb-8 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Översikt</h1>
          <p className="mt-2 text-sm text-ink-500">Hantera dina publicerade objekt</p>
        </div>
        <button type="button" className="btn-primary px-4" onClick={() => navigateTo("/app/my-listings")}>
          Lägg till objekt
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.85fr]">
        <article className="surface p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-2xl font-semibold">Dina objekt</h2>
            <button type="button" className="btn-secondary px-3 py-2 text-xs" onClick={() => navigateTo("/app/my-listings")}>
              Hantera alla
            </button>
          </div>

          <p className="mb-2 text-lg font-semibold">Aktiva ({activeListings.length})</p>
          <div className="space-y-2">
            {activeListings.length > 0 ? activeListings.map((listing) => <ListingRow key={listing.id} listing={listing} />) : <p className="rounded-2xl border border-black/10 bg-[#fafafa] p-4 text-sm text-ink-500">Inga aktiva objekt just nu.</p>}
          </div>

          <p className="mb-2 mt-4 text-lg font-semibold">Inaktiva ({inactiveListings.length})</p>
          <div className="space-y-2">
            {inactiveListings.length > 0 ? inactiveListings.map((listing) => <ListingRow key={listing.id} listing={listing} muted />) : <p className="rounded-2xl border border-black/10 bg-[#fafafa] p-4 text-sm text-ink-500">Inga inaktiva objekt just nu.</p>}
          </div>
        </article>

        <article className="surface p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-2xl font-semibold">Statistik</h2>
            <span className="rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-ink-700">Senaste månaden</span>
          </div>
          <p className="mb-3 text-lg font-semibold">Antal besök</p>
          <div className="space-y-2">
            {topStats.map((entry) => (
              <div key={entry.title} className="flex items-center justify-between rounded-xl border border-black/10 bg-[#fafafa] px-3 py-2">
                <span className="text-sm text-ink-700">{entry.title}</span>
                <span className="text-sm font-semibold text-ink-900">{entry.views}</span>
              </div>
            ))}
            {topStats.length === 0 ? <p className="rounded-2xl border border-black/10 bg-[#fafafa] p-4 text-sm text-ink-500">Statistik visas när du har objekt.</p> : null}
          </div>
        </article>
      </div>
      </div>
    </section>
  );
}

export default PublisherOverviewPage;
