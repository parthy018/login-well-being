import React, { useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useOnboarding, type FormState, type Sex } from "../context/OnboardingContext";

type Errors = Partial<Record<keyof FormState, string>>;

const styles = {
  container: { maxWidth: 900, margin: "0 auto", padding: 24 } as React.CSSProperties,
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 16 } as React.CSSProperties,
  btn: { cursor: "pointer", borderRadius: 12, border: "1px solid #0f172a", padding: "10px 14px", background: "#0f172a", color: "#fff" } as React.CSSProperties,
  btnAlt: { cursor: "pointer", borderRadius: 12, border: "1px solid #0f172a", padding: "10px 14px", background: "#fff", color: "#0f172a" } as React.CSSProperties,
  label: { fontSize: 14, color: "#334155", marginBottom: 6 } as React.CSSProperties,
  input: { width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 12 } as React.CSSProperties,
  errorText: { color: "#b91c1c", fontSize: 12 } as React.CSSProperties,
  muted: { color: "#64748b", fontSize: 14 } as React.CSSProperties,
  grid2: { display: "grid", gap: 12, gridTemplateColumns: "1fr" } as React.CSSProperties,
  errorBox: { background: "#fef2f2", border: "1px solid #fecaca", color: "#7f1d1d", padding: 12, borderRadius: 12, marginBottom: 12 } as React.CSSProperties,
};

export default function PatientForm() {
  const nav = useNavigate();
  const { profile, form, setForm } = useOnboarding();

  // Simple guard: if no profile (not logged in), send to /onboarding
  if (!profile) return <Navigate to="/onboarding" replace />;

  const errors = useMemo<Errors>(() => validate(form), [form]);

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

    // Example: send to backend (verify profile.idToken server-side)
    // await fetch("/api/onboarding", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ profile, form }) });

    nav("/done", { replace: true });
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={{ marginTop: 0 }}>Patient Information</h1>
        {Object.keys(errors).length > 0 && <div style={styles.errorBox}>Please fix the highlighted fields.</div>}

        <form onSubmit={onSubmit} style={styles.grid2}>
          <Field label="Full name" name="fullName" value={form.fullName} onChange={onChange} error={errors.fullName} />
          <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} />
          <Field label="Phone (10 digits)" name="phone" value={form.phone} onChange={onChange} error={errors.phone} />
          <Field label="Date of birth" name="dob" type="date" value={form.dob} onChange={onChange} error={errors.dob} />
          <Select label="Sex" name="sex" value={form.sex} onChange={onChange} options={["Male","Female","Other","Prefer not to say"]} />

          <Field label="Address line" name="address1" value={form.address1} onChange={onChange} />
          <Field label="City" name="city" value={form.city} onChange={onChange} />
          <Field label="State/Province" name="state" value={form.state} onChange={onChange} />
          <Field label="ZIP/Postal" name="zip" value={form.zip} onChange={onChange} />

          <Field label="Insurance provider" name="insuranceProvider" value={form.insuranceProvider} onChange={onChange} />
          <Field label="Member/Policy ID" name="memberId" value={form.memberId} onChange={onChange} />

          <TextArea label="Reason for visit" name="reason" value={form.reason} onChange={onChange} />
          <TextArea label="Allergies / Medications" name="allergies" value={form.allergies} onChange={onChange} />

          <Checkbox
            label={<>I agree to the <a href="#" onClick={(e) => e.preventDefault()}>Terms</a> & <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>.</>}
            name="consentTerms"
            checked={form.consentTerms}
            onChange={onChange}
            error={errors.consentTerms}
          />
          <Checkbox
            label="I consent to treatment."
            name="consentTreatment"
            checked={form.consentTreatment}
            onChange={onChange}
            error={errors.consentTreatment}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <button type="submit" style={styles.btn}>Save & Continue →</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --- small UI bits --- */
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
}: {
  label: React.ReactNode;
  name: keyof FormState;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
      <input id={name as string} name={name as string} type="checkbox" checked={checked} onChange={onChange} style={{ width: 18, height: 18 }} />
      <label htmlFor={name as string} style={{ fontSize: 14 }}>
        {label}
      </label>
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
}

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
