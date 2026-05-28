"use client";

type Item = { id: string; label: string };

type Props = {
  title: string;
  items: Item[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd?: () => void;
  onDelete?: () => void;
};

/**
 * Shared sidebar across store/image/subscribe pages. Uses inline styles for
 * layout-critical visuals so it renders identically inside any tab namespace.
 */
export function ProductSidebar({ title, items, selectedId, onSelect, onAdd, onDelete }: Props) {
  return (
    <div style={S.sidebar}>
      <div style={S.header}>
        <h1 style={S.headerH1}>{title}</h1>
      </div>
      {(onAdd || onDelete) && (
        <div style={S.actions}>
          {onAdd && (
            <button type="button" style={{ ...S.btn, ...S.btnAdd }} onClick={onAdd}>
              추가
            </button>
          )}
          {onDelete && (
            <button type="button" style={{ ...S.btn, ...S.btnDelete }} onClick={onDelete}>
              삭제
            </button>
          )}
        </div>
      )}
      <div style={S.list}>
        {items.length === 0 ? (
          <div style={S.empty}>
            제품이 없습니다. &lsquo;추가&rsquo;를 눌러 시작하세요.
          </div>
        ) : (
          items.map((item) => {
            const isActive = selectedId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                style={{ ...S.item, ...(isActive ? S.itemActive : null) }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#e8e2e2";
                    e.currentTarget.style.borderColor = "#e6863f";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.borderColor = "#c9bcbe";
                  }
                }}
              >
                <span style={S.itemName}>{item.label}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 280,
    minWidth: 280,
    flexShrink: 0,
    height: "100%",
    backgroundColor: "#e8e2e2",
    borderRight: "1px solid #c9bcbe",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  header: {
    padding: "24px 16px",
    borderBottom: "1px solid #c9bcbe",
    backgroundColor: "#6e5035",
    textAlign: "center",
    flexShrink: 0,
  },
  headerH1: {
    fontSize: 14,
    fontWeight: 600,
    color: "white",
    margin: 0,
    letterSpacing: 0.5,
  },
  actions: {
    padding: 12,
    borderBottom: "1px solid #c9bcbe",
    display: "flex",
    gap: 8,
    flexShrink: 0,
  },
  btn: {
    flex: 1,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 600,
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    color: "white",
    fontFamily: "inherit",
    transition: "background-color 0.15s",
  },
  btnAdd: { backgroundColor: "#6e5035" },
  btnDelete: { backgroundColor: "#ff1714" },
  list: {
    flex: 1,
    overflowY: "auto",
    padding: 12,
  },
  empty: {
    padding: 16,
    fontSize: 12,
    color: "#6e5035",
  },
  item: {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "white",
    border: "1px solid #c9bcbe",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    color: "#250a00",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: "background-color 0.15s, border-color 0.15s",
  },
  itemActive: {
    backgroundColor: "#b8976a",
    color: "#250a00",
    borderColor: "#b8976a",
    fontWeight: 600,
  },
  itemName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block",
  },
};
