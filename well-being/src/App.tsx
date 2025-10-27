import React, { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import GoogleLoginButton from "./component/GoogleLoginButton";
import type { Profile } from "./types/type";
type Sex = "Male" | "Female" | "Other" | "Prefer not to say" | "";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  sex: Sex;
  address1: string;
  city: string;
  state: string;
  zip: string;
  insuranceProvider: string;
  memberId: string;
  reason: string;
  allergies: string;
  consentTerms: boolean;
  consentTreatment: boolean;
}

type Errors = Partial<Record<keyof FormState, string>>;

const styles = {
  container: { maxWidth: 1120, margin: "0 auto", padding: 24 } as React.CSSProperties,
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 16 } as React.CSSProperties,
  btn: { cursor: "pointer", borderRadius: 12, border: "1px solid #0f172a", padding: "10px 14px", background: "#0f172a", color: "#fff" } as React.CSSProperties,
  btnAlt: { cursor: "pointer", borderRadius: 12, border: "1px solid #0f172a", padding: "10px 14px", background: "#fff", color: "#0f172a" } as React.CSSProperties,
  muted: { color: "#64748b", fontSize: 14 } as React.CSSProperties,
  codeBox: { fontSize: 12, background: "#f1f5f9", padding: 8, borderRadius: 8, display: "block", wordBreak: "break-all" } as React.CSSProperties,
  qrWrap: { display: "grid", placeItems: "center", padding: 16, background: "#f1f5f9", borderRadius: 12, margin: "12px 0" } as React.CSSProperties,
  label: { fontSize: 14, color: "#334155", marginBottom: 6 } as React.CSSProperties,
  input: { width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 12 } as React.CSSProperties,
  errorText: { color: "#b91c1c", fontSize: 12 } as React.CSSProperties,
  hr: { height: 1, background: "#e5e7eb", border: 0, margin: "16px 0" } as React.CSSProperties,
  grid2: { display: "grid", gap: 12, gridTemplateColumns: "1fr" } as React.CSSProperties,
  summaryBox: { background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 } as React.CSSProperties,
};

const QR_LINK = `${window.location.origin}/?signin=1`;
const startAtSignin = new URLSearchParams(window.location.search).get("signin") === "1";

export default function App() {
  // 0 = Landing, 1 = Google, 2 = Form, 3 = Done
  const [step, setStep] = useState<number>(startAtSignin ? 1 : 0);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    sex: "",
    address1: "",
    city: "",
    state: "",
    zip: "",
    insuranceProvider: "",
    memberId: "",
    reason: "",
    allergies: "",
    consentTerms: false,
    consentTreatment: false,
  });

  const errors = useMemo<Errors>(() => validate(form), [form]);

  function handleGoogleSuccess(p: Profile) {
    setProfile(p);
    setForm((f) => ({
      ...f,
      fullName: p.name || f.fullName,
      email: p.email || f.email,
    }));
    setStep(2);
  }

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (Object.keys(errors).length) return;

    // Example: send to backend and verify profile.idToken on server
    // await fetch("/api/onboarding", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ profile, form }),
    // });

    setStep(3);
  }

  return (
    <div style={styles.container}>
      <Header step={step} />

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr" }}>
        {/* Left: Fixed QR (print once) */}
        <div style={styles.card}>
          <h3 style={{ marginTop: 0 }}>Kiosk / Staff QR</h3>
          <p style={styles.muted}>Scan to begin. This QR always opens the Google sign-in screen.</p>
          <code style={styles.codeBox}>{QR_LINK}</code>
          <div style={styles.qrWrap}>
            <QRCodeSVG value={QR_LINK} size={180} includeMargin />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.btn} onClick={() => window.print()}>Print</button>
            <button style={styles.btnAlt} onClick={() => (window.location.href = QR_LINK)}>
              Open patient link →
            </button>
          </div>
        </div>

        {/* Right: Patient flow */}
        <div style={styles.card}>
          {step === 0 && (
            <>
              <h2 style={{ marginTop: 0 }}>Welcome to Your Clinic</h2>
              <p style={styles.muted}>Scan the QR at reception to start, or continue here for a quick demo.</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={styles.btn} onClick={() => (window.location.href = QR_LINK)}>Get Started →</button>
                <button style={styles.btnAlt} onClick={() => setStep(1)}>I already scanned</button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 style={{ marginTop: 0 }}>Sign in with Google</h2>
              <p style={styles.muted}>We only use your name & email to prefill the form.</p>
              <GoogleLoginButton onSuccess={handleGoogleSuccess} />
              <hr style={styles.hr} />
              <button style={styles.btnAlt} onClick={() => setStep(2)}>Skip for now</button>
              <p style={{ ...styles.muted, marginTop: 8 }}>
                Production tip: verify the received ID token on your server.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ marginTop: 0 }}>Patient Information</h2>
              {Object.keys(errors).length > 0 && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#7f1d1d", padding: 12, borderRadius: 12, marginBottom: 12 }}>
                  Please fix the highlighted fields.
                </div>
              )}
              <form onSubmit={onSubmit} style={styles.grid2}>
                <Field label="Full name" name="fullName" value={form.fullName} onChange={onChange} error={errors.fullName} />
                <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} />
                <Field label="Phone (10 digits)" name="phone" value={form.phone} onChange={onChange} error={errors.phone} />
                <Field label="Date of birth" name="dob" type="date" value={form.dob} onChange={onChange} error={errors.dob} />
                <Select label="Sex" name="sex" value={form.sex} onChange={onChange} options={["Male","Female","Other","Prefer not to say"]} />

                <Field style={{ gridColumn: "1 / -1" }} label="Address line" name="address1" value={form.address1} onChange={onChange} />
                <Field label="City" name="city" value={form.city} onChange={onChange} />
                <Field label="State/Province" name="state" value={form.state} onChange={onChange} />
                <Field label="ZIP/Postal" name="zip" value={form.zip} onChange={onChange} />

                <Field label="Insurance provider" name="insuranceProvider" value={form.insuranceProvider} onChange={onChange} />
                <Field label="Member/Policy ID" name="memberId" value={form.memberId} onChange={onChange} />

                <TextArea style={{ gridColumn: "1 / -1" }} label="Reason for visit" name="reason" value={form.reason} onChange={onChange} />
                <TextArea style={{ gridColumn: "1 / -1" }} label="Allergies / Medications" name="allergies" value={form.allergies} onChange={onChange} />

                <Checkbox
                  label={<>I agree to the <a href="#" onClick={(e) => e.preventDefault()}>Terms</a> & <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>.</>}
                  name="consentTerms"
                  checked={form.consentTerms}
                  onChange={onChange}
                  error={errors.consentTerms}
                  style={{ gridColumn: "1 / -1" }}
                />
                <Checkbox
                  label="I consent to treatment."
                  name="consentTreatment"
                  checked={form.consentTreatment}
                  onChange={onChange}
                  error={errors.consentTreatment}
                  style={{ gridColumn: "1 / -1" }}
                />

                <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <button type="button" style={styles.btnAlt} onClick={() => setStep(1)}>Back</button>
                  <button type="submit" style={styles.btn}>Save & Continue →</button>
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2 style={{ marginTop: 0, color: "#065f46" }}>All set!</h2>
              <p style={styles.muted}>Your information has been securely submitted. Please return to reception.</p>
              <div style={styles.summaryBox}>
                <Info label="Name" value={form.fullName} />
                <Info label="Email" value={form.email} />
                <Info label="Phone" value={form.phone} />
                <Info label="DOB" value={form.dob} />
                <Info label="Sex" value={form.sex} />
                <Info label="Address" value={[form.address1, form.city, form.state, form.zip].filter(Boolean).join(", ")} />
                <Info label="Insurance" value={`${form.insuranceProvider}${form.memberId ? ` (${form.memberId})` : ""}`} />
                <Info label="Reason" value={form.reason || "—"} />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button style={styles.btnAlt} onClick={() => { window.location.href = "/"; }}>Start another</button>
                <button style={styles.btn} onClick={() => window.print()}>Print</button>
              </div>
            </>
          )}
        </div>
      </div>

      <p style={{ ...styles.muted, marginTop: 8 }}>Demo only — no data leaves your browser.</p>
    </div>
  );
}

/* ---------- UI bits ---------- */
function Field(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; style?: React.CSSProperties }
) {
  const { label, error, style, ...rest } = props;
  return (
    <label style={style}>
      <div style={styles.label}>{label}</div>
      <input {...rest} style={styles.input} />
      {error && <div style={styles.errorText}>{error}</div>}
    </label>
  );
}

function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; style?: React.CSSProperties }
) {
  const { label, error, style, ...rest } = props;
  return (
    <label style={style}>
      <div style={styles.label}>{label}</div>
      <textarea rows={4} {...rest} style={styles.input} />
      {error && <div style={styles.errorText}>{error}</div>}
    </label>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: keyof FormState;
  value: Sex;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<Exclude<Sex, ""> | "">;
}) {
  return (
    <label>
      <div style={styles.label}>{label}</div>
      <select name={name} value={value} onChange={onChange} style={styles.input}>
        <option value="">— Select —</option>
        {options.map((o) => (
          <option key={o || "blank"} value={o}>
            {o || "— Select —"}
          </option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({
  label,
  name,
  checked,
  onChange,
  error,
  style,
}: {
  label: React.ReactNode;
  name: keyof FormState;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, ...style }}>
      <input id={name as string} name={name as string} type="checkbox" checked={checked} onChange={onChange} style={{ width: 18, height: 18 }} />
      <label htmlFor={name as string} style={{ fontSize: 14 }}>
        {label}
      </label>
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, fontSize: 14, padding: "4px 0" }}>
      <div style={{ ...styles.muted, fontSize: 13 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value || "—"}</div>
    </div>
  );
}

function Header({ step }: { step: number }) {
  const labels = ["Scan QR", "Google", "Form", "Done"];
  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <h1 style={{ margin: 0 }}>Patient Onboarding</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
        {labels.map((l, i) => (
          <React.Fragment key={l}>
            <span
              style={{
                display: "grid",
                placeItems: "center",
                width: 28,
                height: 28,
                borderRadius: 999,
                border: `1px solid ${i <= step ? "#0f172a" : "#cbd5e1"}`,
                background: i <= step ? "#0f172a" : "#fff",
                color: i <= step ? "#fff" : "#0f172a",
              }}
            >
              {i + 1}
            </span>
            <span style={{ opacity: 0.8 }}>{l}</span>
            {i < labels.length - 1 && <span style={{ color: "#cbd5e1" }}>›</span>}
          </React.Fragment>
        ))}
      </div>
    </header>
  );
}

/* ---------- validation ---------- */
function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.fullName.trim()) e.fullName = "Full name is required";
  if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Valid email is required";
  if (!/^\d{10}$/.test(f.phone.replace(/\D/g, ""))) e.phone = "10-digit phone required";
  if (!f.dob) e.dob = "Date of birth is required";
  if (!f.consentTerms) e.consentTerms = "Accept Terms & Privacy";
  if (!f.consentTreatment) e.consentTreatment = "Treatment consent required";
  return e;
}
