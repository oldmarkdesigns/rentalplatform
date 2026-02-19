export function formatSek(value) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function formatDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function formatRelativeHours(hours) {
  return `${Number(hours || 0)}h`;
}

export function parseAmenities(text) {
  return String(text || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function slugId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
