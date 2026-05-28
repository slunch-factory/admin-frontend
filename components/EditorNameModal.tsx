"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "slunch_admin:last_editor_name";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (editorName: string) => Promise<void> | void;
  title?: string;
};

export function EditorNameModal({ open, onClose, onConfirm, title = "저장하기" }: Props) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved) setName(saved);
    setError(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("이름 또는 아이디를 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, trimmed);
      }
      await onConfirm(trimmed);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          padding: 32,
          borderRadius: 8,
          width: 400,
          maxWidth: "90vw",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
          {title}
        </h2>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 20 }}>
          마지막 수정자로 기록할 이름이나 아이디를 입력해 주세요.
        </p>

        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
          이름 / 아이디
        </label>
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 김도영"
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid var(--border)",
            borderRadius: 6,
            fontSize: 13,
            marginBottom: error ? 6 : 20,
          }}
        />

        {error && (
          <div style={{ fontSize: 12, color: "var(--danger)", marginBottom: 16 }}>{error}</div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            style={{
              padding: "8px 16px",
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              color: "var(--text-secondary)",
            }}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "8px 18px",
              background: "var(--accent-primary)",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
