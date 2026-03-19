import { motion } from 'framer-motion';
import { type UseFormReturn } from 'react-hook-form';
import { FileText, AlertCircle, CreditCard } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { type FormData } from './validationSchemas';
import { ImageUploader } from './ImageUploader';

interface BrokerDetailsStepProps {
  form: UseFormReturn<FormData>;
}

export const BrokerDetailsStep = ({ form }: BrokerDetailsStepProps) => {
  const errors = form.formState.errors;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Broker Information
        </h2>
        <p className="text-muted-foreground mt-2">
          Verify your identity and tell us about your experience
        </p>
      </div>

      {/* National ID Upload Section */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <Label className="text-base font-semibold text-foreground">
            National ID Verification
          </Label>
        </div>
        
        <div className="p-4 rounded-xl bg-accent/30 border border-border mb-4">
          <p className="text-sm text-muted-foreground">
            Please upload clear photos of both sides of your National ID. Ensure all text is readable and the entire document is visible in the frame. Accepted formats: PNG, JPG, JPEG.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUploader
            label="Front Side"
            description="Upload the front side of your National ID"
            value={form.watch('nationalIdFront') || ''}
            onChange={(value) => form.setValue('nationalIdFront', value, { shouldValidate: true })}
            error={errors.nationalIdFront?.message}
          />
          
          <ImageUploader
            label="Back Side"
            description="Upload the back side of your National ID"
            value={form.watch('nationalIdBack') || ''}
            onChange={(value) => form.setValue('nationalIdBack', value, { shouldValidate: true })}
            error={errors.nationalIdBack?.message}
          />
        </div>
      </motion.div>

      {/* Bio */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Label htmlFor="bio" className="text-sm font-medium text-foreground">
          Professional Bio
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-3 text-muted-foreground">
            <FileText className="w-4 h-4" />
          </div>
          <Textarea
            id="bio"
            placeholder="Tell us about your experience as a broker. What properties do you specialize in? How long have you been in the industry? (minimum 20 characters)"
            {...form.register('bio')}
            className={cn(
              'pl-10 min-h-[160px] bg-background border-border focus:border-primary resize-none',
              errors.bio && 'border-destructive'
            )}
          />
        </div>
        <div className="flex items-center justify-between">
          {errors.bio ? (
            <motion.p
              className="form-field-error"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.bio.message}
            </motion.p>
          ) : (
            <span className="text-xs text-muted-foreground">
              Minimum 20 characters, maximum 500
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {(form.watch('bio') || '').length}/500
          </span>
        </div>
      </motion.div>

      {/* Info card */}
      <motion.div
        className="p-4 rounded-xl bg-accent/50 border border-accent"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h4 className="font-medium text-accent-foreground mb-2">Why we need this information</h4>
        <p className="text-sm text-muted-foreground">
          Your National ID helps us verify your identity and maintain a trustworthy platform. 
          Your professional bio helps property owners understand your expertise and experience.
        </p>
      </motion.div>
    </div>
  );
};
