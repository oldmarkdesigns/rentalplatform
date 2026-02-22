import { navigateTo } from "../../lib/router";

function Breadcrumbs({ items = [], className = "" }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <nav aria-label="Brödsmulor" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-ink-700">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
              {item.to && !isLast ? (
                <button
                  type="button"
                  className="min-h-0 p-0 text-xs font-semibold text-ink-700 hover:text-black"
                  onClick={() => navigateTo(item.to)}
                >
                  {item.label}
                </button>
              ) : (
                <span className="font-semibold text-ink-700">{item.label}</span>
              )}
              {!isLast ? <span aria-hidden="true" className="text-ink-500">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
