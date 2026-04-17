import { useState, useEffect, useMemo, useId, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMentorById } from '../api/mentors';
import { getReviewsForMentor } from '../api/reviews';
import { createSession } from '../api/sessions';
import { useAuth } from '../context/AuthContext';
import SessionTypeCard, { SESSION_TYPES } from '../components/SessionTypeCard';
import { addRecentlyViewedMentor } from '../utils/recentlyViewed';

function BookingModal({ mentor, onClose }) {
    const [selectedType, setSelectedType] = useState(null);
    const [scheduledDate, setScheduledDate] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [handleClose]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!selectedType) return;

        setSubmitting(true);
        setResult(null);

        const { error } = await createSession({
            mentorId: mentor.id,
            sessionType: selectedType.key,
            scheduledDate: scheduledDate || null,
            message: message || null,
        });

        setSubmitting(false);

        if (error) {
            setResult({ ok: false, message: error.message ?? 'Something went wrong. Please try again.' });
        } else {
            setResult({ ok: true, message: 'Session booked! Your mentor will confirm shortly.' });
        }
    }

    const mentorFirst = mentor.name?.split(/\s+/)[0] ?? 'your mentor';

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-stone-950/70 backdrop-blur-[2px] transition-opacity"
                aria-label="Close booking"
                onClick={handleClose}
            />
            <div className="relative flex max-h-[min(92vh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl shadow-stone-950/25 ring-1 ring-stone-200/90 sm:rounded-3xl sm:ring-stone-200/60">
                {result?.ok ? (
                    <div className="flex flex-col items-center px-8 py-14 sm:py-16 text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-4xl shadow-lg shadow-amber-900/20">
                            ✓
                        </div>
                        <h2 className="font-display text-2xl font-medium text-stone-900 sm:text-3xl">You&apos;re booked</h2>
                        <p className="mt-3 max-w-sm text-stone-600 leading-relaxed">{result.message}</p>
                        <p className="mt-2 text-sm text-stone-500">We&apos;ll email you when {mentorFirst} responds.</p>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="mt-10 rounded-2xl bg-stone-900 px-10 py-3.5 text-sm font-semibold text-amber-50 shadow-lg shadow-stone-900/25 transition hover:bg-stone-800"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                        <header className="relative shrink-0 overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 px-6 pb-8 pt-7 sm:px-8 sm:pb-10 sm:pt-8">
                            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/15 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />
                            <div className="relative flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-200/90">Book a session</p>
                                    <h2
                                        id="booking-modal-title"
                                        className="mt-2 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl"
                                    >
                                        Meet with {mentor.name}
                                    </h2>
                                    <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-300">
                                        Pick a format, add an optional time and note — your mentor confirms the details.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20"
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>
                            <ol className="relative mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium sm:text-sm">
                                <li className={`flex items-center gap-2 ${selectedType ? 'text-stone-400' : 'text-white'}`}>
                                    <span
                                        className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] ${selectedType ? 'bg-emerald-500 text-white' : 'bg-white/15 text-white'}`}
                                    >
                                        {selectedType ? '✓' : '1'}
                                    </span>
                                    Format
                                </li>
                                <li className="hidden text-stone-500 sm:inline" aria-hidden="true">
                                    —
                                </li>
                                <li className={`flex items-center gap-2 ${selectedType ? 'text-amber-200' : 'text-stone-500'}`}>
                                    <span
                                        className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] ${selectedType ? 'bg-white/20 text-white' : 'bg-white/10 text-stone-400'}`}
                                    >
                                        2
                                    </span>
                                    Details
                                </li>
                            </ol>
                        </header>

                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                            <div className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">
                                <section>
                                    <div className="mb-4">
                                        <h3 className="text-base font-semibold text-stone-900">Session format</h3>
                                        <p className="mt-1 text-sm text-stone-500">
                                            Tap a card to select. Hover to preview — selection shows a ring and checkmark.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                                        {SESSION_TYPES.map((type) => (
                                            <SessionTypeCard
                                                key={type.key}
                                                type={type}
                                                variant="picker"
                                                selected={selectedType?.key === type.key}
                                                onClick={() => setSelectedType(type)}
                                            />
                                        ))}
                                    </div>
                                </section>

                                <section className="rounded-2xl border border-stone-200/80 bg-gradient-to-b from-stone-50/90 to-white p-5 sm:p-6">
                                    <h3 className="text-base font-semibold text-stone-900">When &amp; focus</h3>
                                    <p className="mt-1 text-sm text-stone-500">Optional — helps your mentor prepare.</p>
                                    <div className="mt-5 space-y-5">
                                        <div>
                                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-500" htmlFor="scheduled-date">
                                                Preferred start time
                                            </label>
                                            <input
                                                id="scheduled-date"
                                                type="datetime-local"
                                                value={scheduledDate}
                                                onChange={(e) => setScheduledDate(e.target.value)}
                                                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 shadow-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-500" htmlFor="booking-message">
                                                Note to mentor
                                            </label>
                                            <textarea
                                                id="booking-message"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                rows={3}
                                                placeholder="e.g. Preparing for PM interviews at mid-size startups…"
                                                className="w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 shadow-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {result && !result.ok && (
                                    <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{result.message}</p>
                                )}
                            </div>
                        </div>

                        <footer className="shrink-0 border-t border-stone-200/80 bg-white/95 px-5 py-4 backdrop-blur-sm sm:px-8 sm:py-5">
                            {selectedType && (
                                <p className="mb-3 text-center text-xs text-stone-500 sm:text-left">
                                    <span className="font-medium text-stone-700">{selectedType.name}</span>
                                    <span className="text-stone-400"> · </span>
                                    {selectedType.duration}
                                </p>
                            )}
                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="rounded-2xl border border-stone-200 bg-white px-5 py-3.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 sm:px-6"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedType || submitting}
                                    className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-900/25 transition hover:from-amber-400 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none sm:min-w-[200px]"
                                >
                                    {submitting ? 'Sending request…' : 'Request session'}
                                </button>
                            </div>
                        </footer>
                    </form>
                )}
            </div>
        </div>
    );
}

function avatarColor(name = '') {
    const palette = [
        'from-stone-700 via-stone-800 to-stone-900',
        'from-amber-900 via-stone-800 to-stone-900',
        'from-teal-900 via-stone-800 to-stone-950',
        'from-neutral-700 via-stone-800 to-neutral-900',
        'from-amber-800 via-orange-900 to-stone-900',
        'from-slate-700 via-slate-800 to-slate-900',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return palette[Math.abs(hash) % palette.length];
}

function initials(name = '') {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('');
}

function formatIndustry(industry) {
    if (!industry?.trim()) return null;
    return industry
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

function StarRow({ rating, size = 'md' }) {
    const uid = useId().replace(/:/g, '');
    const r = Math.min(5, Math.max(0, Number(rating) || 0));
    const full = Math.floor(r);
    const partial = r - full;
    const dim = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
        <span className="flex items-center gap-0.5" aria-label={`${r.toFixed(1)} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => {
                let fill = 0;
                if (i < full) fill = 100;
                else if (i === full) fill = Math.round(partial * 100);
                const gid = `star-${uid}-${i}-${size}`;
                return (
                    <svg key={i} className={dim} viewBox="0 0 20 20">
                        <defs>
                            <linearGradient id={gid}>
                                <stop offset={`${fill}%`} stopColor="#78350f" />
                                <stop offset={`${fill}%`} stopColor="#d6d3d1" />
                            </linearGradient>
                        </defs>
                        <polygon
                            points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
                            fill={`url(#${gid})`}
                        />
                    </svg>
                );
            })}
        </span>
    );
}

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-[#f2efe9] font-sans">
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.35]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 1px 1px, rgb(120 113 108 / 0.11) 1px, transparent 0)',
                    backgroundSize: '28px 28px',
                }}
            />
            <main className="relative mx-auto max-w-6xl animate-pulse px-4 pb-20 pt-6 sm:px-6 sm:pt-10 lg:px-8">
                <div className="mb-10 h-3 w-48 rounded-sm bg-stone-200/80" />
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-5">
                        <div className="mx-auto aspect-[3/4] max-w-[280px] rounded-sm bg-stone-200/70 lg:mx-0" />
                    </div>
                    <div className="space-y-6 lg:col-span-7">
                        <div className="h-4 w-24 rounded-sm bg-stone-200/70" />
                        <div className="h-12 max-w-lg rounded-sm bg-stone-300/60" />
                        <div className="h-6 max-w-md rounded-sm bg-stone-200/60" />
                        <div className="flex gap-8 border-y border-stone-200/50 py-6">
                            <div className="h-14 w-20 rounded-sm bg-stone-100" />
                            <div className="h-14 w-20 rounded-sm bg-stone-100" />
                            <div className="h-14 w-20 rounded-sm bg-stone-100" />
                        </div>
                    </div>
                </div>
                <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
                    <div className="space-y-4 lg:col-span-8">
                        <div className="h-8 w-40 rounded-sm bg-stone-200/70" />
                        <div className="h-24 max-w-prose rounded-sm bg-stone-100/90" />
                        <div className="h-24 max-w-prose rounded-sm bg-stone-100/90" />
                    </div>
                    <div className="lg:col-span-4">
                        <div className="h-80 rounded-lg border border-stone-200/50 bg-white/50" />
                    </div>
                </div>
            </main>
        </div>
    );
}

function formatReviewDate(iso) {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
        return '';
    }
}

export default function MentorProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [mentorReviews, setMentorReviews] = useState([]);
    const [loadError, setLoadError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        let cancelled = false;
        /* Reset UI when mentor id changes (standard fetch pattern) */
        /* eslint-disable react-hooks/set-state-in-effect */
        setLoading(true);
        setLoadError(null);
        /* eslint-enable react-hooks/set-state-in-effect */

        Promise.all([getMentorById(id), getReviewsForMentor(id)]).then(([mentorRes, reviewsRes]) => {
            if (cancelled) return;

            if (mentorRes.error) {
                setProfile(null);
                setMentorReviews([]);
                setLoadError(mentorRes.error.message ?? 'Could not load mentor.');
            } else if (!mentorRes.data?.mentor) {
                setProfile(null);
                setMentorReviews([]);
                setLoadError(null);
            } else {
                setProfile(mentorRes.data);
                setMentorReviews(reviewsRes.error ? [] : (reviewsRes.data ?? []));
                setLoadError(null);
                addRecentlyViewedMentor(mentorRes.data.mentor);
            }
            setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [id]);

    const displayRating = useMemo(() => {
        if (!profile?.mentor) return 0;
        const fromReviews = profile.reviews?.average;
        if (fromReviews != null && profile.reviews.count > 0) return Number(fromReviews);
        const r = profile.mentor.rating;
        return r != null ? Number(r) : 0;
    }, [profile]);

    function handleBookClick() {
        if (!user) {
            navigate('/login');
        } else {
            setShowModal(true);
        }
    }

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (loadError) {
        return (
            <div className="min-h-screen bg-[#f2efe9] font-sans px-4 py-20">
                <main className="mx-auto max-w-md rounded-lg border border-stone-200/80 bg-white px-8 py-12 text-center shadow-[0_24px_48px_-12px_rgba(28,25,23,0.12)]">
                    <p className="font-display text-lg font-medium text-stone-900">Something went wrong</p>
                    <p className="mt-3 text-sm leading-relaxed text-stone-600">{loadError}</p>
                    <Link
                        to="/mentors"
                        className="mt-8 inline-flex items-center justify-center rounded-md border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
                    >
                        Back to directory
                    </Link>
                </main>
            </div>
        );
    }

    if (!profile?.mentor) {
        return (
            <div className="min-h-screen bg-[#f2efe9] font-sans px-4 py-20">
                <main className="mx-auto max-w-md rounded-lg border border-stone-200/80 bg-white px-8 py-12 text-center shadow-[0_24px_48px_-12px_rgba(28,25,23,0.12)]">
                    <p className="font-display text-lg font-medium text-stone-900">Profile unavailable</p>
                    <p className="mt-3 text-sm text-stone-600">That mentor may have been removed or the link is incorrect.</p>
                    <Link
                        to="/mentors"
                        className="mt-8 inline-flex items-center justify-center rounded-md bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                    >
                        Browse mentors
                    </Link>
                </main>
            </div>
        );
    }

    const mentor = profile.mentor;
    const reviewMeta = profile.reviews;
    const industryLabel = formatIndustry(mentor.industry);
    const grad = avatarColor(mentor.name);
    const mentorInitials = initials(mentor.name);

    return (
        <>
            <div className="min-h-screen bg-[#f2efe9] font-sans text-stone-900 selection:bg-amber-900/12 selection:text-stone-950">
                <div
                    className="pointer-events-none fixed inset-0 opacity-[0.35]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, rgb(120 113 108 / 0.11) 1px, transparent 0)',
                        backgroundSize: '28px 28px',
                    }}
                />

                <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pt-10 lg:px-8">
                    <nav
                        className="mb-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400"
                        aria-label="Breadcrumb"
                    >
                        <Link to="/mentors" className="transition-colors hover:text-stone-800">
                            Directory
                        </Link>
                        <span className="text-stone-300" aria-hidden="true">
                            /
                        </span>
                        <span className="max-w-[min(100%,220px)] truncate text-stone-600">{mentor.name}</span>
                    </nav>

                    <header className="mb-14 grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-14">
                        <div className="lg:col-span-5 xl:col-span-4">
                            <div className="relative mx-auto max-w-[300px] lg:mx-0">
                                <div
                                    className="pointer-events-none absolute -inset-px rounded-sm border border-stone-300/60"
                                    aria-hidden="true"
                                />
                                {mentor.image_url ? (
                                    <img
                                        src={mentor.image_url}
                                        alt={`${mentor.name} — portrait`}
                                        className="relative aspect-[3/4] w-full rounded-sm object-cover shadow-[0_28px_56px_-12px_rgba(28,25,23,0.25)] ring-1 ring-black/5"
                                    />
                                ) : (
                                    <div
                                        className={`relative flex aspect-[3/4] w-full items-center justify-center rounded-sm bg-gradient-to-br ${grad} font-display text-5xl font-medium tracking-tight text-white shadow-[0_28px_56px_-12px_rgba(28,25,23,0.3)]`}
                                        aria-hidden="true"
                                    >
                                        {mentorInitials}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-7 xl:col-span-8">
                            <div className="flex flex-wrap items-center gap-2">
                                {industryLabel && (
                                    <span className="border border-stone-300/70 bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-600">
                                        {industryLabel}
                                    </span>
                                )}
                                {mentor.available && (
                                    <span className="inline-flex items-center gap-2 border border-emerald-200/80 bg-emerald-50/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-900">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        </span>
                                        Accepting
                                    </span>
                                )}
                            </div>

                            <h1 className="font-display mt-6 text-[2.75rem] font-medium leading-[1.05] tracking-[-0.02em] text-stone-900 sm:text-5xl lg:text-[3.35rem]">
                                {mentor.name}
                            </h1>

                            {(mentor.title || mentor.company) && (
                                <p className="mt-5 max-w-2xl text-lg leading-snug text-stone-600 sm:text-xl">
                                    {mentor.title && <span className="font-medium text-stone-900">{mentor.title}</span>}
                                    {mentor.title && mentor.company && <span className="text-stone-400"> · </span>}
                                    {mentor.company && <span>{mentor.company}</span>}
                                </p>
                            )}

                            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-b border-stone-200/80 py-8 sm:grid-cols-4">
                                <div>
                                    <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Rating</dt>
                                    <dd className="mt-2 flex flex-col gap-1">
                                        <span className="font-display text-2xl tabular-nums tracking-tight text-stone-900">
                                            {displayRating > 0 ? displayRating.toFixed(1) : '—'}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <StarRow rating={displayRating} size="md" />
                                        </span>
                                        {reviewMeta?.count > 0 && (
                                            <span className="text-xs text-stone-500">{reviewMeta.count} reviews</span>
                                        )}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Experience</dt>
                                    <dd className="font-display mt-2 text-2xl tabular-nums text-stone-900">
                                        {mentor.years_experience != null ? `${mentor.years_experience}` : '—'}
                                        {mentor.years_experience != null && (
                                            <span className="ml-1 font-sans text-sm font-normal text-stone-500">yrs</span>
                                        )}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Sessions</dt>
                                    <dd className="font-display mt-2 text-2xl tabular-nums text-stone-900">
                                        {mentor.total_sessions != null ? mentor.total_sessions : '—'}
                                    </dd>
                                </div>
                                <div className="col-span-2 flex items-end sm:col-span-1">
                                    <p className="text-sm leading-relaxed text-stone-500">
                                        Figures aggregate peer feedback and completed sessions on Bridge.
                                    </p>
                                </div>
                            </dl>
                        </div>
                    </header>

                    <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
                        <div className="space-y-16 lg:col-span-8">
                            <section className="scroll-mt-24">
                                <div className="flex items-baseline justify-between gap-4 border-b border-stone-200/80 pb-4">
                                    <h2 className="font-display text-2xl font-medium tracking-tight text-stone-900 sm:text-[1.75rem]">
                                        Overview
                                    </h2>
                                </div>
                                <p className="mt-8 max-w-prose text-[1.0625rem] leading-[1.85] text-stone-600">
                                    {mentor.bio?.trim() ||
                                        'This mentor has not published a full biography yet. Booking a session is the fastest way to learn how they work and whether the fit is right for your goals.'}
                                </p>
                            </section>

                            <section>
                                <div className="flex items-baseline justify-between gap-4 border-b border-stone-200/80 pb-4">
                                    <h2 className="font-display text-2xl font-medium tracking-tight text-stone-900 sm:text-[1.75rem]">
                                        Practice areas
                                    </h2>
                                </div>
                                {mentor.expertise?.length > 0 ? (
                                    <ul className="mt-8 flex flex-wrap gap-2">
                                        {mentor.expertise.map((tag) => (
                                            <li key={tag}>
                                                <span className="inline-flex border border-stone-300/80 bg-white px-3 py-1.5 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-400 hover:shadow-md">
                                                    {tag}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-8 text-stone-500">Focus areas will appear here once added.</p>
                                )}
                            </section>

                            <section>
                                <div className="flex flex-col gap-2 border-b border-stone-200/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
                                    <h2 className="font-display text-2xl font-medium tracking-tight text-stone-900 sm:text-[1.75rem]">
                                        Client perspectives
                                    </h2>
                                    <p className="text-sm text-stone-500">From verified sessions</p>
                                </div>

                                {mentorReviews.length > 0 ? (
                                    <ul className="mt-10 space-y-10">
                                        {mentorReviews.map((rev) => (
                                            <li key={rev.id} className="relative pl-8 sm:pl-10">
                                                <svg
                                                    className="absolute left-0 top-0 h-6 w-6 text-stone-200"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M7.17 6c-2.4 0-4.47 1.93-4.47 4.53 0 2.2 1.53 4.07 3.6 4.6L4 20h4.67l1.47-4.4c.13-.4.2-.83.2-1.27C10.33 11.33 8.6 9.33 6.33 8.2 6.8 6.93 7.87 6 7.17 6zm10 0c-2.4 0-4.47 1.93-4.47 4.53 0 2.2 1.53 4.07 3.6 4.6L14 20h4.67l1.47-4.4c.13-.4.2-.83.2-1.27C20.33 11.33 18.6 9.33 16.33 8.2 16.8 6.93 17.87 6 17.17 6z" />
                                                </svg>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <StarRow rating={rev.rating} />
                                                    <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                                                        {formatReviewDate(rev.created_at)}
                                                    </span>
                                                </div>
                                                {rev.comment?.trim() ? (
                                                    <blockquote className="mt-4 font-display text-lg italic leading-relaxed text-stone-800 sm:text-xl">
                                                        {rev.comment.trim()}
                                                    </blockquote>
                                                ) : (
                                                    <p className="mt-4 text-sm italic text-stone-400">Rated without a written comment.</p>
                                                )}
                                                <p className="mt-3 text-xs font-medium text-stone-500">— Verified mentee</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="mt-10 rounded-lg border border-dashed border-stone-300/80 bg-white/50 px-6 py-16 text-center">
                                        <p className="font-display text-lg font-medium text-stone-800">No public reviews yet</p>
                                        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-stone-500">
                                            After your first session, you can help future mentees by leaving candid feedback.
                                        </p>
                                    </div>
                                )}
                            </section>
                        </div>

                        <aside className="lg:col-span-4">
                            <div className="space-y-6 lg:sticky lg:top-24">
                                <div className="rounded-lg border border-stone-200/90 bg-white p-8 shadow-[0_24px_48px_-12px_rgba(28,25,23,0.14)]">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400">Private advisory</p>
                                    <h3 className="font-display mt-4 text-[1.65rem] font-medium leading-snug tracking-tight text-stone-900">
                                        Request time with {mentor.name.split(/\s+/)[0] ?? 'this mentor'}
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-stone-600">
                                        You choose the session format. Share context so your mentor can prepare meaningfully.
                                    </p>
                                    <ul className="mt-8 space-y-3 border-t border-stone-100 pt-6">
                                        {SESSION_TYPES.map((type) => (
                                            <li
                                                key={type.key}
                                                className="flex items-baseline justify-between gap-3 border-b border-stone-100/90 pb-3 text-sm last:border-0 last:pb-0"
                                            >
                                                <span className="font-medium text-stone-900">
                                                    <span className="mr-2" aria-hidden="true">
                                                        {type.icon}
                                                    </span>
                                                    {type.name}
                                                </span>
                                                <span className="shrink-0 tabular-nums text-stone-400">{type.duration}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        type="button"
                                        onClick={handleBookClick}
                                        className="mt-8 w-full rounded-md bg-stone-900 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(28,25,23,0.45)] transition hover:bg-stone-800 hover:shadow-lg"
                                    >
                                        Schedule a session
                                    </button>
                                    <p className="mt-4 text-center text-[11px] leading-relaxed text-stone-400">
                                        Fair cancellation and Pro plan terms may apply.
                                    </p>
                                </div>

                                <div className="rounded-lg border border-stone-200/80 bg-white/80 px-6 py-5 text-sm text-stone-600">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Why Bridge</p>
                                    <ul className="mt-4 space-y-3">
                                        <li className="flex gap-3">
                                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-800" aria-hidden="true" />
                                            Structured formats—not open-ended cold calls.
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-800" aria-hidden="true" />
                                            Profiles and histories you can evaluate upfront.
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-800" aria-hidden="true" />
                                            Secure booking and session records.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
            {showModal && <BookingModal mentor={mentor} onClose={() => setShowModal(false)} />}
        </>
    );
}
