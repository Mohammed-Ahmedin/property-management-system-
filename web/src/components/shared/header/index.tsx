"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Calendar, LogOut, Menu, Settings, User, Heart, ChevronDown, Hotel, Home, Building2, TreePine, Tent, Warehouse, MapPin, Bookmark } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "../avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useClientAuth } from "@/hooks/use-client-auth";

const PROPERTY_TYPES = [
  { label: "Hotels", value: "HOTEL", icon: <Hotel className="w-4 h-4" />, color: "text-blue-500" },
  { label: "Guest Houses", value: "GUEST_HOUSE", icon: <Home className="w-4 h-4" />, color: "text-green-500" },
  { label: "Apartments", value: "APARTMENT", icon: <Building2 className="w-4 h-4" />, color: "text-purple-500" },
  { label: "Resorts", value: "RESORT", icon: <TreePine className="w-4 h-4" />, color: "text-emerald-500" },
  { label: "Villas", value: "VILLA", icon: <Tent className="w-4 h-4" />, color: "text-orange-500" },
  { label: "Hostels", value: "HOSTEL", icon: <Warehouse className="w-4 h-4" />, color: "text-pink-500" },
];

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/nearby", label: "Nearby", icon: <MapPin className="w-3.5 h-3.5" /> },
  { href: "/about", label: "About" },
  { href: "/register", label: "Register" },
];

export function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [propDropdown, setPropDropdown] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const { data, isPending } = authClient.useSession();
  const { signOut, isAuthenticated } = useClientAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setPropDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href: string) => location.pathname === href;

  const UserMenu = () => (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-border px-2 py-1 hover:shadow-md transition-shadow">
          <Menu className="w-4 h-4 text-muted-foreground" />
          <Avatar src={data?.user?.image!} fallback={data?.user?.name ?? ""} className="w-7 h-7" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2" align="end">
        <div className="flex gap-2.5 items-center px-3 py-2.5 border-b mb-2 bg-muted/30 rounded-lg">
          <Avatar src={data?.user?.image || ""} fallback={data?.user?.name ?? ""} className="w-9 h-9" />
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold truncate">{data?.user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{data?.user?.email}</p>
          </div>
        </div>
        <button className="w-full text-start text-sm px-3 py-2 rounded-lg flex items-center gap-2.5 hover:bg-muted transition-colors" onClick={() => navigate("/account")}>
          <Settings className="w-4 h-4 text-muted-foreground" /> Account settings
        </button>
        <button className="w-full text-start text-sm px-3 py-2 rounded-lg flex items-center gap-2.5 hover:bg-muted transition-colors" onClick={() => navigate("/account/bookings")}>
          <Bookmark className="w-4 h-4 text-muted-foreground" /> My bookings
        </button>
        <div className="border-t my-1" />
        <button className="w-full text-start text-sm px-3 py-2 rounded-lg flex items-center gap-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-destructive transition-colors" onClick={() => signOut()}>
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </PopoverContent>
    </Popover>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:shadow-primary/30 group-hover:shadow-md transition-shadow">
              <span className="text-primary-foreground font-bold text-base">B</span>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">Bete</span>
          </Link>

          {/* Desktop Nav — full width spread */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center px-8">
            <Link to="/"
              className={cn("px-5 py-2 rounded-full text-sm font-medium transition-all",
                isActive("/") ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"
              )}>
              Home
            </Link>

            {/* Properties dropdown */}
            <div ref={dropRef} className="relative">
              <button
                onClick={() => setPropDropdown(d => !d)}
                className={cn("flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all",
                  location.pathname.startsWith("/properties") ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"
                )}
              >
                Properties
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", propDropdown && "rotate-180")} />
              </button>
              {propDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link to="/properties" onClick={() => setPropDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/5 border-b border-border transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5 text-primary" />
                    </div>
                    All Properties
                  </Link>
                  <div className="p-1.5">
                    {PROPERTY_TYPES.map((t) => (
                      <Link key={t.value} to={`/properties?type=${t.value}`} onClick={() => setPropDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors">
                        <span className={t.color}>{t.icon}</span>
                        {t.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/nearby"
              className={cn("flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all",
                isActive("/nearby") ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"
              )}>
              <MapPin className="w-3.5 h-3.5" /> Nearby
            </Link>

            <Link to="/about"
              className={cn("px-5 py-2 rounded-full text-sm font-medium transition-all",
                isActive("/about") ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"
              )}>
              About
            </Link>

            <Link to="/register"
              className={cn("px-5 py-2 rounded-full text-sm font-medium transition-all",
                isActive("/register") ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"
              )}>
              Register
            </Link>
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            <ModeToggle />
            {isPending ? null : data?.user ? (
              <>
                <button onClick={() => navigate("/account/bookings")}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-full hover:bg-muted transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="hidden lg:inline">Saved</span>
                </button>
                <UserMenu />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="rounded-full" onClick={() => navigate("/auth/register")}>Register</Button>
                <Button size="sm" className="rounded-full px-5 shadow-sm" onClick={() => navigate("/auth/signin")}>Sign in</Button>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            {data?.user && <UserMenu />}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col justify-between px-4 pb-6 w-72">
                <div>
                  <SheetHeader className="mb-6">
                    <SheetTitle className="text-xl font-bold flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">B</span>
                      </div>
                      Bete
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-0.5">
                    {[{ href: "/", label: "Home" }, { href: "/nearby", label: "Nearby" }, { href: "/about", label: "About" }, { href: "/register", label: "Register" }].map(({ href, label }) => (
                      <Link key={href} to={href} onClick={() => setOpen(false)}
                        className={cn("text-sm font-medium px-3 py-2.5 rounded-xl transition-colors", isActive(href) ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted")}>
                        {label}
                      </Link>
                    ))}
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">Property Types</div>
                    <Link to="/properties" onClick={() => setOpen(false)} className="text-sm font-medium px-3 py-2 rounded-xl text-primary hover:bg-primary/5">All Properties</Link>
                    {PROPERTY_TYPES.map((t) => (
                      <Link key={t.value} to={`/properties?type=${t.value}`} onClick={() => setOpen(false)}
                        className="text-sm px-3 py-2 rounded-xl text-foreground/70 hover:bg-muted hover:text-foreground flex items-center gap-2.5 ml-2">
                        <span className={t.color}>{t.icon}</span>{t.label}
                      </Link>
                    ))}
                  </div>
                </div>
                {!isAuthenticated && (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full rounded-xl" onClick={() => { navigate("/auth/register"); setOpen(false); }}>Register</Button>
                    <Button className="w-full rounded-xl" onClick={() => { navigate("/auth/signin"); setOpen(false); }}><User className="h-4 w-4 mr-2" /> Sign in</Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
