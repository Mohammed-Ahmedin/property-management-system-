import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Mail, KeyRound, Lock, CheckCircle2 } from "lucide-react";
import axios from "axios";

const SERVER = import.meta.env.VITE_SERVER_BASE_URL;

type Step = "email" | "code" | "password" | "done";

const ForgotPasswordView = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => step === "email" ? navigate("/auth/signin") : setStep(step === "code" ? "email" : step === "password" ? "code" : "email")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Step 1 — Email */}
        {step === "email" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Forgot Password</h1>
              <p className="text-muted-foreground mt-2">
                Enter your email address and we'll send you a 6-digit verification code.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9 py-5"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendCode()}
                  autoFocus
                />
              </div>
            </div>
            <Button className="w-full py-5" onClick={handleSendCode} disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Send Code"}
            </Button>
          </div>
        )}

        {/* Step 2 — Code */}
        {step === "code" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Enter Code</h1>
              <p className="text-muted-foreground mt-2">
                A 6-digit code was sent to <span className="font-medium text-foreground">{email}</span>. It expires in 5 minutes.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Verification Code</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9 py-5 text-center tracking-[0.5em] text-lg font-mono"
                  placeholder="000000"
                  maxLength={6}
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={e => e.key === "Enter" && handleVerifyCode()}
                  autoFocus
                />
              </div>
            </div>
            <Button className="w-full py-5" onClick={handleVerifyCode} disabled={loading || code.length !== 6}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : "Verify Code"}
            </Button>
            <button
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setStep("email")}
            >
              ← Resend code
            </button>
          </div>
        )}

        {/* Step 3 — New Password */}
        {step === "password" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">New Password</h1>
              <p className="text-muted-foreground mt-2">Choose a new password for your account.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9 py-5"
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
                    className="pl-9 py-5"
                    type="password"
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleResetPassword()}
                  />
                </div>
              </div>
            </div>
            <Button
              className="w-full py-5"
              onClick={handleResetPassword}
              disabled={loading || newPassword.length < 4 || newPassword !== confirmPassword}
            >
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...</> : "Reset Password"}
            </Button>
          </div>
        )}

        {/* Done */}
        {step === "done" && (
          <div className="flex flex-col items-center gap-6 py-8">
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Password Reset!</h1>
              <p className="text-muted-foreground">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
            </div>
            <Button className="w-full py-5" onClick={() => navigate("/auth/signin")}>
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordView;
