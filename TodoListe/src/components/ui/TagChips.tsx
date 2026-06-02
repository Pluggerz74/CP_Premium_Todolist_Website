import { cn } from "../../utils/cn";

type TagChipsProps = {
  tags: string[];
  prefix?: boolean;
  className?: string;
  maxVisible?: number;
};

export function TagChips({ tags, prefix = false, className, maxVisible }: TagChipsProps) {
  if (tags.length === 0) return null;

  const visibleTags = maxVisible ? tags.slice(0, maxVisible) : tags;
  const hiddenCount = maxVisible ? Math.max(0, tags.length - maxVisible) : 0;

  return (
    <div className={cn("tag-chips", className)}>
      {visibleTags.map((tag) => (
        <span key={tag} className="tag-chip">
          {prefix ? `#${tag}` : tag}
        </span>
      ))}
      {hiddenCount > 0 ? <span className="tag-chip tag-chip--more">+{hiddenCount}</span> : null}
    </div>
  );
}
