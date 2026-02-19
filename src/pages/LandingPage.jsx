import { useEffect, useRef, useState } from "react";
import { navigateTo } from "../lib/router";
import {
  BikeIcon,
  BuildingIcon,
  CalendarIcon,
  CarIcon,
  CoinsIcon,
  PinIcon,
  SearchIcon,
  SparklesIcon,
  StarIcon,
  UserIcon,
  UtensilsIcon,
  WifiIcon
} from "../components/icons/UiIcons";
import { districtOptions, listingTypes } from "../data/mockData";
import heroImage from "../../Assets/Hero Images/stockholm-landing.jpg";
import stockholmMidhero from "../../Assets/Hero Images/stockholm-midhero.jpg";
import featureImageA from "../../Assets/Object Images/Inspiration.jpeg";
import featureImageB from "../../Assets/Object Images/_ (1).jpeg";
import processImage from "../../Assets/Object Images/_ (2).jpeg";
import faqImage from "../../Assets/Object Images/_ (3).jpeg";

const navLinks = [
  { label: "Publicera annons", type: "action", action: "publish" },
  { label: "Funktioner", type: "href", href: "#funktioner" },
  { label: "Så fungerar det", type: "href", href: "#sa-fungerar-det" },
  { label: "Priser", type: "href", href: "#priser" },
  { label: "FAQ", type: "href", href: "#faq" }
];

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
        title: "Fregattvägen 8",
        area: "Gröndal, Stockholm",
        tags: ["Industrier & verkstäder", "Lager & logistik", "Kontor"],
        size: "159 m²",
        image: "/object-images/object-1.jpeg"
      },
      {
        title: "Tomtebogatan 30",
        area: "Vasastan, Stockholm",
        tags: ["Butiker", "Kontor"],
        size: "90 m²",
        image: "/object-images/object-2.jpeg"
      },
      {
        title: "Ringvägen 129",
        area: "Södermalm, Stockholm",
        tags: ["Restauranger & caféer"],
        size: "75 m²",
        image: "/object-images/object-3.jpeg"
      },
      {
        title: "Riddargatan 28",
        area: "Östermalm, Stockholm",
        tags: ["Butiker", "Kontor"],
        size: "79 m²",
        image: "/object-images/object-4.jpeg"
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
  { value: "Cykelrum", label: "Cykelförråd", icon: BikeIcon },
  { value: "Parkering", label: "Garage", icon: CarIcon },
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

const heroInputClass = "w-full rounded-2xl border border-black/15 bg-[#f7f9fc] px-3 py-3 text-sm text-ink-900 placeholder:text-ink-500 focus:border-[#0f1930] focus:outline-none";
const heroSelectClass = "w-full rounded-2xl border border-black/15 bg-[#f7f9fc] px-3 py-3 pr-10 text-sm text-ink-900 appearance-none focus:border-[#0f1930] focus:outline-none [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2214%22 height=%2214%22 viewBox=%220 0 20 20%22 fill=%22none%22%3E%3Cpath d=%22M6 8L10 12L14 8%22 stroke=%22%23263842%22 stroke-width=%221.8%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E')] [background-repeat:no-repeat] [background-position:right_0.7rem_center] [background-size:14px_14px]";

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

function LandingPage({ user, onOpenAuthOverlay }) {
  const [showAdvancedHeroFilters, setShowAdvancedHeroFilters] = useState(false);
  const [heroAiEnabled, setHeroAiEnabled] = useState(false);
  const [heroModeOpacity, setHeroModeOpacity] = useState(1);
  const [heroAiPrompt, setHeroAiPrompt] = useState("");
  const heroModeTimerRef = useRef(null);
  const [heroFilters, setHeroFilters] = useState({
    query: "",
    district: "Alla",
    type: "Alla",
    minSize: "",
    maxSize: "",
    teamSize: "",
    minBudget: "",
    maxBudget: "",
    keyword: "",
    amenities: [],
    furnished: "all"
  });

  const openAuth = (mode, preferredRole = "renter") => {
    onOpenAuthOverlay?.(mode, preferredRole);
  };

  useEffect(() => {
    return () => {
      if (heroModeTimerRef.current) {
        clearTimeout(heroModeTimerRef.current);
      }
    };
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
    if (amenityTerms) params.set("amenity", amenityTerms);
    if (heroFilters.furnished !== "all") params.set("furnished", heroFilters.furnished);
    if (heroAiEnabled && aiPromptCandidate) {
      params.set("ai", "1");
      params.set("aiPrompt", aiPromptCandidate);
    }
    navigateTo(`/app/rent?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-black">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-3 sm:px-6">
          <button type="button" className="justify-self-start text-left" onClick={() => navigateTo("/")}>
            <p className="text-lg font-semibold">Lokalflöde Stockholm</p>
            <p className="text-xs text-ink-600">Kontor och kommersiella lokaler i hela Stockholm</p>
          </button>

          <nav className="hidden items-center justify-self-center gap-5 lg:flex">
            {navLinks.map((item) => (
              item.type === "route" ? (
                <button key={item.label} type="button" className="text-sm font-semibold text-ink-700 transition hover:text-black" onClick={() => navigateTo(item.path)}>
                  {item.label}
                </button>
              ) : item.type === "action" ? (
                <button
                  key={item.label}
                  type="button"
                  className="text-sm font-semibold text-ink-700 transition hover:text-black"
                  onClick={() => (user ? navigateTo("/app/publish") : openAuth("signup", "publisher"))}
                >
                  {item.label}
                </button>
              ) : (
                <a key={item.href} href={item.href} className="text-sm font-semibold text-ink-700 transition hover:text-black">
                  {item.label}
                </a>
              )
            ))}
          </nav>

          <div className="flex items-center justify-self-end gap-2">
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
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <img
          src={heroImage}
          alt="Stockholm kontorsmarknad"
          className="h-[72vh] w-full object-cover"
        />
        <div className="absolute inset-0 z-20">
          <div className={`mx-auto flex h-full w-full max-w-7xl justify-center items-center px-4 transition-[padding] duration-500 ease-out sm:px-6 ${showAdvancedHeroFilters ? "py-8" : "py-6"}`}>
            <div className="mx-auto w-full max-w-4xl">
              <article className="rounded-3xl border border-black/10 bg-white p-5 text-ink-900 shadow-[0_20px_60px_rgba(15,25,48,0.18)] transition-all duration-500 ease-out sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-ink-900 sm:text-2xl">Sök lokaler i hela Stockholm</h2>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-ink-700">
                    <SparklesIcon className="h-3.5 w-3.5 text-[#0f1930]" />
                    <span>AI-sök</span>
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
                      <div className="space-y-4 rounded-2xl border border-black/10 bg-[#f8fafc] p-5">
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
                        <div className="flex justify-end pt-1">
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
                          <div className="grid gap-5 sm:grid-cols-3">
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
                          </div>

                          <div className="grid gap-5 sm:grid-cols-[minmax(0,320px)_minmax(0,1fr)] sm:items-start">
                            <div className="w-full">
                              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-700">Möblering</span>
                              <div className="inline-flex h-[48px] w-full items-center gap-1 rounded-2xl border border-black/15 bg-[#f1f4f8] p-1">
                                {furnishedOptions.map((option) => {
                                  const active = heroFilters.furnished === option.value;
                                  return (
                                    <button
                                      key={option.value}
                                      type="button"
                                      className={`inline-flex min-w-0 flex-1 items-center justify-center rounded-xl p-2 text-xs font-semibold leading-none transition ${
                                        active
                                          ? "bg-[#0f1930] text-white shadow-[0_1px_2px_rgba(15,25,48,0.22)]"
                                          : "text-ink-700 hover:bg-white"
                                      }`}
                                      onClick={() => setHeroFilters((prev) => ({ ...prev, furnished: option.value }))}
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
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
                                    <Icon className="h-3.5 w-3.5" />
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

      <section id="funktioner" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Funktioner</p>
          <h2 className="text-3xl font-semibold">Allt som behövs för en fungerande lokalmarknadsplats</h2>
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
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-[#f8fafc] p-3">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">
                    <SparklesIcon className="h-3.5 w-3.5" />
                    AI-sök
                  </p>
                  <p className="mt-1 text-sm text-ink-700">Förslag på objekt och smart filterjustering.</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-[#f8fafc] p-3">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">
                    <StarIcon className="h-3.5 w-3.5" />
                    Favoriter
                  </p>
                  <p className="mt-1 text-sm text-ink-700">Spara objekt och återkom till favoritlistan när du vill.</p>
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

      <section id="sa-fungerar-det" className="relative overflow-hidden border-y border-black/10 bg-gradient-to-br from-white to-[#f6f9fd]">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Så fungerar det</p>
            <h2 className="text-3xl font-semibold">Tre steg till en snabbare uthyrningsprocess</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <div className="space-y-4">
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

            <article className="overflow-hidden rounded-3xl border border-black/10 bg-white">
              <img src={processImage} alt="Processöversikt" className="h-64 w-full object-cover sm:h-[420px]" />
              <div className="space-y-2 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Resultat</p>
                <p className="text-2xl font-semibold">Kortare väg från intresse till affär</p>
                <p className="text-sm text-ink-600">Samlad process ger snabbare beslut och bättre uppföljning för båda parter.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="priser" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Priser</p>
            <h2 className="text-3xl font-semibold">Bygg volym med Gratis, skala med synlighetslyft</h2>
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
        <img src={stockholmMidhero} alt="Stockholm stadsvy" className="h-[430px] w-full object-cover sm:h-[500px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#e5ebf2]/90 via-[#e5ebf2]/70 to-transparent" />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full w-full max-w-7xl items-start justify-center px-4 pt-14 text-center sm:px-6">
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
                className="mt-7 rounded-full border border-[#12375a] bg-white/35 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-[#12375a] backdrop-blur hover:bg-white/55"
                onClick={() => openAuth("signup", "publisher")}
              >
                Läs mer
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Lokaler just nu</p>
            <h2 className="text-3xl font-semibold">Populäraste lediga lokaler</h2>
          </div>
          <button
            type="button"
            className="rounded-xl border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-ink-700 hover:bg-[#f7f9fc]"
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

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {group.listings.map((listing) => (
                  <button
                    key={`${group.city}-${listing.title}`}
                    type="button"
                    className="overflow-hidden rounded-2xl border border-black/10 bg-[#fbfcfe] text-left"
                    onClick={() => navigateTo("/app/rent")}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img src={listing.image} alt={listing.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="space-y-2 p-3">
                      <p className="text-lg font-semibold leading-tight text-[#0f1930]">{listing.title}</p>
                      <p className="inline-flex items-center gap-1 text-xs text-ink-600">
                        <PinIcon className="h-3.5 w-3.5" />
                        {listing.area}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {listing.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-black/10 bg-white px-2 py-0.5 text-[10px] font-semibold text-ink-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="pt-1 text-base font-semibold text-[#0f1930]">{listing.size}</p>
                    </div>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Kunskapsbank</p>
            <h2 className="text-3xl font-semibold">Guider och tips</h2>
          </div>
          <button type="button" className="rounded-xl border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-ink-700 hover:bg-[#f7f9fc]">
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
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">FAQ</p>
            <h2 className="text-3xl font-semibold">Vanliga frågor</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="overflow-hidden rounded-3xl border border-black/10 bg-white">
              <img src={faqImage} alt="FAQ och support" className="h-64 w-full object-cover sm:h-[420px]" />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Kundservice</p>
                <p className="mt-1 text-2xl font-semibold">Tydliga svar för snabbare beslut</p>
                <p className="mt-1 text-sm text-ink-600">Vanliga frågor samlade för att du ska komma igång utan friktion.</p>
              </div>
            </article>

            <div className="space-y-3">
              {faqItems.map((item) => (
                <article key={item.q} className="rounded-2xl border border-black/10 bg-[#f8fafc] p-5">
                  <p className="inline-flex items-start gap-2 font-semibold">
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0f1930] text-[11px] font-bold text-white">?</span>
                    {item.q}
                  </p>
                  <p className="mt-2 text-sm text-ink-600">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#f4f5f7]">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
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
                <a className="text-sm text-ink-600 hover:text-black" href="#funktioner">Funktioner</a>
                <a className="text-sm text-ink-600 hover:text-black" href="#sa-fungerar-det">Så fungerar det</a>
                <a className="text-sm text-ink-600 hover:text-black" href="#priser">Priser</a>
                <a className="text-sm text-ink-600 hover:text-black" href="#faq">FAQ</a>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Konton & flöden</p>
              <div className="mt-3 grid gap-2">
                <button type="button" className="text-left text-sm text-ink-600 hover:text-black" onClick={() => openAuth("login")}>Logga in</button>
                <button type="button" className="text-left text-sm text-ink-600 hover:text-black" onClick={() => openAuth("signup", "renter")}>Skapa konto</button>
                <button type="button" className="text-left text-sm text-ink-600 hover:text-black" onClick={() => navigateTo("/app/rent")}>Hyr lokal (gästläge)</button>
                <button type="button" className="text-left text-sm text-ink-600 hover:text-black" onClick={() => openAuth("signup", "publisher")}>Publicera lokal</button>
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
