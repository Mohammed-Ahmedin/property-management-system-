"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, User, Building2, Briefcase } from "lucide-react";
import { useState } from "react";
import { useSignUpWithEmailMutation } from "@/hooks/api/use-auth";
import { cn } from "@/lib/utils";

const validationSchema = yup.object({
  name: yup.string().required("Name is required").min(2).max(50),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "At least 6 characters")
    .max(20, "Too long"),
});

type FormType = yup.InferType<typeof validationSchema>;

const ROLES = [
  { value: "GUEST", label: "Guest", icon: User, description: "Browse & book properties" },
  { value: "OWNER", label: "Owner", icon: Building2, description: "List & manage properties" },
  { value: "BROKER", label: "Broker", icon: Briefcase, description: "Manage on behalf of owners" },
];

const SignupView = () => {
  const navigate = useNavigate();
  const signUpMutation = useSignUpWithEmailMutation();
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<"GUEST" | "OWNER" | "BROKER">("GUEST");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<FormType>({
    defaultValues: { name: "", phone: "", email: "", password: "" },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: FormType) => {
    if (selectedRole === "GUEST") {
      // Direct signup — no admin approval needed
      await signUpMutation.mutateAsync({
        email: data.email,
        name: data.name,
        password: data.password,
        phone: data.phone,
      });
    } else {
      // OWNER or BROKER — submit registration request (requires admin approval)
      try {
        const { api } = await import("@/hooks/api");
        await api.post("/registration-requests", {
          contactName: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          registrationType: selectedRole,
          companyName: data.name,
        });
        setSubmitted(true);
      } catch (e: any) {
        const msg = e?.response?.data?.message || "Registration failed. Please try again.";
        alert(msg);
      }
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6 w-[80%] sm:w-[300px] md:w-[400px] py-20 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Registration Submitted</h2>
        <p className="text-muted-foreground text-sm">
          Your {selectedRole.toLowerCase()} registration request has been submitted. An admin will review and approve your account. You'll receive an email once approved.
        </p>
        <Button className="w-full py-5" onClick={() => navigate("/auth/signin")}>
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-[80%] sm:w-[300px] md:w-[400px] py-20">
      <Button className="rounded-full" variant="default" size="icon-lg" onClick={() => navigate(-1)}>
        <ArrowLeft />
      </Button>

      <div className="mb-4 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Create your <span className="text-primary font-semibold">Kuru Rent</span> account
        </h1>
        <p className="text-muted-foreground">Sign up to start exploring and booking your perfect stay</p>
      </div>

      {/* Role selector */}
      <div className="space-y-2">
        <Label className="text-base">I am a...</Label>
        <div className="grid grid-cols-3 gap-2">
          {ROLES.map(({ value, label, icon: Icon, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedRole(value as any)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center",
                selectedRole === value
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
        {selectedRole !== "GUEST" && (
          <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
            {selectedRole === "OWNER" ? "Owner" : "Broker"} accounts require admin approval before you can log in.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-base">Full Name</Label>
          <Input className="py-5 w-full" placeholder="Your name" disabled={signUpMutation.isPending} {...register("name")} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-base">Phone Number</Label>
          <Input className="py-5 w-full" placeholder="09XXXXXXXX" disabled={signUpMutation.isPending} {...register("phone")} />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-base">Email</Label>
          <Input className="py-5 w-full" placeholder="@gmail.com" disabled={signUpMutation.isPending} {...register("email")} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-base">Password</Label>
          <Input className="py-5 w-full" placeholder="******" type="password" disabled={signUpMutation.isPending} {...register("password")} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <Button className="mt-2 w-full py-5" disabled={signUpMutation.isPending}>
          {signUpMutation.isPending
            ? "Creating account..."
            : selectedRole === "GUEST"
            ? "Sign up"
            : `Submit ${selectedRole.toLowerCase()} registration`}
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

const validationSchema = yup.object({
  name: yup.string().required("Name is required").min(2).max(50),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "At least 6 characters")
    .max(20, "Too long"),
});

type FormType = yup.InferType<typeof validationSchema>;

const SignupView = () => {
  const navigate = useNavigate();
  const signUpMutation = useSignUpWithEmailMutation(); // replace with your actual signup hook
  const [searchParams] = useSearchParams();
  const callBackUrl = searchParams.get("callBackUrl");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormType>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: FormType) => {
    await signUpMutation.mutateAsync({
      email: data.email,
      name: data.name,
      password: data.password,
      phone: data.phone,
    });
    // Navigation handled in mutation (window.location.href for mobile cookie fix)
  };

  return (
    <div className="space-y-6 w-[80%] sm:w-[300px] md:w-[400px] py-20">
      <Button
        className="rounded-full"
        variant="default"
        size="icon-lg"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft />
      </Button>

      <div className="mb-8 space-y-2 ">
        <h1 className="text-3xl font-bold tracking-tight">
          Create your <span className="text-primary font-semibold">Kuru Rent</span>{" "}
          account
        </h1>
        <p className="text-muted-foreground">
          Sign up to start exploring and booking your perfect stay
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <Label className="text-base">Full Name</Label>
          <Input
            className="py-5 w-full"
            placeholder="Your name"
            disabled={signUpMutation.isPending}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <Label className="text-base">Phone Number</Label>
          <Input
            className="py-5 w-full"
            placeholder="09XXXXXXXX"
            disabled={signUpMutation.isPending}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <Label className="text-base">Email</Label>
          <Input
            className="py-5 w-full"
            placeholder="@gmail.com"
            disabled={signUpMutation.isPending}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <Label className="text-base">Password</Label>
          <Input
            className="py-5 w-full"
            placeholder="******"
            type="password"
            disabled={signUpMutation.isPending}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button
          className="mt-2 w-full py-5"
          disabled={signUpMutation.isPending}
        >
          {signUpMutation.isPending ? "Creating account..." : "Sign up"}
        </Button>
      </form>
      <div className="w-full flex justify-center items-center">
        <p className="text-sm">Aleardy have an account?</p>
        <Button
          variant={"link"}
          className="underline"
          onClick={() => {
            navigate("/auth/signin");
          }}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
};

export default SignupView;
