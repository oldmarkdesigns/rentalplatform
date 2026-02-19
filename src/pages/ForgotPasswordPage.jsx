import { useState } from "react";
import PublicLayout from "../components/layout/PublicLayout";
import { navigateTo } from "../lib/router";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <PublicLayout title="Glömt lösenord" subtitle="I MVP simuleras återställning via e-post.">
      <form
        className="mx-auto max-w-md space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
      >
        <input
          className="field"
          type="email"
          placeholder="Din e-post"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <button type="submit" className="btn-primary w-full">
          Skicka återställningslänk
        </button>

        {sent ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">Om kontot finns har vi skickat en återställningslänk.</p> : null}

        <div className="text-center text-xs">
          <button type="button" className="text-ink-600 underline" onClick={() => navigateTo("/login")}>Tillbaka till inloggning</button>
        </div>
      </form>
    </PublicLayout>
  );
}

export default ForgotPasswordPage;
