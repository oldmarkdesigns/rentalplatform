import { useState } from "react";
import PublicLayout from "../components/layout/PublicLayout";
import { defaultAppPathForRole, navigateTo } from "../lib/router";

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const user = await onLogin(form);
      navigateTo(user.onboardingCompleted ? defaultAppPathForRole(user.role) : "/onboarding");
    } catch (submitError) {
      setError(submitError.message || "Inloggning misslyckades.");
    } finally {
      setPending(false);
    }
  }

  return (
    <PublicLayout title="Logga in" subtitle="Logga in för att fortsätta till hyres- eller annonsörsflödet.">
      <form className="mx-auto max-w-md space-y-3" onSubmit={submit}>
        <input
          className="field"
          type="email"
          placeholder="E-post"
          value={form.email}
          onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
          required
        />
        <input
          className="field"
          type="password"
          placeholder="Lösenord"
          value={form.password}
          onChange={(event) => setForm((previous) => ({ ...previous, password: event.target.value }))}
          required
        />

        {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p> : null}

        <button type="submit" className="btn-primary w-full" disabled={pending}>
          {pending ? "Loggar in..." : "Logga in"}
        </button>

        <div className="flex items-center justify-between text-xs">
          <button type="button" className="text-ink-600 underline" onClick={() => navigateTo("/forgot-password")}>Glömt lösenord</button>
          <button type="button" className="text-ink-600 underline" onClick={() => navigateTo("/signup")}>Skapa konto</button>
        </div>

        <div className="rounded-2xl border border-black/10 bg-[#f8fafc] p-3 text-xs text-ink-600">
          Demo-konton: <br />
          Hyresgäst: hyresgast@demo.se / demo123<br />
          Annonsör: annonsor@demo.se / demo123<br />
          Kombi (båda roller): kombi@demo.se / demo123
        </div>
      </form>
    </PublicLayout>
  );
}

export default LoginPage;
