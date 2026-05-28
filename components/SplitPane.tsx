"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  left: React.ReactNode;
  right: React.ReactNode;
  initialLeftPercent?: number;
  minLeftPx?: number;
  minRightPx?: number;
};

/**
 * Horizontal split pane with a draggable divider.
 * Used for the edit / preview split — user can drag to resize.
 */
export function SplitPane({
  left,
  right,
  initialLeftPercent = 50,
  minLeftPx = 320,
  minRightPx = 320,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftPercent, setLeftPercent] = useState(initialLeftPercent);
  const [dragging, setDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;

    function onMove(e: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const total = rect.width;
      const leftPx = Math.max(minLeftPx, Math.min(x, total - minRightPx));
      setLeftPercent((leftPx / total) * 100);
    }

    function onUp() {
      setDragging(false);
    }

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, minLeftPx, minRightPx]);

  return (
    <div ref={containerRef} className="split-pane">
      <div className="split-pane-left" style={{ flexBasis: `${leftPercent}%` }}>
        {left}
      </div>
      <div
        className={`pane-resizer ${dragging ? "dragging" : ""}`}
        onMouseDown={handleMouseDown}
        role="separator"
        aria-orientation="vertical"
      />
      <div className="split-pane-right" style={{ flexBasis: `${100 - leftPercent}%` }}>
        {right}
      </div>
    </div>
  );
}
