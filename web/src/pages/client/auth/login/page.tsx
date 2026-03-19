"use client";

import { useNavigate } from "react-router-dom";
import LoginView from "./login-view";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Login Form */}
      <div className="flex items-center justify-center lg:p-8 bg-background">
        <div className="w-full max-md:flex max-md:flex-col max-md:justify-center max-md:items-center md:max-w-md">
          <LoginView />
        </div>
      </div>

      {/* Right Side - Guest Experience Image */}
      <div className="relative hidden lg:block overflow-hidden bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-950 dark:to-blue-950">
        {/* Background Image */}
        <div className="absolute inset-0 animate-in fade-in zoom-in-95 duration-1000">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
            alt="Property View"
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
                  Find Your Perfect Stay
                </span>
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold leading-tight animate-in slide-in-from-bottom-6 fade-in duration-700 delay-700">
              Discover
              <br />
              <span className="text-blue-300">Comfort & Elegance</span>
              <br />
              Wherever You Go
            </h2>

            <p className="text-lg text-white/90 max-w-md leading-relaxed animate-in slide-in-from-bottom-4 fade-in duration-700 delay-1000">
              Book your next property easily, manage reservations, and enjoy
              a seamless travel experience—all in one place.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 animate-in fade-in duration-700 delay-1200">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-sm">🏡 Beautiful Stays</span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-sm">💳 Easy Booking</span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-sm">⭐ Trusted Reviews</span>
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
