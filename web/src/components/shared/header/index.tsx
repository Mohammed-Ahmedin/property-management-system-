"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar, LogOut, Menu, Settings, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import { cn } from "@/lib/utils";
import { mainNavLinks } from "@/const/links";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "../avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useClientAuth } from "@/hooks/use-client-auth";

export function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { data, isPending } = authClient.useSession();
  const { signOut, isAuthenticated } = useClientAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60">
      <div className="c-px">
        <div className="flex h-16 items-center justify-between">
          {/* Logo + Desktop Nav */}
          <div className="flex items-center gap-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">Bete</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === link.href
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <div className="pl-2">
              <ModeToggle />
            </div>

            {isPending ? (
              "Loading..."
            ) : data?.user ? (
              <div>
                <Popover>
                  <PopoverTrigger>
                    <Avatar src={data.user.image!} fallback={data.user.name} />
                  </PopoverTrigger>

                  <PopoverContent>
                    <div className="flex gap-2 items-center">
                      <Avatar
                        src={data.user.image || ""}
                        fallback={data.user.name}
                      />
                      <div className="flex flex-col px-2 py-3">
                        <h2 className="text-sm">{data.user.name}</h2>
                        <h2 className="text-xs">{data.user.email}</h2>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-3">
                      <button
                        className="w-full text-start text-sm border px-2 py-2 rounded-lg flex items-center gap-2"
                        onClick={() => {
                          navigate("/account");
                        }}
                      >
                        <Settings className="w-4" />
                        Account
                      </button>
                      <button
                        className="w-full text-start text-sm border px-2 py-2 rounded-lg flex items-center gap-2"
                        onClick={() => {
                          navigate("/account/bookings");
                        }}
                      >
                        <Calendar className="w-4" />
                        Bookings
                      </button>
                      <button
                        className="w-full text-start text-sm border px-2 py-2 rounded-lg flex items-center gap-2"
                        onClick={() => {
                          signOut();
                        }}
                      >
                        <LogOut className="w-4" />
                        Signout
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <>
                <Button
                  className="rounded-3xl py-4 px-8"
                  variant="outline"
                  onClick={() => {
                    navigate("/auth/register");
                  }}
                >
                  Sign up
                </Button>
                <Button
                  className="rounded-3xl py-4 px-8"
                  onClick={() => {
                    navigate("/auth/signin");
                  }}
                >
                  Sign in
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-2">
            {data?.user && (
              <div>
                <Popover>
                  <PopoverTrigger>
                    <Avatar src={data.user.image!} fallback={data.user.name} />
                  </PopoverTrigger>

                  <PopoverContent>
                    <div className="flex gap-2 items-center">
                      <Avatar
                        src={data.user.image || ""}
                        fallback={data.user.name}
                      />
                      <div className="flex flex-col px-2 py-3">
                        <h2 className="text-sm">{data.user.name}</h2>
                        <h2 className="text-xs">{data.user.email}</h2>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-3">
                      <button
                        className="w-full text-start text-sm border px-2 py-2 rounded-lg flex items-center gap-2"
                        onClick={() => {
                          navigate("/account");
                        }}
                      >
                        <Settings className="w-4" />
                        Account
                      </button>
                      <button
                        className="w-full text-start text-sm border px-2 py-2 rounded-lg flex items-center gap-2"
                        onClick={() => {
                          navigate("/account/bookings");
                        }}
                      >
                        <Calendar className="w-4" />
                        Bookings
                      </button>
                      <button
                        className="w-full text-start text-sm border px-2 py-2 rounded-lg flex items-center gap-2"
                        onClick={() => {
                          signOut();
                        }}
                      >
                        <LogOut className="w-4" />
                        Signout
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex flex-col justify-between px-4 pb-4"
              >
                <div>
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold">Bete</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col gap-4">
                    {mainNavLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "text-base font-medium transition-colors hover:text-primary",
                          location.pathname === link.href
                            ? "text-primary border-l-4 border-primary pl-3"
                            : "text-foreground pl-3"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Auth actions inside sheet */}
                {!isAuthenticated && (
                  <div className="mt-8 flex flex-col gap-2 ">
                    <Button
                      variant="outline"
                      className="rounded-3xl w-full"
                      onClick={() => {
                        navigate("/auth/register");
                      }}
                    >
                      Sign up
                    </Button>
                    <Button
                      className="rounded-3xl w-full flex items-center justify-center gap-2"
                      onClick={() => {
                        navigate("/auth/signin");
                      }}
                    >
                      <User className="h-4 w-4" />
                      Sign in
                    </Button>
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
