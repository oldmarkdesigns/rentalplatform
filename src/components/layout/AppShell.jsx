import { useEffect, useMemo, useRef, useState } from "react";
import { navigateTo, routeMatches } from "../../lib/router";
import { BuildingIcon, CalendarIcon, HistoryIcon, SearchIcon, StarIcon, UserIcon } from "../icons/UiIcons";
import AppFooter from "./AppFooter";
import MarketingNavLinks from "./MarketingNavLinks";

const renterMenuItems = [
  { label: "Sök lokaler", path: "/app/rent", icon: SearchIcon },
  { label: "Favoriter", path: "/app/favorites", icon: StarIcon },
  { label: "Visningar", path: "/app/viewings", icon: CalendarIcon }
];

const publisherWorkspaceItems = [
  { label: "Publicera annons", path: "/app/publish" },
  { label: "Dina objekt", path: "/app/my-listings" },
  { label: "Intresse och visningar", path: "/app/leads" }
];

function AppShell({ pathname, user, onSwitchRole, onLogout, onRequireAuth, isGuest = false, children }) {
  const activeRole = user?.role === "publisher" ? "publisher" : "renter";
  const rawRoles = isGuest ? ["renter"] : (Array.isArray(user?.roles) ? user.roles : [activeRole]);
  const roleSet = new Set(rawRoles.filter((item) => item === "renter" || item === "publisher"));
  const hasPublisherAccess = roleSet.has("publisher");
  const isPublisherWorkspacePath = (
    routeMatches(pathname, "/app/publish")
    || routeMatches(pathname, "/app/my-listings")
    || routeMatches(pathname, "/app/leads")
  );
  const showPublisherWorkspaceNav = !isGuest && hasPublisherAccess && (activeRole === "publisher" || isPublisherWorkspacePath);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLeaveSearchConfirm, setShowLeaveSearchConfirm] = useState(false);
  const menuRef = useRef(null);

  const initials = useMemo(() => {
    const source = (user?.name || (isGuest ? "Gäst" : "AA")).trim();
    const words = source.split(" ").filter(Boolean);
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }
    return `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase();
  }, [isGuest, user?.name]);

  useEffect(() => {
    function onPointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function handlePrimaryNavClick(event, item) {
    if (!item?.href) return false;
    if (item.href !== "/app/rent?view=available") return false;
    if (pathname !== "/app/rent") return false;

    const params = new URLSearchParams(window.location.search);
    const hasActiveSearch = params.get("run") === "1";
    if (!hasActiveSearch) return false;

    event.preventDefault();
    setShowLeaveSearchConfirm(true);
    return true;
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-white text-black">
      <header className="navbar-enter sticky top-0 z-40 shrink-0 border-b border-black/10 bg-white px-4 py-3 sm:px-6">
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex items-center gap-3">
            <button type="button" className="justify-self-start text-left" onClick={() => navigateTo("/")}>
              <span className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-2.5 py-1.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-black/30 bg-[#f8fafc] text-[9px] font-semibold uppercase tracking-wide text-ink-500">
                  LOGGA
                </span>
                <span className="text-sm font-semibold text-ink-800">Företagsnamn</span>
              </span>
            </button>
          </div>

          <nav className="hidden items-center justify-self-center gap-5 lg:flex">
            <MarketingNavLinks
              hrefPrefix="/"
              onPrimaryNavClick={handlePrimaryNavClick}
              onPublish={() => {
                if (isGuest) {
                  onRequireAuth?.("signup", "publisher");
                  return;
                }
                navigateTo("/app/publish");
              }}
            />
          </nav>

          {!isGuest ? (
          <div className="flex items-center justify-self-end gap-2">
            <div ref={menuRef} className="relative">
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/20 bg-white text-sm font-semibold text-ink-700"
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                {initials}
              </button>

              {menuOpen ? (
                <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-72 rounded-2xl border border-black/10 bg-white p-3">
                  <div className="rounded-xl border border-black/10 bg-[#f8fafc] px-3 py-2">
                    <p className="text-sm font-semibold text-black">{isGuest ? "Gästläge" : (user?.name || "Användare")}</p>
                    <p className="text-xs text-ink-600">{isGuest ? "Logga in för att spara och boka visning" : (user?.email || "-")}</p>
                    {!isGuest ? <p className="mt-1 text-xs text-ink-500">Roll: {activeRole === "publisher" ? "Annonsör" : "Hyresgäst"}</p> : null}
                  </div>

                  <div className="mt-2 grid gap-2 text-sm">
                    {isGuest ? (
                      <>
                        <button
                          type="button"
                          className="rounded-xl border border-black/15 bg-white px-3 py-2 text-left font-semibold text-ink-700"
                          onClick={() => onRequireAuth?.("login")}
                        >
                          Logga in
                        </button>
                        <button
                          type="button"
                          className="rounded-xl border border-[#0f1930] bg-[#0f1930] px-3 py-2 text-left font-semibold text-white hover:bg-[#16233f]"
                          onClick={() => onRequireAuth?.("signup", "renter")}
                        >
                          Skapa konto
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" className="rounded-xl border border-black/15 bg-white px-3 py-2 text-left font-semibold text-ink-700" onClick={() => navigateTo("/app/profile")}>
                          <span className="inline-flex items-center gap-1.5">
                            <UserIcon className="h-4 w-4" />
                            Kontoinformation
                          </span>
                        </button>
                        <button type="button" className="rounded-xl border border-black/15 bg-white px-3 py-2 text-left font-semibold text-ink-700" onClick={() => navigateTo("/app/profile#search-history")}>
                          <span className="inline-flex items-center gap-1.5">
                            <HistoryIcon className="h-4 w-4" />
                            Sökhistorik
                          </span>
                        </button>
                        {activeRole === "renter"
                          ? renterMenuItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                <button
                                  key={item.path}
                                  type="button"
                                  className="rounded-xl border border-black/15 bg-white px-3 py-2 text-left font-semibold text-ink-700"
                                  onClick={() => navigateTo(item.path)}
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    {Icon ? <Icon className="h-4 w-4" /> : null}
                                    {item.label}
                                  </span>
                                </button>
                              );
                            })
                          : null}
                        {roleSet.has("publisher") ? (
                          <button type="button" className="rounded-xl border border-black/15 bg-white px-3 py-2 text-left font-semibold text-ink-700" onClick={() => navigateTo("/app/my-listings")}>
                            <span className="inline-flex items-center gap-1.5">
                              <BuildingIcon className="h-4 w-4" />
                              Dina objekt
                            </span>
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="rounded-xl border border-black/15 bg-white px-3 py-2 text-left font-semibold text-ink-700"
                          onClick={async () => {
                            await onLogout();
                            navigateTo("/", { replace: true });
                          }}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <HistoryIcon className="h-4 w-4" />
                            Logga ut
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          ) : (
            <div className="flex items-center justify-self-end gap-2">
              <button
                type="button"
                className="rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-[#f7f9fc]"
                onClick={() => onRequireAuth?.("login")}
              >
                Logga in
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#0f1930] bg-[#0f1930] px-3 py-2 text-xs font-semibold text-white hover:bg-[#16233f]"
                onClick={() => onRequireAuth?.("signup", "renter")}
              >
                Skapa konto
              </button>
            </div>
          )}
        </div>

      </header>

      {showPublisherWorkspaceNav ? (
        <div className="shrink-0 border-b border-black/10 bg-white px-4 py-2 sm:px-6">
          <nav className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-center gap-5">
            {publisherWorkspaceItems.map((item) => {
              const active = routeMatches(pathname, item.path);
              return (
                <button
                  key={item.path}
                  type="button"
                  className={`border-b-2 pb-0.5 text-sm font-semibold transition ${
                    active
                      ? "border-[#0f1930] text-[#0f1930]"
                      : "border-transparent text-ink-600 hover:text-black"
                  }`}
                  onClick={() => navigateTo(item.path)}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      ) : null}

      <section className="min-h-0 flex-1 overflow-hidden">{children}</section>
      <AppFooter />

      {showLeaveSearchConfirm ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowLeaveSearchConfirm(false)}
        >
          <article
            className="w-full max-w-lg rounded-2xl border border-black/10 bg-white p-5 shadow-[0_24px_64px_rgba(15,25,48,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-ink-900">Byt till Lediga lokaler?</h3>
            <p className="mt-2 text-sm text-ink-700">
              Din nuvarande sökning försvinner om du går vidare till Lediga lokaler-flödet.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-[#f7f9fc]"
                onClick={() => setShowLeaveSearchConfirm(false)}
              >
                Avbryt
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#0f1930] bg-[#0f1930] px-4 py-2 text-sm font-semibold text-white hover:bg-[#16233f]"
                onClick={() => {
                  setShowLeaveSearchConfirm(false);
                  navigateTo("/app/rent?view=available");
                }}
              >
                Fortsätt
              </button>
            </div>
          </article>
        </div>
      ) : null}
    </main>
  );
}

export default AppShell;
