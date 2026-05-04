"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building2, Briefcase, Upload, CheckCircle2, Loader2 } from "lucide-react";
import { useSignUpWithEmailMutation } from "@/hooks/api/use-auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Role = "GUEST" | "OWNER" | "BROKER";

const ROLES = [
  { value: "GUEST" as Role, label: "Guest", icon: User, description: "Browse & book" },
  { value: "OWNER" as Role, label: "Owner", icon: Building2, description: "List properties" },
  { value: "BROKER" as Role, label: "Broker", icon: Briefcase, description: "Manage listings" },
];

const SignupView = () => {
  const navigate = useNavigate();
  const signUpMutation = useSignUpWithEmailMutation();

  const [role, setRole] = useState<Role>("GUEST");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Shared fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Owner-specific
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licenseUrl, setLicenseUrl] = useState("");
  const [licenseUploading, setLicenseUploading] = useState(false);

  // Broker-specific
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
  const [nationalIdUrl, setNationalIdUrl] = useState("");
  const [nationalIdUploading, setNationalIdUploading] = useState(false);

  const uploadFile = async (file: File, setter: (url: string) => void, loadingSetter: (v: boolean) => void) => {
    loadingSetter(true);
    try {
      const { api } = await import("@/hooks/api");
      const fd = new FormData();
      fd.append("file", file);
      // Public upload endpoint — no auth required (for registration docs)
      const res = await api.post("/users/upload-public", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.url || res.data?.secure_url || "";
      if (url) {
        setter(url);
        toast.success("File uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      loadingSetter(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (phone && !/^[0-9]{10}$/.test(phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      if (role === "GUEST") {
        await signUpMutation.mutateAsync({ email, name, password, phone });
      } else {
        const { api } = await import("@/hooks/api");
        const payload: any = {
          contactName: name,
          email,
          password,
          phone,
          registrationType: role,
        };
        if (role === "OWNER") {
          payload.companyName = companyName || name;
          payload.companyDescription = companyDescription;
          payload.businessFileUrl = licenseUrl;
        } else {
          payload.nationalId = nationalIdUrl;
        }
        await api.post("/registration-requests", payload);
        setSubmitted(true);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6 w-[80%] sm:w-[300px] md:w-[400px] py-20 flex flex-col items-center text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        <h2 className="text-2xl font-bold">Registration Submitted!</h2>
        <p className="text-muted-foreground text-sm">
          Your {role === "OWNER" ? "owner" : "broker"} registration has been submitted. An admin will review and approve your account. You'll receive an email once approved.
        </p>
        <Button className="w-full py-5" onClick={() => navigate("/auth/signin")}>
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 w-[80%] sm:w-[300px] md:w-[400px] py-16">
      <Button className="rounded-full" variant="default" size="icon-lg" onClick={() => navigate(-1)}>
        <ArrowLeft />
      </Button>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Create your <span className="text-primary font-semibold">Kuru Rent</span> account
        </h1>
        <p className="text-muted-foreground text-sm">Sign up to start exploring and booking your perfect stay</p>
      </div>

      {/* Role selector */}
      <div className="space-y-2">
        <Label className="text-base">I am a...</Label>
        <div className="grid grid-cols-3 gap-2">
          {ROLES.map(({ value, label, icon: Icon, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center",
                role === value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-semibold">{label}</span>
              <span className="text-[10px] leading-tight opacity-70 hidden sm:block">{description}</span>
            </button>
          ))}
        </div>
        {role !== "GUEST" && (
          <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
            {role === "OWNER" ? "Owner" : "Broker"} accounts require admin approval before you can log in.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        {/* ── OWNER fields ── */}
        {role === "OWNER" && (
          <>
            <div className="flex flex-col gap-1">
              <Label>Company Name *</Label>
              <Input className="py-5" placeholder="Your company name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Company Description</Label>
              <Input className="py-5" placeholder="Brief description of your business" value={companyDescription} onChange={e => setCompanyDescription(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Business License</Label>
              <div className="flex gap-2 items-center">
                <label className="flex-1 cursor-pointer">
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={async e => {
                    const f = e.target.files?.[0];
                    if (f) { setLicenseFile(f); await uploadFile(f, setLicenseUrl, setLicenseUploading); }
                  }} />
                  <div className={cn("flex items-center gap-2 border rounded-lg px-3 py-2.5 text-sm transition-colors", licenseUrl ? "border-emerald-500 text-emerald-600" : "border-border text-muted-foreground hover:border-primary/50")}>
                    {licenseUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : licenseUrl ? <CheckCircle2 className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                    {licenseUploading ? "Uploading..." : licenseUrl ? "License uploaded ✓" : "Upload business license"}
                  </div>
                </label>
              </div>
            </div>
          </>
        )}

        {/* ── BROKER fields ── */}
        {role === "BROKER" && (
          <div className="flex flex-col gap-1">
            <Label>National ID Document</Label>
            <div className="flex gap-2 items-center">
              <label className="flex-1 cursor-pointer">
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={async e => {
                  const f = e.target.files?.[0];
                  if (f) { setNationalIdFile(f); await uploadFile(f, setNationalIdUrl, setNationalIdUploading); }
                }} />
                <div className={cn("flex items-center gap-2 border rounded-lg px-3 py-2.5 text-sm transition-colors", nationalIdUrl ? "border-emerald-500 text-emerald-600" : "border-border text-muted-foreground hover:border-primary/50")}>
                  {nationalIdUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : nationalIdUrl ? <CheckCircle2 className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                  {nationalIdUploading ? "Uploading..." : nationalIdUrl ? "National ID uploaded ✓" : "Upload national ID"}
                </div>
              </label>
            </div>
          </div>
        )}

        {/* ── Shared fields ── */}
        <div className="flex flex-col gap-1">
          <Label>{role === "GUEST" ? "Full Name" : "Contact Name"} *</Label>
          <Input className="py-5" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Phone Number *</Label>
          <Input className="py-5" placeholder="09XXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Email *</Label>
          <Input className="py-5" type="email" placeholder="@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Password *</Label>
          <Input className="py-5" type="password" placeholder="Min. 6 characters" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <Button className="mt-2 w-full py-5" type="submit" disabled={loading || signUpMutation.isPending || licenseUploading || nationalIdUploading}>
          {loading || signUpMutation.isPending
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</>
            : role === "GUEST" ? "Sign up" : `Submit ${role === "OWNER" ? "owner" : "broker"} registration`}
        </Button>
      </form>

      <div className="w-full flex justify-center items-center">
        <p className="text-sm">Already have an account?</p>
        <Button variant="link" className="underline" onClick={() => navigate("/auth/signin")}>
          Sign in
        </Button>
      </div>
    </div>
  );
};

export default SignupView;
