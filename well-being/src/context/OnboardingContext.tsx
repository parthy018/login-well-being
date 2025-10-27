import React, { createContext, useContext, useState } from "react";
import type { Profile } from "../types/type";

export type Sex = "Male" | "Female" | "Other" | "Prefer not to say" | "";

export interface FormState {
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

interface Ctx {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  reset: () => void;
}

const OnboardingCtx = createContext<Ctx | null>(null);

const initialForm: FormState = {
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
};

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  const reset = () => {
    setProfile(null);
    setForm(initialForm);
  };

  return (
    <OnboardingCtx.Provider value={{ profile, setProfile, form, setForm, reset }}>
      {children}
    </OnboardingCtx.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingCtx);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
