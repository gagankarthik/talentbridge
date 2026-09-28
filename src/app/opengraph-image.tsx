import { ImageResponse } from "next/og";

export const alt = "TalentBridge: pre-vetted engineers for enterprises and staffing firms";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social share card in the brand palette (evergreen stage, mint signal).
export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#071a14", padding: "72px", color: "white" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#2ee6a8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#071a14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 15.5h19" />
              <path d="M6.5 20.5v-15M17.5 20.5v-15" />
              <path d="M6.5 6c1.8 5 3.4 7.5 5.5 7.5S15.7 11 17.5 6" />
            </svg>
          </div>
          <span style={{ fontSize: 34, fontWeight: 600 }}>TalentBridge</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: -2, maxWidth: 900 }}>Hire the engineers others are still searching for.</span>
          <span style={{ marginTop: 28, fontSize: 30, color: "#a7c4ba" }}>Screened, compliance-cleared and ready to start in 48 hours.</span>
        </div>
        <div style={{ display: "flex", height: 8, width: 220, borderRadius: 4, background: "#2ee6a8" }} />
      </div>
    ),
    size,
  );
}
