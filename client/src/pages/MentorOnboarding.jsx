import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ensureMentorProfileForUser,
  getMentorOnboardingProfile,
  saveMentorOnboardingStep,
  completeMentorOnboarding,
} from "../api/mentorOnboarding";
import LoadingSpinner from "../components/LoadingSpinner";

const STEP_LABELS = ["Basic Info", "Expertise", "Your Story", "Calendar"];
const TOTAL_STEPS = STEP_LABELS.length;

const EXPERTISE_OPTIONS = [
  "React", "TypeScript", "JavaScript", "Python", "Node.js",
  "Java", "Go", "Rust", "C++", "Swift",
  "AWS", "GCP", "Azure", "DevOps", "Docker", "Kubernetes",
  "Machine Learning", "Data Science", "AI / LLMs",
  "iOS", "Android", "React Native",
  "SQL", "PostgreSQL", "MongoDB", "Redis",
  "System Design", "Architecture", "API Design",
  "Product Management", "UX Design", "User Research",
  "Leadership", "Engineering Management",
  "Career Growth", "Interview Prep", "Resume Review",
  "Startup Advice", "Entrepreneurship", "Fundraising",
  "Technical Writing", "Public Speaking", "Negotiation",
  "Web3 / Blockchain", "Cybersecurity",
];

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education",
  "Media & Entertainment", "E-commerce", "Retail",
  "Consulting", "Government", "Non-profit", "Other",
];

function inputCls() {
  return "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-800 placeholder-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all";
}

export default function MentorOnboarding() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [profileId, setProfileId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");

  // Step 2
  const [expertise, setExpertise] = useState([]);

  // Step 3
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login", { replace: true }); return; }
    if (user.user_metadata?.role !== "mentor") { navigate("/dashboard", { replace: true }); return; }

    let cancelled = false;

    async function init() {
      try {
        const stub = await ensureMentorProfileForUser(user);
        if (cancelled) return;
        setProfileId(stub.id);

        const profile = await getMentorOnboardingProfile(user.id);
        if (cancelled || !profile) return;

        setName(profile.name ?? "");
        setTitle(profile.title ?? "");
        setCompany(profile.company ?? "");
        setIndustry(profile.industry ?? "");
        setYearsExperience(profile.years_experience != null ? String(profile.years_experience) : "");
        setExpertise(Array.isArray(profile.expertise) ? profile.expertise : []);
        setBio(profile.bio ?? "");
      } catch (err) {
        if (!cancelled) setError("Failed to load your profile. Please refresh the page.");
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, [user, authLoading, navigate]);

  function toggleExpertise(tag) {
    setExpertise((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= 6) return prev;
      return [...prev, tag];
    });
  }

  async function handleNext() {
    setError("");

    if (step === 1 && !name.trim()) {
      setError("Full name is required.");
      return;
    }
    if (step === 2 && expertise.length === 0) {
      setError("Select at least one area of expertise.");
      return;
    }
    if (step === 3 && !bio.trim()) {
      setError("Please write a short bio.");
      return;
    }

    setSaving(true);
    try {
      if (step === 1) {
        await saveMentorOnboardingStep(profileId, {
          name: name.trim(),
          title: title.trim(),
          company: company.trim(),
          industry: industry || null,
          years_experience: yearsExperience !== "" ? parseInt(yearsExperience, 10) : null,
        });
      } else if (step === 2) {
        await saveMentorOnboardingStep(profileId, { expertise });
      } else if (step === 3) {
        await saveMentorOnboardingStep(profileId, { bio: bio.trim() });
      } else if (step === 4) {
        await completeMentorOnboarding(profileId);
        navigate("/dashboard");
        return;
      }
      setStep((s) => s + 1);
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleBack() {
    setError("");
    setStep((s) => s - 1);
  }

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <LoadingSpinner message="Loading your profile…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-amber-600 font-bold text-2xl tracking-tight mb-4">
            <span className="text-3xl">🌉</span> Bridge
          </Link>
          <h1 className="text-2xl font-bold text-stone-800">Set up your mentor profile</h1>
          <p className="mt-1 text-sm text-stone-500">
            Step {step} of {TOTAL_STEPS} — {STEP_LABELS[step - 1]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                  i + 1 <= step ? "bg-amber-400" : "bg-stone-200"
                }`}
              />
              <span
                className={`text-[10px] font-semibold hidden sm:block ${
                  i + 1 === step ? "text-amber-600" : "text-stone-400"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm px-8 py-8">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* ── Step 1: Basic Info ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                  Full name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className={inputCls()}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Job title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Senior Software Engineer"
                  className={inputCls()}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Corp"
                  className={inputCls()}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={inputCls()}
                >
                  <option value="">Select industry…</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                  Years of experience
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  placeholder="e.g. 5"
                  className={inputCls()}
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Expertise ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-stone-700 mb-0.5">
                  Select up to 6 areas of expertise
                </p>
                <p className="text-xs text-stone-400 mb-4">{expertise.length} / 6 selected</p>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE_OPTIONS.map((tag) => {
                    const selected = expertise.includes(tag);
                    const atMax = !selected && expertise.length >= 6;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => !atMax && toggleExpertise(tag)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          selected
                            ? "border-amber-400 bg-amber-50 text-amber-700"
                            : atMax
                            ? "border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed"
                            : "border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Story ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                  Your bio <span className="text-red-400">*</span>
                </label>
                <p className="text-xs text-stone-400 mb-2">
                  Tell mentees who you are, what you're passionate about, and how you like to help.
                </p>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={7}
                  placeholder="I'm a software engineer with 8 years of experience building products at scale…"
                  className={`${inputCls()} resize-none`}
                />
                <p className="mt-1 text-right text-xs text-stone-400">{bio.length} characters</p>
              </div>
            </div>
          )}

          {/* ── Step 4: Calendar (placeholder) ── */}
          {step === 4 && (
            <div className="py-6 text-center space-y-5">
              <div className="text-5xl">📅</div>
              <h2 className="text-lg font-bold text-stone-800">Calendar integration</h2>
              <p className="text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
                Connect your Google Calendar so mentees can book time that works for you.
                This feature is coming soon — complete your setup now and we'll notify you when it's ready.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm font-semibold text-amber-700">
                🚧 Coming soon
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 text-sm font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
            >
              {saving ? "Saving…" : step === TOTAL_STEPS ? "Complete setup →" : "Next →"}
            </button>
          </div>
        </div>

        {/* Escape hatch */}
        <p className="mt-5 text-center text-xs text-stone-400">
          Want to finish later?{" "}
          <Link to="/dashboard" className="text-amber-600 hover:underline font-semibold">
            Go to dashboard
          </Link>
        </p>

      </div>
    </div>
  );
}
