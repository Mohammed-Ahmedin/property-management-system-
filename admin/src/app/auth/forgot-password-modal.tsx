"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, KeyRound, Lock, CheckCircle2 } from "lucide-react";
import axios from "axios";

const SERVER = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

type Step = "email" | "code" | "password" | "done";

export function ForgotPasswordModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setStep("email");
    setEmail("");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  // Step 1 — send code
  const handleSendCode = async () => {
    if (!email.trim()) return toast.error("Enter your email");
    setLoading(true);
    try {
      await axios.post(`${SERVER}/api/v1/auth/forgot-password`, { email });
      toast.success("Reset code sent — check your inbox");
      setStep("code");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to send code. Check your email address.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify code
  const handleVerifyCode = async () => {
    if (code.length !== 6) return toast.error("Enter the 6-digit code");
    setLoading(true);
    try {
      await axios.post(`${SERVER}/api/v1/auth/verify-reset-code`, { email, code });
      toast.success("Code verified");
      setStep("password");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  // Step 3 — reset password
  const handleResetPassword = async () => {
    if (newPassword.length < 4) return toast.error("Password must be at least 4 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      await axios.post(`${SERVER}/api/v1/auth/reset-password`, { email, code, newPassword });
      toast.success("Password reset successfully");
      setStep("done");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {step === "email" && "Forgot Password"}
            {step === "code" && "Enter Verification Code"}
            {step === "password" && "Set New Password"}
            {step === "done" && "Password Reset"}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1 — Email */}
        {step === "email" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a 6-digit verification code.
            </p>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendCode()}
                  autoFocus
                />
              </div>
            </div>
            <Button className="w-full" onClick={handleSendCode} disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Send Code"}
            </Button>
          </div>
        )}

        {/* Step 2 — Code */}
        {step === "code" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A 6-digit code was sent to <span className="font-medium text-foreground">{email}</span>. It expires in 5 minutes.
            </p>
            <div className="space-y-2">
              <Label>Verification Code</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9 text-center tracking-[0.5em] text-lg font-mono"
                  placeholder="000000"
                  maxLength={6}
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={e => e.key === "Enter" && handleVerifyCode()}
                  autoFocus
                />
              </div>
            </div>
            <Button className="w-full" onClick={handleVerifyCode} disabled={loading || code.length !== 6}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : "Verify Code"}
            </Button>
            <button
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setStep("email")}
            >
              ← Back / Resend code
            </button>
          </div>
        )}

        {/* Step 3 — New Password */}
        {step === "password" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Choose a new password for your account.</p>
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  type="password"
                  placeholder="Min. 4 characters"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  type="password"
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleResetPassword()}
                />
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleResetPassword}
              disabled={loading || newPassword.length < 4 || newPassword !== confirmPassword}
            >
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...</> : "Reset Password"}
            </Button>
          </div>
        )}

        {/* Done */}
        {step === "done" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <p className="text-center text-sm text-muted-foreground">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <Button className="w-full" onClick={() => handleClose(false)}>
              Back to Login
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
