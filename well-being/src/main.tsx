import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { OnboardingProvider } from "./context/OnboardingContext";
import { HeroUIProvider } from "@heroui/react";
import "./index.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HeroUIProvider>
    <GoogleOAuthProvider clientId={clientId}>
      <OnboardingProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </OnboardingProvider>
    </GoogleOAuthProvider>
    </HeroUIProvider>
  </React.StrictMode>
);
