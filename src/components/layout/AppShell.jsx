import { useEffect, useMemo, useRef, useState } from "react";
import { navigateTo } from "../../lib/router";
import { BuildingIcon, CalendarIcon, HistoryIcon, SearchIcon, StarIcon, UserIcon } from "../icons/UiIcons";

const renterMenuItems = [
  { label: "Sök lokaler", path: "/app/rent", icon: SearchIcon },
  { label: "Favoriter", path: "/app/favorites", icon: StarIcon },
  { label: "Visningar", path: "/app/viewings", icon: CalendarIcon }
];

const publicNavItems = [
  { label: "Publicera annons", type: "action", action: "publish" },
  { label: "Funktioner", type: "href", href: "/#funktioner" },
  { label: "Så fungerar det", type: "href", href: "/#sa-fungerar-det" },
  { label: "Priser", type: "href", href: "/#priser" },
  { label: "FAQ", type: "href", href: "/#faq" }
];

function AppShell({ pathname, user, onSwitchRole, onLogout, onRequireAuth, isGuest = false, children }) {
  const activeRole = user?.role === "publisher" ? "publisher" : "renter";
  const rawRoles = isGuest ? ["renter"] : (Array.isArray(user?.roles) ? user.roles : [activeRole]);
  const roleSet = new Set(rawRoles.filter((item) => item === "renter" || item === "publisher"));
  const [menuOpen, setMenuOpen] = useState(false);
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

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#f4f5f7] text-black">
      <header className="sticky top-0 z-40 shrink-0 border-b border-black/10 bg-white px-4 py-3 sm:px-6">
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex items-center gap-3">
            <button type="button" className="justify-self-start text-left" onClick={() => navigateTo("/")}>
              <p className="text-lg font-semibold">Lokalflöde Stockholm</p>
              <p className="text-xs text-ink-600">Kontor och kommersiella lokaler i hela Stockholm</p>
            </button>
          </div>

          <nav className="hidden items-center justify-self-center gap-5 lg:flex">
            {publicNavItems.map((item) => {
              if (item.type === "route") {
                return (
                  <button key={item.label} type="button" className="text-sm font-semibold text-ink-700 transition hover:text-black" onClick={() => navigateTo(item.path)}>
                    {item.label}
                  </button>
                );
              }
              if (item.type === "action") {
                return (
                  <button
                    key={item.label}
                    type="button"
                    className="text-sm font-semibold text-ink-700 transition hover:text-black"
                    onClick={() => {
                      if (isGuest) {
                        onRequireAuth?.("signup", "publisher");
                        return;
                      }
                      navigateTo("/app/publish");
                    }}
                  >
                    {item.label}
                  </button>
                );
              }
              return (
                <a key={item.label} href={item.href} className="text-sm font-semibold text-ink-700 transition hover:text-black">
                  {item.label}
                </a>
              );
            })}
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
                          <button type="button" className="rounded-xl border border-black/15 bg-white px-3 py-2 text-left font-semibold text-ink-700" onClick={() => navigateTo("/app/publish")}>
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

      <section className="min-h-0 flex-1 overflow-hidden">{children}</section>
    </main>
  );
}

export default AppShell;
