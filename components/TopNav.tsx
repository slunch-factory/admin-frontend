"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { href: "/store", key: "copy", label: "스토어 상세" },
  { href: "/image", key: "image", label: "스토어 이미지" },
  { href: "/subscribe", key: "subscribe", label: "구독 상세" },
] as const;

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/v1/admin/store/admin/login", { method: "DELETE" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <nav className="unified-top-nav" role="tablist" aria-label="관리 도구 탭">
      <div className="unified-brand">SLUNCH</div>
      <div className="unified-nav-tabs">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`unified-nav-tab ${isActive ? "active" : ""}`}
              role="tab"
              aria-selected={isActive}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      <button
        type="button"
        onClick={logout}
        style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "rgba(255,255,255,0.85)",
          padding: "6px 14px",
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        로그아웃
      </button>
    </nav>
  );
}
