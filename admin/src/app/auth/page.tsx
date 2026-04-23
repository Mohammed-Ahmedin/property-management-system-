import LoginView from "./login-view";
import AuthGuard from "./auth-guard";

export default function LoginPage() {
  return (
    <AuthGuard>
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Login Form */}
      <div className="flex items-center justify-center lg:p-8 bg-background">
        <div className="w-full max-md:flex max-md:flex-col max-md:justify-center max-md:items-center md:max-w-md">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your Property management panel</p>
          </div>
          <LoginView />
        </div>
      </div>

      {/* Right Side */}
      <div className="relative hidden lg:block overflow-hidden bg-[#1a4a2e]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-12 text-white">
          <div className="space-y-6">
            <div className="inline-block">
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <span className="text-sm font-medium text-[#c9a227]">Kuru Rent Admin Panel</span>
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-[#c9a227]">
              Manage Your<br />Property<br />With Ease
            </h2>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Streamline bookings, manage guests, and grow your hospitality business.
            </p>
            <div className="flex flex-wrap gap-3">
              {["📅 Smart Booking", "👥 Guest Management", "📊 Analytics"].map(t => (
                <div key={t} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <span className="text-sm text-[#c9a227]">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
