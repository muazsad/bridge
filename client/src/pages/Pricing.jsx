import React from "react";
import { Link } from "react-router-dom";

export default function Pricing() {
    const handlePaidClick = () => {
        alert("Payment integration coming soon");
    };

    return (
        <main className="min-h-screen bg-amber-50 px-6 py-16">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-stone-900">
                        Choose Your Plan
                    </h1>
                    <p className="text-stone-600 mt-3">
                        Flexible pricing for every stage of your career journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Free */}
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 flex flex-col">
                        <h2 className="text-2xl font-semibold text-stone-900 mb-2">Free</h2>
                        <p className="text-3xl font-bold text-stone-900 mb-6">$0<span className="text-lg font-medium text-stone-500">/month</span></p>

                        <ul className="space-y-3 text-stone-700 mb-8 flex-1">
                            <li>✓ Browse mentor profiles</li>
                            <li>✓ View ratings and reviews</li>
                            <li>✓ Limited to 1 session request per month</li>
                        </ul>

                        <Link
                            to="/register"
                            className="w-full text-center px-6 py-3 rounded-full bg-stone-900 text-amber-50 hover:bg-stone-700 transition-colors font-medium"
                        >
                            Sign Up Free
                        </Link>
                    </div>

                    {/* Pro */}
                    <div className="bg-white rounded-2xl shadow-md border-2 border-amber-400 p-8 flex flex-col relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Most Popular
            </span>

                        <h2 className="text-2xl font-semibold text-stone-900 mb-2">Pro</h2>
                        <p className="text-3xl font-bold text-stone-900 mb-6">$19<span className="text-lg font-medium text-stone-500">/month</span></p>

                        <ul className="space-y-3 text-stone-700 mb-8 flex-1">
                            <li>✓ Unlimited session bookings</li>
                            <li>✓ Priority matching with top-rated mentors</li>
                            <li>✓ Access to messaging with mentors before/after sessions</li>
                            <li>✓ Session notes and action item summaries</li>
                        </ul>

                        <button
                            onClick={handlePaidClick}
                            className="w-full px-6 py-3 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors font-medium"
                        >
                            Subscribe
                        </button>
                    </div>

                    {/* Premium */}
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 flex flex-col">
                        <h2 className="text-2xl font-semibold text-stone-900 mb-2">Premium</h2>
                        <p className="text-3xl font-bold text-stone-900 mb-6">$49<span className="text-lg font-medium text-stone-500">/month</span></p>

                        <ul className="space-y-3 text-stone-700 mb-8 flex-1">
                            <li>✓ Everything in Pro</li>
                            <li>✓ Dedicated mentor (recurring weekly sessions with the same person)</li>
                            <li>✓ Resume and LinkedIn profile review</li>
                            <li>✓ Priority support and scheduling</li>
                        </ul>

                        <button
                            onClick={handlePaidClick}
                            className="w-full px-6 py-3 rounded-full bg-stone-900 text-amber-50 hover:bg-stone-700 transition-colors font-medium"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>

                <p className="text-center text-sm text-stone-500 mt-10">
                    Not sure? Start free and upgrade anytime.
                </p>
            </div>
        </main>
    );
}