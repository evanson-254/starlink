import React from "react";
import { ArrowRight, Wifi } from "lucide-react";

/**
 * StarlinkPlanSelector
 * ---------------------------------------------------------
 * A responsive "select your plan" step for a Starlink-reseller
 * style checkout flow. Built with React + Tailwind CSS only.
 *
 * Usage:
 *   <StarlinkPlanSelector
 *     country="ZAMBIA"
 *     countryCode="ZM"
 *     currency="ZMW"
 *     onSelectPlan={(plan) => console.log(plan)}
 *   />
 */

type Plan = {
  id: string;
  name: string;
  tag: string;
  description: string;
  price: number;
};

type StepIndicatorProps = {
  steps?: string[];
  currentStep?: number;
};

type PlanCardProps = {
  plan: Plan;
  currency: string;
  onSelect: (plan: Plan) => void;
};

type StarlinkPlanSelectorProps = {
  country?: string;
  countryCode?: string;
  currency?: string;
  plans?: Plan[];
  currentStep?: number;
  onSelectPlan?: (plan: Plan) => void;
};

const STEPS = ["Plans", "Verify", "Account", "Details", "Security", "Status"];

const DEFAULT_PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    tag: "Basic",
    description: "Basic Starlink Plan (20mbps)",
    price: 15,
  },
  {
    id: "standard",
    name: "Standard",
    tag: "Standard",
    description: "Standard Starlink Plan (60mbps)",
    price: 45,
  },
  {
    id: "premium",
    name: "Premium Plan",
    tag: "Premium",
    description: "Premium Starlink Plan (100mbps)",
    price: 75,
  },
  {
    id: "unlimited",
    name: "Unlimited Plan",
    tag: "Unlimited",
    description: "Unlimited Starlink Plan (220mbps)",
    price: 110,
  },
];

function StepIndicator({ steps = STEPS, currentStep = 1 }: StepIndicatorProps) {
  return (
    <div className="flex items-start justify-between px-4 py-5 sm:px-8">
      {steps.map((label, i) => {
        const stepNumber = i + 1;
        const isActive = stepNumber === currentStep;
        const isComplete = stepNumber < currentStep;
        return (
          <div key={label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={[
                "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold shrink-0",
                isActive
                  ? "border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                  : isComplete
                  ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-300"
                  : "border-slate-700 text-slate-500",
              ].join(" ")}
            >
              {stepNumber}
            </div>
            <span
              className={[
                "hidden text-[10px] font-medium tracking-wide sm:block",
                isActive ? "text-cyan-400" : "text-slate-500",
              ].join(" ")}
            >
              {label.toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PlanCard({ plan, currency, onSelect }: PlanCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white sm:text-xl">{plan.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
        </div>
        <span className="shrink-0 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
          {plan.tag}
        </span>
      </div>

      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold text-white sm:text-4xl">
          {currency} {plan.price.toFixed(2)}
        </span>
        <span className="text-sm text-slate-400">/month</span>
      </div>

      <div className="my-5 h-px w-full bg-slate-800" />

      <button
        type="button"
        onClick={() => onSelect?.(plan)}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-400 to-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:from-cyan-300 hover:to-sky-400 active:scale-[0.99] sm:text-base"
      >
        Select Plan & Proceed
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

export default function StarlinkPlanSelector({
  country = "ZAMBIA",
  countryCode = "ZM",
  currency = "ZMW",
  plans = DEFAULT_PLANS,
  currentStep = 1,
  onSelectPlan,
}: StarlinkPlanSelectorProps) {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-2xl">
        {/* Top bar */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold tracking-widest">STARLINK</span>
            <span className="hidden h-4 w-px bg-slate-700 sm:block" />
            <span className="text-sm font-semibold text-slate-300">
              {country} <span className="text-cyan-400">RESELLER</span>
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500/20 text-[9px]">
              {countryCode}
            </span>
            {country} ({currency})
          </div>
        </header>

        {/* Step indicator */}
        <nav aria-label="Checkout progress" className="border-b border-slate-800">
          <StepIndicator currentStep={currentStep} />
        </nav>

        {/* Hero */}
        <section className="border-b border-slate-800 px-4 py-10 text-center sm:px-8 sm:py-14">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300">
            <Wifi className="h-3.5 w-3.5" />
            HIGH-SPEED COVERAGE ACTIVE
          </div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Select Your Starlink Plan</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-400 sm:text-base">
            High-speed, low-latency satellite internet across {country[0]}
            {country.slice(1).toLowerCase()}. Choose a package below to initiate your order.
          </p>

          {/* Simple dish illustration */}
          <div className="mx-auto mt-8 flex h-32 items-center justify-center">
            <svg
              viewBox="0 0 200 140"
              className="h-28 w-auto"
              fill="none"
              aria-hidden="true"
            >
              <ellipse
                cx="100"
                cy="40"
                rx="70"
                ry="22"
                fill="url(#dishGradient)"
                transform="rotate(-8 100 40)"
              />
              <line x1="100" y1="55" x2="100" y2="110" stroke="#64748b" strokeWidth="4" />
              <line x1="70" y1="130" x2="130" y2="130" stroke="#475569" strokeWidth="4" />
              <line x1="100" y1="110" x2="70" y2="130" stroke="#475569" strokeWidth="4" />
              <line x1="100" y1="110" x2="130" y2="130" stroke="#475569" strokeWidth="4" />
              <defs>
                <linearGradient id="dishGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </section>

        {/* Plans */}
        <section className="flex flex-col gap-4 px-4 py-6 sm:px-8 sm:py-8">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} currency={currency} onSelect={onSelectPlan || (() => {})} />
          ))}
        </section>
      </div>
    </div>
  );
}