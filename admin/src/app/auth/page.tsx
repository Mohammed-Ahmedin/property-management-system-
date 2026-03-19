import LoginView from "./login-view";
import SignupView from "./signup-view";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Login Form */}
      <div className="flex items-center justify-center lg:p-8 bg-background">
        <div className="w-full max-md:flex max-md:flex-col max-md:justify-center max-md:items-center md:max-w-md">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your Property management panel</p>
          </div>
          <LoginView />
          {/* <SignupView/> */}
        </div>
      </div>

      {/* Right Side - Animated Image */}
      <div className="relative hidden lg:block overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
        {/* Animated Background Image */}
        <div className="absolute inset-0 animate-in fade-in zoom-in-95 duration-1000">
          <img
            src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/7c/11/39/blaauwheim-property.jpg?w=900&h=500&s=1"
            alt="Property"
            className="w-full h-full object-cover opacity-90"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        {/* Animated Text Content */}
        <div className="relative h-full flex flex-col justify-end p-12 text-white">
          <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
            <div className="inline-block">
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 animate-in fade-in slide-in-from-left-4 duration-700 delay-500">
                <span className="text-sm font-medium">Management Panel</span>
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold leading-tight animate-in slide-in-from-bottom-6 fade-in duration-700 delay-700">
              Manage Your
              <br />
              <span className="text-blue-300">Property</span>
              <br />
              With Ease
            </h2>

            <p className="text-lg text-white/90 max-w-md leading-relaxed animate-in slide-in-from-bottom-4 fade-in duration-700 delay-1000">
              Streamline bookings, manage guests, and grow your hospitality business with our powerful management
              platform.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 animate-in fade-in duration-700 delay-1200">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-sm">📅 Smart Booking</span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-sm">👥 Guest Management</span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-sm">📊 Analytics</span>
              </div>
            </div>
          </div>

          {/* Floating Animation Elements */}
          <div className="absolute top-20 right-20 w-20 h-20 bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute top-40 right-40 w-32 h-32 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>
      </div>
    </div>
  )
}
