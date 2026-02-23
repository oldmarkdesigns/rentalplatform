import { useEffect, useMemo, useRef, useState } from "react";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { formatSek } from "../../lib/formatters";
import { normalizePopularListingFallback, popularListingFallbackKey } from "../../lib/popularListingFallback";
import { navigateTo } from "../../lib/router";
import {
  BalconyIcon,
  BikeIcon,
  BuildingIcon,
  CarIcon,
  ClockIcon,
  CoinsIcon,
  DumbbellIcon,
  ExternalLinkIcon,
  LockerIcon,
  LoungeIcon,
  PenthouseIcon,
  PinIcon,
  RooftopIcon,
  RulerIcon,
  ShieldIcon,
  SnowflakeIcon,
  UserIcon,
  UtensilsIcon,
  WifiIcon
} from "../../components/icons/UiIcons";
import ListingVisualCard from "../../components/app/ListingVisualCard";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_SCRIPT_ID = "google-maps-listing-detail-script";

const districtInsights = {
  Norrmalm: {
    center: { lat: 59.3346, lng: 18.0628 },
    transit: ["T-Centralen 6 min", "Hötorget 4 min", "Flera innerstadsbussar 2-5 min"],
    services: ["Brett restaurangutbud", "Gym och service i kvarteren", "Många lunchalternativ"],
    profile: "Norrmalm passar företag som prioriterar central tillgänglighet, korta restider och närhet till service."
  },
  Södermalm: {
    center: { lat: 59.3148, lng: 18.0632 },
    transit: ["Skanstull 5 min", "Medborgarplatsen 7 min", "Tvärförbindelser med buss 2-6 min"],
    services: ["Kreativa kvarter", "Caféer och mötesplatser", "Blandning av kontor och handel"],
    profile: "Södermalm erbjuder ett dynamiskt område med stark företagsmix och god kommunikation till city."
  },
  Vasastan: {
    center: { lat: 59.3458, lng: 18.0344 },
    transit: ["Odenplan 6 min", "S:t Eriksplan 6 min", "Pendeltåg via Odenplan"],
    services: ["Kvartersnära service", "Bra utbud av lunchrestauranger", "Nära parker och stråk"],
    profile: "Vasastan kombinerar citynära läge med lugnare kvarter och stabil efterfrågan på kontorsytor."
  },
  Östermalm: {
    center: { lat: 59.3385, lng: 18.0916 },
    transit: ["Östermalmstorg 5 min", "Stadion 7 min", "Busslinjer längs huvudstråk"],
    services: ["Representativa adresser", "Hög servicenivå", "Starkt restaurang- och handelsutbud"],
    profile: "Östermalm är ett representativt läge med premiumkänsla och nära access till city."
  },
  Kungsholmen: {
    center: { lat: 59.3319, lng: 18.0418 },
    transit: ["Fridhemsplan 5 min", "Rådhuset 7 min", "Snabb busskoppling västerut"],
    services: ["Stabil företagsnärvaro", "Bra service längs huvudgator", "Nära vatten och promenadstråk"],
    profile: "Kungsholmen ger en balanserad mix av läge, tillgänglighet och trivsam arbetsmiljö."
  },
  Solna: {
    center: { lat: 59.3608, lng: 18.0003 },
    transit: ["Solna Centrum 8 min", "Pendeltåg mot city", "Tvärbana/buss i flera lägen"],
    services: ["Kostnadseffektiva alternativ", "Närhet till större trafikleder", "Växande företagsområden"],
    profile: "Solna är ett attraktivt val för team som söker bra tillgänglighet och effektiv kostnadsbild."
  }
};

function getDistrictInsight(district) {
  return districtInsights[district] || {
    center: { lat: 59.3293, lng: 18.0686 },
    transit: ["Goda kommunikationer i området", "Flera busslinjer i närheten"],
    services: ["Serviceutbud inom gångavstånd", "Närhet till lunch och vardagsservice"],
    profile: "Området erbjuder en stabil blandning av kontor, service och kollektivtrafik."
  };
}

function loadGoogleMaps(apiKey) {
  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (window.__googleMapsListingDetailPromise) {
    return window.__googleMapsListingDetailPromise;
  }

  window.__googleMapsListingDetailPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }

    const previousAuthFailure = window.gm_authFailure;
    const timeoutId = window.setTimeout(() => {
      reject(new Error("Google Maps timeout."));
    }, 12000);

    function cleanup() {
      window.clearTimeout(timeoutId);
      window.gm_authFailure = previousAuthFailure;
    }

    window.gm_authFailure = () => {
      cleanup();
      reject(new Error("Google Maps API-nyckeln nekades."));
    };

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      cleanup();
      if (window.google?.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error("Google Maps SDK kunde inte initieras."));
      }
    };
    script.onerror = () => {
      cleanup();
      reject(new Error("Kunde inte ladda Google Maps SDK."));
    };
    document.head.appendChild(script);
  }).catch((error) => {
    window.__googleMapsListingDetailPromise = null;
    throw error;
  });

  return window.__googleMapsListingDetailPromise;
}

function ListingAreaGoogleMap({ lat, lng, title }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      if (!GOOGLE_MAPS_API_KEY) {
        setStatus("missing_key");
        return;
      }
      try {
        const maps = await loadGoogleMaps(GOOGLE_MAPS_API_KEY);
        if (cancelled || !containerRef.current) return;
        const center = { lat, lng };
        if (!mapRef.current) {
          mapRef.current = new maps.Map(containerRef.current, {
            center,
            zoom: 15,
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            mapTypeControl: false,
            clickableIcons: false,
            gestureHandling: "greedy"
          });
        } else {
          mapRef.current.setCenter(center);
        }
        if (!markerRef.current) {
          markerRef.current = new maps.Marker({
            map: mapRef.current,
            position: center,
            title
          });
        } else {
          markerRef.current.setPosition(center);
          markerRef.current.setTitle(title);
        }
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    setup();
    return () => {
      cancelled = true;
    };
  }, [lat, lng, title]);

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-black/10 bg-[#dbe8f6]">
      <div ref={containerRef} className="absolute inset-0" />
      {status === "loading" ? (
        <div className="absolute inset-0 grid place-items-center bg-white/55 text-xs font-semibold text-ink-700">Laddar karta...</div>
      ) : null}
      {status === "missing_key" ? (
        <div className="absolute inset-0 grid place-items-center bg-white/70 px-4 text-center text-xs font-semibold text-rose-700">
          Google Maps API-nyckel saknas.
        </div>
      ) : null}
      {status === "error" ? (
        <div className="absolute inset-0 grid place-items-center bg-white/70 px-4 text-center text-xs font-semibold text-rose-700">
          Google Maps kunde inte laddas.
        </div>
      ) : null}
    </div>
  );
}

function inferAmenitiesFromText(text) {
  const normalized = String(text || "").toLowerCase();
  const inferred = [];
  if (/(mötesrum|styrelserum|konferens)/.test(normalized)) inferred.push("Mötesrum");
  if (/(fiber|wifi|internet)/.test(normalized)) inferred.push("Fiber");
  if (/(kök|pentry|kaffe|kaffestation)/.test(normalized)) inferred.push("Kök");
  if (/(parkering|garage|lastzon|laddplats)/.test(normalized)) inferred.push("Parkering");
  if (/(cykel|cykelförråd|cykelrum)/.test(normalized)) inferred.push("Cykelförråd");
  if (/(reception|väntrum)/.test(normalized)) inferred.push("Reception");
  if (/(lounge|telefonbås)/.test(normalized)) inferred.push("Lounge");
  if (/(dusch|omklädningsrum|gym)/.test(normalized)) inferred.push("Omklädningsrum");
  if (/(air condition|ac|klimat)/.test(normalized)) inferred.push("Air condition");
  if (/(balkong|terrass|takterrass)/.test(normalized)) inferred.push("Takterrass");
  return Array.from(new Set(inferred));
}

function buildDisplayAmenities(listing) {
  const blocked = new Set([
    "extern källa",
    "importerad listing",
    "importerad",
    "listing",
    "amf fastigheter",
    "vasakronan",
    "castellum",
    "fabege",
    "skandia fastigheter"
  ]);
  const advertiserName = String(listing?.advertiserName || "").trim().toLowerCase();
  if (advertiserName) blocked.add(advertiserName);

  const sanitized = (Array.isArray(listing?.amenities) ? listing.amenities : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .filter((item) => !blocked.has(item.toLowerCase()));

  if (sanitized.length > 0) {
    return Array.from(new Set(sanitized)).slice(0, 8);
  }

  const inferred = inferAmenitiesFromText(
    [listing?.description, listing?.type, listing?.tags?.join(" "), listing?.title]
      .filter(Boolean)
      .join(" ")
  );
  if (inferred.length > 0) return inferred.slice(0, 8);
  return ["Mötesrum", "Fiber", "Kök"];
}

function buildLongDescription(listing, insight, amenities) {
  const amenityText = Array.isArray(amenities) && amenities.length > 0
    ? amenities.slice(0, 5).join(", ").toLowerCase()
    : "moderna grundfaciliteter";

  const intro = listing.description || `${listing.title} är en ${listing.type.toLowerCase()}lokal i ${listing.district} med genomtänkt planering för team upp till ${listing.capacity} personer. Lokalen omfattar cirka ${listing.sizeSqm} kvm och passar verksamheter som vill kombinera effektiv yta med hög vardagsfunktion.`;
  const layout = `Ytorna är planerade för både fokusarbete och samarbete, med tydliga arbetszoner och flexibla möbleringsmöjligheter. Bekvämligheter som ${amenityText} skapar en arbetsmiljö som fungerar i vardagen och ger bra förutsättningar för tillväxt.`;
  const area = `${insight.profile} Läget vid ${listing.address} gör det enkelt för både medarbetare och besökare att nå lokalen, och området erbjuder en bra balans mellan tillgänglighet, service och representativ känsla.`;
  const transport = `Kommunikationerna är starka med ${insight.transit.join(", ").toLowerCase()}. Det ger korta restider inom Stockholm och underlättar både rekrytering och kundmöten.`;

  return [intro, layout, area, transport];
}

function amenityIconFor(amenity) {
  const normalized = String(amenity || "").toLowerCase();
  if (normalized.includes("cykel")) return BikeIcon;
  if (normalized.includes("garage") || normalized.includes("park")) return CarIcon;
  if (normalized.includes("kök") || normalized.includes("pentry") || normalized.includes("kaffe")) return UtensilsIcon;
  if (normalized.includes("möte") || normalized.includes("styrelse") || normalized.includes("kontor")) return BuildingIcon;
  if (normalized.includes("fiber") || normalized.includes("wifi")) return WifiIcon;
  if (normalized.includes("reception") || normalized.includes("väntrum")) return UserIcon;
  if (normalized.includes("balkong")) return BalconyIcon;
  if (normalized.includes("takterrass")) return RooftopIcon;
  if (normalized.includes("takvåning")) return PenthouseIcon;
  if (normalized.includes("gym")) return DumbbellIcon;
  if (normalized.includes("omklädning") || normalized.includes("förråd") || normalized.includes("lager")) return LockerIcon;
  if (normalized.includes("air condition") || normalized.includes("ac") || normalized.includes("dusch")) return SnowflakeIcon;
  if (normalized.includes("lounge") || normalized.includes("telefonbås")) return LoungeIcon;
  if (normalized.includes("säker")) return ShieldIcon;
  return BuildingIcon;
}

function ListingDetailPage({ app, listingId, isGuest = false, onRequireAuth }) {
  const pageRef = useRef(null);
  const listing = useMemo(() => {
    const existing = app.listings.find((item) => String(item.id) === String(listingId));
    if (existing) return existing;
    if (typeof window === "undefined") return null;
    try {
      const raw = window.sessionStorage.getItem(popularListingFallbackKey(listingId));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return normalizePopularListingFallback(parsed);
    } catch {
      return null;
    }
  }, [app.listings, listingId]);
  const similarListings = useMemo(() => {
    if (!listing) return [];
    const sameDistrict = app.listings.filter((item) => item.id !== listing.id && item.district === listing.district);
    const remaining = app.listings.filter((item) => item.id !== listing.id && item.district !== listing.district);
    return [...sameDistrict, ...remaining].slice(0, 4);
  }, [app.listings, listing]);
  const insight = useMemo(() => getDistrictInsight(listing?.district), [listing?.district]);
  const displayAmenities = useMemo(() => (listing ? buildDisplayAmenities(listing) : []), [listing]);
  const longDescription = useMemo(() => (listing ? buildLongDescription(listing, insight, displayAmenities) : []), [listing, insight, displayAmenities]);
  const googleMapsHref = useMemo(
    () => `https://www.google.com/maps?q=${encodeURIComponent(`${insight.center.lat},${insight.center.lng}`)}`,
    [insight.center.lat, insight.center.lng]
  );

  useEffect(() => {
    const container = pageRef.current;
    if (container) {
      container.scrollTo({ top: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [listingId]);

  if (!listing) {
    return (
      <section ref={pageRef} className="h-full overflow-y-auto">
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
    <section ref={pageRef} className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-7xl p-4 pb-8 sm:p-6">
        <Breadcrumbs
          className="mb-2"
          items={[
            { label: "Startsida", to: "/" },
            { label: "Sökresultat", to: "/app/rent?run=1" },
            { label: listing.title }
          ]}
        />

        <div className="mt-4 space-y-4">
            <h1 className="text-3xl font-semibold">{listing.title}</h1>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-500">
              <PinIcon className="h-4 w-4" />
              {listing.district} • {listing.address}
            </p>

            <img src={images[0]} alt={listing.title} className="mt-4 h-72 w-full rounded-2xl object-cover sm:h-[460px]" />
            <div className="mt-3 grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((image, index) => (
                <img key={`${image}-${index}`} src={image} alt={`${listing.title} ${index + 1}`} className="h-20 w-full rounded-xl border border-black/10 object-cover" />
              ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <article className="flex h-full flex-col rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-3xl font-semibold">{formatSek(listing.priceMonthly)} /månad</p>
                <p className="mt-1 text-sm text-ink-500">Hyresperiod: {listing.term || "6-24 månader"}</p>

                <h3 className="mt-5 text-lg font-semibold">Bekvämligheter</h3>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {displayAmenities.map((amenity) => {
                    const Icon = amenityIconFor(amenity);
                    return (
                      <li key={amenity} className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-[#f8fafc] px-3 py-2 text-sm text-ink-700">
                        <Icon className="h-4 w-4 text-ink-500" />
                        {amenity}
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-auto space-y-2 pt-5">
                  <button
                    type="button"
                    className="w-full rounded-2xl border border-[#0f1930] bg-[#0f1930] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#16233f]"
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
                  <button
                    type="button"
                    className="w-full rounded-2xl border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-[#eef3fa]"
                    onClick={() => {
                      if (isGuest) {
                        onRequireAuth?.("signup", "renter");
                        return;
                      }
                      app.pushToast("Visningsförfrågan skickad.", "success");
                    }}
                  >
                    Boka visning
                  </button>
                </div>
              </article>

              <article className="rounded-2xl border border-black/10 bg-white p-4">
                <h3 className="text-lg font-semibold">Snabbfakta</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
                  <div className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-[#f8fafc] px-3 py-2 text-sm text-ink-700">
                    <ClockIcon className="h-4 w-4 text-ink-500" />
                    Svarstid cirka {listing.responseHours}h
                  </div>
                </div>

                <h3 className="mt-5 text-lg font-semibold">Kommunikation & service i området</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-black/10 bg-[#f8fafc] p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Kommunaltrafik</p>
                    <ul className="mt-2 space-y-1 text-sm text-ink-700">
                      {insight.transit.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-black/10 bg-[#f8fafc] p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Närområde</p>
                    <ul className="mt-2 space-y-1 text-sm text-ink-700">
                      {insight.services.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </div>

            <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
              <article className="rounded-2xl border border-black/10 bg-white p-4">
                <h2 className="text-xl font-semibold">Området</h2>
                <p className="mt-2 text-sm text-ink-700">
                  Lokalen ligger i {listing.district} och nås smidigt med kollektivtrafik, cykel och bil beroende på teamets behov.
                </p>
                <div className="mt-3">
                  <ListingAreaGoogleMap lat={insight.center.lat} lng={insight.center.lng} title={listing.title} />
                </div>
                <a
                  href={googleMapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-[#eef3fa]"
                >
                  Öppna i Google Maps
                  <ExternalLinkIcon className="h-3.5 w-3.5" />
                </a>
              </article>

              <article className="self-start rounded-2xl border border-black/10 p-4">
                <h2 className="text-xl font-semibold">Om lokalen</h2>
                <div className="mt-2 space-y-3 text-sm text-ink-700">
                  {longDescription.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            </div>
        </div>

        {similarListings.length > 0 ? (
          <section className="mt-10 pb-8">
            <h2 className="text-2xl font-semibold">Liknande objekt</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {similarListings.map((item) => (
                <ListingVisualCard
                  key={item.id}
                  listing={item}
                  shortlisted={Boolean((app.favorites || []).some((entry) => entry.listingId === item.id))}
                  onOpenListing={(selected) => navigateTo(`/app/listings/${encodeURIComponent(selected.id)}`)}
                  onToggleShortlist={(listingId) => app.toggleFavorite?.(listingId)}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}

export default ListingDetailPage;
