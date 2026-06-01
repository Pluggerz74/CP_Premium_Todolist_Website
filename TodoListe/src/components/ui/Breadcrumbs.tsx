import type { BreadcrumbItem } from "../../types/hierarchy";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  onNavigate?: (item: BreadcrumbItem) => void;
};

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={`${item.level}-${item.id}`} className="breadcrumbs__item">
          {index > 0 ? <span className="breadcrumbs__separator">/</span> : null}
          {onNavigate ? (
            <button type="button" className="breadcrumbs__link" onClick={() => onNavigate(item)}>
              {item.label}
            </button>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
