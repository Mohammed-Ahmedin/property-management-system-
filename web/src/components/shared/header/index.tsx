"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Calendar, LogOut, Menu, Settings, User, Heart, ChevronDown, Hotel, Home, Building2, TreePine, Tent, Warehouse } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "../avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useClientAuth } from "@/hooks/use-client-auth";

const PROPERTY_TYPES = [
  { label: "Hotels", value: "HOTEL", icon: <Hotel className="w-4 h-4" /> },
  { label: "Guest Houses", value: "GUEST_HOUSE", icon: <Home className="w-4 h-4" /> },
  { label: "Apartments", value: "APARTMENT", icon: <Building2 className="w-4 h-4" /> },
  { label: "Resorts", value: "RESORT", icon: <TreePine className="w-4 h-4" /> },
  { label: "Villas", value: "VILLA", icon: <Tent className="w-4 h-4" /> },
  { label: "Hostels", value: "HOSTEL", icon: <Warehouse className="w-4 h-4" /> },
];

const mainNavLinks = [
  { href: "/", label: "Home" },
  { href: "/nearby", label: "Nearby" },
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

  const UserMenu = () => (
    <Popover>
      <PopoverTrigger>
        <Avatar src={data?.user?.image!} fallback={data?.user?.name ?? ""} />
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="flex gap-2 items-center px-2 py-2 border-b mb-2">
          <Avatar src={data?.user?.image || ""} fallback={data?.user?.name ?? ""} />
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-medium truncate">{data?.user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{data?.user?.email}</p>
          </div>
        </div>
        <button className="w-full text-start text-sm px-2 py-2 rounded-lg flex items-center gap-2 hover:bg-muted transition-colors" onClick={() => navigate("/account")}>
          <Settings className="w-4 h-4" /> Account settings
        </button>
        <button className="w-full text-start text-sm px-2 py-2 rounded-lg flex items-center gap-2 hover:bg-muted transition-colors" onClick={() => navigate("/account/bookings")}>
          <Calendar className="w-4 h-4" /> My bookings
        </button>
        <button className="w-full text-start text-sm px-2 py-2 rounded-lg flex items-center gap-2 hover:bg-muted transition-colors text-destructive" onClick={() => signOut()}>
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </PopoverContent>
    </Popover>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-foreground">Bete</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 flex-1">
            {/* Home */}
            <Link to="/"
              className={cn("text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/" ? "text-primary" : "text-foreground/70"
              )}>
              Home
            </Link>

            {/* Properties dropdown */}
            <div ref={dropRef} className="relative">
              <button
                onClick={() => setPropDropdown(d => !d)}
                className={cn("flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                  location.pathname.startsWith("/properties") ? "text-primary" : "text-foreground/70"
                )}
              >
                Properties
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", propDropdown && "rotate-180")} />
              </button>
              {propDropdown && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50">
                  <Link to="/properties"
                    onClick={() => setPropDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted border-b border-border">
                    All Properties
                  </Link>
                  {PROPERTY_TYPES.map((t) => (
                    <Link key={t.value}
                      to={`/properties?type=${t.value}`}
                      onClick={() => setPropDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground/80 hover:bg-muted hover:text-primary transition-colors">
                      {t.icon}
                      {t.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {mainNavLinks.slice(1).map((link) => (
              <Link key={link.href} to={link.href}
                className={cn("text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.href ? "text-primary" : "text-foreground/70"
                )}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <ModeToggle />
            {isPending ? null : data?.user ? (
              <>
                <button onClick={() => navigate("/account/bookings")}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                  <Heart className="w-4 h-4" /> Saved
                </button>
                <UserMenu />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth/register")}>Register</Button>
                <Button size="sm" className="rounded-lg px-5" onClick={() => navigate("/auth/signin")}>Sign in</Button>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            {data?.user && <UserMenu />}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col justify-between px-4 pb-6">
                <div>
                  <SheetHeader className="mb-6">
                    <SheetTitle className="text-xl font-bold flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-xs">B</span>
                      </div>
                      Bete
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-1">
                    <Link to="/" onClick={() => setOpen(false)} className={cn("text-sm font-medium px-3 py-2.5 rounded-lg transition-colors", location.pathname === "/" ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted")}>Home</Link>
                    <Link to="/properties" onClick={() => setOpen(false)} className={cn("text-sm font-medium px-3 py-2.5 rounded-lg transition-colors", location.pathname === "/properties" ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted")}>All Properties</Link>
                    {PROPERTY_TYPES.map((t) => (
                      <Link key={t.value} to={`/properties?type=${t.value}`} onClick={() => setOpen(false)}
                        className="text-sm font-medium px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted hover:text-primary flex items-center gap-2 ml-3">
                        {t.icon}{t.label}
                      </Link>
                    ))}
                    {mainNavLinks.slice(1).map((link) => (
                      <Link key={link.href} to={link.href} onClick={() => setOpen(false)}
                        className={cn("text-sm font-medium px-3 py-2.5 rounded-lg transition-colors", location.pathname === link.href ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted")}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
                {!isAuthenticated && (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full" onClick={() => { navigate("/auth/register"); setOpen(false); }}>Register</Button>
                    <Button className="w-full" onClick={() => { navigate("/auth/signin"); setOpen(false); }}><User className="h-4 w-4 mr-2" /> Sign in</Button>
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
