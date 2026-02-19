import { useEffect, useMemo, useRef, useState } from "react";
import ListingVisualCard from "../../components/app/ListingVisualCard";
import ViewingRequestModal from "../../components/app/ViewingRequestModal";
import {
  BikeIcon,
  BuildingIcon,
  CarIcon,
  MapIcon,
  ResetIcon,
  SaveIcon,
  SearchIcon,
  SparklesIcon,
  UserIcon,
  UtensilsIcon,
  WifiIcon
} from "../../components/icons/UiIcons";
import { districtOptions, listingTypes } from "../../data/mockData";
import { navigateTo } from "../../lib/router";

const districtMapLayout = {
  Solna: { x: 42, y: 18 },
  Norrmalm: { x: 48, y: 34 },
  Vasastan: { x: 38, y: 33 },
  Östermalm: { x: 59, y: 34 },
  Kungsholmen: { x: 41, y: 42 },
  Södermalm: { x: 50, y: 48 }
};

const districtGeo = {
  Solna: { lat: 59.3608, lng: 18.0003 },
  Norrmalm: { lat: 59.3346, lng: 18.0628 },
  Vasastan: { lat: 59.3458, lng: 18.0344 },
  Östermalm: { lat: 59.3385, lng: 18.0916 },
  Kungsholmen: { lat: 59.3319, lng: 18.0418 },
  Södermalm: { lat: 59.3148, lng: 18.0632 }
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_SCRIPT_ID = "google-maps-sdk-script";
const editorAmenityOptions = [
  { value: "Cykelförråd", label: "Cykelförråd", icon: BikeIcon },
  { value: "Garage", label: "Garage", icon: CarIcon },
  { value: "Kök", label: "Kök", icon: UtensilsIcon },
  { value: "Mötesrum", label: "Mötesrum", icon: BuildingIcon },
  { value: "Fiber", label: "Fiber", icon: WifiIcon },
  { value: "Reception", label: "Reception", icon: UserIcon }
];

const furnishedOptions = [
  { value: "all", label: "Alla" },
  { value: "yes", label: "Möblerad" },
  { value: "no", label: "Omöblerad" }
];
const amenityAliasesByValue = {
  "cykelförråd": ["cykelförråd", "cykelrum"],
  garage: ["garage", "parkering"],
  kök: ["kök", "kitchen"],
  mötesrum: ["mötesrum", "konferensrum"],
  fiber: ["fiber", "wifi"],
  reception: ["reception"]
};

const heroInputClass = "w-full rounded-2xl border border-black/15 bg-[#f7f9fc] px-3 py-3 text-sm text-ink-900 placeholder:text-ink-500 focus:border-[#0f1930] focus:outline-none";
const heroSelectClass = "w-full rounded-2xl border border-black/15 bg-[#f7f9fc] px-3 py-3 pr-10 text-sm text-ink-900 appearance-none focus:border-[#0f1930] focus:outline-none [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2214%22 height=%2214%22 viewBox=%220 0 20 20%22 fill=%22none%22%3E%3Cpath d=%22M6 8L10 12L14 8%22 stroke=%22%23263842%22 stroke-width=%221.8%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E')] [background-repeat:no-repeat] [background-position:right_0.7rem_center] [background-size:14px_14px]";

function hashSeed(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function markerPointForListing(listing) {
  const base = districtMapLayout[listing.district] || { x: 50, y: 50 };
  const seed = hashSeed(String(listing.id || listing.title || "listing"));
  const jitterX = ((seed % 11) - 5) * 0.75;
  const jitterY = (((seed >> 4) % 11) - 5) * 0.75;
  return {
    x: clamp(base.x + jitterX, 8, 92),
    y: clamp(base.y + jitterY, 12, 88)
  };
}

function markerGeoForListing(listing) {
  const base = districtGeo[listing.district] || { lat: 59.3293, lng: 18.0686 };
  const seed = hashSeed(String(listing.id || listing.title || "listing"));
  const jitterLat = ((seed % 9) - 4) * 0.001;
  const jitterLng = (((seed >> 4) % 9) - 4) * 0.001;
  return {
    lat: base.lat + jitterLat,
    lng: base.lng + jitterLng
  };
}

function loadGoogleMaps(apiKey) {
  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (window.__googleMapsLoadPromise) {
    return window.__googleMapsLoadPromise;
  }

  window.__googleMapsLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }

    const previousAuthFailure = window.gm_authFailure;
    const timeoutId = window.setTimeout(() => {
      reject(new Error("Google Maps timeout. Kontrollera nätverk eller domänbegränsning för API-nyckeln."));
    }, 12000);

    function cleanup() {
      window.clearTimeout(timeoutId);
      window.gm_authFailure = previousAuthFailure;
    }

    window.gm_authFailure = () => {
      cleanup();
      reject(new Error("Google Maps nekade API-nyckeln för denna domän."));
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
        reject(new Error("Google Maps SDK laddades men kunde inte initieras."));
      }
    };
    script.onerror = () => {
      cleanup();
      reject(new Error("Kunde inte ladda Google Maps SDK."));
    };
    document.head.appendChild(script);
  }).catch((error) => {
    window.__googleMapsLoadPromise = null;
    throw error;
  });

  return window.__googleMapsLoadPromise;
}

function GoogleListingsMap({ listings, onMarkerClick, dense = false }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersByIdRef = useRef(new Map());
  const markerClickRef = useRef(onMarkerClick);
  const didInitialFitRef = useRef(false);
  const lastListingsSignatureRef = useRef("");
  const [status, setStatus] = useState("loading");
  const [retryToken, setRetryToken] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    markerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  useEffect(() => {
    let cancelled = false;

    async function setupMap() {
      if (!GOOGLE_MAPS_API_KEY) {
        setStatus("missing_key");
        setErrorMessage("Google Maps API-nyckel saknas.");
        return;
      }
      try {
        setStatus("loading");
        setErrorMessage("");
        const maps = await loadGoogleMaps(GOOGLE_MAPS_API_KEY);
        if (cancelled || !containerRef.current) return;

        if (!mapRef.current) {
          mapRef.current = new maps.Map(containerRef.current, {
            center: { lat: 59.3293, lng: 18.0686 },
            zoom: 11,
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            mapTypeControl: false,
            clickableIcons: false,
            gestureHandling: "greedy"
          });
        }

        const visibleListings = listings.slice(0, 120);
        const signature = visibleListings.map((listing) => String(listing.id)).join("|");
        if (signature === lastListingsSignatureRef.current) {
          setStatus("ready");
          return;
        }
        lastListingsSignatureRef.current = signature;

        const bounds = new maps.LatLngBounds();
        const nextIds = new Set();

        visibleListings.forEach((listing) => {
          nextIds.add(String(listing.id));
          const position = markerGeoForListing(listing);
          let marker = markersByIdRef.current.get(String(listing.id));
          if (!marker) {
            marker = new maps.Marker({
              map: mapRef.current,
              position,
              title: listing.title
            });
            marker.addListener("click", () => markerClickRef.current?.(marker.__listing));
            markersByIdRef.current.set(String(listing.id), marker);
          } else {
            marker.setPosition(position);
            marker.setTitle(listing.title);
          }
          marker.__listing = listing;
          bounds.extend(position);
        });

        markersByIdRef.current.forEach((marker, id) => {
          if (!nextIds.has(id)) {
            marker.setMap(null);
            markersByIdRef.current.delete(id);
          }
        });

        if (!didInitialFitRef.current && visibleListings.length > 0) {
          mapRef.current.fitBounds(bounds, 60);
          didInitialFitRef.current = true;
        }

        setStatus("ready");
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(error?.message || "Google Maps kunde inte laddas.");
        }
      }
    }

    setupMap();

    return () => {
      cancelled = true;
    };
  }, [listings, retryToken]);

  useEffect(() => {
    return () => {
      markersByIdRef.current.forEach((marker) => marker.setMap(null));
      markersByIdRef.current.clear();
    };
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-[#c6d1df] bg-[#dbe8f6] ${dense ? "h-72 sm:h-80" : "h-[480px]"}`}>
      <div ref={containerRef} className="absolute inset-0" />
      {status === "loading" ? (
        <div className="absolute inset-0 grid place-items-center bg-white/55 text-xs font-semibold text-ink-700">Laddar karta...</div>
      ) : null}
      {status === "missing_key" ? (
        <div className="absolute inset-0 grid place-items-center bg-white/70 p-4 text-center text-xs font-semibold text-rose-700">
          Google Maps API-nyckel saknas. Lägg till `VITE_GOOGLE_MAPS_API_KEY` i `.env` och starta om `npm run dev`.
        </div>
      ) : null}
      {status === "error" ? (
        <div className="absolute inset-0 grid place-items-center bg-white/75 p-4 text-center text-xs font-semibold text-rose-700">
          <div className="space-y-2">
            <p>{errorMessage || "Google Maps kunde inte laddas."}</p>
            <p>
              Kontrollera att `Maps JavaScript API` + billing är aktiverat och att referrer tillåter
              `http://localhost:5173/*` samt `http://127.0.0.1:5173/*`.
            </p>
            <button
              type="button"
              className="mx-auto rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
              onClick={() => setRetryToken((value) => value + 1)}
            >
              Försök igen
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MapCanvas({ listings, onMarkerClick, dense = false }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-[#c6d1df] bg-[#dbe8f6] ${dense ? "h-64 sm:h-72" : "h-[420px]"}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,#e9f2fb_0%,transparent_35%),radial-gradient(circle_at_75%_65%,#d2e3f5_0%,transparent_40%),linear-gradient(135deg,#cfdfef_0%,#e9f2fb_100%)]" />
      <div className="absolute inset-x-0 top-[32%] h-px bg-white/60" />
      <div className="absolute inset-x-0 top-[58%] h-px bg-white/50" />
      <div className="absolute left-[36%] top-0 h-full w-px bg-white/50" />
      <div className="absolute left-[62%] top-0 h-full w-px bg-white/45" />

      {listings.map((listing) => {
        const point = markerPointForListing(listing);
        return (
          <button
            key={listing.id}
            type="button"
            onClick={() => onMarkerClick?.(listing)}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0f1930]/25 bg-white px-2 py-1 text-[10px] font-semibold text-[#0f1930] hover:border-[#0f1930] hover:bg-[#0f1930] hover:text-white"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            title={listing.title}
          >
            {listing.sizeSqm} m²
          </button>
        );
      })}
    </div>
  );
}

function PillToggle({ checked, onToggle, ariaLabel, className = "" }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      className={`relative inline-flex h-6 w-10 min-h-0 items-center rounded-full p-0.5 transition-colors ${
        checked ? "bg-[#0f1930]" : "bg-[#a8adb3]"
      } ${checked ? "justify-end" : "justify-start"} ${className}`}
      onClick={onToggle}
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(15,25,48,0.35)]"
      />
    </button>
  );
}

function AuthPromptModal({ mode, onClose, onRequireAuth }) {
  if (!mode) {
    return null;
  }

  const message = mode === "save"
    ? "Logga in eller skapa konto för att spara objekt och bygga en favoritlista."
    : "Logga in eller skapa konto för att boka visning och skicka förfrågan till annonsör.";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/45 p-4 sm:items-center" onClick={onClose}>
      <div className="surface w-full max-w-md p-5" onClick={(event) => event.stopPropagation()}>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Konto krävs</p>
        <h3 className="mt-1 text-xl font-semibold text-ink-900">Fortsätt med konto</h3>
        <p className="mt-2 text-sm text-ink-600">{message}</p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              onClose?.();
              onRequireAuth?.("login");
            }}
          >
            Logga in
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              onClose?.();
              onRequireAuth?.("signup", "renter");
            }}
          >
            Skapa konto
          </button>
        </div>
        <button type="button" className="mt-3 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-ink-700" onClick={onClose}>
          Fortsätt söka som gäst
        </button>
      </div>
    </div>
  );
}

function hasRunSearchInUrl() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("run") === "1";
}

function RentPage({ app, isGuest = false, onRequireAuth }) {
  const {
    listings,
    favorites,
    savedFilters,
    searchListings,
    saveCurrentFilters,
    saveAiSearch,
    toggleFavorite,
    requestViewing,
    runAiSearch
  } = app;

  const [filters, setFilters] = useState(savedFilters);
  const [isHydratingLandingSearch, setIsHydratingLandingSearch] = useState(() => hasRunSearchInUrl());
  const [showSearchEditor, setShowSearchEditor] = useState(false);
  const [showAdvancedSearchEditor, setShowAdvancedSearchEditor] = useState(false);
  const [showEditorAiPanel, setShowEditorAiPanel] = useState(false);
  const [editorModeOpacity, setEditorModeOpacity] = useState(1);
  const [editorAiPrompt, setEditorAiPrompt] = useState("");
  const [amenityQuery, setAmenityQuery] = useState("");
  const [furnishedFilter, setFurnishedFilter] = useState("all");
  const [appliedSearchMeta, setAppliedSearchMeta] = useState({
    filters: savedFilters,
    amenityQuery: "",
    furnishedFilter: "all",
    aiPrompt: ""
  });
  const [bookingListing, setBookingListing] = useState(null);
  const [authPromptMode, setAuthPromptMode] = useState("");
  const [showMap, setShowMap] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");
  const [useNewSearchCta, setUseNewSearchCta] = useState(false);
  const landingSearchAppliedRef = useRef(false);
  const editorModeTimerRef = useRef(null);

  const favoriteIds = useMemo(() => new Set(favorites.map((entry) => entry.listingId)), [favorites]);
  const listingsById = useMemo(() => new Map(listings.map((item) => [item.id, item])), [listings]);
  const advertiserOptions = useMemo(() => {
    const names = Array.from(new Set(listings.map((item) => item.advertiserName).filter(Boolean)));
    return names.sort((a, b) => a.localeCompare(b, "sv"));
  }, [listings]);
  const sortedListings = useMemo(() => {
    const items = [...listings];

    items.sort((a, b) => {
      if (sortBy === "price_asc") return Number(a.priceMonthly || 0) - Number(b.priceMonthly || 0);
      if (sortBy === "price_desc") return Number(b.priceMonthly || 0) - Number(a.priceMonthly || 0);
      if (sortBy === "size_asc") return Number(a.sizeSqm || 0) - Number(b.sizeSqm || 0);
      if (sortBy === "size_desc") return Number(b.sizeSqm || 0) - Number(a.sizeSqm || 0);
      return Number(b.score || 0) - Number(a.score || 0);
    });

    return items;
  }, [listings, sortBy]);

  useEffect(() => {
    setFilters(savedFilters);
  }, [savedFilters]);

  useEffect(() => {
    return () => {
      if (editorModeTimerRef.current) {
        clearTimeout(editorModeTimerRef.current);
      }
    };
  }, []);

  function isAmenitySelected(value) {
    const query = String(amenityQuery || "").toLowerCase();
    const normalizedValue = String(value || "").toLowerCase();
    const aliases = amenityAliasesByValue[normalizedValue] || [normalizedValue];
    return aliases.some((alias) => query.includes(alias));
  }

  function toggleAmenity(value) {
    const tokens = amenityQuery
      .split(/\s+/)
      .map((token) => token.trim())
      .filter(Boolean);
    const lowered = String(value).toLowerCase();
    const hasValue = tokens.some((token) => token.toLowerCase() === lowered);
    const nextTokens = hasValue ? tokens.filter((token) => token.toLowerCase() !== lowered) : [...tokens, value];
    setAmenityQuery(nextTokens.join(" "));
  }

  function switchEditorSearchMode(nextAiEnabled) {
    if (nextAiEnabled === showEditorAiPanel) return;
    if (editorModeTimerRef.current) {
      clearTimeout(editorModeTimerRef.current);
    }
    setEditorModeOpacity(0);
    editorModeTimerRef.current = setTimeout(() => {
      setShowEditorAiPanel(nextAiEnabled);
      setShowAdvancedSearchEditor(true);
      setEditorModeOpacity(1);
      editorModeTimerRef.current = null;
    }, 140);
  }

  function inferAmenitiesFromText(text) {
    const normalized = String(text || "").toLowerCase();
    const inferred = [];
    for (const option of editorAmenityOptions) {
      const normalizedValue = String(option.value).toLowerCase();
      const aliases = amenityAliasesByValue[normalizedValue] || [normalizedValue];
      if (aliases.some((alias) => normalized.includes(alias))) {
        inferred.push(option.value);
      }
    }
    return inferred;
  }

  async function submitEditorSearch(event) {
    event.preventDefault();
    const amenityTerms = amenityQuery.trim();

    if (showEditorAiPanel) {
      const prompt = editorAiPrompt.trim() || String(filters.query || "").trim();
      if (!prompt) {
        app.pushToast("Skriv en AI-prompt eller ett sökord först.", "info");
        return;
      }
      try {
        const aiResponse = await runAiSearch(prompt, filters);
        const nextFilters = aiResponse?.suggestedFilters || filters;
        const inferredAmenities = inferAmenitiesFromText(prompt);
        const currentAmenities = amenityTerms
          .split(/\s+/)
          .map((token) => token.trim())
          .filter(Boolean);
        const nextAmenityTerms = Array.from(new Set([...currentAmenities, ...inferredAmenities])).join(" ");
        if (nextAmenityTerms !== amenityTerms) {
          setAmenityQuery(nextAmenityTerms);
        }
        setFilters(nextFilters);
        await executeSearch(nextFilters, { aiPrompt: prompt, amenityQuery: nextAmenityTerms, furnishedFilter });
      } catch (_error) {
        app.pushToast("AI-sök kunde inte köras just nu.", "error");
      }
      return;
    }

    await executeSearch(filters, { amenityQuery: amenityTerms, furnishedFilter });
  }

  function openAuthPrompt(mode) {
    setAuthPromptMode(mode);
  }

  async function executeSearch(nextFilters = filters, options = {}) {
    await searchListings(nextFilters);
    setIsHydratingLandingSearch(false);
    setShowSearchEditor(false);
    setUseNewSearchCta(Boolean(options.markAsNewSearch));
    const amenityValue = typeof options.amenityQuery === "string" ? options.amenityQuery : amenityQuery;
    const furnishedValue = typeof options.furnishedFilter === "string" ? options.furnishedFilter : furnishedFilter;
    setAppliedSearchMeta({
      filters: nextFilters,
      amenityQuery: amenityValue,
      furnishedFilter: furnishedValue,
      aiPrompt: options.aiPrompt || ""
    });
  }

  async function handleAiSuggestedFilters(payload) {
    const nextFilters = payload?.suggestedFilters || filters;
    const aiPrompt = String(payload?.prompt || "").trim();
    setFilters(nextFilters);
    await executeSearch(nextFilters, { aiPrompt });
  }

  async function handleResetSearchResults() {
    const resetFilters = { ...app.defaultFilters };
    setFilters(resetFilters);
    setAmenityQuery("");
    setFurnishedFilter("all");
    await executeSearch(resetFilters, {
      amenityQuery: "",
      furnishedFilter: "all",
      aiPrompt: "",
      markAsNewSearch: true
    });
  }

  useEffect(() => {
    if (landingSearchAppliedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("run") !== "1") {
      setIsHydratingLandingSearch(false);
      return;
    }

    landingSearchAppliedRef.current = true;
    const queryFromUrl = String(params.get("query") || params.get("q") || "").trim();
    const districtFromUrl = String(params.get("district") || "").trim();
    const typeFromUrl = String(params.get("type") || "").trim();
    const minSizeFromUrl = String(params.get("minSize") || "").trim();
    const teamSizeFromUrl = String(params.get("teamSize") || "").trim();
    const maxBudgetFromUrl = String(params.get("maxBudget") || "").trim();
    const maxSizeFromUrl = String(params.get("maxSize") || "").trim();
    const amenityFromUrl = String(params.get("amenity") || "").trim();
    const furnishedFromUrl = String(params.get("furnished") || "").trim();
    const aiEnabledFromUrl = params.get("ai") === "1";
    const aiPromptFromUrl = String(params.get("aiPrompt") || "").trim();
    const nextFilters = {
      ...filters,
      query: queryFromUrl,
      district: districtFromUrl || filters.district,
      type: typeFromUrl ? [typeFromUrl] : filters.type,
      minSize: minSizeFromUrl || filters.minSize,
      maxSize: maxSizeFromUrl || filters.maxSize,
      teamSize: teamSizeFromUrl || filters.teamSize,
      maxBudget: maxBudgetFromUrl || filters.maxBudget
    };
    if (amenityFromUrl) setAmenityQuery(amenityFromUrl);
    if (furnishedFromUrl === "yes" || furnishedFromUrl === "no") setFurnishedFilter(furnishedFromUrl);

    async function bootstrapFromLandingSearch() {
      try {
        let filtersToApply = nextFilters;
        let aiPromptApplied = "";
        let nextAmenityQuery = amenityFromUrl;

        if (aiEnabledFromUrl && aiPromptFromUrl) {
          try {
            const aiResponse = await runAiSearch(aiPromptFromUrl, nextFilters);
            if (aiResponse?.suggestedFilters) {
              filtersToApply = aiResponse.suggestedFilters;
            }
            const inferredAmenities = inferAmenitiesFromText(aiPromptFromUrl);
            if (inferredAmenities.length > 0) {
              const explicitAmenities = nextAmenityQuery
                .split(/\s+/)
                .map((token) => token.trim())
                .filter(Boolean);
              nextAmenityQuery = Array.from(new Set([...explicitAmenities, ...inferredAmenities])).join(" ");
            }
            aiPromptApplied = aiPromptFromUrl;
          } catch (_error) {
            app.pushToast("AI-sök kunde inte tolkas. Visar resultat med dina vanliga filter.", "info");
          }
        }

        setAmenityQuery(nextAmenityQuery);
        setFilters(filtersToApply);
        await executeSearch(filtersToApply, {
          amenityQuery: nextAmenityQuery,
          furnishedFilter: furnishedFromUrl === "yes" || furnishedFromUrl === "no" ? furnishedFromUrl : furnishedFilter,
          aiPrompt: aiPromptApplied
        });
      } catch (_error) {
        setIsHydratingLandingSearch(false);
      }
    }

    void bootstrapFromLandingSearch();
  }, [filters]);

  const visibleListings = useMemo(() => {
    return sortedListings.filter((listing) => {
      const amenityText = Array.isArray(listing.amenities) ? listing.amenities.join(" ").toLowerCase() : "";
      const query = String(appliedSearchMeta.amenityQuery || "").toLowerCase().trim();
      if (query && !amenityText.includes(query)) {
        return false;
      }

      const furnishedSignal = /möbler|furnished|inredd/i.test(amenityText);
      if (appliedSearchMeta.furnishedFilter === "yes" && !furnishedSignal) {
        return false;
      }
      if (appliedSearchMeta.furnishedFilter === "no" && furnishedSignal) {
        return false;
      }

      return true;
    });
  }, [sortedListings, appliedSearchMeta]);

  const activeSearchChips = useMemo(() => {
    const chips = [];
    const activeFilters = appliedSearchMeta.filters || {};
    if (appliedSearchMeta.aiPrompt) chips.push(`AI: ${appliedSearchMeta.aiPrompt}`);
    if (activeFilters.query) chips.push(`Sökord: ${activeFilters.query}`);
    if (activeFilters.district && activeFilters.district !== "Alla") chips.push(`Område: ${activeFilters.district}`);
    if (Array.isArray(activeFilters.type) && activeFilters.type.length > 0) chips.push(`Typ: ${activeFilters.type.join(", ")}`);
    if (activeFilters.teamSize) chips.push(`Platser: ${activeFilters.teamSize}+`);
    if (activeFilters.minSize || activeFilters.maxSize) chips.push(`Yta: ${activeFilters.minSize || 0}-${activeFilters.maxSize || "∞"} kvm`);
    if (appliedSearchMeta.amenityQuery) chips.push(`Bekvämlighet: ${appliedSearchMeta.amenityQuery}`);
    if (appliedSearchMeta.furnishedFilter === "yes") chips.push("Möblerad");
    if (appliedSearchMeta.furnishedFilter === "no") chips.push("Ej möblerad");
    return chips;
  }, [appliedSearchMeta]);

  function handleToggleShortlist(listingId) {
    if (isGuest) {
      openAuthPrompt("save");
      return;
    }
    toggleFavorite(listingId);
  }

  function handleBookViewing(listing) {
    if (isGuest) {
      openAuthPrompt("book");
      return;
    }
    setBookingListing(listing);
  }

  function openListingDetail(listing) {
    if (!listing?.id) return;
    navigateTo(`/app/listings/${encodeURIComponent(listing.id)}`);
  }

  return (
    <section className="relative h-full overflow-y-auto p-4 sm:p-6">
      <div className="relative mx-auto w-full max-w-[1240px]">
        {isHydratingLandingSearch ? (
          <div className="grid min-h-[58vh] place-items-center">
            <div className="rounded-2xl border border-[#c8d1de] bg-white px-5 py-4 text-sm font-semibold text-ink-700">
              Laddar sökresultat...
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="px-1 py-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl font-semibold">Sökresultat</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-ink-700"
                    onClick={() => {
                      if (isGuest) {
                        openAuthPrompt("save");
                        return;
                      }
                      void saveCurrentFilters(filters);
                    }}
                  >
                    <SaveIcon className="h-3.5 w-3.5" />
                    Spara sökfilter
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-ink-700"
                    onClick={() => {
                      void handleResetSearchResults();
                    }}
                  >
                    <ResetIcon className="h-3.5 w-3.5" />
                    Nollställ
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-ink-700"
                    onClick={() => {
                      setShowSearchEditor((value) => {
                        const nextValue = !value;
                        if (nextValue) {
                          if (editorModeTimerRef.current) {
                            clearTimeout(editorModeTimerRef.current);
                            editorModeTimerRef.current = null;
                          }
                          setEditorModeOpacity(1);
                          setShowAdvancedSearchEditor(true);
                          setShowEditorAiPanel(false);
                          setAmenityQuery(appliedSearchMeta.amenityQuery || amenityQuery);
                          setFurnishedFilter(appliedSearchMeta.furnishedFilter || furnishedFilter);
                        }
                        return nextValue;
                      });
                    }}
                  >
                    {showSearchEditor ? "Stäng" : (useNewSearchCta ? "Ny sökning" : "Ändra sökning")}
                  </button>
                </div>
              </div>
              {activeSearchChips.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeSearchChips.map((chip) => <span key={chip} className="rounded-full border border-black/15 bg-[#f7f9fc] px-2.5 py-1 text-xs font-semibold text-ink-700">{chip}</span>)}
                </div>
              ) : null}
            </div>

            {showSearchEditor ? (
              <article className="mx-auto w-full rounded-3xl border border-black/10 bg-white p-5 text-ink-900 shadow-[0_20px_60px_rgba(15,25,48,0.12)] sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-ink-900 sm:text-2xl">Sök lokaler i hela Stockholm</h2>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-ink-700">
                    <SparklesIcon className="h-3.5 w-3.5 text-[#0f1930]" />
                    <span>AI-sök</span>
                    <PillToggle
                      checked={showEditorAiPanel}
                      onToggle={() => switchEditorSearchMode(!showEditorAiPanel)}
                      ariaLabel="AI-sök i ändra sökning"
                      className="h-6 w-10"
                    />
                  </div>
                </div>

                <form className="mt-6 space-y-6" onSubmit={submitEditorSearch}>
                  <div className="transition-opacity duration-200" style={{ opacity: editorModeOpacity }}>
                  {showEditorAiPanel ? (
                    <div className="space-y-4 rounded-2xl border border-black/10 bg-[#f8fafc] p-5">
                      <div className="inline-flex items-center gap-2">
                        <SparklesIcon className="h-3.5 w-3.5 text-[#0f1930]" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">AI-sök</span>
                      </div>
                      <p className="text-sm text-ink-700">Beskriv lokalen du söker med naturligt språk så föreslår AI filter och relevanta träffar.</p>
                      <textarea
                        value={editorAiPrompt}
                        onChange={(event) => setEditorAiPrompt(event.target.value)}
                        className={`${heroInputClass} min-h-28`}
                        placeholder="Exempel: Vi är 15 personer och söker möblerat kontor i Vasastan med mötesrum och budget under 90 000 kr."
                      />
                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="rounded-2xl border border-[#0f1930] bg-[#0f1930] px-5 py-3 text-sm font-semibold text-white hover:bg-[#16233f]"
                        >
                          Sök med AI
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.55fr)]">
                          <label>
                            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Sök</span>
                            <div className="relative">
                              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                              <input
                                value={filters.query}
                                onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
                                className={`${heroInputClass} pl-10`}
                                placeholder="Gata, adress eller fritext"
                              />
                            </div>
                          </label>
                          <label>
                            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Område</span>
                            <select
                              value={filters.district}
                              onChange={(event) => setFilters((prev) => ({ ...prev, district: event.target.value }))}
                              className={heroSelectClass}
                            >
                              <option value="Alla" className="text-black">Alla områden</option>
                              {districtOptions.map((district) => <option key={district} value={district} className="text-black">{district}</option>)}
                            </select>
                          </label>
                          <label>
                            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Typ</span>
                            <select
                              value={Array.isArray(filters.type) && filters.type.length > 0 ? filters.type[0] : "Alla"}
                              onChange={(event) => {
                                const nextType = event.target.value;
                                setFilters((prev) => ({ ...prev, type: nextType === "Alla" ? [] : [nextType] }));
                              }}
                              className={heroSelectClass}
                            >
                              <option value="Alla" className="text-black">Alla typer</option>
                              {listingTypes.map((type) => <option key={type} value={type} className="text-black">{type}</option>)}
                            </select>
                          </label>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-3 sm:items-start">
                          <label>
                            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Team</span>
                            <input
                              value={filters.teamSize}
                              onChange={(event) => setFilters((prev) => ({ ...prev, teamSize: event.target.value }))}
                              className={heroInputClass}
                              placeholder="Platser"
                              type="number"
                              min="1"
                            />
                          </label>
                          <label>
                            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Min yta</span>
                            <input value={filters.minSize} onChange={(event) => setFilters((prev) => ({ ...prev, minSize: event.target.value }))} className={heroInputClass} placeholder="Min kvm" type="number" min="0" />
                          </label>
                          <label>
                            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Max yta</span>
                            <input value={filters.maxSize} onChange={(event) => setFilters((prev) => ({ ...prev, maxSize: event.target.value }))} className={heroInputClass} placeholder="Max kvm" type="number" min="0" />
                          </label>
                        </div>
                      </div>

                      <div
                        className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          showAdvancedSearchEditor ? "mt-5 opacity-100" : "mt-0 opacity-0"
                        }`}
                        style={{ gridTemplateRows: showAdvancedSearchEditor ? "1fr" : "0fr" }}
                      >
                        <div className="min-h-0 space-y-5">
                          <div className="grid gap-5 sm:grid-cols-3 sm:items-start">
                            <div>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Möblering</span>
                              <div className="inline-flex h-[48px] w-full items-center gap-1 rounded-2xl border border-black/15 bg-[#f1f4f8] p-1">
                                {furnishedOptions.map((option) => {
                                  const active = furnishedFilter === option.value;
                                  return (
                                    <button
                                      key={option.value}
                                      type="button"
                                      className={`inline-flex min-w-0 flex-1 items-center justify-center rounded-xl p-2 text-xs font-semibold leading-none transition ${
                                        active ? "bg-[#0f1930] text-white shadow-[0_1px_2px_rgba(15,25,48,0.22)]" : "text-ink-700 hover:bg-white"
                                      }`}
                                      onClick={() => setFurnishedFilter(option.value)}
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <label>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Budget min / månad</span>
                              <input
                                value={String(filters.minBudget ?? "")}
                                onChange={(event) => setFilters((prev) => ({ ...prev, minBudget: event.target.value }))}
                                className={`${heroInputClass} h-[48px] py-0`}
                                placeholder="Min (ex. 25 000)"
                                type="number"
                                min="0"
                              />
                            </label>
                            <label>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Budget max / månad</span>
                              <input
                                value={String(filters.maxBudget ?? "").trim() === "250000" ? "" : filters.maxBudget}
                                onChange={(event) => setFilters((prev) => ({ ...prev, maxBudget: event.target.value }))}
                                className={`${heroInputClass} h-[48px] py-0`}
                                placeholder="Max (ex. 250000)"
                                type="number"
                                min="0"
                              />
                            </label>
                          </div>

                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-700">Bekvämligheter</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {editorAmenityOptions.map((option) => {
                                const Icon = option.icon;
                                const active = isAmenitySelected(option.value);
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                                      active ? "border-[#0f1930] bg-[#0f1930] text-white" : "border-black/15 bg-white text-ink-700 hover:bg-[#eef3fa]"
                                    }`}
                                    onClick={() => toggleAmenity(option.value)}
                                  >
                                    <Icon className="h-3.5 w-3.5" />
                                    {option.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-ink-700 hover:bg-[#eef3fa]"
                          onClick={() => setShowSearchEditor(false)}
                        >
                          Avbryt
                        </button>
                        <button type="submit" className="rounded-2xl border border-[#0f1930] bg-[#0f1930] px-5 py-3 text-sm font-semibold text-white hover:bg-[#16233f]">
                          Uppdatera sökning
                        </button>
                      </div>
                    </>
                  )}
                  </div>
                </form>
              </article>
            ) : null}

            <div className="space-y-4">
              {showMap ? (
                <div className="space-y-2">
                  <GoogleListingsMap listings={visibleListings} onMarkerClick={openListingDetail} dense />
                  <p className="inline-flex items-center gap-1.5 text-xs text-ink-600"><MapIcon className="h-3.5 w-3.5" />Google Maps visas med enkla markörer. Klicka på en markör för att öppna objektet.</p>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-ink-700">
                  <BuildingIcon className="h-3.5 w-3.5 text-ink-600" />
                  {visibleListings.length} träffar
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-ink-700">
                    <span>Karta</span>
                    <PillToggle checked={showMap} onToggle={() => setShowMap((value) => !value)} ariaLabel="Karta" className="h-6 w-10" />
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2">
                    <label className="text-xs font-semibold text-ink-700">Sortera</label>
                    <select className="rounded-xl border border-black/15 bg-white px-2 py-1 text-xs font-semibold" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                      <option value="relevance">Relevans</option>
                      <option value="price_asc">Hyra: lägst först</option>
                      <option value="price_desc">Hyra: högst först</option>
                      <option value="size_asc">Yta: minst först</option>
                      <option value="size_desc">Yta: störst först</option>
                    </select>
                  </div>
                </div>
              </div>

              {visibleListings.length === 0 ? (
                <div className="rounded-3xl border border-black/10 bg-white p-10 text-center text-sm text-ink-500">Inga objekt matchar din sökning just nu.</div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleListings.map((listing) => (
                    <ListingVisualCard
                      key={listing.id}
                      listing={listing}
                      shortlisted={favoriteIds.has(listing.id)}
                      onOpenListing={openListingDetail}
                      onBookViewing={handleBookViewing}
                      onToggleShortlist={handleToggleShortlist}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ViewingRequestModal
        listing={bookingListing}
        onClose={() => setBookingListing(null)}
        onSubmit={async (payload) => {
          await requestViewing(payload);
          setBookingListing(null);
        }}
      />

      <AuthPromptModal mode={authPromptMode} onClose={() => setAuthPromptMode("")} onRequireAuth={onRequireAuth} />
    </section>
  );
}

export default RentPage;
