import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartPulse, Stethoscope, Mail, Lock, ShieldCheck } from "lucide-react";
import GoogleLoginButton from "../component/GoogleLoginButton";
import { useOnboarding } from "../context/OnboardingContext";
import type { Profile } from "../types/type";

export default function OnBoarding() {
  const nav = useNavigate();
  const { setProfile, setForm } = useOnboarding();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);

  function handleGoogleSuccess(p: Profile) {
    setProfile(p);
    setForm((f) => ({ ...f, fullName: p.name || f.fullName, email: p.email || f.email }));
    nav("/form", { replace: true });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setForm((f) => ({ ...f, email }));
    nav("/form", { replace: true });
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden grid grid-rows-[auto,1fr] lg:grid-rows-1 lg:grid-cols-2 bg-gradient-to-br from-teal-50 via-emerald-50 to-white">
      {/* Brand bar (mobile) */}
      <div className="lg:hidden px-4 sm:px-6 pt-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl grid place-items-center bg-teal-600 text-white shadow-sm" />
          <div className="min-w-0">
            <p className="text-lg sm:text-xl font-semibold tracking-tight text-slate-800 leading-tight">PranaCare</p>
            <p className="text-[11px] sm:text-xs text-slate-500">Medical Yoga & Well‑Being</p>
          </div>
        </div>
      </div>

      {/* Left column: form */}
      <div className="flex items-center justify-center px-4 sm:px-8 lg:px-12 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-[560px]"
        >
          <div className="hidden lg:flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-2xl grid place-items-center bg-teal-600 text-white shadow-sm" />
            <div>
              <p className="text-xl font-semibold tracking-tight text-slate-800">PranaCare</p>
              <p className="text-xs text-slate-500">Medical Yoga & Well‑Being</p>
            </div>
          </div>

          <div className="rounded-2xl shadow-md border border-slate-200/60 bg-white/90 backdrop-blur p-5 sm:p-6">
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Welcome back</h1>
              <p className="text-sm text-slate-600">Sign in to continue your personalized yoga plan.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@clinic.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-10 py-3 text-slate-900 placeholder-slate-400 outline-none shadow-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600/30"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <a href="#" className="text-sm text-teal-700 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-10 py-3 text-slate-900 placeholder-slate-400 outline-none shadow-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600/30"
                  />
                </div>
              </div>

              {/* Remember + Submit */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <label className="inline-flex items-center gap-2 select-none text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
                <button
                  type="submit"
                  disabled={!email || !password}
                  className="inline-flex justify-center items-center rounded-xl bg-teal-600 px-5 py-3 text-white font-medium shadow-sm hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-600/40"
                >
                  Continue
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-xs text-slate-500">or</span>
                </div>
              </div>

              {/* Google Sign in */}
              <GoogleLoginButton onSuccess={handleGoogleSuccess} />

              <p className="text-[13px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" /> Your data is protected and never shared without consent.
              </p>
            </form>

            <div className="mt-5 text-center text-sm text-slate-600">
              New to PranaCare? {" "}
              <a href="#" className="text-teal-700 hover:underline">Create an account</a>
            </div>
          </div>

          {/* Benefits row */}
          <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-white/70 backdrop-blur border border-slate-200 p-3">
              <HeartPulse className="mx-auto h-5 w-5 text-teal-700" />
              <p className="mt-1 text-[12px] text-slate-600">Physio‑approved flows</p>
            </div>
            <div className="rounded-xl bg-white/70 backdrop-blur border border-slate-200 p-3">
              <Stethoscope className="mx-auto h-5 w-5 text-teal-700" />
              <p className="mt-1 text-[12px] text-slate-600">Posture assessments</p>
            </div>
            <div className="rounded-xl bg-white/70 backdrop-blur border border-slate-200 p-3">
              <p className="mt-1 text-[12px] text-slate-600">Breathwork coaching</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right column: visual */}
      <div className="hidden xl:block relative overflow-hidden">
        <div className="absolute -top-24 -right-24 size-[360px] rounded-full bg-gradient-to-tr from-teal-200 via-emerald-200 to-white blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute bottom-10 left-8 right-8 rounded-3xl bg-white/60 backdrop-blur border border-teal-200/60 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl grid place-items-center bg-teal-600 text-white">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <p className="text-slate-800 font-medium">Today’s Tip</p>
              <p className="text-slate-600 text-sm">Try a 4‑7‑8 breathing cycle before practice to lower stress.</p>
            </div>
          </div>
          <div className="my-4 border-t border-slate-200" />
          <div className="grid grid-cols-3 gap-3 text-center">
            {["Neck Relief", "Lower Back", "Knee Care"].map((t) => (
              <div key={t} className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-[12px] text-slate-700">{t}</p>
                <button className="mt-2 text-sm text-teal-700 hover:underline">Explore</button>
              </div>
            ))}
          </div>
        </div>
        <svg
          viewBox="0 0 480 480"
          className="absolute inset-0 m-auto w-[70%] max-w-[720px] opacity-20 text-teal-700 pointer-events-none"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M240 80a30 30 0 1 0 0-60 30 30 0 0 0 0 60Z"/>
          <path d="M210 132c20-20 40-20 60 0l40 40c10 10 10 26 0 36l-20 20 40 50c8 10 6 25-5 33-10 7-24 5-31-5l-42-56-42 56c-7 10-21 12-31 5-11-8-13-23-5-33l40-50-20-20c-10-10-10-26 0-36l40-40Z"/>
          <path d="M120 420c0-17 13-30 30-30h180c17 0 30 13 30 30v10H120v-10Z"/>
        </svg>
      </div>

      {/* Mobile-only tip */}
      <div className="xl:hidden px-4 sm:px-6 pb-8">
        <div className="mt-6 rounded-2xl bg-white/70 backdrop-blur border border-teal-200/60 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl grid place-items-center bg-teal-600 text-white">
              <HeartPulse className="h-4 w-4" />
            </div>
            <div>
              <p className="text-slate-800 font-medium">Today’s Tip</p>
              <p className="text-slate-600 text-sm">4‑7‑8 breathing calms your nervous system.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
