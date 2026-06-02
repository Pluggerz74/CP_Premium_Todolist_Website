import type { BreadcrumbItem } from "../../types/hierarchy";
import { useI18n } from "../../i18n/useI18n";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  onNavigate?: (item: BreadcrumbItem) => void;
};

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  const { t } = useI18n();

  if (items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label={t("aria.breadcrumb")}>
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
