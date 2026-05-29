"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchStoreProducts } from "@/lib/api-client";
import {
  SHOTS,
  generatePrompts,
  inputsFromStyle,
  matchFob,
  type FobData,
  type PromptContext,
  type ShotPrompt,
} from "@/lib/prompt-gen";
import type { StoreProduct } from "@/types/product";

type InputState = {
  bgColor: string;
  wallColor: string;
  plate: string;
  utensil: string;
  noUtensil: string;
  garnish: string;
  noGarnish: string;
  foodDesc: string;
  orefFood: string;
  orefPackage: string;
  lens: string;
  angle: string;
  distance: string;
};

const EMPTY_INPUTS: InputState = {
  bgColor: "",
  wallColor: "",
  plate: "",
  utensil: "",
  noUtensil: "",
  garnish: "",
  noGarnish: "",
  foodDesc: "",
  orefFood: "",
  orefPackage: "",
  lens: "50mm",
  angle: "아이레벨",
  distance: "미디엄",
};

export function ImageClient({ fobs }: { fobs: FobData[] }) {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [inputs, setInputs] = useState<InputState>(EMPTY_INPUTS);
  const [activeShots, setActiveShots] = useState<Set<string>>(
    () => new Set(SHOTS.map((s) => s.id)),
  );
  const [results, setResults] = useState<ShotPrompt[]>([]);
  const [foodLabel, setFoodLabel] = useState("");
  const [copiedKeys, setCopiedKeys] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStoreProducts()
      .then((list) => setProducts(list))
      .catch((e) => console.error("상품 목록 로드 실패", e))
      .finally(() => setLoadingProducts(false));
  }, []);

  const selectedProduct = useMemo(
    () => products.find((p) => p.product_id === selectedProductId) ?? null,
    [products, selectedProductId],
  );
  const matchedFob = useMemo(
    () => matchFob(selectedProduct, fobs),
    [selectedProduct, fobs],
  );

  function handleProductChange(id: string) {
    setSelectedProductId(id);
    const product = products.find((p) => p.product_id === id) ?? null;
    const fob = matchFob(product, fobs);
    const auto = inputsFromStyle(fob);
    setInputs((prev) => ({
      ...EMPTY_INPUTS,
      lens: prev.lens,
      angle: prev.angle,
      distance: prev.distance,
      bgColor: auto.bgColor,
      wallColor: auto.wallColor,
      plate: auto.plate,
      utensil: auto.utensil,
      noUtensil: "",
      garnish: auto.garnish,
      noGarnish: "",
      foodDesc: auto.foodDesc,
      orefFood: auto.orefFood,
      orefPackage: auto.orefPackage,
    }));
    setResults([]);
    setCopiedKeys(new Set());
    setError(null);
  }

  function setInput<K extends keyof InputState>(key: K, value: string) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function toggleShot(id: string) {
    setActiveShots((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleGenerate() {
    setError(null);
    if (!selectedProduct) {
      setError("상품을 먼저 선택하세요.");
      return;
    }
    if (activeShots.size === 0) {
      setError("최소 1개 이상의 컷을 선택하세요.");
      return;
    }
    try {
      const ctx: PromptContext = {
        product: selectedProduct,
        fob: matchedFob,
        inputs: {
          plate: inputs.plate,
          garnish: inputs.garnish,
          bgColor: inputs.bgColor,
          utensil: inputs.utensil,
          wallColor: inputs.wallColor,
          foodDesc: inputs.foodDesc,
          orefFood: inputs.orefFood,
          orefPackage: inputs.orefPackage,
        },
      };
      const ordered = SHOTS.filter((s) => activeShots.has(s.id)).map((s) => s.id);
      const prompts = generatePrompts(ctx, ordered);
      setResults(prompts);
      setCopiedKeys(new Set());
      setFoodLabel(matchedFob?.nameEn || selectedProduct.product_id);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const editedPromptsRef = useRef<Record<string, string>>({});
  const handlePromptEdit = useCallback((key: string, value: string) => {
    editedPromptsRef.current[key] = value;
  }, []);

  function getCurrentPrompt(key: string, original: string) {
    return editedPromptsRef.current[key] ?? original;
  }

  function handleIndividualCopy(key: string) {
    setCopiedKeys((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }

  async function copyAll() {
    const all = results
      .map((r, i) => getCurrentPrompt(`${r.key}-${i}`, r.prompt))
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(all);
      setCopiedKeys(new Set(results.map((r, i) => `${r.key}-${i}`)));
    } catch (e) {
      console.error("clipboard write failed", e);
    }
  }

  const totalCount = results.length;
  const copyCount = copiedKeys.size;

  return (
    <div className="tab-panel tab-image active">
      <div className="layout">
        {/* ===== LEFT PANEL ===== */}
        <div
          className="panel-left"
          style={{ display: "flex", flexDirection: "column", paddingBottom: 0 }}
        >
          {/* 제품 선택 */}
          <div className="section">
            <div className="section-title">
              제품 선택 <span className="badge">STEP 1</span>
            </div>
            <div className="product-select-wrap">
              <select
                value={selectedProductId}
                onChange={(e) => handleProductChange(e.target.value)}
                disabled={loadingProducts}
              >
                <option value="">
                  {loadingProducts ? "불러오는 중..." : "상품을 선택하세요"}
                </option>
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.product_id}
                  </option>
                ))}
              </select>
            </div>
            {selectedProduct && (
              <div style={{ fontSize: 11, marginTop: 10, color: "var(--text-secondary)" }}>
                매칭 FOB:{" "}
                {matchedFob ? (
                  <strong style={{ color: "var(--text-primary)" }}>
                    {matchedFob.nameKr}
                    {matchedFob.nameEn ? ` (${matchedFob.nameEn})` : ""}
                  </strong>
                ) : (
                  <em style={{ color: "var(--danger)" }}>
                    매칭 실패 — foodVisual/패키지/스타일 자동입력 비활성
                  </em>
                )}
              </div>
            )}
          </div>

          {/* 스타일링 & 소품 */}
          <div className="section">
            <div className="section-title">스타일링 & 소품</div>
            <div className="field">
              <label htmlFor="bgColor">
                테이블 (바닥) <span className="hint">(한글 OK)</span>
              </label>
              <input
                id="bgColor"
                type="text"
                value={inputs.bgColor}
                onChange={(e) => setInput("bgColor", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="wallColor">
                벽 (배경) <span className="hint">(한글 OK)</span>
              </label>
              <input
                id="wallColor"
                type="text"
                value={inputs.wallColor}
                onChange={(e) => setInput("wallColor", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="plate">그릇 / 플레이트</label>
              <input
                id="plate"
                type="text"
                value={inputs.plate}
                onChange={(e) => setInput("plate", e.target.value)}
              />
            </div>
            <div className="row">
              <div className="field">
                <label htmlFor="utensil">식기류</label>
                <input
                  id="utensil"
                  type="text"
                  value={inputs.utensil}
                  onChange={(e) => setInput("utensil", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="noUtensil">제외 식기</label>
                <input
                  id="noUtensil"
                  type="text"
                  value={inputs.noUtensil}
                  onChange={(e) => setInput("noUtensil", e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="field">
                <label htmlFor="garnish">가니쉬</label>
                <input
                  id="garnish"
                  type="text"
                  value={inputs.garnish}
                  onChange={(e) => setInput("garnish", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="noGarnish">제외 가니쉬</label>
                <input
                  id="noGarnish"
                  type="text"
                  value={inputs.noGarnish}
                  onChange={(e) => setInput("noGarnish", e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="foodDesc">
                음식 설명 (FOB foodVisual 없을 때 fallback, EN)
              </label>
              <textarea
                id="foodDesc"
                value={inputs.foodDesc}
                onChange={(e) => setInput("foodDesc", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* 카메라 & 조명 */}
          <div className="section">
            <div className="section-title">카메라 & 조명</div>
            <div className="field">
              <label>조명</label>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-secondary)",
                  padding: "8px 10px",
                  background: "var(--bg-tertiary)",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  lineHeight: 1.5,
                }}
              >
                🔒 POPEYE 스타일 고정 · 다이렉트 플래시 · 5600K 트루컬러 · 하드 클린 쉐도우 · 노랗지 않은 조명
              </div>
            </div>
            <div className="row">
              <div className="field">
                <label htmlFor="lens">렌즈</label>
                <select
                  id="lens"
                  value={inputs.lens}
                  onChange={(e) => setInput("lens", e.target.value)}
                >
                  <option value="35mm">35mm</option>
                  <option value="50mm">50mm</option>
                  <option value="85mm">85mm</option>
                  <option value="100mm macro">100mm macro</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="angle">앵글</label>
                <select
                  id="angle"
                  value={inputs.angle}
                  onChange={(e) => setInput("angle", e.target.value)}
                >
                  <option value="아이레벨">아이레벨</option>
                  <option value="살짝 위 30도">살짝 위 (30°)</option>
                  <option value="탑다운 오버헤드">탑다운</option>
                  <option value="로우앵글">로우 앵글</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="distance">거리</label>
                <select
                  id="distance"
                  value={inputs.distance}
                  onChange={(e) => setInput("distance", e.target.value)}
                >
                  <option value="클로즈업">클로즈업</option>
                  <option value="미디엄">미디엄</option>
                  <option value="와이드">와이드</option>
                </select>
              </div>
            </div>
          </div>

          {/* 컷 구성 선택 */}
          <div className="section">
            <div className="section-title">
              컷 구성 선택 <span className="badge">STEP 2</span>
            </div>
            <p className="hint" style={{ marginBottom: 12 }}>
              상세페이지에 필요한 이미지 컷을 선택하세요. 각 컷은 상세페이지 HTML의 해당 섹션에 매핑됩니다.
            </p>
            {SHOTS.map((shot, idx) => {
              const active = activeShots.has(shot.id);
              return (
                <div
                  key={shot.id}
                  className={`shot-card-select ${active ? "active" : ""}`}
                  onClick={() => toggleShot(shot.id)}
                  data-type={shot.type}
                >
                  <div className="shot-content">
                    <div className="shot-name">
                      <span className="num">{idx + 1}</span>
                      {shot.name}
                      <span className={`shot-type ${shot.type}`}>{shot.type.toUpperCase()}</span>
                    </div>
                    <div className="shot-purpose">{shot.purpose}</div>
                    <div className="shot-maps">{shot.maps}</div>
                  </div>
                  <span className="shot-check">✓</span>
                </div>
              );
            })}
          </div>

          {/* 옴니 레퍼런스 */}
          <div className="section">
            <div className="section-title">
              옴니 레퍼런스 (--oref) <span className="badge-blue">STEP 3</span>
            </div>
            <p className="hint" style={{ marginBottom: 12 }}>
              URL 등록 시 프롬프트에 <code>--oref URL --ow (컷별 가중치)</code> 자동 추가
            </p>
            <div className="field">
              <label htmlFor="orefFood">완성 음식 사진 (hero, dish, serving, reveal)</label>
              <input
                id="orefFood"
                type="text"
                value={inputs.orefFood}
                onChange={(e) => setInput("orefFood", e.target.value)}
                placeholder="https://... 완성된 음식 사진 URL"
              />
            </div>
            <div className="field">
              <label htmlFor="orefPackage">패키지 사진 (servingBanner, ending)</label>
              <input
                id="orefPackage"
                type="text"
                value={inputs.orefPackage}
                onChange={(e) => setInput("orefPackage", e.target.value)}
                placeholder="https://... 제품 패키지 사진 URL"
              />
            </div>
          </div>

          {/* GENERATE — 사이드바 가장 아래 고정 */}
          <div
            className="section section-generate"
            style={{ marginTop: "auto", borderBottom: "none" }}
          >
            {error && (
              <div
                style={{
                  background: "rgba(255,23,20,0.08)",
                  border: "1px solid var(--danger)",
                  color: "var(--danger)",
                  padding: "8px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  marginBottom: 12,
                }}
              >
                {error}
              </div>
            )}
            <button className="btn-generate" onClick={handleGenerate}>
              프롬프트 생성
            </button>
          </div>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div className="panel-right">
          {results.length === 0 ? (
            <div className="empty-state">
              <div className="icon">⚡</div>
              <p>
                1. 좌측에서 상품을 선택하면 자동 매칭된 스타일이 채워집니다.<br />
                2. 필요시 입력값을 수정하고 컷을 선택하세요.<br />
                3. <strong>프롬프트 생성</strong> 버튼을 누르면 여기에 결과가 표시됩니다.
              </p>
            </div>
          ) : (
            <>
              <div className="output-header">
                <h2>
                  생성된 프롬프트{" "}
                  <span className="output-count">
                    {totalCount}컷 — {foodLabel}
                  </span>
                </h2>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-dim)",
                      padding: "4px 10px",
                      background: "var(--bg-tertiary)",
                      borderRadius: 4,
                    }}
                  >
                    {copyCount} / {totalCount} copied
                  </span>
                  <button className="btn-copy-all" onClick={copyAll}>
                    전체 복사
                  </button>
                </div>
              </div>
              {results.map((r, i) => (
                <PromptCard
                  key={`${r.key}-${i}`}
                  index={i + 1}
                  prompt={r}
                  onEdit={(v) => handlePromptEdit(`${r.key}-${i}`, v)}
                  onCopied={() => handleIndividualCopy(`${r.key}-${i}`)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PromptCard — 출력 카드. 디스플레이는 highlight, 편집 토글하면 textarea.
   ========================================================================= */

function PromptCard({
  index,
  prompt,
  onEdit,
  onCopied,
}: {
  index: number;
  prompt: ShotPrompt;
  onEdit: (value: string) => void;
  onCopied: () => void;
}) {
  const [text, setText] = useState(prompt.prompt);
  const [editing, setEditing] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setText(prompt.prompt);
    setEditing(false);
  }, [prompt.prompt]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  function update(v: string) {
    setText(v);
    onEdit(v);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setJustCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setJustCopied(false), 1500);
      onCopied();
    } catch (e) {
      console.error("clipboard write failed", e);
    }
  }

  function reset() {
    setText(prompt.prompt);
    onEdit(prompt.prompt);
  }

  const orefStatus = prompt.orefApplied
    ? { label: "--oref ✓", color: "#6e5035" }
    : prompt.sref
      ? { label: "--oref 미등록", color: "#e6863f" }
      : null;

  return (
    <div className="shot-card" data-type={prompt.type}>
      <div className="shot-header">
        <div className="shot-label">
          <span className="shot-num">{index}</span>
          {prompt.label}
          <span className={`shot-type ${prompt.type}`}>{prompt.type.toUpperCase()}</span>
          <span className="shot-target">{prompt.target}</span>
          {orefStatus && (
            <span style={{ color: orefStatus.color, fontSize: 10, fontWeight: 600 }}>
              {orefStatus.label}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            className="btn-copy"
            onClick={() => setEditing((e) => !e)}
            title={editing ? "보기 모드" : "편집 모드"}
          >
            {editing ? "보기" : "편집"}
          </button>
          {text !== prompt.prompt && (
            <button className="btn-copy" onClick={reset} title="원본으로 되돌리기">
              원본
            </button>
          )}
          <button className="btn-copy" onClick={copy}>
            {justCopied ? "복사됨" : "COPY"}
          </button>
        </div>
      </div>
      <div className="shot-body">
        {prompt.koDesc && <div className="ko-desc-block">{prompt.koDesc}</div>}
        {editing ? (
          <textarea
            value={text}
            onChange={(e) => update(e.target.value)}
            rows={Math.max(4, Math.ceil(text.length / 90))}
            style={{
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
              fontSize: 12,
              lineHeight: 1.7,
              width: "100%",
              resize: "vertical",
            }}
          />
        ) : (
          <div
            className="prompt-text"
            dangerouslySetInnerHTML={{ __html: highlightMjParams(text) }}
          />
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   Helpers
   ========================================================================= */

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightMjParams(raw: string): string {
  const escaped = escapeHtml(raw);
  const firstParam = escaped.search(/\s--\w/);
  if (firstParam === -1) return escaped;

  const creative = escaped.substring(0, firstParam);
  let params = escaped.substring(firstParam);

  params = params.replace(
    /(--no\s+)([\w\s\-,]+?)(?=\s--|$)/g,
    '<span class="mj-neg">$1$2</span>',
  );
  params = params.replace(
    /(--(?:sref|oref)\s+)(https?:\/\/[^\s]+)/g,
    '$1<span class="mj-url">$2</span>',
  );
  params = params.replace(
    /(--\w+)(\s+)(?!https?:\/\/)([\w.:]+)/g,
    '<span class="mj-param">$1</span>$2$3',
  );
  params = params.replace(/(--\w+)(?=\s*$)/g, '<span class="mj-param">$1</span>');

  return (
    creative +
    '<span class="prompt-params-divider">PARAMETERS</span>' +
    params
  );
}

