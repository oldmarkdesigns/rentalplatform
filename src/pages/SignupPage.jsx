import { useEffect, useMemo, useState } from "react";
import PublicLayout from "../components/layout/PublicLayout";
import { navigateTo } from "../lib/router";

function SignupPage({ onSignup }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    roles: ["renter"],
    role: "renter"
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const roleFromUrl = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("role") === "publisher" ? "publisher" : "renter";
  }, []);

  useEffect(() => {
    setForm((previous) => ({ ...previous, role: roleFromUrl, roles: [roleFromUrl] }));
  }, [roleFromUrl]);

  function setRoleSelection(selection) {
    if (selection === "both") {
      setForm((previous) => ({ ...previous, role: "renter", roles: ["renter", "publisher"] }));
      return;
    }

    const role = selection === "publisher" ? "publisher" : "renter";
    setForm((previous) => ({ ...previous, role, roles: [role] }));
  }

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      await onSignup(form);
      navigateTo("/onboarding");
    } catch (submitError) {
      setError(submitError.message || "Kunde inte skapa konto.");
    } finally {
      setPending(false);
    }
  }

  return (
    <PublicLayout title="Skapa konto" subtitle="Välj om kontot ska vara hyresgäst, annonsör eller båda.">
      <form className="mx-auto max-w-md space-y-3" onSubmit={submit}>
        <input className="field" placeholder="Namn" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        <input className="field" type="email" placeholder="E-post" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
        <input className="field" placeholder="Telefon (valfritt i MVP)" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
        <input className="field" type="password" placeholder="Lösenord" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Välj kontotyp">
          <button
            type="button"
            role="radio"
            aria-checked={form.roles.length === 1 && form.roles[0] === "renter"}
            onClick={() => setRoleSelection("renter")}
            className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold ${
              form.roles.length === 1 && form.roles[0] === "renter"
                ? "border-[#0f1930] bg-[#eef3fb] text-[#0f1930]"
                : "border-black/20 bg-white text-ink-700"
            }`}
          >
            <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${form.roles.length === 1 && form.roles[0] === "renter" ? "border-[#0f1930]" : "border-ink-400"}`}>
              {form.roles.length === 1 && form.roles[0] === "renter" ? <span className="h-2 w-2 rounded-full bg-[#0f1930]" /> : null}
            </span>
            Hyresgäst
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={form.roles.length === 1 && form.roles[0] === "publisher"}
            onClick={() => setRoleSelection("publisher")}
            className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold ${
              form.roles.length === 1 && form.roles[0] === "publisher"
                ? "border-[#0f1930] bg-[#eef3fb] text-[#0f1930]"
                : "border-black/20 bg-white text-ink-700"
            }`}
          >
            <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${form.roles.length === 1 && form.roles[0] === "publisher" ? "border-[#0f1930]" : "border-ink-400"}`}>
              {form.roles.length === 1 && form.roles[0] === "publisher" ? <span className="h-2 w-2 rounded-full bg-[#0f1930]" /> : null}
            </span>
            Annonsör
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={form.roles.length === 2}
            onClick={() => setRoleSelection("both")}
            className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold ${
              form.roles.length === 2
                ? "border-[#0f1930] bg-[#eef3fb] text-[#0f1930]"
                : "border-black/20 bg-white text-ink-700"
            }`}
          >
            <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${form.roles.length === 2 ? "border-[#0f1930]" : "border-ink-400"}`}>
              {form.roles.length === 2 ? <span className="h-2 w-2 rounded-full bg-[#0f1930]" /> : null}
            </span>
            Båda roller
          </button>
        </div>

        {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p> : null}

        <button type="submit" className="btn-primary w-full" disabled={pending}>
          {pending ? "Skapar konto..." : "Skapa konto"}
        </button>

        <div className="text-center text-xs">
          <button type="button" className="text-ink-600 underline" onClick={() => navigateTo("/login")}>Har du redan konto? Logga in</button>
        </div>
      </form>
    </PublicLayout>
  );
}

export default SignupPage;
