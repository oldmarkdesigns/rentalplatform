import { apiClient } from "../api/client";

export const analyticsEventNames = {
  SIGNUP_STARTED: "signup_started",
  SIGNUP_COMPLETED: "signup_completed",
  LOGIN_COMPLETED: "login_completed",
  ONBOARDING_COMPLETED: "onboarding_completed",
  LISTING_OPENED: "listing_opened",
  FAVORITE_TOGGLED: "favorite_toggled",
  VIEWING_REQUESTED: "viewing_requested",
  LISTING_PUBLISHED: "listing_published",
  LEAD_STATUS_CHANGED: "lead_status_changed",
  AI_PROMPT_SUBMITTED: "ai_prompt_submitted"
};

export async function trackEvent(eventName, payload = {}) {
  try {
    await apiClient.request("POST", "/api/analytics/events", {
      eventName,
      payload,
      timestamp: new Date().toISOString()
    });
  } catch (_error) {
    // Analytics should never break UX in MVP mode.
  }
}
