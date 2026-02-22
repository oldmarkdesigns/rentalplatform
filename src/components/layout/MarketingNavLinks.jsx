import { navigateTo } from "../../lib/router";

const marketingPrimaryItems = [
  { label: "Lediga lokaler", href: "/app/rent?view=available" },
];

const marketingSectionItems = [
  { label: "Funktioner", hash: "#funktioner" },
  { label: "Så fungerar det", hash: "#sa-fungerar-det" },
  { label: "Priser", hash: "#priser" },
  { label: "FAQ", hash: "#faq" },
  { label: "Kontakt", hash: "#kontakt" }
];

function MarketingNavLinks({ hrefPrefix = "", onSectionLinkClick, onPublish, onPrimaryNavClick }) {
  return (
    <>
      {marketingPrimaryItems.map((item) => {
        return (
          <a
            key={item.label}
            href={item.href}
            className="text-sm font-semibold text-ink-700 transition hover:text-black"
            onClick={(event) => {
              if (onPrimaryNavClick?.(event, item) === true) {
                return;
              }
              event.preventDefault();
              navigateTo(item.href);
            }}
          >
            {item.label}
          </a>
        );
      })}
      {marketingSectionItems.map((item) => {
        const href = `${hrefPrefix}${item.hash}`;
        return (
          <a
            key={item.hash}
            href={href}
            className="text-sm font-semibold text-ink-700 transition hover:text-black"
            onClick={onSectionLinkClick ? (event) => onSectionLinkClick(event, item.hash) : undefined}
          >
            {item.label}
          </a>
        );
      })}
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-xl border border-[#0f1930] px-2.5 py-1.5 text-xs font-semibold text-[#0f1930] transition hover:bg-[#f7f9fc]"
        onClick={onPublish}
      >
        <span aria-hidden="true" className="text-sm leading-none">+</span>
        <span>Publicera annons</span>
      </button>
    </>
  );
}

export default MarketingNavLinks;
