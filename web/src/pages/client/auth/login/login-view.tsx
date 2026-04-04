"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSignInWithEmailMutation } from "@/hooks/api/use-auth";
import { ArrowLeft } from "lucide-react";

const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required().min(4).max(12),
});

type FormType = yup.InferType<typeof validationSchema>;

const LoginView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const callBackUrl = searchParams.get("callBackUrl");
  const location = useLocation();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(validationSchema),
  });
  // Mock mutation for demo
  const signInWithEmailMutation = useSignInWithEmailMutation();

  const onSubmit = async (data: FormType) => {
    await signInWithEmailMutation.mutateAsync(data);
    // Navigation handled in mutation (window.location.href for mobile cookie fix)
  };
  return (
    <div className="space-y-6 w-[80%] sm:w-[300px] md:w-[400px] py-20">
      <Button
        className="rounded-full "
        variant={"default"}
        size={"icon-lg"}
        onClick={() => {
          if (location.state === "booking") {
            navigate(-1);
          } else {
            navigate("/");
          }
        }}
      >
        <ArrowLeft />
      </Button>

      <div className="mb-8 space-y-2 ">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to <span className="text-primary font-semibold">Bete</span>
        </h1>
        <p className="text-muted-foreground">
          Sign in to explore and book your perfect stay
        </p>
      </div>
      {/* Social Login Buttons */}
      <div className="space-y-3">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label className="text-base">Email</Label>
            <Input
              className="py-5 w-full"
              placeholder="@gmail.com"
              disabled={signInWithEmailMutation.isPending}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <Label className="text-base">Password</Label>
              <Button
                variant={"link"}
                className="text-xs"
                type="button"
                onClick={() => {
                  navigate("/auth/forgot-password");
                }}
              >
                Forgot password?
              </Button>
            </div>
            <Input
              className="py-5 w-full"
              placeholder="******"
              type="password"
              disabled={signInWithEmailMutation.isPending}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button
            className="mt-1 w-full py-5"
            disabled={signInWithEmailMutation.isPending}
          >
            {signInWithEmailMutation.isPending ? "Please wait..." : "Login now"}
          </Button>
        </form>

        <div className="w-full flex justify-center items-center">
          <p className="text-sm">Don't have an account?</p>
          <Button
            variant={"link"}
            className="underline"
            onClick={() => {
              navigate(
                callBackUrl
                  ? `/auth/register?callBackUrl=${callBackUrl}`
                  : "/auth/register"
              );
            }}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
