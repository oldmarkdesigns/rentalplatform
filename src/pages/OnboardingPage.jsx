import { useMemo, useState } from "react";
import PublicLayout from "../components/layout/PublicLayout";
import { defaultAppPathForRole, navigateTo } from "../lib/router";

const roleSteps = {
  renter: {
    title: "Jag vill hyra lokal",
    fields: [
      { key: "companySize", label: "Teamstorlek", placeholder: "T.ex. 11-25" },
      { key: "budgetRange", label: "Budgetintervall / mån", placeholder: "T.ex. 50000-90000" },
      { key: "preferredAreas", label: "Önskade områden", placeholder: "T.ex. Norrmalm, Solna" },
      { key: "moveInTimeline", label: "Inflyttning", placeholder: "T.ex. inom 1-2 månader" }
    ]
  },
  publisher: {
    title: "Jag vill hyra ut lokal",
    fields: [
      { key: "propertyType", label: "Fastighetstyp", placeholder: "T.ex. Kontor" },
      { key: "legalEntity", label: "Juridisk enhet", placeholder: "T.ex. Exempel Fastigheter AB" },
      { key: "contactRole", label: "Din roll", placeholder: "T.ex. Förvaltare" },
      { key: "portfolioSize", label: "Portföljstorlek", placeholder: "T.ex. 6-20 objekt" }
    ]
  }
};

function OnboardingPage({ user, onComplete }) {
  const availableRoles = useMemo(() => {
    const roles = Array.isArray(user?.roles) && user.roles.length ? user.roles : [user?.role || "renter"];
    return roles.filter((role) => role === "renter" || role === "publisher");
  }, [user?.role, user?.roles]);
  const [step, setStep] = useState(0);
  const [primaryRole, setPrimaryRole] = useState(user?.role || availableRoles[0] || "renter");
  const [account, setAccount] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });
  const [profile, setProfile] = useState({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const roleConfig = useMemo(() => roleSteps[primaryRole], [primaryRole]);

  async function finish() {
    setPending(true);
    setError("");

    try {
      const nextUser = await onComplete({
        primaryRole,
        account,
        profile: {
          ...profile
        }
      });
      navigateTo(defaultAppPathForRole(nextUser.role));
    } catch (submitError) {
      setError(submitError.message || "Kunde inte slutföra introduktionen.");
    } finally {
      setPending(false);
    }
  }

  return (
    <PublicLayout title="Kom igång" subtitle="Välj syfte och komplettera profil för bästa matchning och snabb publicering.">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 inline-flex rounded-2xl border border-black/15 bg-white p-1 text-xs">
          {[
            "Välj syfte",
            "Konto",
            "Profil",
            "Klar"
          ].map((item, index) => (
            <button key={item} type="button" className={`rounded-xl px-3 py-2 font-semibold ${step === index ? "bg-[#0f1930] text-white" : "text-ink-600"}`} onClick={() => setStep(index)}>
              {item}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-black/10 bg-[#f8fafc] p-4 sm:p-5">
          {step === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-ink-700">Vad vill du göra primärt i plattformen?</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {availableRoles.includes("renter") ? (
                  <button type="button" onClick={() => setPrimaryRole("renter")} className={`rounded-2xl border px-3 py-3 text-left ${primaryRole === "renter" ? "border-[#0f1930] bg-[#0f1930] hover:bg-[#16233f] text-white" : "border-black/15 bg-white"}`}>
                    <p className="font-semibold">Jag vill hyra lokal</p>
                    <p className="text-xs opacity-80">Sök, filtrera, AI-matchning och boka visning.</p>
                  </button>
                ) : null}
                {availableRoles.includes("publisher") ? (
                  <button type="button" onClick={() => setPrimaryRole("publisher")} className={`rounded-2xl border px-3 py-3 text-left ${primaryRole === "publisher" ? "border-[#0f1930] bg-[#0f1930] hover:bg-[#16233f] text-white" : "border-black/15 bg-white"}`}>
                    <p className="font-semibold">Jag vill hyra ut lokal</p>
                    <p className="text-xs opacity-80">Publicera, hantera intressen och svara snabbare.</p>
                  </button>
                ) : null}
              </div>
              {primaryRole === "publisher" ? (
                <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                  Gratis publicering är aktiv just nu. Publicera obegränsat antal annonser utan startkostnad.
                </p>
              ) : null}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-3">
              <input className="field" value={account.name} onChange={(e) => setAccount((p) => ({ ...p, name: e.target.value }))} placeholder="Namn" />
              <input className="field" type="email" value={account.email} onChange={(e) => setAccount((p) => ({ ...p, email: e.target.value }))} placeholder="E-post" />
              <input className="field" value={account.phone} onChange={(e) => setAccount((p) => ({ ...p, phone: e.target.value }))} placeholder="Telefon" />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold">{roleConfig.title}</p>
              {roleConfig.fields.map((field) => (
                <label key={field.key} className="grid gap-1">
                  <span className="text-xs font-semibold text-ink-600">{field.label}</span>
                  <input className="field" value={profile[field.key] || ""} placeholder={field.placeholder} onChange={(e) => setProfile((p) => ({ ...p, [field.key]: e.target.value }))} />
                </label>
              ))}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Roll:</span> {primaryRole === "publisher" ? "Annonsör" : "Hyresgäst"}</p>
              <p><span className="font-semibold">Namn:</span> {account.name || "-"}</p>
              <p><span className="font-semibold">E-post:</span> {account.email || "-"}</p>
              {primaryRole === "publisher" ? (
                <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                  Gratisplan aktiv: obegränsad publicering tills vidare.
                </p>
              ) : null}
              <p className="text-ink-600">Du kan ändra fler uppgifter i Inställningar efter onboarding.</p>
            </div>
          ) : null}
        </div>

        {error ? <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p> : null}

        <div className="mt-4 flex items-center justify-between">
          <button type="button" className="rounded-xl border border-black/20 bg-white px-3 py-2 text-xs font-semibold" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>
            Föregående
          </button>
          {step < 3 ? (
            <button type="button" className="rounded-xl border border-[#0f1930] bg-[#0f1930] hover:bg-[#16233f] px-3 py-2 text-xs font-semibold text-white" onClick={() => setStep((value) => Math.min(3, value + 1))}>
              Nästa
            </button>
          ) : (
            <button type="button" className="rounded-xl border border-[#0f1930] bg-[#0f1930] hover:bg-[#16233f] px-3 py-2 text-xs font-semibold text-white" onClick={finish} disabled={pending}>
              {pending ? "Sparar..." : "Slutför introduktionen"}
            </button>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

export default OnboardingPage;
