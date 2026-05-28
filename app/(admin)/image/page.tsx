export default function ImagePage() {
  return (
    <div
      className="tab-panel tab-copy active"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        background: "#fcfaf8",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛠</div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#250a00",
            marginBottom: 12,
            letterSpacing: 0.5,
          }}
        >
          스토어 이미지 — 제작 중
        </h1>
        <p style={{ fontSize: 14, color: "#6e5035", lineHeight: 1.6 }}>
          이미지 일괄 관리 화면을 준비 중입니다.
          <br />
          지금은 <b>스토어 상세</b> 탭의 각 섹션에서 이미지를 직접 업로드해 주세요.
        </p>
      </div>
    </div>
  );
}
