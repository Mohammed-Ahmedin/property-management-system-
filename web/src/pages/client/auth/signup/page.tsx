"use client";

import SignupView from "./signup-view";

export default function SignupPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Signup Form */}
      <div className="flex items-center justify-center lg:p-8 bg-background">
        <div className="w-full max-md:flex max-md:flex-col max-md:justify-center max-md:items-center md:max-w-md">
          <SignupView />
        </div>
      </div>

      {/* Right Side - Guest Experience Image */}
      <div className="relative hidden lg:block overflow-hidden bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-950 dark:to-blue-950">
        {/* Background Image */}
        <div className="absolute inset-0 animate-in fade-in zoom-in-95 duration-1000">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop"
            alt="Relaxing Property View"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        </div>

        {/* Right Text Section */}
        <div className="relative h-full flex flex-col justify-end p-12 text-white">
          <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
            <div className="inline-block">
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 animate-in fade-in slide-in-from-left-4 duration-700 delay-500">
                <span className="text-sm font-medium">
                  Start Your Next Stay
                </span>
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold leading-tight animate-in slide-in-from-bottom-6 fade-in duration-700 delay-700">
              Create Your Account
              <br />
              <span className="text-blue-300">And Find Your Dream Stay</span>
            </h2>

            <p className="text-lg text-white/90 max-w-md leading-relaxed animate-in slide-in-from-bottom-4 fade-in duration-700 delay-1000">
              Sign up in seconds to discover properties, compare prices, and
              book unforgettable experiences across Ethiopia and beyond.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 animate-in fade-in duration-700 delay-1200">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-sm">🛏️ Cozy Rooms</span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-sm">💸 Secure Payments</span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-sm">🗺️ Local Experiences</span>
              </div>
            </div>
          </div>

          {/* Floating Animations */}
          <div className="absolute top-20 right-20 w-20 h-20 bg-sky-400/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute top-40 right-40 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>
      </div>
    </div>
  );
}
