"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSignUpWithEmailMutation } from "@/hooks/api/use-auth"
import { Spinner } from "@/components/ui/spinner"
import { useState } from "react"
import { CheckCircle2, Mail, Phone, Building2, User } from "lucide-react"

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits"),
  password: yup.string().required("Password is required").min(4, "Min 4 characters").max(12, "Max 12 characters"),
  role: yup.mixed<"OWNER" | "BROKER" | "ADMIN">().oneOf(["OWNER", "BROKER", "ADMIN"]).required("Role is required"),
  // Conditional fields for OWNER role
  businessName: yup.string().when("role", {
    is: "OWNER",
    then: (schema) => schema.required("Business name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  businessLicense: yup.string().when("role", {
    is: "OWNER",
    then: (schema) => schema.required("Business license number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  businessAddress: yup.string().when("role", {
    is: "OWNER",
    then: (schema) => schema.required("Business address is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
})

type FormType = yup.InferType<typeof validationSchema>

const SuccessState = ({ email, phone }: { email: string; phone: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6 px-4">
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <CheckCircle2 className="w-24 h-24 text-green-500/20" />
        </div>
        <CheckCircle2 className="w-24 h-24 text-green-500 relative" />
      </div>

      <div className="text-center space-y-3 max-w-md">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
          Registration Submitted!
        </h2>
        <p className="text-lg text-muted-foreground">Your request is currently pending review</p>
      </div>

      <Card className="w-full max-w-md border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Email Notification</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">SMS Notification</p>
              <p className="text-sm text-muted-foreground">{phone}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-green-200 dark:border-green-900">
            <p className="text-xs text-center text-muted-foreground">
              We'll notify you via email or SMS once your account is approved
            </p>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
        Submit Another Registration
      </Button>
    </div>
  )
}

const SignupView = () => {
  const router = useRouter()
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedData, setSubmittedData] = useState<{ email: string; phone: string } | null>(null)

  const {
    register,
    control,
    watch,
    formState: { errors },
    handleSubmit,
    resetField,
  } = useForm<FormType>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "ADMIN",
      businessName: "",
      businessLicense: "",
      businessAddress: "",
    },
    resolver: yupResolver(validationSchema as any),
  })

  const selectedRole = watch("role")

  const handleRoleChange = (value: string) => {
    if (value !== "OWNER") {
      resetField("businessName")
      resetField("businessLicense")
      resetField("businessAddress")
    }
    return value
  }

  const { mutate, isPending } = useSignUpWithEmailMutation()

  const onSubmit = async (data: FormType) => {
    setSubmittedData({ email: data.email, phone: data.phone })

    // Simulate API call - replace with actual mutation
    mutate(data, {
      onSuccess: () => {
        setIsSuccess(true)
      },
      onError: () => {
        toast.error("Registration failed. Please try again.")
      },
    })
  }

  if (isSuccess && submittedData) {
    return <SuccessState email={submittedData.email} phone={submittedData.phone} />
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Create Your Account</h1>
        <p className="text-muted-foreground">Join our platform and get started today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            {/* Role */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Account Type</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(handleRoleChange(value))
                    }}
                    value={field.value}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWNER">Business Owner</SelectItem>
                      <SelectItem value="BROKER">Broker</SelectItem>
                      <SelectItem value="ADMIN">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="1234567890" {...register("phone")} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter a secure password" {...register("password")} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
          </CardContent>
        </Card>

        {selectedRole === "OWNER" && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Business Information
              </CardTitle>
              <CardDescription>Provide your business license details</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              {/* Business Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" placeholder="Acme Corporation" {...register("businessName")} />
                {errors.businessName && <p className="text-sm text-destructive">{errors.businessName.message}</p>}
              </div>

              {/* Business License */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="businessLicense">License Number</Label>
                <Input id="businessLicense" placeholder="BL-123456789" {...register("businessLicense")} />
                {errors.businessLicense && <p className="text-sm text-destructive">{errors.businessLicense.message}</p>}
              </div>

              {/* Business Address */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input
                  id="businessAddress"
                  placeholder="123 Main St, City, State, ZIP"
                  {...register("businessAddress")}
                />
                {errors.businessAddress && <p className="text-sm text-destructive">{errors.businessAddress.message}</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button type="submit" size="lg" disabled={isPending} className="w-full md:w-auto min-w-[200px]">
            {isPending ? (
              <>
                <Spinner className="mr-2" />
                Submitting...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SignupView
