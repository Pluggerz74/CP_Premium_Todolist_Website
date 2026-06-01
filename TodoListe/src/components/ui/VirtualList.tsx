import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type VirtualListProps<T> = {
  items: T[];
  itemHeight: number;
  overscan?: number;
  maxHeight?: number;
  className?: string;
  ariaLabel?: string;
  getItemKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
};

export function VirtualList<T>({
  items,
  itemHeight,
  overscan = 6,
  maxHeight = 640,
  className,
  ariaLabel,
  getItemKey,
  renderItem,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(maxHeight);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(viewportHeight / itemHeight) + overscan * 2;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length, startIndex + visibleCount);
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const observer = new ResizeObserver(() => {
      setViewportHeight(Math.min(node.clientHeight || maxHeight, maxHeight));
    });
    observer.observe(node);
    setViewportHeight(Math.min(node.clientHeight || maxHeight, maxHeight));

    return () => observer.disconnect();
  }, [maxHeight]);

  return (
    <div
      ref={containerRef}
      className={className ?? "virtual-list"}
      style={{ maxHeight, overflow: "auto" }}
      onScroll={handleScroll}
      role="list"
      aria-label={ariaLabel}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {items.slice(startIndex, endIndex).map((item, index) => (
            <div key={getItemKey(item, startIndex + index)} role="listitem" style={{ minHeight: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const MemoVirtualList = memo(VirtualList) as typeof VirtualList;
