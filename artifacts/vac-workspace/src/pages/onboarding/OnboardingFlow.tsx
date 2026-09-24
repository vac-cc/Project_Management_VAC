import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  useGetSession,
  useUpdateSession,
  useCompleteSession,
  getGetSessionQueryKey,
  getListSessionsQueryKey,
  getGetSessionsSummaryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import vacLogo from "@assets/Branding_RGB_V2-01_1782856164314.png";

const GREEN = "hsl(var(--primary))";
const RUST = "hsl(var(--rust))";
const MUTED = "hsl(var(--muted-foreground))";
const BORDER = "hsl(var(--border))";

const STEPS = [
  { id: 1, label: "Welcome", question: null },
  { id: 2, label: "Background", question: "Tell us about your brand." },
  { id: 3, label: "Objectives", question: "What does success look like?" },
  { id: 4, label: "Audience", question: "Who are you speaking to?" },
  { id: 5, label: "Personality", question: "How does your brand present itself?" },
  { id: 6, label: "Tone", question: "How does your brand sound?" },
  { id: 7, label: "Landscape", question: "Who are you competing with?" },
  { id: 8, label: "Channels", question: "Where does your brand live?" },
  { id: 9, label: "Workflow", question: "How do we work together?" },
  { id: 10, label: "Review", question: "A final look before we generate your brief." },
];

const INDUSTRY_OPTIONS = [
  { value: "hospitality", label: "Hospitality & Food" },
  { value: "architecture", label: "Architecture & Design" },
  { value: "luxury", label: "Luxury & Fashion" },
  { value: "technology", label: "Technology & SaaS" },
  { value: "finance", label: "Finance & Professional Services" },
  { value: "retail", label: "Retail & Consumer" },
  { value: "healthcare", label: "Healthcare & Wellness" },
  { value: "culture", label: "Culture & Arts" },
  { value: "nonprofit", label: "Non-profit & Social Impact" },
  { value: "other", label: "Other" },
];

const INDUSTRY_AUDIENCES: Record<string, string[]> = {
  hospitality: [
    "Local Dining Regulars",
    "Travel & Tourism Visitors",
    "Corporate & Group Bookings",
    "Food Media & Critics",
    "Delivery & Online Platform Users",
    "Loyalty & Returning Guests",
    "Private Event Clients",
    "Lifestyle Influencers",
  ],
  architecture: [
    "Private Residential Clients (HNW)",
    "Property Developers",
    "Commercial Real Estate Commissioners",
    "Public Sector Clients",
    "Design & Architecture Media",
    "Planning Authorities",
    "Interior Design Partners",
    "International Investors",
  ],
  luxury: [
    "Ultra-High Net Worth Individuals",
    "Aspirational Luxury Consumers",
    "Fashion & Style Press",
    "Retail Buyers & Stockists",
    "Celebrity & Cultural Tastemakers",
    "Collectors & Connoisseurs",
    "Digital Luxury Consumers",
    "Global Flagship Visitors",
  ],
  technology: [
    "CTO & Technical Decision-Makers",
    "Product & Engineering Teams",
    "Enterprise Procurement",
    "Startup Founders",
    "Developer Communities",
    "Investors & VCs",
    "End Users (B2C)",
    "Channel Partners & Resellers",
  ],
  finance: [
    "C-Suite & Board Level",
    "CFOs & Finance Directors",
    "Investment Committee Members",
    "Institutional Investors",
    "Regulatory Bodies",
    "High Net Worth Individuals",
    "SME Business Owners",
    "Media & Financial Press",
  ],
  retail: [
    "Everyday Consumers (B2C)",
    "Loyal Brand Advocates",
    "Price-Sensitive Shoppers",
    "Retail Media Buyers",
    "Wholesale & Distribution Partners",
    "Social Commerce Audiences",
    "Sustainability-Conscious Consumers",
    "Gen Z & Millennial Buyers",
  ],
  healthcare: [
    "Patients & End Users",
    "Medical Professionals",
    "Health Insurance Buyers",
    "Hospital Procurement",
    "Public Health Bodies",
    "Wellness-Conscious Consumers",
    "Caregivers & Family Decision-Makers",
    "Investors & Biotech Partners",
  ],
  culture: [
    "Cultural Enthusiasts & Visitors",
    "Arts Funding Bodies",
    "Corporate Sponsors",
    "Educational Institutions",
    "Creative Communities",
    "International Cultural Tourists",
    "Press & Cultural Critics",
    "Policy & Government Commissioners",
  ],
  nonprofit: [
    "Individual Donors",
    "Corporate CSR Partners",
    "Grant-Making Foundations",
    "Beneficiaries & Communities",
    "Government & Policy Stakeholders",
    "Volunteers & Ambassadors",
    "Media & Advocacy Networks",
    "Board Members & Trustees",
  ],
  other: [
    "Senior Decision-Makers (C-Suite)",
    "Brand Managers & Marketers",
    "End Consumers (B2C)",
    "Creative & Agency Partners",
    "Investors & Stakeholders",
    "Media & Press",
    "Industry Partners",
    "Internal Teams",
  ],
};

const INDUSTRY_COMPETITORS: Record<string, string[]> = {
  hospitality: [
    "Nobu Restaurants",
    "The Ivy Collection",
    "Soho House",
    "Noma / Nordic model",
    "Ottolenghi",
    "Local independents",
    "Delivery-first brands",
    "Hotel F&B concepts",
  ],
  architecture: [
    "Zaha Hadid Architects",
    "Foster + Partners",
    "Snøhetta",
    "Adjaye Associates",
    "Local design studios",
    "Developer-aligned practices",
    "Value-engineering firms",
    "Boutique interiors firms",
  ],
  luxury: [
    "LVMH portfolio brands",
    "Kering brands",
    "Independent luxury houses",
    "New-guard designer labels",
    "Emerging heritage brands",
    "Direct-to-consumer luxury",
    "Luxury e-commerce platforms",
    "Niche fragrance / lifestyle houses",
  ],
  technology: [
    "Established SaaS incumbents",
    "Venture-backed challengers",
    "Open-source alternatives",
    "Big tech platform products",
    "Niche vertical solutions",
    "In-house build advocates",
    "AI-native competitors",
    "Legacy enterprise vendors",
  ],
  finance: [
    "Global investment banks",
    "Big Four consulting firms",
    "Boutique advisory practices",
    "Fintech disruptors",
    "Regional specialists",
    "Family office networks",
    "Robo-advisory platforms",
    "Impact investment firms",
  ],
  retail: [
    "Category leaders (branded)",
    "Private label challengers",
    "D2C disruptors",
    "Marketplace sellers (Amazon / Etsy)",
    "International fast brands",
    "Premium independents",
    "Subscription box competitors",
    "Resale & recommerce platforms",
  ],
  healthcare: [
    "Established healthcare providers",
    "Digital health platforms",
    "Wellness consumer brands",
    "Public health service alternatives",
    "Pharmaceutical brands",
    "Prevention-focused startups",
    "Mental health platforms",
    "Wearable health tech brands",
  ],
  culture: [
    "National institutions (Tate, V&A, etc.)",
    "Commercial galleries",
    "Festival organisers",
    "Digital cultural platforms",
    "International touring programmes",
    "Emerging artist collectives",
    "Experience economy competitors",
    "Online streaming cultural content",
  ],
  nonprofit: [
    "Sector-peer charities",
    "Corporate social responsibility programmes",
    "Government service providers",
    "Social enterprise competitors",
    "International NGO programmes",
    "Crowdfunding platforms",
    "Impact investment vehicles",
    "Community benefit societies",
  ],
  other: [
    "WPP / Grey",
    "Ogilvy",
    "BBDO",
    "Leo Burnett",
    "Droga5",
    "72andSunny",
    "Wieden+Kennedy",
    "Anomaly",
    "Cossette",
    "DDB",
    "McCann",
    "TBWA",
  ],
};

const DEFAULT_AUDIENCE_OPTIONS = INDUSTRY_AUDIENCES.other;
const DEFAULT_COMPETITOR_OPTIONS = INDUSTRY_COMPETITORS.other;

const BRAND_PAIRS = [
  ["Traditional", "Progressive"],
  ["Serious", "Playful"],
  ["Premium", "Accessible"],
  ["Global", "Local"],
  ["Digital-first", "Human-first"],
];

const TONE_OPTIONS = [
  "Authoritative", "Warm", "Bold", "Refined", "Playful",
  "Minimal", "Provocative", "Empathetic", "Precise",
];

const CHANNEL_OPTIONS = [
  "Social Media (Organic)", "Social Media (Paid)",
  "Experiential / Events", "PR & Media Relations",
  "Content Marketing", "Email Marketing",
  "OOH / Print", "Broadcast / TV",
  "Podcast / Audio", "Influencer",
  "Digital Display", "Search (SEO / SEM)",
];

const WORKFLOW_OPTIONS = [
  "Weekly check-ins", "Bi-weekly reviews",
  "Monthly reporting", "Real-time Slack/Teams",
  "Single point of contact", "Full team access",
  "Strict approval gates", "Agile feedback loops",
];

const OBJECTIVES = [
  { key: "brandAwareness", label: "Brand awareness" },
  { key: "leadGeneration", label: "Lead generation" },
  { key: "customerRetention", label: "Customer retention" },
  { key: "marketExpansion", label: "Market expansion" },
  { key: "rebranding", label: "Repositioning" },
];

const monoStyle = {
  fontFamily: "var(--app-font-mono)",
  fontSize: "0.58rem",
  letterSpacing: "0.13em",
  textTransform: "uppercase" as const,
};

const stepVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 32 : -32,
    transition: { duration: 0 },
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -32 : 32,
    transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

function OptionLine({
  children,
  selected,
  onClick,
  testId,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  testId?: string;
}) {
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      className={cn(
        "w-full text-left py-3.5 px-0 flex items-center gap-3 group transition-colors duration-150 text-sm"
      )}
      style={{ borderBottom: `1px solid ${BORDER}` }}
    >
      <span
        className="font-brand flex-shrink-0"
        style={{
          color: selected ? GREEN : "transparent",
          fontSize: "1rem",
          lineHeight: 1,
          transition: "color 0.15s",
          width: "16px",
        }}
      >
        /
      </span>
      <span
        style={{
          fontWeight: selected ? 500 : 400,
          color: selected ? "hsl(var(--foreground))" : MUTED,
          transition: "color 0.15s",
          flex: 1,
        }}
        className="group-hover:text-foreground"
      >
        {children}
      </span>
      {selected && (
        <span
          className="flex-shrink-0"
          style={{
            width: "16px",
            height: "16px",
            background: GREEN,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check className="w-2.5 h-2.5 text-white" />
        </span>
      )}
    </button>
  );
}

export default function OnboardingFlow() {
  const { id } = useParams<{ id: string }>();
  const sessionId = parseInt(id, 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useGetSession(sessionId, {
    query: { queryKey: getGetSessionQueryKey(sessionId), enabled: !!sessionId },
  });

  const updateSession = useUpdateSession();
  const completeSession = useCompleteSession();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [pairIndex, setPairIndex] = useState(0);
  const [personalityChoices, setPersonalityChoices] = useState<string[]>([]);

  useEffect(() => {
    if (session) {
      setStep(session.currentStep || 1);
      setResponses((session.responses as Record<string, unknown>) || {});
    }
  }, [session]);

  function updateResponse(key: string, value: unknown) {
    setResponses((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArrayItem(key: string, item: string) {
    const current = (responses[key] as string[]) || [];
    const updated = current.includes(item)
      ? current.filter((x) => x !== item)
      : [...current, item];
    updateResponse(key, updated);
  }

  function rankAudience(item: string) {
    const current = (responses.audience as string[]) || [];
    const updated = current.includes(item)
      ? current.filter((x) => x !== item)
      : [...current, item];
    updateResponse("audience", updated);
  }

  function choosePersonality(choice: string) {
    const newChoices = [...personalityChoices, choice];
    setPersonalityChoices(newChoices);
    if (pairIndex < BRAND_PAIRS.length - 1) {
      setPairIndex((i) => i + 1);
    } else {
      updateResponse("brandPersonality", newChoices);
    }
  }

  function goNext() {
    if (step >= 10) return;
    const next = step + 1;
    setDirection(1);
    updateSession.mutate(
      { id: sessionId, data: { currentStep: next, responses } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSessionQueryKey(sessionId) });
          setStep(next);
        },
      }
    );
  }

  function goPrev() {
    if (step <= 1) return;
    setDirection(-1);
    setStep((s) => s - 1);
  }

  function handleComplete() {
    updateSession.mutate(
      { id: sessionId, data: { responses } },
      {
        onSuccess: () => {
          completeSession.mutate(
            { id: sessionId },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getGetSessionQueryKey(sessionId) });
                queryClient.invalidateQueries({ queryKey: getListSessionsQueryKey() });
                queryClient.invalidateQueries({ queryKey: getGetSessionsSummaryQueryKey() });
                setLocation(`/onboarding/sessions/${sessionId}/brief`);
              },
            }
          );
        },
      }
    );
  }

  const selectedIndustry = (responses.industry as string) || "";
  const audienceOptions = selectedIndustry && INDUSTRY_AUDIENCES[selectedIndustry]
    ? INDUSTRY_AUDIENCES[selectedIndustry]
    : DEFAULT_AUDIENCE_OPTIONS;
  const competitorOptions = selectedIndustry && INDUSTRY_COMPETITORS[selectedIndustry]
    ? INDUSTRY_COMPETITORS[selectedIndustry]
    : DEFAULT_COMPETITOR_OPTIONS;
  const industryLabel = INDUSTRY_OPTIONS.find((o) => o.value === selectedIndustry)?.label ?? "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div style={{ width: "2px", height: "40px", background: GREEN, animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm" style={{ color: MUTED }}>
        Session not found.
      </div>
    );
  }

  const currentStepMeta = STEPS[step - 1];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* Top bar */}
      <div
        className="flex items-center justify-between"
        style={{ padding: "16px 48px", borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-6">
          <button
            data-testid="button-back"
            onClick={() => setLocation("/onboarding/sessions")}
            className="text-xs flex items-center gap-2 transition-colors"
            style={{ color: MUTED }}
          >
            <ArrowLeft className="w-3 h-3" />
            Sessions
          </button>
          <span style={{ color: BORDER }}>|</span>
          <span className="text-sm" style={{ color: MUTED }}>
            {session.clientName}
            <span style={{ opacity: 0.5 }}> — {session.clientCompany}</span>
          </span>
          {industryLabel && (
            <>
              <span style={{ color: BORDER }}>|</span>
              <span style={{ ...monoStyle, color: GREEN }}>{industryLabel}</span>
            </>
          )}
        </div>

        <img src={vacLogo} alt="Vāc" style={{ height: "28px", width: "auto" }} />

        <span style={{ ...monoStyle, color: MUTED }}>{step} / {STEPS.length}</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: "3px", background: BORDER, position: "relative" }}>
        <motion.div
          style={{ position: "absolute", top: 0, left: 0, height: "100%", background: GREEN }}
          initial={{ width: 0 }}
          animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
        />
      </div>

      {/* Step labels */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "0 48px", overflowX: "auto" }}>
        <div className="flex">
          {STEPS.map((s) => (
            <div
              key={s.id}
              style={{
                ...monoStyle,
                color:
                  s.id === step
                    ? "hsl(var(--foreground))"
                    : s.id < step
                    ? GREEN
                    : "hsl(var(--muted-foreground) / 0.35)",
                padding: "10px 0",
                marginRight: "28px",
                whiteSpace: "nowrap",
                transition: "color 0.3s",
                flexShrink: 0,
                borderBottom: s.id === step ? `2px solid ${GREEN}` : "2px solid transparent",
              }}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center" style={{ padding: "56px 48px" }}>
        <div style={{ width: "100%", maxWidth: "600px" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >

              {/* Step heading */}
              <div style={{ marginBottom: "40px" }}>
                <p style={{ ...monoStyle, color: GREEN, marginBottom: "14px" }}>
                  {currentStepMeta.label}
                </p>
                {currentStepMeta.question && (
                  <h2
                    className="font-brand"
                    style={{ fontSize: "2.4rem", lineHeight: 1.1, color: "hsl(var(--foreground))" }}
                  >
                    {currentStepMeta.question}
                  </h2>
                )}
              </div>

              {/* ── Step 1 — Welcome ── */}
              {step === 1 && (
                <div>
                  <h2 className="font-brand" style={{ fontSize: "2.6rem", lineHeight: 1.1, marginBottom: "28px" }}>
                    Welcome,{" "}
                    <span style={{ color: RUST }}>{session.clientName}.</span>
                  </h2>
                  <p className="leading-relaxed mb-3" style={{ color: MUTED, fontSize: "0.95rem" }}>
                    This session helps Vāc • Conscious Communication understand your brand deeply — your objectives, your audience, and how you communicate. It takes around five minutes.
                  </p>
                  <p className="leading-relaxed" style={{ color: MUTED, fontSize: "0.9rem", opacity: 0.75 }}>
                    Be direct. The more honest your answers, the sharper the strategic output.
                  </p>

                  <div style={{ background: GREEN, padding: "24px 28px", marginTop: "36px" }}>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                      {[
                        { label: "Client", value: session.clientName },
                        { label: "Company", value: session.clientCompany },
                        { label: "Manager", value: session.accountManager },
                        { label: "Steps", value: `${STEPS.length} questions` },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p style={{ ...monoStyle, color: "rgba(255,255,255,0.55)", marginBottom: "4px" }}>
                            {label}
                          </p>
                          <p className="text-sm font-medium" style={{ color: "#fff" }}>
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2 — Brand Background (with industry selector) ── */}
              {step === 2 && (
                <div className="space-y-10">

                  {/* Industry selector — drives adaptive logic */}
                  <div>
                    <p style={{ ...monoStyle, color: MUTED, marginBottom: "4px" }}>
                      What sector does your business operate in?
                    </p>
                    <p className="text-xs mb-4" style={{ color: MUTED, opacity: 0.7 }}>
                      Your industry shapes every question that follows.
                    </p>
                    <div className="grid grid-cols-2 gap-0">
                      {INDUSTRY_OPTIONS.map((opt) => (
                        <OptionLine
                          key={opt.value}
                          selected={responses.industry === opt.value}
                          onClick={() => {
                            updateResponse("industry", opt.value);
                            updateResponse("audience", []);
                            updateResponse("competitors", []);
                          }}
                          testId={`option-industry-${opt.value}`}
                        >
                          {opt.label}
                        </OptionLine>
                      ))}
                    </div>
                  </div>

                  {/* Business description */}
                  <div>
                    <p style={{ ...monoStyle, color: MUTED, marginBottom: "12px" }}>
                      {selectedIndustry
                        ? `Describe what ${session.clientCompany} does in ${industryLabel}`
                        : "Briefly describe what your business does"}
                    </p>
                    <Textarea
                      data-testid="input-business-context"
                      placeholder="We are a..."
                      className="bg-transparent border-0 border-b resize-none text-sm"
                      style={{
                        boxShadow: "none",
                        lineHeight: 1.7,
                        minHeight: "100px",
                        paddingLeft: 0,
                        paddingRight: 0,
                        borderBottomColor: BORDER,
                        borderRadius: 0,
                      }}
                      value={(responses.businessContext as string) || ""}
                      onChange={(e) => updateResponse("businessContext", e.target.value)}
                      onFocus={(e) => { e.target.style.borderBottomColor = GREEN; }}
                      onBlur={(e) => { e.target.style.borderBottomColor = BORDER; }}
                    />
                  </div>

                  {/* Brand age */}
                  <div>
                    <p style={{ ...monoStyle, color: MUTED, marginBottom: "4px" }}>
                      How long has your brand been active?
                    </p>
                    {["Under 1 year", "1 to 3 years", "3 to 10 years", "10+ years"].map((opt) => (
                      <OptionLine
                        key={opt}
                        selected={responses.brandAge === opt}
                        onClick={() => updateResponse("brandAge", opt)}
                        testId={`option-brand-age-${opt}`}
                      >
                        {opt}
                      </OptionLine>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 3 — Objectives ── */}
              {step === 3 && (
                <div className="space-y-8">
                  <p className="text-sm" style={{ color: MUTED }}>
                    Rate each on a scale of 0 to 10. Where do you need to move the needle most?
                  </p>
                  <div className="space-y-8">
                    {OBJECTIVES.map((obj) => {
                      const val = ((responses.objectives as Record<string, number>) || {})[obj.key] ?? 5;
                      return (
                        <div key={obj.key}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium">{obj.label}</span>
                            <span className="font-brand" style={{ color: RUST, fontSize: "1rem" }}>
                              {val} / 10
                            </span>
                          </div>
                          <Slider
                            data-testid={`slider-${obj.key}`}
                            min={0}
                            max={10}
                            step={1}
                            value={[val]}
                            onValueChange={([v]) => {
                              const current = (responses.objectives as Record<string, number>) || {};
                              updateResponse("objectives", { ...current, [obj.key]: v });
                            }}
                          />
                          <div
                            className="flex justify-between"
                            style={{ ...monoStyle, color: "hsl(var(--muted-foreground) / 0.4)", marginTop: "6px" }}
                          >
                            <span>Not a priority</span>
                            <span>Critical</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Step 4 — Audience (industry-adaptive) ── */}
              {step === 4 && (
                <div>
                  {industryLabel && (
                    <div
                      className="mb-6 text-xs"
                      style={{
                        background: `hsl(var(--primary) / 0.08)`,
                        borderLeft: `2px solid ${GREEN}`,
                        padding: "8px 12px",
                        color: "hsl(var(--foreground))",
                      }}
                    >
                      <span style={{ ...monoStyle, color: GREEN }}>Tailored for</span>
                      <span className="ml-2">{industryLabel}</span>
                    </div>
                  )}
                  <p className="text-sm mb-6" style={{ color: MUTED }}>
                    Select in priority order. Your first choice matters most.
                  </p>

                  {(responses.audience as string[] || []).length > 0 && (
                    <div style={{ marginBottom: "24px" }}>
                      <p style={{ ...monoStyle, color: MUTED, marginBottom: "8px" }}>
                        Selected — in priority order
                      </p>
                      {(responses.audience as string[]).map((item, idx) => (
                        <div
                          key={item}
                          className="flex items-center gap-4"
                          style={{ borderBottom: `1px solid ${GREEN}30`, padding: "12px 0" }}
                        >
                          <span className="font-brand" style={{ color: GREEN, fontSize: "0.9rem", width: "20px" }}>
                            {idx + 1}
                          </span>
                          <span className="text-sm font-medium flex-1">{item}</span>
                          <button
                            data-testid={`deselect-audience-${idx}`}
                            onClick={() => rankAudience(item)}
                            className="text-xs transition-colors"
                            style={{ ...monoStyle, color: MUTED }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(var(--destructive))"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = MUTED; }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    {audienceOptions.filter(
                      (opt) => !((responses.audience as string[]) || []).includes(opt)
                    ).map((opt) => (
                      <OptionLine
                        key={opt}
                        selected={false}
                        onClick={() => rankAudience(opt)}
                        testId={`option-audience-${opt}`}
                      >
                        {opt}
                      </OptionLine>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 5 — Personality ── */}
              {step === 5 && (
                <div>
                  {pairIndex < BRAND_PAIRS.length ? (
                    <div>
                      <p className="text-sm mb-8" style={{ color: MUTED }}>
                        Round {pairIndex + 1} of {BRAND_PAIRS.length} — choose the one that better describes your brand.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {BRAND_PAIRS[pairIndex].map((choice, ci) => (
                          <motion.button
                            key={`pair-${pairIndex}-${ci}`}
                            data-testid={`option-personality-${choice}`}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => choosePersonality(choice)}
                            className="group py-12 text-center transition-colors duration-200"
                            style={{ border: `1px solid ${BORDER}`, position: "relative" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.borderColor = GREEN;
                              (e.currentTarget as HTMLElement).style.background = `hsl(var(--primary) / 0.04)`;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.borderColor = BORDER;
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                          >
                            <span
                              className="font-brand block"
                              style={{ fontSize: "1.8rem", lineHeight: 1, color: "hsl(var(--foreground))" }}
                            >
                              {choice}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm mb-6" style={{ color: MUTED }}>
                        Your brand personality profile:
                      </p>
                      <div>
                        {personalityChoices.map((choice, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-6"
                            style={{ borderBottom: `1px solid ${BORDER}`, padding: "16px 0" }}
                          >
                            <span style={{ ...monoStyle, color: MUTED, width: "100px", flexShrink: 0 }}>
                              {BRAND_PAIRS[idx][0]} / {BRAND_PAIRS[idx][1]}
                            </span>
                            <span className="font-brand" style={{ color: GREEN, fontSize: "1.1rem" }}>
                              / {choice}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 6 — Tone ── */}
              {step === 6 && (
                <div>
                  <p className="text-sm mb-6" style={{ color: MUTED }}>
                    Select up to four words that describe how your brand sounds.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {TONE_OPTIONS.map((opt) => {
                      const selected = ((responses.toneWords as string[]) || []).includes(opt);
                      return (
                        <button
                          key={opt}
                          data-testid={`option-tone-${opt}`}
                          onClick={() => toggleArrayItem("toneWords", opt)}
                          className="text-sm py-3 px-4 text-left transition-colors duration-150"
                          style={{
                            border: `1px solid ${selected ? GREEN : BORDER}`,
                            background: selected ? `hsl(var(--primary) / 0.08)` : "transparent",
                            color: selected ? "hsl(var(--foreground))" : MUTED,
                            fontWeight: selected ? 500 : 400,
                          }}
                        >
                          <span className="font-brand mr-2" style={{ color: selected ? GREEN : "transparent", fontSize: "0.9rem" }}>/</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Step 7 — Landscape (industry-adaptive competitors) ── */}
              {step === 7 && (
                <div>
                  {industryLabel && (
                    <div
                      className="mb-6 text-xs"
                      style={{
                        background: `hsl(var(--primary) / 0.08)`,
                        borderLeft: `2px solid ${GREEN}`,
                        padding: "8px 12px",
                        color: "hsl(var(--foreground))",
                      }}
                    >
                      <span style={{ ...monoStyle, color: GREEN }}>Benchmarks for</span>
                      <span className="ml-2">{industryLabel}</span>
                    </div>
                  )}
                  <p className="text-sm mb-6" style={{ color: MUTED }}>
                    Select the brands, agencies, or competitors you aspire to stand alongside — or against.
                  </p>
                  <div className="grid grid-cols-2 gap-0">
                    {competitorOptions.map((opt) => (
                      <OptionLine
                        key={opt}
                        selected={((responses.competitors as string[]) || []).includes(opt)}
                        onClick={() => toggleArrayItem("competitors", opt)}
                        testId={`option-competitor-${opt}`}
                      >
                        {opt}
                      </OptionLine>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 8 — Channels ── */}
              {step === 8 && (
                <div>
                  <p className="text-sm mb-6" style={{ color: MUTED }}>
                    Where does your brand currently invest, or plan to invest?
                  </p>
                  <div className="grid grid-cols-2 gap-0">
                    {CHANNEL_OPTIONS.map((opt) => (
                      <OptionLine
                        key={opt}
                        selected={((responses.channels as string[]) || []).includes(opt)}
                        onClick={() => toggleArrayItem("channels", opt)}
                        testId={`option-channel-${opt}`}
                      >
                        {opt}
                      </OptionLine>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 9 — Workflow ── */}
              {step === 9 && (
                <div className="space-y-8">
                  <div>
                    <p className="text-sm mb-6" style={{ color: MUTED }}>
                      How do you prefer to work with an agency?
                    </p>
                    <div className="grid grid-cols-2 gap-0">
                      {WORKFLOW_OPTIONS.map((opt) => (
                        <OptionLine
                          key={opt}
                          selected={((responses.workflow as string[]) || []).includes(opt)}
                          onClick={() => toggleArrayItem("workflow", opt)}
                          testId={`option-workflow-${opt}`}
                        >
                          {opt}
                        </OptionLine>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ ...monoStyle, color: MUTED, marginBottom: "12px" }}>
                      Anything else we should know?
                    </p>
                    <Textarea
                      data-testid="input-workflow-notes"
                      placeholder="Additional context, constraints, or preferences..."
                      className="bg-transparent border-0 border-b resize-none text-sm"
                      style={{
                        boxShadow: "none",
                        lineHeight: 1.7,
                        minHeight: "80px",
                        paddingLeft: 0,
                        paddingRight: 0,
                        borderBottomColor: BORDER,
                        borderRadius: 0,
                      }}
                      value={(responses.workflowNotes as string) || ""}
                      onChange={(e) => updateResponse("workflowNotes", e.target.value)}
                      onFocus={(e) => { e.target.style.borderBottomColor = GREEN; }}
                      onBlur={(e) => { e.target.style.borderBottomColor = BORDER; }}
                    />
                  </div>
                </div>
              )}

              {/* ── Step 10 — Review ── */}
              {step === 10 && (
                <div>
                  <p className="text-sm mb-8" style={{ color: MUTED }}>
                    Here is a summary of what you have shared. Generating your strategic brief will take just a moment.
                  </p>
                  <div style={{ borderTop: `1px solid ${BORDER}` }}>
                    {[
                      { label: "Sector", value: industryLabel || "Not specified" },
                      { label: "Brand", value: session.clientCompany },
                      { label: "Context", value: (responses.businessContext as string)?.slice(0, 80) + ((responses.businessContext as string)?.length > 80 ? "..." : "") || "—" },
                      { label: "Audience", value: ((responses.audience as string[]) || []).slice(0, 2).join(", ") || "—" },
                      { label: "Tone", value: ((responses.toneWords as string[]) || []).join(", ") || "—" },
                      { label: "Channels", value: `${((responses.channels as string[]) || []).length} selected` },
                      { label: "Workflow", value: ((responses.workflow as string[]) || []).slice(0, 2).join(", ") || "—" },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex gap-8"
                        style={{ borderBottom: `1px solid ${BORDER}`, padding: "14px 0" }}
                      >
                        <span style={{ ...monoStyle, color: MUTED, width: "80px", flexShrink: 0 }}>{label}</span>
                        <span className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: GREEN, padding: "20px 24px", marginTop: "32px" }}>
                    <p className="text-sm font-medium" style={{ color: "#fff", marginBottom: "4px" }}>
                      Ready to generate your strategic brief?
                    </p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                      Vāc • Conscious Communication will analyse your responses and produce a tailored {industryLabel ? `${industryLabel} ` : ""}discovery document.
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div
        className="flex items-center justify-between"
        style={{ padding: "20px 48px", borderTop: `1px solid ${BORDER}` }}
      >
        <button
          onClick={goPrev}
          disabled={step <= 1}
          className="text-sm flex items-center gap-2 transition-colors disabled:opacity-30"
          style={{ color: MUTED }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        {step < 10 ? (
          <button
            onClick={goNext}
            disabled={updateSession.isPending}
            className="font-medium text-sm flex items-center gap-3 px-7 py-2.5 transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: GREEN, color: "#fff" }}
          >
            Next
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            data-testid="button-complete"
            onClick={handleComplete}
            disabled={completeSession.isPending || updateSession.isPending}
            className="font-medium text-sm flex items-center gap-3 px-7 py-2.5 transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: RUST, color: "#fff" }}
          >
            {completeSession.isPending ? "Generating..." : "Generate Strategic Brief"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
}
