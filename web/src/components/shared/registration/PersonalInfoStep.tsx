import { motion } from 'framer-motion';
import { type UseFormReturn } from 'react-hook-form';
import { User, Phone, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { type FormData } from './validationSchemas';

interface PersonalInfoStepProps {
  form: UseFormReturn<FormData>;
}

interface FormFieldProps {
  label: string;
  name: keyof FormData;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  form: UseFormReturn<FormData>;
  showPasswordToggle?: boolean;
}

const FormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  icon,
  form,
  showPasswordToggle,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const error = form.formState.errors[name];
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
        <Input
          id={name}
          type={inputType}
          placeholder={placeholder}
          {...form.register(name)}
          className={cn(
            'pl-10 pr-10 h-12 bg-background border-border focus:border-primary focus:ring-primary/20 transition-all',
            error && 'border-destructive focus:border-destructive focus:ring-destructive/20'
          )}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <motion.p
          className="form-field-error"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          {error.message as string}
        </motion.p>
      )}
    </motion.div>
  );
};

export const PersonalInfoStep = ({ form }: PersonalInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Personal Information
        </h2>
        <p className="text-muted-foreground mt-2">
          Tell us a bit about yourself
        </p>
      </div>

      <div className="space-y-5">
        <FormField
          label="Full Name"
          name="fullName"
          placeholder="Enter your full name"
          icon={<User className="w-4 h-4" />}
          form={form}
        />

        <FormField
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          placeholder="+1 (555) 000-0000"
          icon={<Phone className="w-4 h-4" />}
          form={form}
        />

        <FormField
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="w-4 h-4" />}
          form={form}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Password"
            name="password"
            placeholder="Min 8 characters"
            icon={<Lock className="w-4 h-4" />}
            form={form}
            showPasswordToggle
          />

          <FormField
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your password"
            icon={<Lock className="w-4 h-4" />}
            form={form}
            showPasswordToggle
          />
        </div>
      </div>
    </div>
  );
};
