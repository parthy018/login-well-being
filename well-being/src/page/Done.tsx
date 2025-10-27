import React from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../context/OnboardingContext";

const styles = {
  container: { maxWidth: 720, margin: "0 auto", padding: 24 } as React.CSSProperties,
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 16 } as React.CSSProperties,
  btn: { cursor: "pointer", borderRadius: 12, border: "1px solid #0f172a", padding: "10px 14px", background: "#0f172a", color: "#fff" } as React.CSSProperties,
  btnAlt: { cursor: "pointer", borderRadius: 12, border: "1px solid #0f172a", padding: "10px 14px", background: "#fff", color: "#0f172a" } as React.CSSProperties,
  muted: { color: "#64748b", fontSize: 14 } as React.CSSProperties,
  summaryBox: { background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 } as React.CSSProperties,
};

export default function Done() {
  const nav = useNavigate();
  const { form, reset } = useOnboarding();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={{ marginTop: 0, color: "#065f46" }}>All set!</h1>
        <p style={styles.muted}>Your information has been securely submitted. Please return to reception.</p>

        <div style={styles.summaryBox}>
          {([
            ["Name", form.fullName],
            ["Email", form.email],
            ["Phone", form.phone],
            ["DOB", form.dob],
            ["Sex", form.sex],
            ["Address", [form.address1, form.city, form.state, form.zip].filter(Boolean).join(", ")],
            ["Insurance", `${form.insuranceProvider}${form.memberId ? ` (${form.memberId})` : ""}`],
            ["Reason", form.reason || "—"],
          ] as Array<[string, string]>).map(([k, v]) => (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, fontSize: 14, padding: "4px 0" }}>
              <div style={{ ...styles.muted, fontSize: 13 }}>{k}</div>
              <div style={{ fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            style={styles.btnAlt}
            onClick={() => {
              reset();
              nav("/onboarding", { replace: true });
            }}
          >
            Start another
          </button>
          <button style={styles.btn} onClick={() => window.print()}>Print</button>
        </div>
      </div>
    </div>
  );
}
