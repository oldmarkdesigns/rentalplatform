import { useEffect, useState } from "react";
import ViewingRequestModal from "./components/app/ViewingRequestModal";
import AppShell from "./components/layout/AppShell";
import AuthOverlay from "./components/layout/AuthOverlay";
import ToastStack from "./components/layout/ToastStack";
import LandingPage from "./pages/LandingPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OnboardingPage from "./pages/OnboardingPage";
import FavoritesPage from "./pages/app/FavoritesPage";
import LeadsPage from "./pages/app/LeadsPage";
import ListingDetailPage from "./pages/app/ListingDetailPage";
import ManageListingPage from "./pages/app/ManageListingPage";
import MyListingsPage from "./pages/app/MyListingsPage";
import ProfilePage from "./pages/app/ProfilePage";
import PublisherOverviewPage from "./pages/app/PublisherOverviewPage";
import RentPage from "./pages/app/RentPage";
import ViewingsPage from "./pages/app/ViewingsPage";
import { defaultAppPathForRole, navigateTo, usePathname } from "./lib/router";
import { AppProvider, useAppState } from "./state/AppState";

function AppContent() {
  const pathname = usePathname();
  const app = useAppState();
  const [bookingListing, setBookingListing] = useState(null);
  const [authOverlay, setAuthOverlay] = useState({
    open: false,
    mode: "login",
    preferredRole: "renter"
  });

  function openAuthOverlay(mode = "login", preferredRole = "renter") {
    setAuthOverlay({
      open: true,
      mode,
      preferredRole
    });
  }

  function closeAuthOverlay() {
    setAuthOverlay((current) => ({ ...current, open: false }));
  }

  useEffect(() => {
    if (app.isBootstrapping) {
      return;
    }

    const isAuthenticated = Boolean(app.user);
    const isOnboardingPath = pathname === "/onboarding";
    const isAppPath = pathname === "/app" || pathname.startsWith("/app/");
    const isPublicRentPath = pathname === "/app/rent";
    const isPublicListingPath = pathname.startsWith("/app/listings/");
    const isAuthPath = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password";

    if (!isAuthenticated && pathname === "/login") {
      openAuthOverlay("login");
      navigateTo("/", { replace: true });
      return;
    }

    if (!isAuthenticated && pathname === "/signup") {
      const roleFromQuery = new URLSearchParams(window.location.search).get("role");
      const preferredRole = roleFromQuery === "publisher" ? "publisher" : "renter";
      openAuthOverlay("signup", preferredRole);
      navigateTo("/", { replace: true });
      return;
    }

    if (!isAuthenticated && pathname === "/app") {
      navigateTo("/app/rent", { replace: true });
      return;
    }

    if (!isAuthenticated && isAppPath && !isPublicRentPath && !isPublicListingPath) {
      openAuthOverlay("login");
      navigateTo("/app/rent", { replace: true });
      return;
    }

    if (!isAuthenticated && isOnboardingPath) {
      openAuthOverlay("signup", "renter");
      navigateTo("/", { replace: true });
      return;
    }

    if (isAuthenticated && !app.user.onboardingCompleted && !isOnboardingPath) {
      navigateTo("/onboarding", { replace: true });
      return;
    }

    if (isAuthenticated && app.user.onboardingCompleted && (isAuthPath || isOnboardingPath)) {
      navigateTo(defaultAppPathForRole(app.user.role), { replace: true });
      return;
    }

    if (isAuthenticated && pathname === "/app") {
      navigateTo(defaultAppPathForRole(app.user.role), { replace: true });
      return;
    }

    if (isAuthenticated && app.user.onboardingCompleted) {
      const role = app.user.role === "publisher" ? "publisher" : "renter";
      const rawRoles = Array.isArray(app.user.roles) ? app.user.roles : [role];
      const roleSet = new Set(rawRoles.filter((item) => item === "renter" || item === "publisher"));
      const hasPublisherRole = roleSet.has("publisher");
      const renterAllowed = ["/app/rent", "/app/favorites", "/app/viewings", "/app/profile", "/app/settings", "/app/publish", "/app/listings"];
      const publisherAllowed = ["/app/my-listings", "/app/leads", "/app/profile", "/app/settings", "/app/rent", "/app/publish", "/app/listings"];
      const extraForPublisherMembers = hasPublisherRole ? ["/app/my-listings"] : [];
      const allowedBases = role === "publisher" ? publisherAllowed : [...renterAllowed, ...extraForPublisherMembers];
      const pathnameAllowed = allowedBases.some((base) => pathname === base || pathname.startsWith(`${base}/`));

      if (role === "renter" && pathname.startsWith("/app/") && !pathnameAllowed) {
        navigateTo("/app/rent", { replace: true });
        return;
      }

      if (role === "publisher" && pathname === "/app/viewings") {
        navigateTo("/app/leads", { replace: true });
        return;
      }

      if (role === "publisher" && pathname.startsWith("/app/") && !pathnameAllowed) {
        navigateTo("/app/publish", { replace: true });
      }
    }
  }, [app.isBootstrapping, app.user, pathname]);

  if (app.isBootstrapping) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f5f7]">
        <div className="rounded-3xl border border-black/10 bg-white px-6 py-5 text-center">
          <p className="text-lg font-semibold">Laddar plattformen...</p>
          <p className="text-sm text-ink-600">Initierar session och mock-data.</p>
        </div>
      </main>
    );
  }

  let content = null;

  if (pathname === "/") {
    content = <LandingPage user={app.user} onOpenAuthOverlay={openAuthOverlay} />;
  } else if (pathname === "/forgot-password") {
    content = <ForgotPasswordPage />;
  } else if (pathname === "/onboarding") {
    content = <OnboardingPage user={app.user} onComplete={app.completeOnboarding} />;
  } else if (pathname.startsWith("/app")) {
    const listingDetailMatch = pathname.match(/^\/app\/listings\/([^/]+)$/);
    const manageListingMatch = pathname.match(/^\/app\/my-listings\/([^/]+)$/);
    const listingId = listingDetailMatch ? decodeURIComponent(listingDetailMatch[1]) : null;
    const managedListingId = manageListingMatch ? decodeURIComponent(manageListingMatch[1]) : null;

    if (!app.user) {
      if (pathname === "/app/rent") {
        content = (
          <AppShell pathname={pathname} user={null} isGuest onRequireAuth={openAuthOverlay}>
            <RentPage app={app} isGuest onRequireAuth={openAuthOverlay} />
          </AppShell>
        );
      } else if (listingId) {
        content = (
          <AppShell pathname={pathname} user={null} isGuest onRequireAuth={openAuthOverlay}>
            <ListingDetailPage app={app} listingId={listingId} isGuest onRequireAuth={openAuthOverlay} />
          </AppShell>
        );
      } else {
        content = <LandingPage user={app.user} onOpenAuthOverlay={openAuthOverlay} />;
      }
    } else {
    let appRouteContent = null;
    const activeRole = app.user?.role === "publisher" ? "publisher" : "renter";

    if (pathname === "/app/rent") {
      appRouteContent = <RentPage app={app} onRequireAuth={openAuthOverlay} />;
    } else if (listingId) {
      appRouteContent = <ListingDetailPage app={app} listingId={listingId} />;
    } else if (managedListingId) {
      appRouteContent = <ManageListingPage app={app} listingId={managedListingId} />;
    } else if (pathname === "/app/my-listings") {
      appRouteContent = <MyListingsPage app={app} />;
    } else if (pathname === "/app/favorites") {
      appRouteContent = (
        <FavoritesPage
          app={app}
          onOpenListing={(listing) => navigateTo(`/app/listings/${encodeURIComponent(listing.id)}`)}
          onBookViewing={setBookingListing}
        />
      );
    } else if (pathname === "/app/viewings") {
      appRouteContent = app.user?.role === "publisher" ? <LeadsPage app={app} /> : <ViewingsPage app={app} />;
    } else if (pathname === "/app/leads") {
      appRouteContent = <LeadsPage app={app} />;
    } else if (pathname === "/app/profile") {
      appRouteContent = <ProfilePage app={app} />;
    } else if (pathname === "/app/settings") {
      appRouteContent = <ProfilePage app={app} />;
    } else if (pathname === "/app/publish") {
      appRouteContent = <PublisherOverviewPage app={app} />;
    } else {
      appRouteContent = activeRole === "publisher" ? <PublisherOverviewPage app={app} /> : <RentPage app={app} />;
    }

      content = (
        <AppShell pathname={pathname} user={app.user} onSwitchRole={app.switchRole} onLogout={app.logout}>
          {appRouteContent}
        </AppShell>
      );
    }
  } else {
    content = <LandingPage user={app.user} onOpenAuthOverlay={openAuthOverlay} />;
  }

  return (
    <>
      {content}

      <ViewingRequestModal
        listing={bookingListing}
        onClose={() => setBookingListing(null)}
        onSubmit={async (payload) => {
          await app.requestViewing(payload);
          setBookingListing(null);
        }}
      />

      <ToastStack toasts={app.toasts} />

      <AuthOverlay
        open={authOverlay.open}
        mode={authOverlay.mode}
        preferredRole={authOverlay.preferredRole}
        onClose={closeAuthOverlay}
        onLogin={app.login}
        onSignup={app.signup}
      />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
