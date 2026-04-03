"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSignUpWithEmailMutation } from "@/hooks/api/use-auth"; // 🔄 update your hook if needed

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
    const response = await signUpMutation.mutateAsync({
      email: data.email,
      name: data.name,
      password: data.password,
      phone: data.phone,
    });

    if (response?.user) {
      // Hard reload so authClient.useSession() re-initializes with the new cookie
      window.location.href = callBackUrl || "/";
    }
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
          Create your <span className="text-primary font-semibold">Bete</span>{" "}
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
