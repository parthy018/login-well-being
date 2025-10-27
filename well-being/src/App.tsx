import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import OnBoarding from "./page/Onboarding";
import PatientForm from "./page/PatientForm";
import Done from "./page/Done";
import { useOnboarding } from "./context/OnboardingContext";

function Protected({ children }: { children: React.ReactElement }) {
  const { profile } = useOnboarding();
  return profile ? children : <Navigate to="/onboarding" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding" replace />} />
      {/* <Route path="/kiosk" element={<Kiosk />} /> */}
      <Route path="/onboarding" element={<OnBoarding />} />
      <Route
        path="/form"
        element={
          <Protected>
            <PatientForm />
          </Protected>
        }
      />
      <Route
        path="/done"
        element={
          <Protected>
            <Done />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/onboarding" replace />} />
    </Routes>
  );
}
