"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Upload,
  Building2,
  Mail,
  Phone,
  Lock,
  User,
  FileText,
  Award as IdCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfettiDialog } from "@/components/shared/confetti-dialog";
import { useRegisterRequestMutation } from "@/hooks/api/use-registration-request";
import { useUploadFileMutation } from "@/hooks/api/use-upload";
import { toast } from "sonner";

const schema = yup
  .object({
    registrationType: yup
      .string()
      .oneOf(["OWNER", "BROKER"], "Please select a registration type")
      .required("Registration type is required"),
    fullName: yup
      .string()
      .required("Full name is required")
      .min(2, "Name must be at least 2 characters"),
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email address"),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
        "Invalid phone number"
      ),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Passwords must match"),
    companyName: yup.string().when("registrationType", {
      is: "OWNER",
      then: (schema) =>
        schema
          .required("Company name is required")
          .min(2, "Company name must be at least 2 characters"),
      otherwise: (schema) => schema.notRequired(),
    }),
    businessLicense: yup.string(),
    companyDescription: yup.string().when("registrationType", {
      is: "OWNER",
      then: (schema) =>
        schema
          .required("Company description is required")
          .min(20, "Description must be at least 20 characters"),
      otherwise: (schema) => schema.notRequired(),
    }),
    nationalId: yup.string(),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export function RegistrationForm() {
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [nationalIdFile, setNationalIdFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const nationalIdInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema as any),
    defaultValues: {
      registrationType: "OWNER",
    },
  });

  const registrationType = watch("registrationType");

  const registerRequestMutation = useRegisterRequestMutation();
  const uploadFileMutation = useUploadFileMutation();

  const onSubmit = async (data: FormData) => {
    if (data.registrationType === "OWNER" && !file) {
      toast.error("Business license file is required");
      return;
    }

    if (data.registrationType === "BROKER" && !nationalIdFile) {
      toast.error("National ID file is required");
      return;
    }

    try {
      let fileUrl = "";

      if (data.registrationType === "OWNER" && file) {
        const fileResponse = await uploadFileMutation.mutateAsync(file);
        if (!fileResponse) {
          toast.error("Something went wrong uploading business license");
          return;
        }
        fileUrl = fileResponse.secure_url;
      } else if (data.registrationType === "BROKER" && nationalIdFile) {
        const fileResponse = await uploadFileMutation.mutateAsync(
          nationalIdFile
        );
        if (!fileResponse) {
          toast.error("Something went wrong uploading national ID");
          return;
        }
        fileUrl = fileResponse.secure_url;
        console.log("-----------------", { l: fileResponse.secure_url });
      }

      const requestData: any = {
        registrationType: data.registrationType,
        contactName: data.fullName,
        password: data.password,
        email: data.email,
        phone: data.phone,
      };

      if (data.registrationType === "OWNER") {
        requestData.businessFileUrl = fileUrl;
        requestData.companyDescription = data.companyDescription;
        requestData.companyName = data.companyName;
      } else if (data.registrationType === "BROKER") {
        requestData.nationalId = fileUrl;
      }

      await registerRequestMutation
        .mutateAsync({
          data: requestData,
        })
        .then(() => {
          setShowConfetti(true);
          reset();
          setFile(null);
          setNationalIdFile(null);
        })
        .catch(() => {});
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files;
    if (files) {
      setFile(files[0]);
    }
  };

  const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files;
    if (files) {
      console.log(files[0]);
      setNationalIdFile(files[0]);
    }
  };

  return (
    <>
      <Card className="w-full border-2 shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-balance">
            Register Your Property
          </CardTitle>
          <CardDescription className="text-base text-pretty">
            Join our platform and start welcoming guests to your property
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Registration Type
              </h3>

              <div className="space-y-2">
                <Label htmlFor="registrationType">I am registering as *</Label>
                <Select
                  value={registrationType}
                  onValueChange={(value) =>
                    setValue("registrationType", value as "OWNER" | "BROKER", {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger id="registrationType">
                    <SelectValue placeholder="Select registration type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OWNER">Owner</SelectItem>
                    <SelectItem value="BROKER">Broker</SelectItem>
                  </SelectContent>
                </Select>
                {errors.registrationType && (
                  <p className="text-sm text-destructive">
                    {errors.registrationType.message}
                  </p>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    className="pl-10"
                    {...register("fullName")}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="pl-10"
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      {...register("password")}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      {...register("confirmPassword")}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {registrationType === "OWNER" && (
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Company Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      placeholder="Sunset Property LLC"
                      className="pl-10"
                      {...register("companyName")}
                    />
                  </div>
                  {errors.companyName && (
                    <p className="text-sm text-destructive">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessLicense">Business License *</Label>
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      id="businessLicense"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-transparent"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {file ? file.name : "Upload business license"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 5MB. Accepted formats: PDF, JPG, PNG
                  </p>
                  {errors.businessLicense && (
                    <p className="text-sm text-destructive">
                      {errors.businessLicense.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyDescription">
                    Company Description *
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="companyDescription"
                      placeholder="Tell us about your property, amenities, and what makes it special..."
                      className="min-h-32 pl-10 resize-none"
                      {...register("companyDescription")}
                    />
                  </div>
                  {errors.companyDescription && (
                    <p className="text-sm text-destructive">
                      {errors.companyDescription.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {registrationType === "BROKER" && (
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <IdCard className="h-5 w-5 text-primary" />
                  Broker Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="nationalId">National ID *</Label>
                  <div className="relative">
                    <input
                      ref={nationalIdInputRef}
                      id="nationalId"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={handleNationalIdChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-transparent"
                      onClick={() => nationalIdInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {nationalIdFile
                        ? nationalIdFile.name
                        : "Upload national ID"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 5MB. Accepted formats: PDF, JPG, PNG
                  </p>
                  {errors.nationalId && (
                    <p className="text-sm text-destructive">
                      {errors.nationalId.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              By submitting, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </form>
        </CardContent>
      </Card>

      <ConfettiDialog open={showConfetti} onOpenChange={setShowConfetti} />
    </>
  );
}
