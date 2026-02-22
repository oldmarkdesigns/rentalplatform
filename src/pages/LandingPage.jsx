import { useEffect, useMemo, useRef, useState } from "react";
import { navigateTo } from "../lib/router";
import MarketingNavLinks from "../components/layout/MarketingNavLinks";
import FurnishingToggle from "../components/app/FurnishingToggle";
import ListingVisualCard from "../components/app/ListingVisualCard";
import {
  BalconyIcon,
  ArrowUpIcon,
  BikeIcon,
  BuildingIcon,
  CalendarIcon,
  CarIcon,
  CoinsIcon,
  DumbbellIcon,
  HistoryIcon,
  LockerIcon,
  LoungeIcon,
  MouseScrollIcon,
  PenthouseIcon,
  PinIcon,
  RooftopIcon,
  SearchIcon,
  ShieldIcon,
  SnowflakeIcon,
  SparklesIcon,
  StarIcon,
  UserIcon,
  UtensilsIcon,
  WifiIcon
} from "../components/icons/UiIcons";
import { districtOptions, listingTypes } from "../data/mockData";
import heroImage from "../../Assets/Hero Images/stockholm-landing.jpg";
import featureImageA from "../../Assets/Object Images/Inspiration.jpeg";
import featureImageB from "../../Assets/Object Images/_ (1).jpeg";
import processImage from "../../Assets/Object Images/_ (2).jpeg";
import faqImage from "../../Assets/Object Images/_ (3).jpeg";

const processSteps = [
  {
    title: "Skapa konto och välj roll",
    body: "Starta som hyresgäst, annonsör eller båda roller i samma konto.",
    icon: UserIcon
  },
  {
    title: "Sök eller publicera",
    body: "Använd filter och AI-sök, eller publicera nya objekt steg för steg.",
    icon: SearchIcon
  },
  {
    title: "Boka och följ upp",
    body: "Visningsförfrågan, intressestatus och snabb dialog samlas i en vy.",
    icon: CalendarIcon
  }
];

const faqItems = [
  {
    q: "Kan jag publicera gratis?",
    a: "Ja, just nu är gratis publicering aktiv med obegränsat antal annonser."
  },
  {
    q: "Kan samma konto vara både hyresgäst och annonsör?",
    a: "Ja. Du kan växla roll direkt i plattformen utan att skapa nytt konto."
  },
  {
    q: "Hur snabbt får jag in intresse?",
    a: "Det beror på objekt, pris och efterfrågan, men flödet är byggt för snabb kontakt."
  },
  {
    q: "Finns AI-sök för hyresgäster?",
    a: "Ja, AI-sök hjälper dig hitta relevanta objekt snabbare och justerar filter automatiskt."
  }
];

const popularGroups = [
  {
    city: "Stockholm",
    count: "2 745",
    listings: [
      {
        id: "popular-1",
        title: "Fregattvägen 8",
        district: "Gröndal",
        address: "Fregattvägen 8",
        type: "Kontor",
        priceMonthly: 92000,
        sizeSqm: 159,
        capacity: 18,
        responseHours: 7,
        score: 91,
        verified: true,
        tags: ["Industrier & verkstäder", "Lager & logistik", "Kontor"],
        image: "/object-images/object-1.jpeg"
      },
      {
        id: "popular-2",
        title: "Tomtebogatan 30",
        district: "Vasastan",
        address: "Tomtebogatan 30",
        type: "Kontor",
        priceMonthly: 76000,
        sizeSqm: 90,
        capacity: 10,
        responseHours: 9,
        score: 88,
        verified: false,
        tags: ["Butiker", "Kontor"],
        image: "/object-images/object-2.jpeg"
      },
      {
        id: "popular-3",
        title: "Ringvägen 129",
        district: "Södermalm",
        address: "Ringvägen 129",
        type: "Butik",
        priceMonthly: 68500,
        sizeSqm: 75,
        capacity: 8,
        responseHours: 11,
        score: 84,
        verified: true,
        tags: ["Restauranger & caféer"],
        image: "/object-images/object-3.jpeg"
      },
      {
        id: "popular-4",
        title: "Riddargatan 28",
        district: "Östermalm",
        address: "Riddargatan 28",
        type: "Kontor",
        priceMonthly: 70500,
        sizeSqm: 79,
        capacity: 9,
        responseHours: 8,
        score: 86,
        verified: false,
        tags: ["Butiker", "Kontor"],
        image: "/object-images/object-4.jpeg"
      },
      {
        id: "popular-5",
        title: "Sankt Eriksgatan 44",
        district: "Kungsholmen",
        address: "Sankt Eriksgatan 44",
        type: "Kontor",
        priceMonthly: 81200,
        sizeSqm: 102,
        capacity: 12,
        responseHours: 6,
        score: 89,
        verified: true,
        tags: ["Kontor", "Coworking"],
        image: "/object-images/object-5.jpeg"
      },
      {
        id: "popular-6",
        title: "Götgatan 67",
        district: "Södermalm",
        address: "Götgatan 67",
        type: "Kontor",
        priceMonthly: 73400,
        sizeSqm: 88,
        capacity: 10,
        responseHours: 8,
        score: 87,
        verified: false,
        tags: ["Kontor", "Studio"],
        image: "/object-images/object-6.jpeg"
      }
    ]
  }
];

const guideCards = [
  {
    title: "Jämför olika lokaler",
    body: "Var förberedd när ni utvärderar alternativ och besöker objekt. Här är våra bästa tips inför valet av ny lokal.",
    image: "/object-images/object-9.jpeg"
  },
  {
    title: "Vilket läge behöver verksamheten?",
    body: "Vilka lägen är mest relevanta för din verksamhet? Vi listar fem viktiga faktorer innan ni skriver avtal.",
    image: "/object-images/object-10.jpeg"
  },
  {
    title: "Hyreskontraktet",
    body: "Nu är det dags att skriva kontrakt. Vad bör ni tänka på och när är det läge att ta extern hjälp?",
    image: "/object-images/object-6.jpeg"
  }
];

const heroAmenityOptions = [
  { value: "Cykelförråd", label: "Cykelförråd", icon: BikeIcon },
  { value: "Garage", label: "Garage", icon: CarIcon },
  { value: "Kök", label: "Kök", icon: UtensilsIcon },
  { value: "Mötesrum", label: "Mötesrum", icon: BuildingIcon },
  { value: "Fiber", label: "Fiber", icon: WifiIcon },
  { value: "Reception", label: "Reception", icon: UserIcon },
  { value: "Balkong", label: "Balkong", icon: BalconyIcon },
  { value: "Takterrass", label: "Takterrass", icon: RooftopIcon },
  { value: "Takvåning", label: "Takvåning", icon: PenthouseIcon },
  { value: "Gym", label: "Gym", icon: DumbbellIcon },
  { value: "Omklädningsrum", label: "Omklädningsrum", icon: LockerIcon },
  { value: "Air condition", label: "Air condition", icon: SnowflakeIcon },
  { value: "Lounge", label: "Lounge", icon: LoungeIcon },
  { value: "Förråd", label: "Förråd", icon: LockerIcon },
  { value: "Lastzon", label: "Lastzon", icon: CarIcon },
  { value: "Telefonbås", label: "Telefonbås", icon: BuildingIcon },
  { value: "Väntrum", label: "Väntrum", icon: UserIcon },
  { value: "Pentry", label: "Pentry", icon: UtensilsIcon },
  { value: "Skyltfönster", label: "Skyltfönster", icon: BuildingIcon },
  { value: "Säkerhetsdörr", label: "Säkerhetsdörr", icon: ShieldIcon }
];

const furnishedOptions = [
  { value: "all", label: "Alla" },
  { value: "yes", label: "Möblerad" },
  { value: "no", label: "Omöblerad" }
];

const transitDistanceOptions = ["Alla", "0-3 min", "3-7 min", "7-12 min", "12+ min"];
const contractFlexOptions = ["Alla", "Korttid", "Långtid", "Flexibelt avtal", "Break option"];
const accessHoursOptions = ["Alla", "24/7", "Kontorstid", "Kväll/helg"];
const parkingTypeOptions = ["Alla", "Ingen parkering", "Garage", "Gatuparkering", "Laddplatser"];
const layoutTypeOptions = ["Alla", "Öppet landskap", "Cellkontor", "Hybrid", "Showroom"];
const advertiserOptions = ["Alla", "AMF Fastigheter", "Vasakronan", "Castellum", "Fabege", "Skandia Fastigheter"];

const heroInputClass = "w-full rounded-2xl border border-black/15 bg-[#f7f9fc] px-3 py-3 text-sm text-ink-900 placeholder:text-ink-500 focus:border-[#0f1930] focus:outline-none";
const heroSelectClass = "select-chevron w-full rounded-2xl border border-black/15 bg-[#f7f9fc] px-3 py-3 pr-10 text-sm text-ink-900 focus:border-[#0f1930] focus:outline-none";

function HeroPillToggle({ checked, onToggle, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      className={`relative inline-flex h-6 w-10 min-h-0 items-center rounded-full p-0.5 transition-colors ${
        checked ? "justify-end bg-[#0f1930]" : "justify-start bg-[#a8adb3]"
      }`}
      onClick={onToggle}
    >
      <span aria-hidden="true" className="h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(15,25,48,0.35)]" />
    </button>
  );
}

function LandingPage({ user, onOpenAuthOverlay, onLogout }) {
  const headerRef = useRef(null);
  const processLeftRef = useRef(null);
  const processCardRef = useRef(null);
  const faqQuestionsRef = useRef(null);
  const faqCardRef = useRef(null);
  const [showAdvancedHeroFilters, setShowAdvancedHeroFilters] = useState(false);
  const [heroAiEnabled, setHeroAiEnabled] = useState(false);
  const [heroModeOpacity, setHeroModeOpacity] = useState(1);
  const [heroAiPrompt, setHeroAiPrompt] = useState("");
  const [showHeroAiInfo, setShowHeroAiInfo] = useState(false);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroModeTimerRef = useRef(null);
  const menuRef = useRef(null);
  const [heroFilters, setHeroFilters] = useState({
    query: "",
    district: "Alla",
    type: "Alla",
    minSize: "",
    maxSize: "",
    teamSize: "",
    transitDistance: "",
    moveInDate: "",
    contractFlex: "",
    accessHours: "",
    parkingType: "",
    layoutType: "",
    advertiser: "Alla",
    includeOperatingCosts: false,
    accessibilityAdapted: false,
    ecoCertified: false,
    minBudget: "",
    maxBudget: "",
    keyword: "",
    amenities: [],
    furnished: "all"
  });

  const openAuth = (mode, preferredRole = "renter") => {
    onOpenAuthOverlay?.(mode, preferredRole);
  };

  const userInitials = useMemo(() => {
    const source = String(user?.name || "").trim();
    if (!source) return "AA";
    const words = source.split(" ").filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase();
  }, [user?.name]);
  const activeRole = user?.role === "publisher" ? "publisher" : "renter";
  const rawRoles = Array.isArray(user?.roles) ? user.roles : [activeRole];
  const roleSet = new Set(rawRoles.filter((item) => item === "renter" || item === "publisher"));

  useEffect(() => {
    return () => {
      if (heroModeTimerRef.current) {
        clearTimeout(heroModeTimerRef.current);
      }
    };
  }, []);

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
    if (typeof window === "undefined") return undefined;

    const syncSectionCardHeights = () => {
      const isDesktop = window.innerWidth >= 1024;

      if (processCardRef.current) {
        if (isDesktop && processLeftRef.current) {
          processCardRef.current.style.height = `${processLeftRef.current.offsetHeight}px`;
        } else {
          processCardRef.current.style.height = "";
        }
      }

      if (faqCardRef.current) {
        if (isDesktop && faqQuestionsRef.current) {
          faqCardRef.current.style.height = `${faqQuestionsRef.current.offsetHeight}px`;
        } else {
          faqCardRef.current.style.height = "";
        }
      }
    };

    syncSectionCardHeights();

    const resizeObserver = new ResizeObserver(() => {
      syncSectionCardHeights();
    });

    if (processLeftRef.current) resizeObserver.observe(processLeftRef.current);
    if (faqQuestionsRef.current) resizeObserver.observe(faqQuestionsRef.current);

    window.addEventListener("resize", syncSectionCardHeights);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncSectionCardHeights);
    };
  }, []);

  function scrollToHashSection(hash, smooth = true) {
    if (!hash?.startsWith("#")) return false;
    const section = document.querySelector(hash);
    if (!section) return false;
    const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 72;
    const borderSectionAdjustment = hash === "#sa-fungerar-det" || hash === "#faq" ? 1 : 0;
    const topOffset = Math.ceil(headerHeight) - borderSectionAdjustment;
    const top = section.getBoundingClientRect().top + window.scrollY - topOffset;
    window.scrollTo({ top: Math.max(top, 0), behavior: smooth ? "smooth" : "auto" });
    return true;
  }

  function handleSectionLinkClick(event, href) {
    if (!href?.startsWith("#")) return;
    event.preventDefault();
    if (window.location.hash !== href) {
      window.history.replaceState(null, "", href);
    }
    scrollToHashSection(href, true);
  }

  function handleHomeBrandClick() {
    if (window.location.pathname === "/") {
      if (window.location.hash) {
        window.history.replaceState(null, "", "/");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigateTo("/");
  }

  function handleScrollToTop() {
    if (window.location.hash) {
      window.history.replaceState(null, "", "/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if (window.location.hash) {
      requestAnimationFrame(() => {
        scrollToHashSection(window.location.hash, false);
      });
    }

    const onHashChange = () => {
      scrollToHashSection(window.location.hash, true);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollToTopButton(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function switchHeroSearchMode(nextAiEnabled) {
    if (nextAiEnabled === heroAiEnabled) return;
    if (heroModeTimerRef.current) {
      clearTimeout(heroModeTimerRef.current);
    }
    setHeroModeOpacity(0);
    heroModeTimerRef.current = setTimeout(() => {
      setHeroAiEnabled(nextAiEnabled);
      setShowAdvancedHeroFilters(false);
      setHeroModeOpacity(1);
      heroModeTimerRef.current = null;
    }, 140);
  }

  function toggleHeroAmenity(value) {
    setHeroFilters((prev) => {
      const hasAmenity = prev.amenities.includes(value);
      return {
        ...prev,
        amenities: hasAmenity ? prev.amenities.filter((item) => item !== value) : [...prev.amenities, value]
      };
    });
  }

  function submitHeroSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    const amenityTerms = [...heroFilters.amenities].filter(Boolean).join(" ");
    const aiPromptCandidate = heroAiPrompt.trim() || heroFilters.query.trim();

    params.set("run", "1");
    if (heroFilters.query.trim()) params.set("query", heroFilters.query.trim());
    if (heroFilters.district !== "Alla") params.set("district", heroFilters.district);
    if (heroFilters.type !== "Alla") params.set("type", heroFilters.type);
    if (heroFilters.minSize.trim()) params.set("minSize", heroFilters.minSize.trim());
    if (heroFilters.maxSize.trim()) params.set("maxSize", heroFilters.maxSize.trim());
    if (heroFilters.teamSize.trim()) params.set("teamSize", heroFilters.teamSize.trim());
    if (heroFilters.minBudget.trim()) params.set("minBudget", heroFilters.minBudget.trim());
    if (heroFilters.maxBudget.trim()) params.set("maxBudget", heroFilters.maxBudget.trim());
    if (heroFilters.transitDistance) params.set("transitDistance", heroFilters.transitDistance);
    if (heroFilters.moveInDate) params.set("moveInDate", heroFilters.moveInDate);
    if (heroFilters.contractFlex) params.set("contractFlex", heroFilters.contractFlex);
    if (heroFilters.accessHours) params.set("accessHours", heroFilters.accessHours);
    if (heroFilters.parkingType) params.set("parkingType", heroFilters.parkingType);
    if (heroFilters.layoutType) params.set("layoutType", heroFilters.layoutType);
    if (heroFilters.advertiser && heroFilters.advertiser !== "Alla") params.set("advertiser", heroFilters.advertiser);
    if (heroFilters.includeOperatingCosts) params.set("includeOperatingCosts", "1");
    if (heroFilters.accessibilityAdapted) params.set("accessibilityAdapted", "1");
    if (heroFilters.ecoCertified) params.set("ecoCertified", "1");
    if (amenityTerms) params.set("amenity", amenityTerms);
    if (heroFilters.furnished !== "all") params.set("furnished", heroFilters.furnished);
    if (heroAiEnabled && aiPromptCandidate) {
      params.set("ai", "1");
      params.set("aiPrompt", aiPromptCandidate);
    }
    navigateTo(`/app/rent?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <header ref={headerRef} className="navbar-enter sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-3 sm:px-6">
          <button type="button" className="justify-self-start text-left" onClick={handleHomeBrandClick}>
            <span className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-2.5 py-1.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-black/30 bg-[#f8fafc] text-[9px] font-semibold uppercase tracking-wide text-ink-500">
                LOGGA
              </span>
              <span className="text-sm font-semibold text-ink-800">Företagsnamn</span>
            </span>
          </button>

          <nav className="hidden items-center justify-self-center gap-5 lg:flex">
            <MarketingNavLinks
              onSectionLinkClick={handleSectionLinkClick}
              onPublish={() => (user ? navigateTo("/app/publish") : openAuth("signup", "publisher"))}
            />
          </nav>

          <div className="flex items-center justify-self-end gap-2">
            {user ? (
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/20 bg-white text-sm font-semibold text-ink-700"
                  onClick={() => setMenuOpen((value) => !value)}
                  aria-label="Öppna profilmeny"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  title="Profil"
                >
                  {userInitials}
                </button>
                {menuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-72 rounded-2xl border border-black/10 bg-white p-3">
                    <div className="rounded-xl border border-black/10 bg-[#f8fafc] px-3 py-2">
                      <p className="text-sm font-semibold text-black">{user?.name || "Användare"}</p>
                      <p className="text-xs text-ink-600">{user?.email || "-"}</p>
                      <p className="mt-1 text-xs text-ink-500">Roll: {user?.role === "publisher" ? "Annonsör" : "Hyresgäst"}</p>
                    </div>
                    <div className="mt-2 grid gap-2 text-sm">
                      <button
                        type="button"
                        className="rounded-xl border border-black/15 bg-white px-3 py-2 text-left font-semibold text-ink-700"
                        onClick={() => {
                          setMenuOpen(false);
                          navigateTo("/app/profile");
                        }}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <UserIcon className="h-4 w-4" />
                          Kontoinformation
                        </span>
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-black/15 bg-white px-3 py-2 text-left font-semibold text-ink-700"
                        onClick={() => {
                          setMenuOpen(false);
                          navigateTo("/app/profile#search-history");
                        }}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <StarIcon className="h-4 w-4" />
                          Sökhistorik
                        </span>
                      </button>
                      {activeRole === "renter" ? (
                        <>
                          <button
                            type="button"
                            className="rounded-xl border border-black/15 bg-white px-3 py-2 text-left font-semibold text-ink-700"
                            onClick={() => {
                              setMenuOpen(false);
                              navigateTo("/app/rent");
                            }}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <SearchIcon className="h-4 w-4" />
                              Sök lokaler
                            </span>
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-black/15 bg-white px-3 py-2 text-left font-semibold text-ink-700"
                            onClick={() => {
                              setMenuOpen(false);
                              navigateTo("/app/favorites");
                            }}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <StarIcon className="h-4 w-4" />
                              Favoriter
                            </span>
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-black/15 bg-white px-3 py-2 text-left font-semibold text-ink-700"
                            onClick={() => {
                              setMenuOpen(false);
                              navigateTo("/app/viewings");
                            }}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarIcon className="h-4 w-4" />
                              Visningar
                            </span>
                          </button>
                        </>
                      ) : null}
                      {roleSet.has("publisher") ? (
                        <button
                          type="button"
                          className="rounded-xl border border-black/15 bg-white px-3 py-2 text-left font-semibold text-ink-700"
                          onClick={() => {
                            setMenuOpen(false);
                            navigateTo("/app/my-listings");
                          }}
                        >
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
                          setMenuOpen(false);
                          await onLogout?.();
                          navigateTo("/", { replace: true });
                        }}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <HistoryIcon className="h-4 w-4" />
                          Logga ut
                        </span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-[#f7f9fc]"
                  onClick={() => openAuth("login")}
                >
                  Logga in
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-[#0f1930] bg-[#0f1930] px-3 py-2 text-xs font-semibold text-white hover:bg-[#16233f]"
                  onClick={() => openAuth("signup", "renter")}
                >
                  Skapa konto
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <img
          src={heroImage}
          alt="Stockholm kontorsmarknad"
          className={`w-full object-cover will-change-[height,min-height,max-height,transform] transition-[height,min-height,max-height,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            showAdvancedHeroFilters
              ? "h-[95vh] min-h-[730px] max-h-[1040px] scale-[1.02] md:h-[94vh] md:min-h-[710px] md:max-h-[1000px] lg:h-[92vh] lg:min-h-[670px] lg:max-h-[960px]"
              : "h-[72vh] min-h-[600px] max-h-[820px] scale-100 md:h-[68vh] md:min-h-[560px] md:max-h-[760px] lg:h-[60vh] lg:min-h-[520px] lg:max-h-[700px]"
          }`}
        />
        <div className="absolute inset-0 z-20">
          <div className={`mx-auto flex h-full w-full max-w-[86rem] items-center justify-center px-4 transition-[padding] duration-500 ease-out sm:px-6 ${showAdvancedHeroFilters ? "py-4" : "py-6"}`}>
            <div className={`mx-auto flex h-full w-full items-center ${showAdvancedHeroFilters ? "max-w-[86rem]" : "max-w-4xl"}`}>
              <article className="w-full max-h-full overflow-y-auto rounded-3xl border border-black/10 bg-white p-5 text-ink-900 transition-all duration-500 ease-out sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-ink-900 sm:text-2xl">Sök lokaler i hela Stockholm</h2>
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-ink-700">
                    <span className="inline-flex items-center gap-1">
                      <SparklesIcon className="h-3.5 w-3.5 text-[#0f1930]" />
                      <span>AI-sök</span>
                    </span>
                    <HeroPillToggle
                      checked={heroAiEnabled}
                      onToggle={() => switchHeroSearchMode(!heroAiEnabled)}
                      ariaLabel="AI-sök"
                    />
                  </div>
                </div>

                <form className="mt-6 space-y-6" onSubmit={submitHeroSearch}>
                  <div className="transition-opacity duration-200" style={{ opacity: heroModeOpacity }}>
                    {heroAiEnabled ? (
                      <div className="space-y-4 rounded-2xl border border-black/10 p-5">
                        <div className="inline-flex items-center gap-2">
                          <SparklesIcon className="h-3.5 w-3.5 text-[#0f1930]" />
                          <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">AI-sök</span>
                        </div>
                        <p className="text-sm text-ink-700">
                          Beskriv lokalen du söker med naturligt språk så föreslår AI filter och relevanta träffar.
                        </p>
                        <textarea
                          value={heroAiPrompt}
                          onChange={(event) => setHeroAiPrompt(event.target.value)}
                          className={`${heroInputClass} min-h-28`}
                          placeholder="Exempel: Vi är 15 personer och söker möblerat kontor i Vasastan med mötesrum och budget under 90 000 kr."
                        />
                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-2xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-[#eef3fa]"
                            onClick={() => setShowHeroAiInfo(true)}
                          >
                            Hur fungerar AI-sök?
                          </button>
                          <button
                            type="submit"
                            className="rounded-2xl border border-[#0f1930] bg-[#0f1930] px-5 py-3 text-sm font-semibold text-white hover:bg-[#16233f] disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={!heroAiPrompt.trim() && !heroFilters.query.trim()}
                          >
                            Sök med AI
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                      {showAdvancedHeroFilters ? (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-6">
                          <label className="sm:col-span-2 xl:col-span-3">
                            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Sök</span>
                            <div className="relative">
                              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                              <input
                                value={heroFilters.query}
                                onChange={(event) => setHeroFilters((prev) => ({ ...prev, query: event.target.value }))}
                                className={`${heroInputClass} pl-10`}
                                placeholder="Gata, adress eller fritext"
                              />
                            </div>
                          </label>
                          <label className="xl:col-span-2">
                            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Område</span>
                            <select
                              value={heroFilters.district}
                              onChange={(event) => setHeroFilters((prev) => ({ ...prev, district: event.target.value }))}
                              className={heroSelectClass}
                            >
                              <option value="Alla" className="text-black">Alla områden</option>
                              {districtOptions.map((district) => <option key={district} value={district} className="text-black">{district}</option>)}
                            </select>
                          </label>
                          <label className="xl:col-span-1">
                            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Typ</span>
                            <select
                              value={heroFilters.type}
                              onChange={(event) => setHeroFilters((prev) => ({ ...prev, type: event.target.value }))}
                              className={heroSelectClass}
                            >
                              <option value="Alla" className="text-black">Alla typer</option>
                              {listingTypes.map((type) => <option key={type} value={type} className="text-black">{type}</option>)}
                            </select>
                          </label>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                              <label>
                                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Sök</span>
                                <div className="relative">
                                  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                                  <input
                                    value={heroFilters.query}
                                    onChange={(event) => setHeroFilters((prev) => ({ ...prev, query: event.target.value }))}
                                    className={`${heroInputClass} pl-10`}
                                    placeholder="Gata, adress eller fritext"
                                  />
                                </div>
                              </label>
                              <label>
                                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Område</span>
                                <select
                                  value={heroFilters.district}
                                  onChange={(event) => setHeroFilters((prev) => ({ ...prev, district: event.target.value }))}
                                  className={heroSelectClass}
                                >
                                  <option value="Alla" className="text-black">Alla områden</option>
                                  {districtOptions.map((district) => <option key={district} value={district} className="text-black">{district}</option>)}
                                </select>
                              </label>
                            </div>
                          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-start">
                            <label>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Typ</span>
                              <select
                                  value={heroFilters.type}
                                  onChange={(event) => setHeroFilters((prev) => ({ ...prev, type: event.target.value }))}
                                  className={heroSelectClass}
                                >
                                  <option value="Alla" className="text-black">Alla typer</option>
                                  {listingTypes.map((type) => <option key={type} value={type} className="text-black">{type}</option>)}
                                </select>
                            </label>
                            <label>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Team</span>
                              <input
                                value={heroFilters.teamSize}
                                onChange={(event) => setHeroFilters((prev) => ({ ...prev, teamSize: event.target.value }))}
                                className={heroInputClass}
                                placeholder="Platser"
                                type="number"
                                min="1"
                              />
                            </label>
                            <label>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Min yta</span>
                              <input
                                value={heroFilters.minSize}
                                onChange={(event) => setHeroFilters((prev) => ({ ...prev, minSize: event.target.value }))}
                                className={heroInputClass}
                                placeholder="Min kvm"
                                type="number"
                                min="0"
                              />
                            </label>
                              <button type="submit" className="rounded-2xl border border-[#0f1930] bg-[#0f1930] px-5 py-3 text-sm font-semibold text-white hover:bg-[#16233f] sm:self-end">
                                Sök lokal
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      <div
                        className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          showAdvancedHeroFilters ? "mt-1 opacity-100" : "opacity-0"
                        }`}
                        style={{ gridTemplateRows: showAdvancedHeroFilters ? "1fr" : "0fr" }}
                      >
                        <div className="min-h-0 space-y-5 pt-2.5">
                          <div className="grid gap-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)]">
                            <label>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Team</span>
                              <input
                                value={heroFilters.teamSize}
                                onChange={(event) => setHeroFilters((prev) => ({ ...prev, teamSize: event.target.value }))}
                                className={heroInputClass}
                                placeholder="Platser"
                                type="number"
                                min="1"
                              />
                            </label>
                            <label>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Min yta</span>
                              <input
                                value={heroFilters.minSize}
                                onChange={(event) => setHeroFilters((prev) => ({ ...prev, minSize: event.target.value }))}
                                className={heroInputClass}
                                placeholder="Min kvm"
                                type="number"
                                min="0"
                              />
                            </label>
                            <label>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Max yta</span>
                              <input
                                value={heroFilters.maxSize}
                                onChange={(event) => setHeroFilters((prev) => ({ ...prev, maxSize: event.target.value }))}
                                className={heroInputClass}
                                placeholder="Max kvm"
                                type="number"
                                min="0"
                              />
                            </label>
                            <label>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Inflyttning</span>
                              <input
                                value={heroFilters.moveInDate}
                                onChange={(event) => setHeroFilters((prev) => ({ ...prev, moveInDate: event.target.value }))}
                                className={`${heroInputClass} h-[48px] py-0`}
                                type="date"
                              />
                            </label>
                          </div>

                          <div className="grid gap-5 sm:grid-cols-[minmax(0,320px)_minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] sm:items-start">
                            <div className="w-full">
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Möblering</span>
                              <FurnishingToggle
                                options={furnishedOptions}
                                value={heroFilters.furnished}
                                onChange={(nextValue) => setHeroFilters((prev) => ({ ...prev, furnished: nextValue }))}
                              />
                            </div>

                            <div>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Budget / månad</span>
                              <div className="grid gap-5 sm:grid-cols-2">
                                <label>
                                  <input
                                    value={heroFilters.minBudget}
                                    onChange={(event) => setHeroFilters((prev) => ({ ...prev, minBudget: event.target.value }))}
                                    className={`${heroInputClass} h-[48px] py-0`}
                                    placeholder="Min (ex. 25 000)"
                                    type="number"
                                    min="0"
                                  />
                                </label>
                                <label>
                                  <input
                                    value={heroFilters.maxBudget}
                                    onChange={(event) => setHeroFilters((prev) => ({ ...prev, maxBudget: event.target.value }))}
                                    className={`${heroInputClass} h-[48px] py-0`}
                                    placeholder="Max (ex. 250 000)"
                                    type="number"
                                    min="0"
                                  />
                                </label>
                              </div>
                            </div>
                            <label>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Access</span>
                              <select
                                value={heroFilters.accessHours || "Alla"}
                                onChange={(event) => setHeroFilters((prev) => ({ ...prev, accessHours: event.target.value === "Alla" ? "" : event.target.value }))}
                                className={`${heroSelectClass} h-[48px] py-0`}
                              >
                                {accessHoursOptions.map((option) => <option key={option} value={option} className="text-black">{option}</option>)}
                              </select>
                            </label>
                            <label>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Annonsör</span>
                              <select
                                value={heroFilters.advertiser}
                                onChange={(event) => setHeroFilters((prev) => ({ ...prev, advertiser: event.target.value }))}
                                className={`${heroSelectClass} h-[48px] py-0`}
                              >
                                {advertiserOptions.map((option) => <option key={option} value={option} className="text-black">{option}</option>)}
                              </select>
                            </label>
                          </div>

                          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto_auto_auto] sm:items-end">
                            <label>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Kommunaltrafik</span>
                              <select
                                value={heroFilters.transitDistance || "Alla"}
                                onChange={(event) => setHeroFilters((prev) => ({ ...prev, transitDistance: event.target.value === "Alla" ? "" : event.target.value }))}
                                className={`${heroSelectClass} h-[48px] py-0`}
                              >
                                {transitDistanceOptions.map((option) => <option key={option} value={option} className="text-black">{option}</option>)}
                              </select>
                            </label>
                            <label>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Avtalsflex</span>
                              <select
                                value={heroFilters.contractFlex || "Alla"}
                                onChange={(event) => setHeroFilters((prev) => ({ ...prev, contractFlex: event.target.value === "Alla" ? "" : event.target.value }))}
                                className={`${heroSelectClass} h-[48px] py-0`}
                              >
                                {contractFlexOptions.map((option) => <option key={option} value={option} className="text-black">{option}</option>)}
                              </select>
                            </label>
                            <label>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Parkering</span>
                              <select
                                value={heroFilters.parkingType || "Alla"}
                                onChange={(event) => setHeroFilters((prev) => ({ ...prev, parkingType: event.target.value === "Alla" ? "" : event.target.value }))}
                                className={`${heroSelectClass} h-[48px] py-0`}
                              >
                                {parkingTypeOptions.map((option) => <option key={option} value={option} className="text-black">{option}</option>)}
                              </select>
                            </label>
                            <label>
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Planlösning</span>
                              <select
                                value={heroFilters.layoutType || "Alla"}
                                onChange={(event) => setHeroFilters((prev) => ({ ...prev, layoutType: event.target.value === "Alla" ? "" : event.target.value }))}
                                className={`${heroSelectClass} h-[48px] py-0`}
                              >
                                {layoutTypeOptions.map((option) => <option key={option} value={option} className="text-black">{option}</option>)}
                              </select>
                            </label>
                            <label className="inline-flex h-[48px] items-center gap-2 rounded-2xl border border-black/15 bg-[#f7f9fc] px-3 text-xs font-semibold text-ink-700">
                                <input
                                  type="checkbox"
                                  className="search-flag-checkbox"
                                  checked={heroFilters.includeOperatingCosts}
                                  onChange={(event) => setHeroFilters((prev) => ({ ...prev, includeOperatingCosts: event.target.checked }))}
                                />
                              Driftkostn. ingår
                            </label>
                            <label className="inline-flex h-[48px] items-center gap-2 rounded-2xl border border-black/15 bg-[#f7f9fc] px-3 text-xs font-semibold text-ink-700">
                                <input
                                  type="checkbox"
                                  className="search-flag-checkbox"
                                  checked={heroFilters.accessibilityAdapted}
                                  onChange={(event) => setHeroFilters((prev) => ({ ...prev, accessibilityAdapted: event.target.checked }))}
                                />
                              Tillgänglighetsanp.
                            </label>
                            <label className="inline-flex h-[48px] items-center gap-2 rounded-2xl border border-black/15 bg-[#f7f9fc] px-3 text-xs font-semibold text-ink-700">
                                <input
                                  type="checkbox"
                                  className="search-flag-checkbox"
                                  checked={heroFilters.ecoCertified}
                                  onChange={(event) => setHeroFilters((prev) => ({ ...prev, ecoCertified: event.target.checked }))}
                                />
                              Miljöcertifierad
                            </label>
                          </div>

                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-700">Bekvämligheter</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {heroAmenityOptions.map((option) => {
                                const Icon = option.icon;
                                const active = heroFilters.amenities.includes(option.value);
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                                      active
                                        ? "border-[#0f1930] bg-[#0f1930] text-white"
                                        : "border-black/15 bg-white text-ink-700 hover:bg-[#eef3fa]"
                                    }`}
                                    onClick={() => toggleHeroAmenity(option.value)}
                                  >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {option.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {!heroAiEnabled ? (
                    <div className={`mt-4 flex items-center ${showAdvancedHeroFilters ? "justify-between" : "justify-start"}`}>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-[#eef3fa]"
                        onClick={() => setShowAdvancedHeroFilters((value) => !value)}
                      >
                        <span>{showAdvancedHeroFilters ? "Visa färre filter" : "Visa alla filter"}</span>
                        <span aria-hidden="true" className="text-sm leading-none">
                          {showAdvancedHeroFilters ? "−" : "+"}
                        </span>
                      </button>
                      {showAdvancedHeroFilters ? (
                        <button type="submit" className="rounded-2xl border border-[#0f1930] bg-[#0f1930] px-5 py-3 text-sm font-semibold text-white hover:bg-[#16233f]">
                          Sök lokal
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                  </div>
                </form>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[86rem] px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Lokaler just nu</p>
            <h2 className="mt-2 text-3xl font-semibold">Populäraste lediga lokaler</h2>
          </div>
          <button
            type="button"
            className="rounded-xl border border-[#0f1930] bg-transparent px-4 py-2 text-xs font-semibold text-[#0f1930] hover:bg-[#eef3fa]"
            onClick={() => navigateTo("/app/rent")}
          >
            Se alla lediga lokaler
          </button>
        </div>

        <div className="space-y-6">
          {popularGroups.map((group) => (
            <article key={group.city} className="rounded-3xl border border-black/10 bg-white p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-semibold text-[#0f1930]">{group.city}</h3>
                <p className="rounded-full border border-black/10 bg-[#f8fafc] px-3 py-1 text-xs font-semibold text-ink-600">
                  {group.count} lediga lokaler
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.listings.map((listing) => (
                  <ListingVisualCard
                    key={listing.id}
                    listing={listing}
                    shortlisted={false}
                    onOpenListing={() => navigateTo("/app/rent")}
                    onToggleShortlist={() => {}}
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="funktioner" className="mx-auto w-full max-w-[86rem] scroll-mt-28 px-4 py-16 sm:px-6">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Funktioner</p>
          <h2 className="mt-2 text-3xl font-semibold">Allt som behövs för en fungerande lokalmarknadsplats</h2>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <article className="overflow-hidden rounded-3xl border border-black/10 bg-white">
            <div className="relative h-72">
              <img src={featureImageA} alt="Hyresgästfunktioner" className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                  <SearchIcon className="h-3.5 w-3.5" />
                  Hyresgäst
                </p>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <h3 className="text-3xl font-semibold">Sök, jämför och boka snabbare</h3>
              <p className="text-sm text-ink-600">
                Bygg en sökprofil med filter, AI och favoriter. Se relevanta objekt direkt i karta + kortvy och boka visning med få klick.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 p-2.5">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">
                    <span>AI-sök</span>
                    <SparklesIcon className="h-3.5 w-3.5" />
                  </p>
                  <p className="mt-1 text-sm text-ink-700">Förslag på objekt och smart filterjustering.</p>
                </div>
                <div className="rounded-2xl border border-black/10 p-2.5">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">
                    <span>Favoriter</span>
                    <StarIcon className="h-3.5 w-3.5" />
                  </p>
                  <p className="mt-1 text-sm text-ink-700">Spara objekt till dina favoriter.</p>
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-6">
            <article className="overflow-hidden rounded-3xl border border-black/10 bg-white">
              <div className="relative h-44">
                <img src={featureImageB} alt="Annonsörsfunktioner" className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
              </div>
              <div className="space-y-3 p-5">
                <p className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-[#f8fafc] px-3 py-1 text-xs font-semibold text-ink-700">
                  <BuildingIcon className="h-3.5 w-3.5" />
                  Annonsör
                </p>
                <h3 className="text-2xl font-semibold">Publicera med minimal friktion</h3>
                <p className="text-sm text-ink-600">
                  Stegvis publicering, tydlig intressevy och snabb uppföljning i samma arbetsyta.
                </p>
              </div>
            </article>

            <article className="rounded-3xl border border-black/10 bg-[#0f1930] p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/75">Vad gör skillnad</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="inline-flex items-start gap-2">
                  <CalendarIcon className="mt-0.5 h-4 w-4 text-white/80" />
                  Visningsförfrågan och intressestatus synkade i realtid
                </li>
                <li className="inline-flex items-start gap-2">
                  <CoinsIcon className="mt-0.5 h-4 w-4 text-white/80" />
                  Gratis för volym, synlighetslyft för extra exponering
                </li>
                <li className="inline-flex items-start gap-2">
                  <UserIcon className="mt-0.5 h-4 w-4 text-white/80" />
                  Rollväxling mellan hyresgäst och annonsör
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section id="sa-fungerar-det" className="relative overflow-hidden border-y border-black/10 bg-white">
        <div className="mx-auto w-full max-w-[86rem] px-4 py-16 sm:px-6">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Så fungerar det</p>
            <h2 className="mt-2 text-3xl font-semibold">Tre steg till en snabbare uthyrningsprocess</h2>
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_0.95fr]">
            <div ref={processLeftRef} className="self-start space-y-4">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={step.title} className="rounded-2xl border border-black/10 bg-white p-5">
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0f1930] text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Steg {index + 1}</p>
                        <p className="mt-1 text-xl font-semibold">{step.title}</p>
                        <p className="mt-1 text-sm text-ink-600">{step.body}</p>
                      </div>
                    </div>
                  </article>
                );
              })}

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  className="rounded-xl border border-black/20 bg-white px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-[#f7f9fc]"
                  onClick={() => navigateTo("/app/rent")}
                >
                  Jag vill hyra lokal
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-[#0f1930] bg-[#0f1930] px-3 py-2 text-xs font-semibold text-white hover:bg-[#16233f]"
                  onClick={() => openAuth("signup", "publisher")}
                >
                  Jag vill publicera lokal
                </button>
              </div>
            </div>

            <article ref={processCardRef} className="self-start flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white">
              <img src={processImage} alt="Processöversikt" className="min-h-0 w-full flex-1 object-cover" />
              <div className="space-y-2 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Resultat</p>
                <p className="text-2xl font-semibold">Kortare väg från intresse till affär</p>
                <p className="text-sm text-ink-600">Samlad process ger snabbare beslut och bättre uppföljning för båda parter.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="priser" className="mx-auto w-full max-w-[86rem] scroll-mt-28 px-4 py-16 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Priser</p>
            <h2 className="mt-2 text-3xl font-semibold">Bygg volym med Gratis, skala med synlighetslyft</h2>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            Lanseringsperiod: Gratis publicering aktiv
          </span>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="rounded-3xl border border-[#0f1930]/15 bg-gradient-to-br from-[#0f1930] via-[#132140] to-[#1b2f55] p-7 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/75">Gratis</p>
            <p className="mt-2 text-5xl font-semibold">0 kr</p>
            <p className="mt-2 text-white/85">Obegränsad publicering och alla grundfunktioner under lanseringsperioden.</p>
            <ul className="mt-5 space-y-2 text-sm text-white/90">
              <li className="inline-flex items-center gap-2">
                <StarIcon className="h-4 w-4 text-white/75" />
                Publicera obegränsat antal annonser
              </li>
              <li className="inline-flex items-center gap-2">
                <SearchIcon className="h-4 w-4 text-white/75" />
                Matchning mot hyresgäster i sökflödet
              </li>
              <li className="inline-flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-white/75" />
                Intresseanmälningar och visningsförfrågningar i en vy
              </li>
            </ul>
          </article>

          <div className="grid gap-6">
            <article className="rounded-3xl border border-black/10 bg-white p-6">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">
                <CoinsIcon className="h-3.5 w-3.5" />
                Synlighetslyft
              </p>
              <p className="mt-2 text-2xl font-semibold">Topplacering</p>
              <p className="mt-1 text-sm text-ink-600">Lyft utvalda annonser i listning och sökresultat för mer exponering.</p>
            </article>
            <article className="rounded-3xl border border-black/10 bg-white p-6">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">
                <CoinsIcon className="h-3.5 w-3.5" />
                Synlighetslyft
              </p>
              <p className="mt-2 text-2xl font-semibold">Förnya annons</p>
              <p className="mt-1 text-sm text-ink-600">Pusha upp annonsen igen för ny synlighet när tempot sjunker.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="relative my-4 overflow-hidden">
        <img src={heroImage} alt="Stockholm stadsvy" className="h-[430px] w-full object-cover sm:h-[500px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/72 to-white/28" />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full w-full max-w-[86rem] items-start justify-center px-4 pt-14 text-center sm:px-6">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold leading-tight text-[#12375a] sm:text-6xl">
                Över 55 000 unika besökare i veckan. Vill du annonsera här?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm text-[#12375a] sm:text-xl">
                Hos oss är det enkelt att till ett bra pris annonsera lokaler, fastigheter, företag eller mark.
                Vi erbjuder olika annonspaket beroende på dina behov.
              </p>
              <button
                type="button"
                className="mt-7 rounded-full border border-[#0f1930] bg-[#0f1930] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#16233f]"
                onClick={() => openAuth("signup", "publisher")}
              >
                Läs mer
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[86rem] px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Kunskapsbank</p>
            <h2 className="mt-2 text-3xl font-semibold">Guider och tips</h2>
          </div>
          <button type="button" className="rounded-xl border border-[#0f1930] bg-transparent px-4 py-2 text-xs font-semibold text-[#0f1930] hover:bg-[#eef3fa]">
            Se fler guider
          </button>
        </div>

        <article className="grid overflow-hidden rounded-3xl border border-black/10 bg-white lg:grid-cols-[1fr_1fr]">
          <img src="/object-images/object-5.jpeg" alt="Guide: välja rätt lokal" className="h-64 w-full object-cover lg:h-full" />
          <div className="flex items-center p-6 sm:p-8">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Utvald guide</p>
              <h3 className="mt-2 text-3xl font-semibold text-[#0f1930]">Välja rätt lokal</h3>
              <p className="mt-3 text-sm text-ink-700 sm:text-base">
                För dig som letar lokal till ditt företag finns mycket att tänka på. Vilka regler gäller?
                Vilka krav ska ställas på nya lokaler? Här får du stöd inför nästa steg i verksamhetens utveckling.
              </p>
            </div>
          </div>
        </article>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {guideCards.map((guide) => (
            <article key={guide.title} className="overflow-hidden rounded-3xl border border-black/10 bg-white">
              <img src={guide.image} alt={guide.title} className="h-48 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-semibold leading-tight text-[#0f1930]">{guide.title}</h3>
                <p className="mt-2 text-sm text-ink-700">{guide.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="border-t border-black/10 bg-white">
        <div className="mx-auto w-full max-w-[86rem] px-4 py-16 sm:px-6">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">FAQ</p>
            <h2 className="mt-2 text-3xl font-semibold">Vanliga frågor</h2>
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <article ref={faqCardRef} className="self-start flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white">
              <img src={faqImage} alt="FAQ och support" className="min-h-0 w-full flex-1 object-cover" />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Kundservice</p>
                <p className="mt-1 text-2xl font-semibold">Tydliga svar för snabbare beslut</p>
                <p className="mt-1 text-sm text-ink-600">Vanliga frågor samlade för att du ska komma igång utan friktion.</p>
              </div>
            </article>

            <div ref={faqQuestionsRef} className="self-start space-y-5">
              {faqItems.map((item) => (
                <article key={item.q} className="rounded-2xl border border-black/10 bg-white p-5">
                  <p className="text-xl font-semibold">{item.q}</p>
                  <p className="mt-2 text-sm text-ink-600">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <button
        type="button"
        aria-label="Scrolla till toppen"
        className={`fixed bottom-6 right-6 z-30 inline-flex min-h-0 flex-col items-center justify-center gap-0.5 rounded-full border border-black/20 bg-white/25 p-3 text-[#0f1930] shadow-[0_8px_24px_rgba(15,25,48,0.18)] backdrop-blur-md transition-all duration-250 ${
          showScrollToTopButton
            ? "translate-y-0 scale-100 opacity-100 pointer-events-auto"
            : "translate-y-2 scale-95 opacity-0 pointer-events-none"
        } hover:bg-white/35`}
        onClick={handleScrollToTop}
      >
        <ArrowUpIcon className="h-4 w-4" />
        <MouseScrollIcon className="h-4 w-4" />
      </button>

      {showHeroAiInfo ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]" onClick={() => setShowHeroAiInfo(false)}>
          <div className="relative w-full max-w-lg rounded-2xl border border-black/10 bg-white p-5 shadow-[0_24px_64px_rgba(15,25,48,0.28)]" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/15 text-lg font-semibold leading-none text-ink-700 hover:bg-[#f3f6fb]"
              onClick={() => setShowHeroAiInfo(false)}
              aria-label="Stäng"
            >
              ×
            </button>
            <h3 className="pr-10 text-lg font-semibold text-ink-900">Om AI-sök</h3>
            <p className="mt-2 text-sm text-ink-700">
              AI-sök tolkar din fritext och översätter den till filter, till exempel område, lokaltyp, teamstorlek,
              budget och bekvämligheter.
            </p>
            <p className="mt-2 text-sm text-ink-700">
              Ju mer konkret beskrivning du ger, desto bättre träffar får du. Exempel: <span className="font-semibold">"Kontor för 12 personer i Vasastan, möblerat, med mötesrum och budget under 90 000 kr."</span>
            </p>
          </div>
        </div>
      ) : null}

      <footer id="kontakt" className="scroll-mt-24 bg-white">
        <div className="mx-auto w-full max-w-[86rem] px-4 py-10 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.95fr_0.95fr_0.95fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-black/15 bg-white px-4 py-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-black/30 bg-[#f8fafc] text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                  LOGGA
                </span>
                <div>
                  <p className="text-sm font-semibold">Företagsnamn</p>
                  <p className="text-xs text-ink-600">Plats för företagslogga</p>
                </div>
              </div>
              <p className="max-w-sm text-sm text-ink-600">
                Lokalflöde Stockholm samlar hyresgäst och annonsör i ett gemensamt flöde för snabbare matchning, visningar och affärer.
              </p>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="rounded-xl border border-black/20 bg-white px-3 py-2 text-xs font-semibold text-ink-700" onClick={() => navigateTo("/app/rent")}>
                  Jag vill hyra lokal
                </button>
                <button type="button" className="rounded-xl border border-[#0f1930] bg-[#0f1930] px-3 py-2 text-xs font-semibold text-white hover:bg-[#16233f]" onClick={() => openAuth("signup", "publisher")}>
                  Jag vill publicera lokal
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Utforska</p>
              <div className="mt-3 grid gap-2">
                <a className="text-sm text-ink-600 hover:text-black" href="#funktioner" onClick={(event) => handleSectionLinkClick(event, "#funktioner")}>Funktioner</a>
                <a className="text-sm text-ink-600 hover:text-black" href="#sa-fungerar-det" onClick={(event) => handleSectionLinkClick(event, "#sa-fungerar-det")}>Så fungerar det</a>
                <a className="text-sm text-ink-600 hover:text-black" href="#priser" onClick={(event) => handleSectionLinkClick(event, "#priser")}>Priser</a>
                <a className="text-sm text-ink-600 hover:text-black" href="#faq" onClick={(event) => handleSectionLinkClick(event, "#faq")}>FAQ</a>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Konton & flöden</p>
              <div className="mt-3 grid gap-2">
                <a className="text-sm text-ink-600 hover:text-black" href="#" onClick={(event) => { event.preventDefault(); openAuth("login"); }}>Logga in</a>
                <a className="text-sm text-ink-600 hover:text-black" href="#" onClick={(event) => { event.preventDefault(); openAuth("signup", "renter"); }}>Skapa konto</a>
                <a className="text-sm text-ink-600 hover:text-black" href="#" onClick={(event) => { event.preventDefault(); navigateTo("/app/rent"); }}>Hyr lokal (gästläge)</a>
                <a className="text-sm text-ink-600 hover:text-black" href="#" onClick={(event) => { event.preventDefault(); openAuth("signup", "publisher"); }}>Publicera lokal</a>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Kundservice</p>
              <div className="mt-3 grid gap-2 text-sm text-ink-600">
                <p>support@foretag.se</p>
                <p>08-123 45 67</p>
                <p>Vardagar 08:00-17:00</p>
                <button type="button" className="text-left text-sm text-ink-600 hover:text-black" onClick={() => navigateTo("/forgot-password")}>
                  Glömt lösenord
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-4">
            <p className="text-xs text-ink-500">© {new Date().getFullYear()} Företagsnamn. Alla rättigheter förbehållna.</p>
            <div className="flex items-center gap-3 text-xs text-ink-500">
              <span>Integritet</span>
              <span>Villkor</span>
              <span>Cookie-inställningar</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;
