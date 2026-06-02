import type { PropsWithChildren } from "react";
import { useI18n } from "../../i18n/useI18n";
import { cn } from "../../utils/cn";

type CollapsibleSectionProps = PropsWithChildren<{
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  collapsed: boolean;
  onToggle: () => void;
  level?: number;
}>;

export function CollapsibleSection({
  id,
  title,
  subtitle,
  meta,
  collapsed,
  onToggle,
  level = 0,
  children,
}: CollapsibleSectionProps) {
  const { t } = useI18n();

  return (
    <section className={cn("collapsible-section", `collapsible-section--level-${level}`)} data-section-id={id}>
      <button
        type="button"
        className="collapsible-section__header"
        onClick={onToggle}
        aria-expanded={!collapsed}
        aria-controls={`section-${id}`}
        aria-label={
          collapsed ? t("aria.expandSection", { title }) : t("aria.collapseSection", { title })
        }
      >
        <span className="collapsible-section__chevron" aria-hidden="true">
          {collapsed ? "▸" : "▾"}
        </span>
        <span className="collapsible-section__titles">
          <strong>{title}</strong>
          {subtitle ? <span>{subtitle}</span> : null}
        </span>
        {meta ? <span className="collapsible-section__meta">{meta}</span> : null}
      </button>
      {!collapsed ? (
        <div id={`section-${id}`} className="collapsible-section__body">
          {children}
        </div>
      ) : null}
    </section>
  );
}
