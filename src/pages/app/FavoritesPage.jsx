import ListingVisualCard from "../../components/app/ListingVisualCard";

function FavoritesPage({ app, onOpenListing, onBookViewing }) {
  const { favorites, toggleFavorite } = app;
  const favoriteItems = favorites.filter((item) => Boolean(item.listing));

  return (
    <section className="p-4 sm:p-6">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-4">
          <h1 className="text-3xl font-semibold">Favoriter</h1>
          <p className="text-sm text-ink-600">Sparade objekt för snabb uppföljning.</p>
        </div>

        {favoriteItems.length === 0 ? (
          <div className="rounded-3xl border border-black/10 bg-white p-4">
            <p className="rounded-2xl border border-black/10 bg-[#fafafa] p-3 text-sm text-ink-500">Du har inte sparat några favoriter ännu.</p>
          </div>
        ) : null}

        {favoriteItems.length > 0 ? (
          <div className="inline-block max-w-full rounded-3xl border border-black/10 bg-white p-4 align-top">
            <div className="flex flex-wrap gap-4">
              {favoriteItems.map((item) => (
                <div key={item.id} className="w-full sm:w-[380px]">
                  <ListingVisualCard
                    listing={item.listing}
                    shortlisted
                    onOpenListing={onOpenListing}
                    onBookViewing={onBookViewing}
                    onToggleShortlist={toggleFavorite}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default FavoritesPage;
