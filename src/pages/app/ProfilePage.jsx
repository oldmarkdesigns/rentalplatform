import { useMemo, useState } from "react";

function ProfilePage({ app }) {
  const { user, filterPresets = [], savedAiSearches = [], switchRole } = app;
  const [pendingRole, setPendingRole] = useState(false);
  const roleSet = useMemo(() => new Set(Array.isArray(user?.roles) ? user.roles : [user?.role || "renter"]), [user?.role, user?.roles]);
  const hasRenter = roleSet.has("renter");
  const hasPublisher = roleSet.has("publisher");
  const canSwitchRoles = hasRenter && hasPublisher;

  const currentRoleLabel = useMemo(() => (user?.role === "publisher" ? "Annonsör" : "Hyresgäst"), [user?.role]);

  return (
    <section className="p-4 sm:p-6">
      <div className="mx-auto grid w-full max-w-[1200px] gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-black/10 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/20 bg-[#f8fafc] text-sm font-semibold text-ink-700">
              {(user?.name || "AA")
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase() || "")
                .join("")}
            </div>
            <div>
              <p className="text-lg font-semibold text-black">{user?.name || "Användare"}</p>
              <p className="text-sm text-ink-600">{user?.email || "-"}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p><span className="font-semibold">Telefon:</span> {user?.phone || "-"}</p>
            <p><span className="font-semibold">Aktiv roll:</span> {currentRoleLabel}</p>
            <p><span className="font-semibold">Tillgängliga roller:</span> {[...roleSet].map((role) => (role === "publisher" ? "Annonsör" : "Hyresgäst")).join(", ")}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {!hasRenter ? (
              <button
                type="button"
                className="rounded-xl border border-black/20 bg-white px-3 py-2 text-xs font-semibold"
                disabled={pendingRole}
                onClick={async () => {
                  setPendingRole(true);
                  try {
                    await switchRole("renter");
                  } finally {
                    setPendingRole(false);
                  }
                }}
              >
                Lägg till Hyresgäst
              </button>
            ) : null}
            {!hasPublisher ? (
              <button
                type="button"
                className="rounded-xl border border-black/20 bg-white px-3 py-2 text-xs font-semibold"
                disabled={pendingRole}
                onClick={async () => {
                  setPendingRole(true);
                  try {
                    await switchRole("publisher");
                  } finally {
                    setPendingRole(false);
                  }
                }}
              >
                Lägg till Annonsör
              </button>
            ) : null}
            {canSwitchRoles ? (
              <>
                <button
                  type="button"
                  className="rounded-xl border border-black/20 bg-white px-3 py-2 text-xs font-semibold"
                  disabled={pendingRole || user?.role === "renter"}
                  onClick={async () => {
                    setPendingRole(true);
                    try {
                      await switchRole("renter");
                    } finally {
                      setPendingRole(false);
                    }
                  }}
                >
                  Växla till Hyresgäst
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-black/20 bg-white px-3 py-2 text-xs font-semibold"
                  disabled={pendingRole || user?.role === "publisher"}
                  onClick={async () => {
                    setPendingRole(true);
                    try {
                      await switchRole("publisher");
                    } finally {
                      setPendingRole(false);
                    }
                  }}
                >
                  Växla till Annonsör
                </button>
              </>
            ) : null}
          </div>

          {hasPublisher ? (
            <div className="mt-4 rounded-2xl border border-black/10 bg-[#f8fafc] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Prisöversikt</p>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                  Gratis publicering aktiv
                </span>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                <article className="rounded-xl border border-black/10 bg-white px-2.5 py-2">
                  <p className="text-[11px] font-semibold text-ink-700">Gratis</p>
                  <p className="text-xs text-ink-600">0 kr / månad</p>
                  <p className="mt-1 text-[11px] text-ink-500">Obegränsad publicering.</p>
                </article>
                <article className="rounded-xl border border-black/10 bg-white px-2.5 py-2">
                  <p className="text-[11px] font-semibold text-ink-700">Synlighetslyft</p>
                  <p className="text-xs text-ink-600">Topplacering 30 dagar</p>
                  <p className="mt-1 text-[11px] text-ink-500">Högre synlighet i listan.</p>
                </article>
                <article className="rounded-xl border border-black/10 bg-white px-2.5 py-2">
                  <p className="text-[11px] font-semibold text-ink-700">Synlighetslyft</p>
                  <p className="text-xs text-ink-600">Förnya annons</p>
                  <p className="mt-1 text-[11px] text-ink-500">Pusha upp annonsen igen.</p>
                </article>
              </div>
            </div>
          ) : null}
        </article>

        <div className="space-y-4">
          <article id="search-history" className="rounded-3xl border border-black/10 bg-white p-5">
            <h2 className="text-xl font-semibold">Sökhistorik</h2>
            <p className="mt-1 text-sm text-ink-600">Senast sparade filter och AI-sökningar.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-[#fafafa] px-3 py-2 text-xs">
                <p className="font-semibold text-ink-700">Sparade filter</p>
                <p className="mt-1 text-ink-600">{filterPresets.length} st</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#fafafa] px-3 py-2 text-xs">
                <p className="font-semibold text-ink-700">Sparade AI-sök</p>
                <p className="mt-1 text-ink-600">{savedAiSearches.length} st</p>
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
