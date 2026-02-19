import { useMemo, useState } from "react";
import { formatSek, parseAmenities } from "../../lib/formatters";
import { navigateTo } from "../../lib/router";
import PresetTextField from "../../components/app/PresetTextField";

const steps = ["Grund", "Villkor", "Media", "Granska"];

const initialDraft = {
  title: "",
  district: "Norrmalm",
  address: "",
  type: "Kontor",
  priceMonthly: "",
  sizeSqm: "",
  capacity: "",
  term: "12 månader",
  availability: "Ledig nu",
  responseHours: "2",
  amenities: "Mötesrum, Fiber, Kök",
  image: "/object-images/object-4.jpeg"
};

const termPresets = ["3 månader", "6 månader", "12 månader", "24 månader", "36 månader", "Flexibelt avtal"];
const availabilityPresets = ["Ledig nu", "Inom 2 veckor", "Inom 1 månad", "Inom 2 månader", "Efter överenskommelse"];

function toNumber(value) {
  return Number(value || 0);
}

function computeQualityScore(draft) {
  let score = 0;
  if (draft.title) score += 18;
  if (draft.address) score += 14;
  if (draft.type) score += 12;
  if (toNumber(draft.priceMonthly)) score += 16;
  if (toNumber(draft.sizeSqm)) score += 14;
  if (toNumber(draft.capacity)) score += 10;
  if (parseAmenities(draft.amenities).length) score += 8;
  if (draft.image) score += 8;
  return Math.min(100, score);
}

const stepRules = {
  0: [
    {
      key: "title",
      label: "Rubrik",
      isMissing: (draft) => !String(draft.title || "").trim()
    },
    {
      key: "address",
      label: "Adress",
      isMissing: (draft) => !String(draft.address || "").trim()
    }
  ],
  1: [
    {
      key: "priceMonthly",
      label: "Månadshyra",
      isMissing: (draft) => toNumber(draft.priceMonthly) <= 0
    },
    {
      key: "sizeSqm",
      label: "Yta",
      isMissing: (draft) => toNumber(draft.sizeSqm) <= 0
    },
    {
      key: "capacity",
      label: "Kapacitet",
      isMissing: (draft) => toNumber(draft.capacity) <= 0
    }
  ],
  2: [
    {
      key: "image",
      label: "Omslagsbild",
      isMissing: (draft) => !String(draft.image || "").trim()
    }
  ]
};

function getStepErrors(stepIndex, draft) {
  if (!stepRules[stepIndex]) {
    return [];
  }

  return stepRules[stepIndex]
    .filter((rule) => rule.isMissing(draft))
    .map((rule) => ({
      key: rule.key,
      label: rule.label
    }));
}

function getFirstIncompleteStep(draft) {
  for (let index = 0; index <= 2; index += 1) {
    if (getStepErrors(index, draft).length > 0) {
      return index;
    }
  }
  return null;
}

function StepProgress({ currentStep }) {
  return (
    <div className="mt-5 rounded-3xl border border-black/10 bg-gradient-to-br from-[#f8fafc] to-white p-3">
      <div className="grid grid-cols-4 gap-2">
        {steps.map((label, index) => {
          const active = index === currentStep;
          const complete = index < currentStep;

          return (
            <div
              key={label}
              className={`rounded-2xl border px-3 py-2 ${
                active
                  ? "border-[#0f1930]/30 bg-white"
                  : complete
                    ? "border-[#0f1930]/20 bg-[#f6f8fc]"
                    : "border-black/10 bg-white/70"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                    active
                      ? "bg-[#0f1930] text-white"
                      : complete
                        ? "bg-[#24324f] text-white"
                        : "border border-black/15 bg-[#f4f5f7] text-ink-500"
                  }`}
                >
                  {index + 1}
                </span>
                <span className={`text-xs font-semibold ${active || complete ? "text-black" : "text-ink-500"}`}>{label}</span>
              </div>
              <div className={`mt-2 h-1 rounded-full ${active ? "bg-[#0f1930]" : complete ? "bg-[#24324f]/70" : "bg-black/10"}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ListingPreviewCard({ listing }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-black/10 bg-white">
      <img src={listing.image} alt={listing.title} className="h-56 w-full object-cover" />
      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-xl font-semibold">{listing.title}</h3>
          <p className="text-sm text-ink-600">{listing.district} • {listing.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-black/10 bg-[#fafafa] px-3 py-2">{formatSek(listing.priceMonthly)} / månad</div>
          <div className="rounded-xl border border-black/10 bg-[#fafafa] px-3 py-2">{listing.sizeSqm} kvm</div>
          <div className="rounded-xl border border-black/10 bg-[#fafafa] px-3 py-2">{listing.capacity} platser</div>
          <div className="rounded-xl border border-black/10 bg-[#fafafa] px-3 py-2">{listing.type}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(listing.amenities || []).slice(0, 5).map((amenity) => (
            <span key={amenity} className="rounded-full border border-black/10 bg-[#f8fafc] px-2 py-1 text-[11px] font-semibold text-ink-700">{amenity}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function PublishReview({ listing, onEdit, onApproveAndPublish, pending }) {
  return (
    <div className="mt-6 space-y-4 rounded-2xl border border-black/10 bg-[#f8fafc] p-4">
      <div className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-ink-700">
        Kontrollera annonsen innan publicering.
      </div>
      <ListingPreviewCard listing={listing} />
      <div className="flex w-full justify-end gap-2">
        <button type="button" className="rounded-2xl border border-black/20 bg-white px-4 py-2 text-xs font-semibold" onClick={onEdit}>
          Ändra annons
        </button>
        <button type="button" className="rounded-2xl border border-[#0f1930] bg-[#0f1930] hover:bg-[#16233f] px-4 py-2 text-xs font-semibold text-white" onClick={onApproveAndPublish} disabled={pending}>
          {pending ? "Publicerar..." : "Godkänn och publicera"}
        </button>
      </div>
    </div>
  );
}

function PublishSuccess({ listing, onCreateAnother, onViewListing }) {
  return (
    <div className="mt-6 space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
      <ListingPreviewCard listing={listing} />
      <div className="flex justify-end gap-2">
        <button type="button" className="rounded-2xl border border-black/20 bg-white px-4 py-2 text-xs font-semibold text-black" onClick={onCreateAnother}>
          Publicera nytt objekt
        </button>
        <button type="button" className="rounded-2xl border border-[#0f1930] bg-[#0f1930] hover:bg-[#16233f] px-4 py-2 text-xs font-semibold text-white" onClick={onViewListing}>
          Visa objekt
        </button>
      </div>
    </div>
  );
}

function PublishPage({ app }) {
  const {
    createListing,
    updateListing,
    publishListing
  } = app;

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(initialDraft);
  const [createdListingId, setCreatedListingId] = useState(null);
  const [publishedListing, setPublishedListing] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [pending, setPending] = useState(false);
  const [attemptedSteps, setAttemptedSteps] = useState({ 0: false, 1: false, 2: false });
  const [stepFeedback, setStepFeedback] = useState("");

  const qualityScore = useMemo(() => computeQualityScore(draft), [draft]);

  const stepErrorsByIndex = useMemo(
    () => ({
      0: getStepErrors(0, draft),
      1: getStepErrors(1, draft),
      2: getStepErrors(2, draft)
    }),
    [draft]
  );

  const currentStepErrors = useMemo(() => {
    if (publishedListing || step > 2 || !attemptedSteps[step]) {
      return [];
    }
    return stepErrorsByIndex[step].map((entry) => entry.label);
  }, [attemptedSteps, publishedListing, step, stepErrorsByIndex]);

  function markStepAttempt(stepIndex) {
    if (stepIndex > 2) {
      return;
    }

    setAttemptedSteps((previous) => ({
      ...previous,
      [stepIndex]: true
    }));
  }

  function fieldInvalid(stepIndex, fieldKey) {
    return Boolean(
      attemptedSteps[stepIndex] &&
      stepErrorsByIndex[stepIndex]?.some((entry) => entry.key === fieldKey)
    );
  }

  function fieldClass(stepIndex, fieldKey) {
    return `field ${fieldInvalid(stepIndex, fieldKey) ? "border-rose-300 bg-rose-50 focus:border-rose-500" : ""}`;
  }

  function handleNext() {
    if (publishedListing || step >= 3) {
      return;
    }

    const errors = stepErrorsByIndex[step] || [];
    if (errors.length > 0) {
      markStepAttempt(step);
      setStepFeedback(`Fyll i obligatoriska fält i steget \"${steps[step]}\": ${errors.map((entry) => entry.label).join(", ")}.`);
      return;
    }

    setStep((value) => Math.min(value + 1, 3));
    setStepFeedback("");
  }

  function startAnotherListing() {
    setDraft(initialDraft);
    setCreatedListingId(null);
    setPublishedListing(null);
    setStep(0);
    setDuplicateWarning(false);
    setAttemptedSteps({ 0: false, 1: false, 2: false });
    setStepFeedback("");
  }

  async function saveDraft() {
    setPending(true);
    try {
      if (createdListingId) {
        const response = await updateListing(createdListingId, {
          ...draft,
          amenities: parseAmenities(draft.amenities)
        });
        setDuplicateWarning(Boolean(response.duplicateWarning));
      } else {
        const response = await createListing({
          ...draft,
          amenities: parseAmenities(draft.amenities),
          status: "draft"
        });
        setCreatedListingId(response.listing.id);
        setDuplicateWarning(Boolean(response.duplicateWarning));
      }
    } finally {
      setPending(false);
    }
  }

  async function finalizePublish() {
    const firstIncomplete = getFirstIncompleteStep(draft);
    if (firstIncomplete !== null) {
      markStepAttempt(firstIncomplete);
      setStep(firstIncomplete);
      const missing = stepErrorsByIndex[firstIncomplete].map((entry) => entry.label).join(", ");
      setStepFeedback(`Du kan inte publicera ännu. Slutför steget \"${steps[firstIncomplete]}\". Saknas: ${missing}.`);
      return;
    }

    setPending(true);
    try {
      let listingId = createdListingId;
      if (!listingId) {
        const created = await createListing({
          ...draft,
          amenities: parseAmenities(draft.amenities),
          status: "draft"
        });
        listingId = created.listing.id;
        setCreatedListingId(listingId);
        setDuplicateWarning(Boolean(created.duplicateWarning));
      }

      const published = await publishListing(listingId);
      setPublishedListing(published.listing);
      setStep(3);
      setAttemptedSteps({ 0: false, 1: false, 2: false });
      setStepFeedback("");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-128px)] p-4 sm:p-6">
      <div className="mx-auto w-full max-w-[1000px] rounded-3xl border border-black/10 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide ${publishedListing ? "text-emerald-700" : "text-ink-500"}`}>
              {publishedListing ? "Publicerat" : "Publiceringsflöde"}
            </p>
            <h1 className="mt-1 text-4xl font-semibold">{publishedListing ? "Objekt publicerat" : "Publicera objekt"}</h1>
            <p className="mt-2 text-sm text-ink-500">
              {publishedListing ? "Ditt objekt har publicerats. Du finner det under dina objekt." : "Fyll i stegvis och publicera utan manuellt handpåläggning."}
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-[#f8fafc] px-4 py-3 text-right">
            <p className="text-xs text-ink-500">Kvalitetsscore</p>
            <p className="text-3xl font-semibold">{qualityScore}</p>
          </div>
        </div>

        {!publishedListing ? <StepProgress currentStep={step} /> : null}

        {!publishedListing ? (
          <>
            <div className="mt-6 space-y-3">
              {step === 0 ? (
                <>
                  <input className={fieldClass(0, "title")} value={draft.title} onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))} placeholder="Rubrik för annons" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <select className="field" value={draft.district} onChange={(event) => setDraft((prev) => ({ ...prev, district: event.target.value }))}>
                      <option>Norrmalm</option>
                      <option>Södermalm</option>
                      <option>Vasastan</option>
                      <option>Östermalm</option>
                      <option>Kungsholmen</option>
                      <option>Solna</option>
                    </select>
                    <select className="field" value={draft.type} onChange={(event) => setDraft((prev) => ({ ...prev, type: event.target.value }))}>
                      <option>Kontor</option>
                      <option>Coworking</option>
                      <option>Studio</option>
                      <option>Butik</option>
                      <option>Klinik</option>
                    </select>
                  </div>
                  <input className={fieldClass(0, "address")} value={draft.address} onChange={(event) => setDraft((prev) => ({ ...prev, address: event.target.value }))} placeholder="Adress" />
                </>
              ) : null}

              {step === 1 ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className={fieldClass(1, "priceMonthly")} type="number" value={draft.priceMonthly} onChange={(event) => setDraft((prev) => ({ ...prev, priceMonthly: event.target.value }))} placeholder="Månadshyra (SEK)" />
                    <input className={fieldClass(1, "sizeSqm")} type="number" value={draft.sizeSqm} onChange={(event) => setDraft((prev) => ({ ...prev, sizeSqm: event.target.value }))} placeholder="Yta (kvm)" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input className={fieldClass(1, "capacity")} type="number" value={draft.capacity} onChange={(event) => setDraft((prev) => ({ ...prev, capacity: event.target.value }))} placeholder="Kapacitet" />
                    <PresetTextField
                      value={draft.term}
                      onChange={(value) => setDraft((prev) => ({ ...prev, term: value }))}
                      presets={termPresets}
                      selectPlaceholder="Avtalstid"
                    />
                    <PresetTextField
                      value={draft.availability}
                      onChange={(value) => setDraft((prev) => ({ ...prev, availability: value }))}
                      presets={availabilityPresets}
                      selectPlaceholder="Tillgänglighet"
                    />
                  </div>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <input className={fieldClass(2, "image")} value={draft.image} onChange={(event) => setDraft((prev) => ({ ...prev, image: event.target.value }))} placeholder="Sökväg till omslagsbild" />
                  <textarea className="field min-h-24" value={draft.amenities} onChange={(event) => setDraft((prev) => ({ ...prev, amenities: event.target.value }))} placeholder="Faciliteter, separera med kommatecken" />
                </>
              ) : null}

            </div>

            {stepFeedback ? <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{stepFeedback}</p> : null}
            {currentStepErrors.length > 0 ? <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">Fyll i obligatoriska fält: {currentStepErrors.join(", ")}.</p> : null}
            {duplicateWarning ? <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">Varning: möjlig duplikatannons upptäckt (liknande titel/adress).</p> : null}

            {step < 3 ? (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                <button type="button" className="rounded-2xl border border-black/20 bg-white px-4 py-2 text-xs font-semibold" onClick={() => setStep((value) => Math.max(value - 1, 0))}>
                  Föregående
                </button>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="rounded-2xl border border-black/20 bg-white px-4 py-2 text-xs font-semibold" onClick={saveDraft} disabled={pending}>
                    Spara utkast
                  </button>
                  <button type="button" className="rounded-2xl border border-[#0f1930] bg-[#0f1930] hover:bg-[#16233f] px-4 py-2 text-xs font-semibold text-white" onClick={handleNext}>
                    Nästa
                  </button>
                </div>
              </div>
            ) : (
              <PublishReview
                listing={{
                  ...draft,
                  title: draft.title || "Namnlös annons",
                  address: draft.address || "Adress saknas",
                  priceMonthly: Number(draft.priceMonthly || 0),
                  sizeSqm: Number(draft.sizeSqm || 0),
                  capacity: Number(draft.capacity || 0),
                  amenities: parseAmenities(draft.amenities)
                }}
                onEdit={() => setStep(2)}
                onApproveAndPublish={finalizePublish}
                pending={pending}
              />
            )}
          </>
        ) : (
          <PublishSuccess
            listing={publishedListing}
            onCreateAnother={startAnotherListing}
            onViewListing={() => navigateTo("/app/my-listings")}
          />
        )}
      </div>
    </section>
  );
}

export default PublishPage;
